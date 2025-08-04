import os
import sys
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import pymysql
import requests
from dotenv import load_dotenv, find_dotenv

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("news_fetcher")

# Config
load_dotenv(find_dotenv())  

def env_required(key: str) -> str:
    fetched_key = os.getenv(key)
    if not fetched_key:
        raise RuntimeError(f"환경 변수 {key}를 설정하세요.")
    return fetched_key

def env_int(key: str, default: Optional[int] = None) -> int:
    fetched_key = os.getenv(key)
    if fetched_key is None:
        if default is None:
            raise RuntimeError(f"환경 변수 {key}를 설정하세요.")
        return default
    return int(fetched_key)

NEWSAPI_KEY   = env_required("NEWSAPI_KEY")
NEWS_QUERY    = env_required("NEWS_QUERY")
NEWS_PAGE_SIZE = env_int("NEWS_PAGE_SIZE") 
NEWS_LANGUAGE = env_required("NEWS_LANGUAGE")
NEWS_SORT_BY = env_required("NEWS_SORT_BY")
MYSQL_HOST    = env_required("MYSQL_HOST")
MYSQL_PORT    = env_int("MYSQL_PORT")
MYSQL_USER    = env_required("MYSQL_USER")
MYSQL_PASSWORD= env_required("MYSQL_PASSWORD")
MYSQL_DB      = env_required("MYSQL_DB")
MYSQL_CHARSET = env_required("MYSQL_CHARSET")

# DB Helpers
def get_conn():
    return pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        charset=MYSQL_CHARSET,
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor,
    )

def ensure_table_exists(conn): # conn은 DB 연결 객체
    # 테스트용 
    ddl = """
    CREATE TABLE IF NOT EXISTS news_articles (
        id BIGINT NOT NULL AUTO_INCREMENT,
        source_id VARCHAR(255) NULL,
        source_name VARCHAR(255) NULL,
        author VARCHAR(512) NULL,
        title VARCHAR(1024) NOT NULL,
        description TEXT NULL,
        url VARCHAR(1024) NOT NULL,
        url_to_image VARCHAR(1024) NULL,
        published_at DATETIME NULL,
        content MEDIUMTEXT NULL,
        query VARCHAR(255) NOT NULL,
        fetched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_url (url)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    """
    # try-with-resources 
    with conn.cursor() as cur: # conn.cursor()로 SQL 명령 실행할 수 있는 커서 가져오기
        cur.execute(ddl) # MySQL로 쿼리 날리기

# NewsAPI
def fetch_news(
    query: Optional[str] = None,
    page_size: Optional[int] = None,
    language: Optional[str] = None,
    sort_by: Optional[str] = None,
) -> List[Dict[str, Any]]:
    # api 호출 -> 리스트 반환
    q = query or NEWS_QUERY
    size = page_size or NEWS_PAGE_SIZE
    lang = language or NEWS_LANGUAGE
    sort = sort_by or NEWS_SORT_BY

    url = "https://newsapi.org/v2/everything"
    headers = {"X-Api-Key": NEWSAPI_KEY}
    params = {
        "q": q,
        "pageSize": size,
        "page": 1,
        "language": lang,
        "sortBy": sort,
    }
    
    logger.info("호출한 NewsAPI: q=%s, pageSize=%s, language=%s, sortBy=%s", q, size, lang, sort)
    
    resp = requests.get(url, headers=headers, params=params, timeout=30)
    if resp.status_code != 200:
        try:
            payload = resp.json()
        except Exception:
            payload = {"text": resp.text}
        raise RuntimeError(f"NewsAPI 에러 {resp.status_code}: {payload}")
    data = resp.json()
    articles = data.get("articles", [])
    
    logger.info("불러들인 기사 개수: %d 개", len(articles))
    
    return articles

def parse_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    if not dt_str:
        return None
    
    try:
        dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        return dt.astimezone(timezone.utc).replace(tzinfo=None)
    except Exception:
        return None

def save_articles(conn, articles: List[Dict[str, Any]], query_used: str):
    # MySQL에 기사 삽입, url 체크로 중복 제거
    sql = """
    INSERT INTO news_articles (
        source_id, source_name, author, title, description, url, url_to_image,
        published_at, content, query, fetched_at
    ) VALUES (
        %(source_id)s, %(source_name)s, %(author)s, %(title)s, %(description)s, %(url)s, %(url_to_image)s,
        %(published_at)s, %(content)s, %(query)s, NOW()
    )
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        url_to_image = VALUES(url_to_image),
        published_at = VALUES(published_at),
        content = VALUES(content),
        query = VALUES(query),
        fetched_at = NOW();
    """
    rows = []
    
    for a in articles:
        src = a.get("source") or {}
        rows.append({
            "source_id": src.get("id"),
            "source_name": src.get("name"),
            "author": a.get("author"),
            "title": a.get("title") or "",
            "description": a.get("description"),
            "url": a.get("url"),
            "url_to_image": a.get("urlToImage"),
            "published_at": parse_datetime(a.get("publishedAt")),
            "content": a.get("content"),
            "query": query_used,
        })
    inserted = 0
    
    with conn.cursor() as cur:
        for row in rows:
            try:
                cur.execute(sql, row)
                inserted += 1
            except pymysql.err.IntegrityError:
                pass
    
    logger.info("저장된 행의 개수: %d 개", inserted)

def fetch_and_save(query: Optional[str] = None, page_size: Optional[int] = None) -> int:
    # 기사 불러와서 DB에 저장하고, 불러온 기사들의 개수 반환 - 통합 함수 
    conn = None
    try:
        conn = get_conn()
        ensure_table_exists(conn)
        q = query or NEWS_QUERY
        arts = fetch_news(query=q, page_size=page_size or NEWS_PAGE_SIZE)
        save_articles(conn, arts, q)
       
        return len(arts)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    q = sys.argv[1] if len(sys.argv) >= 2 else NEWS_QUERY
    size = int(sys.argv[2]) if len(sys.argv) >= 3 else NEWS_PAGE_SIZE
    count = fetch_and_save(query=q, page_size=size)
    
    logger.info("완료됨. %d 개의 기사가 처리되었습니다.", count)
