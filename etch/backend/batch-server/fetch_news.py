import os
import sys
import logging
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

# NewsAPI 호출
def _fetch_news(
    query: str,
    page_size: int,
    language: str,
    sort_by: str
) -> List[Dict[str, Any]]:
    url = "https://newsapi.org/v2/everything"
    headers = {"X-Api-Key": NEWSAPI_KEY}
    params = {
        "q":        query,
        "pageSize": page_size,
        "page":     1,
        "language": language,
        "sortBy":   sort_by,
    }
    resp = requests.get(url, headers=headers, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    return data.get("articles", [])

# 회사 이름으로 company_id 조회
def _get_company_id(conn, name: str) -> int:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM company WHERE name = %s", (name,))
        row = cur.fetchone()
        if not row:
            raise ValueError(f"회사 '{name}' 없음")
        
        return row["id"]

# db에 기사 저장
def _save_news(conn, company_id: int, articles: List[Dict[str, Any]]) -> int:
    sql = """
    INSERT INTO news (
        thumbnail_url, title, description, url, published_at, company_id
    ) VALUES (
        %(thumbnail_url)s, %(title)s, %(description)s, %(url)s, %(published_at)s, %(company_id)s
    ) ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        thumbnail_url = VALUES(thumbnail_url),
        published_at = VALUES(published_at);
    """
    with conn.cursor() as cur:
        for a in articles:
            cur.execute(sql, {
                "thumbnail_url": a.get("urlToImage"),
                "title":         a["title"],
                "description":   a.get("description"),
                "url":           a["url"],
                "published_at":  a["publishedAt"][:10],
                "company_id":    company_id
            })
    conn.commit()
    
    return len(articles)

# 외부에서 호출할 통합 함수
def fetch_and_store(company_name: str) -> int:
    articles = _fetch_news(
        query      = company_name,
        page_size  = NEWS_PAGE_SIZE,
        language   = NEWS_LANGUAGE,
        sort_by    = NEWS_SORT_BY
    )
    with get_conn() as conn:
        cid = _get_company_id(conn, company_name)
        cnt = _save_news(conn, cid, articles)
    logger.info("저장 완료: %s (%d건)", company_name, cnt)

    return cnt

def _get_all_company_names() -> List[str]: 
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT name FROM company")
            all_company_names = [row["name"] for row in cur.fetchall()]
            return all_company_names

def run_batch() -> int:
    """
    배치 작업 실행. 모든 회사에 대한 뉴스 기사 가져오기 및 저장
    """
    # DB에서 회사명 리스트 받아오기
    all_company_names: List[str] = _get_all_company_names()
    processed_count = 0
    for company_name in all_company_names:
        cnt = fetch_and_store(company_name)
        processed_count += cnt
    return processed_count # 처리된 기사 수

if __name__ == "__main__":
    q = sys.argv[1] if len(sys.argv) >= 2 else NEWS_QUERY
    size = int(sys.argv[2]) if len(sys.argv) >= 3 else NEWS_PAGE_SIZE
    count = fetch_and_store(q)
    
    logger.info("완료됨. %d 개의 기사가 처리되었습니다.", count)