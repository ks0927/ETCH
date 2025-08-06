import os
import pymysql
import redis
from typing import Optional
from dotenv import load_dotenv, find_dotenv

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
REDIS_HOST   = env_required("REDIS_HOST")
REDIS_PORT   = env_int("REDIS_PORT")

def fetch_and_store_top10():
    # MySQL 연결
    conn = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        charset=MYSQL_CHARSET,
        autocommit=True,
        cursorclass=pymysql.cursors.DictCursor
    )

    r = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True) # db=0

    # 회사id, 회사명, 좋아요, 기사 개수 
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT c.id AS company_id, c.name AS company_name,
                    COUNT(DISTINCT l.id) AS like_count,
                    COUNT(DISTINCT n.id) AS article_count
                FROM company c
                LEFT JOIN liked_content l ON c.id = l.targetId AND l.type = 'COMPANY'
                LEFT JOIN news n ON c.id = n.company_id
                GROUP BY c.id, c.name
                ORDER BY like_count DESC
                LIMIT 10
            """)
            top10 = cursor.fetchall() # sql 리턴값에서 모든 데이터 가져오기
            print("Top 10 기업:", top10)

        r.delete('top10_companies') # redis 초기화하고 새로 저장하기

        for idx, company in enumerate(top10):
            key = f"top10_companies:{idx+1}"

            # 개별적으로 redis에 저장
            r.hset(key, "company_id",   company['company_id'])
            r.hset(key, "company_name", company['company_name'])
            r.hset(key, "likes", company['like_count'])
            r.hset(key, "article_count", company['article_count'])

            r.rpush('top10_companies', key)
    finally:
        conn.close()

if __name__ == "__main__":
    fetch_and_store_top10()
    print("Top 10 기업 정보를 Redis에 저장했습니다.")