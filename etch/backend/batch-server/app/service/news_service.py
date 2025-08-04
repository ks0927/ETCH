import requests, logging
from typing import List, Dict, Any
from ..core.config import settings
from ..core.database import get_conn

logger = logging.getLogger("news_service")

# NewsAPI 호출
def _fetch_news(
    query: str,
    page_size: int,
    language: str,
    sort_by: str
) -> List[Dict[str, Any]]:
    url = "https://newsapi.org/v2/everything"
    headers = {"X-Api-Key": settings.NEWSAPI_KEY}
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
        page_size  = settings.NEWS_PAGE_SIZE,
        language   = settings.NEWS_LANGUAGE,
        sort_by    = settings.NEWS_SORT_BY
    )
    with get_conn() as conn:
        cid = _get_company_id(conn, company_name)
        cnt = _save_news(conn, cid, articles)
    logger.info("저장 완료: %s (%d건)", company_name, cnt)

    return cnt
