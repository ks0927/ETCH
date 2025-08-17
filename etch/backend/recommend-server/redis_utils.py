import json
# redis_connection.py
import redis.asyncio as redis
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    db=int(os.getenv("REDIS_DB")),
    decode_responses=True  # 문자열 변환
)
async def store_recommendations(user_id, news_recommendations, job_recommendations):

    data = {
        "news": news_recommendations,
        "job": job_recommendations
    }

    # Redis에 JSON 저장
    await redis_client.set("recommendations_data_user_"+str(user_id), json.dumps(data))
