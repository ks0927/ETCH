from typing import Dict, List, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD

def rank_content_by_similarity(
    user_liked_docs: List[str],
    all_content_docs: Dict[str, str],
    top_k: int = 5,
    exclude_content_ids: List[str] = None,
    n_components: int = 30
) -> List[Tuple[str, float]]:
    """
    scikit-learn의 TfidfVectorizer와 TruncatedSVD(LSA)를 사용하여
    사용자 선호 컨텐츠와 전체 컨텐츠 간의 유사도를 계산하고,
    상위 top_k개의 컨텐츠를 반환합니다.

    Args:
        user_liked_docs (List[str]): 사용자가 좋아한 문서들의 텍스트 리스트.
                                     각 문자열은 공백으로 구분된 토큰들을 포함합니다.
                                     (예: ["맛집 탐방 재미 있다", "서울 맛집 추천"])
        all_content_docs (Dict[str, str]): 전체 콘텐츠의 ID와 텍스트 원문 딕셔너리.
                                          (예: {"content1": "오늘 날씨 정말 좋다", ...})
        top_k (int, optional): 반환할 추천 컨텐츠의 수. Defaults to 5.
        exclude_content_ids (List[str], optional): 제외할 콘텐츠 ID 리스트.
        n_components (int, optional): LSA의 차원 수. Defaults to 100.

    Returns:
        List[Tuple[str, float]]: (컨텐츠 ID, 유사도 점수) 튜플의 리스트.
    """
    if not user_liked_docs or not all_content_docs:
        return []

    # 콘텐츠 ID와 문서 텍스트를 순서가 보장되도록 분리
    content_ids = list(all_content_docs.keys())
    content_docs_list = list(all_content_docs.values())

    # TfidfVectorizer 초기화 및 전체 문서에 대한 TF-IDF 행렬 생성
    stopwords = ['의', '가', '이', '은', '들', '는', '좀', '잘', '걍', '과', '도', '를', '으로', '자', '에', '와', '한', '하다']
    vectorizer = TfidfVectorizer(stop_words=stopwords, ngram_range=(1,2), max_df=0.85, min_df=2)
    all_content_matrix = vectorizer.fit_transform(content_docs_list)

    # LSA 적용: TF-IDF 행렬에 TruncatedSVD로 차원 축소
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    all_content_matrix_lsa = svd.fit_transform(all_content_matrix)

    # 사용자가 좋아한 문서들을 하나의 문자열로 결합
    user_profile_doc = " ".join(user_liked_docs)

    # 학습된 Vectorizer를 사용하여 사용자 프로필의 TF-IDF 벡터 생성
    user_vector = vectorizer.transform([user_profile_doc])

    # 사용자 벡터에도 동일한 SVD 변환 적용
    user_vector_lsa = svd.transform(user_vector)

    # 차원 축소된 벡터로 코사인 유사도 계산
    sim_scores = cosine_similarity(user_vector_lsa, all_content_matrix_lsa)

    # (컨텐츠 ID, 유사도 점수) 튜플 생성
    # sim_scores는 (1, n_documents) 형태의 2D 배열이므로 첫 번째 행을 사용
    scores = list(zip(content_ids, sim_scores[0]))

    # 유사도 점수 기준 내림차순 정렬
    scores.sort(key=lambda x: x[1], reverse=True)

    if exclude_content_ids is None:
        exclude_content_ids = []

    # 제외 목록 필터링
    filtered_scores = [
        (cid, score)
        for cid, score in scores
        if cid not in exclude_content_ids
    ]

    # 상위 top_k개 결과 반환
    return filtered_scores[:top_k]