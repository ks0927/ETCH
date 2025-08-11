from fastapi import FastAPI
from typing import List
import uvicorn  
from es import fetch_and_tokenize_all, tokenize_user_liked_items
from mysql import get_liked_items
from cbf import rank_content_by_similarity
from redis import store_recommendations

app = FastAPI()

@app.get("/health")
async def root():
    return {"message":"Welcome to the Recommendation API!"}

@app.get("/recommend/{user_id}")
async def recommend(user_id: int):
    print(f"Received request for user_id: {user_id}")
    
    # 1. MySQL에서 타입별로 그룹화된 '좋아요' 콘텐츠 객체 목록 조회
    liked_items_by_type = get_liked_items(user_id)
    
    # CBF에 사용하기 위해 모든 '좋아요' 문서를 하나의 리스트로 통합
    liked_documents = tokenize_user_liked_items(liked_items_by_type)
        
    
    # 2. 전체 뉴스/공고 문서 조회
    all_news_documents = fetch_and_tokenize_all(index="news")
    all_job_documents = fetch_and_tokenize_all(index="job")
    

    # 3. 유사도 계산 (CBF)
    news_recommendations = rank_content_by_similarity(liked_documents, all_news_documents)
    job_recommendations = rank_content_by_similarity(liked_documents, all_job_documents)

    
    # 4. 추천 결과 rdis에 저장
    await store_recommendations(user_id, news_recommendations, job_recommendations)

    #5. 결과 반환
    return

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
