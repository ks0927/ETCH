import os
import sys
import logging
from typing import Any, Dict, List, Optional

import pymysql
import requests
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

def env_required(key: str) -> str:
    v = os.getenv(key)
    if not v:
        raise RuntimeError(f"환경 변수 {key}를 설정하세요.")
    return v

def env_int(key: str, default: Optional[int] = None) -> int:
    v = os.getenv(key)
    if v is None:
        if default is None:
            raise RuntimeError(f"환경 변수 {key}를 설정하세요.")
        return default
    return int(v)

NEWSAPI_KEY    = env_required("NEWSAPI_KEY")
NEWS_QUERY     = env_required("NEWS_QUERY")
NEWS_PAGE_SIZE = env_int("NEWS_PAGE_SIZE")
NEWS_LANGUAGE  = env_required("NEWS_LANGUAGE")
NEWS_SORT_BY   = env_required("NEWS_SORT_BY")

MYSQL_HOST     = env_required("MYSQL_HOST")
MYSQL_PORT     = env_int("MYSQL_PORT")
MYSQL_USER     = env_required("MYSQL_USER")
MYSQL_PASSWORD = env_required("MYSQL_PASSWORD")
MYSQL_DB       = env_required("MYSQL_DB")
MYSQL_CHARSET  = env_required("MYSQL_CHARSET")
MYSQL_SSL_CA   = env_required("MYSQL_SSL_CA")       

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("news_fetcher")

def get_conn():
    return pymysql.connect(
        host        = MYSQL_HOST,
        port        = MYSQL_PORT,
        user        = MYSQL_USER,
        password    = MYSQL_PASSWORD,
        database    = MYSQL_DB,
        charset     = MYSQL_CHARSET,
        autocommit  = True,
        cursorclass = pymysql.cursors.DictCursor,
        ssl         = {"ca": MYSQL_SSL_CA},           
    )

def _fetch_news(query: str, page_size: int, language: str, sort_by: str) -> List[Dict[str, Any]]:
    url = "https://newsapi.org/v2/everything"
    headers = {"X-Api-Key": NEWSAPI_KEY}
    params  = {
        "q": query,
        "pageSize": page_size,
        "page": 1,
        "language": language,
        "sortBy": sort_by,
    }
    resp = requests.get(url, headers=headers, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json().get("articles", [])

def _get_company_id(conn, name: str) -> int:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM company WHERE name = %s", (name,))
        row = cur.fetchone()
        if not row:
            raise ValueError(f"회사 '{name}' 없음")
        return row["id"]

def _save_news(conn, company_id: int, articles: List[Dict[str, Any]]) -> int:
    sql = """
        INSERT INTO news (
            thumbnail_url, title, description, url,
            published_at, company_id
        ) VALUES (
            %(thumbnail_url)s, %(title)s, %(description)s, %(url)s,
            %(published_at)s, %(company_id)s
        )
        ON DUPLICATE KEY UPDATE
            title         = VALUES(title),
            description   = VALUES(description),
            thumbnail_url = VALUES(thumbnail_url),
            published_at  = VALUES(published_at);
    """
    with conn.cursor() as cur:
        for a in articles:
            cur.execute(sql, {
                "thumbnail_url": a.get("urlToImage"),
                "title":         a["title"],
                "description":   a.get("description"),
                "url":           a["url"],
                "published_at":  a["publishedAt"][:10],
                "company_id":    company_id,
            })
    return len(articles)

def fetch_and_store(company_name: str) -> int:
    articles = _fetch_news(
        query      = company_name,
        page_size  = NEWS_PAGE_SIZE,
        language   = NEWS_LANGUAGE,
        sort_by    = NEWS_SORT_BY,
    )
    with get_conn() as conn:
        cid = _get_company_id(conn, company_name)
        cnt = _save_news(conn, cid, articles)
    logger.info("저장 완료: %s (%d건)", company_name, cnt)
    return cnt

def _get_all_company_names() -> List[str]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT name FROM company WHERE name LIKE '%삼성%'")
            return [row["name"] for row in cur.fetchall()]

def run_batch() -> int:
    total = 0
    for name in _get_all_company_names():
        total += fetch_and_store(name)
    return total

if __name__ == "__main__":
    q = sys.argv[1] if len(sys.argv) >= 2 else NEWS_QUERY
    cnt = fetch_and_store(q)
    logger.info("완료됨. %d 개 기사를 처리했습니다.", cnt)
