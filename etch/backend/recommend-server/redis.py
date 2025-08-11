import json
# redis_connection.py
import redis.asyncio as redis

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True  # 문자열 변환
)
async def store_recommendations(user_id, news_recommendations, job_recommendations):

    data = {
        "news": news_recommendations,
        "job": job_recommendations
    }

    # Redis에 JSON 저장
    await redis_client.set("recommendations_data_user_"+user_id, json.dumps(data))
