from ..core.config import settings
from ..core.database import get_conn
from ..core.redis_client import r 

def refresh_top10():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT company_name, likes
            FROM companies
            ORDER BY likes DESC
            LIMIT 10
        """)
        rows = cur.fetchall()

    # Redis에 저장
    r.delete("top10_companies") # 초기화 먼저 해주고

    for idx, row in enumerate(rows, 1):
        key = f"top10_companies:{idx}"
        r.hset(key, mapping=row)   
        r.rpush("top10_companies", key)
        
    return rows
