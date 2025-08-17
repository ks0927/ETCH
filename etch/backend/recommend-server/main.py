from fastapi import FastAPI
from typing import List
import uvicorn  
from es import fetch_and_tokenize_all, tokenize_user_liked_items
from mysql_utils import get_liked_items, get_latest_items

from cbf import rank_content_by_similarity
from redis_utils import store_recommendations

app = FastAPI()

@app.get("/health")
async def root():
    return {"message":"Welcome to the Recommendation API!"}

@app.get("/recommend/{user_id}")
async def recommend(user_id: int):
    print(f"Received request for user_id: {user_id}")
    
    # 1. MySQL에서 타입별로 그룹화된 '좋아요' 콘텐츠 객체 목록 조회
    liked_items_by_type = get_liked_items(user_id)
    
    # 사용자가 '좋아요'한 콘텐츠가 없는 경우, 최신 아이템을 가져옴
    is_cold_start_user = not any(liked_items_by_type.values())
    if is_cold_start_user:
        print(f"User {user_id} is a cold start user. Fetching latest items.")
        liked_items_by_type = get_latest_items()
        exclude_liked_ids = [] # 최신 아이템 추천 시에는 제외할 아이디가 없음
    else:
        # 제외할 '좋아요' 콘텐츠 ID 목록 생성
        exclude_liked_ids = []
        for item_type_list in liked_items_by_type.values():
            for item in item_type_list:
                if 'id' in item:
                    exclude_liked_ids.append(str(item['id']))

    # CBF에 사용하기 위해 모든 '좋아요' 문서를 타입별로 그룹화하여 가져옴
    liked_docs_by_type = tokenize_user_liked_items(liked_items_by_type)
    
    # 2. 전체 뉴스/공고 문서 조회
    all_news_documents = fetch_and_tokenize_all(index="news")
    all_job_documents = fetch_and_tokenize_all(index="job")
    

    # 3. 유사도 계산 (CBF) - 가중치 적용
    # 뉴스 추천을 위한 사용자 프로필 생성 (뉴스 70%, 프로젝트 10%, 공고 20%)
    news_preference_corpus = (
        liked_docs_by_type.get('NEWS', []) * 7 +
        liked_docs_by_type.get('PROJECT', []) * 1 +
        liked_docs_by_type.get('JOB', []) * 2
    )
    news_recommendations = rank_content_by_similarity(news_preference_corpus, all_news_documents, exclude_content_ids=exclude_liked_ids)

    # 공고 추천을 위한 사용자 프로필 생성 (공고 70%, 뉴스 20%, 프로젝트 10%)
    job_preference_corpus = (
        liked_docs_by_type.get('JOB', []) * 7 +
        liked_docs_by_type.get('NEWS', []) * 2 +
        liked_docs_by_type.get('PROJECT', []) * 1
    )
    job_recommendations = rank_content_by_similarity(job_preference_corpus, all_job_documents, exclude_content_ids=exclude_liked_ids)

    
    # 4. 추천 결과 rdis에 저장
    await store_recommendations(user_id, news_recommendations, job_recommendations)

    #5. 결과 반환
    return

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8084)

