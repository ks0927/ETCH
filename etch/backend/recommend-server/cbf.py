import math
from typing import Dict, List, Tuple

def cosine_similarity(vec1: Dict[str, int], vec2: Dict[str, int]) -> float:
    """두 벡터 간 코사인 유사도 계산"""
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum(vec1[token] * vec2[token] for token in intersection)

    sum1 = sum(v ** 2 for v in vec1.values())
    sum2 = sum(v ** 2 for v in vec2.values())
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if denominator == 0:
        return 0.0
    else:
        return numerator / denominator

def aggregate_user_vector(user_vectors: Dict[str, Dict[str, int]]) -> Dict[str, float]:
    """
    사용자 좋아요 여러 문서 벡터들을 합산하여 단일 벡터로 변환
    (빈도 합산, 필요 시 가중치 적용 가능)
    """
    agg_vector = {}
    for doc_vec in user_vectors.values():
        for token, freq in doc_vec.items():
            agg_vector[token] = agg_vector.get(token, 0) + freq
    return agg_vector

def rank_content_by_similarity(
    user_likes: Dict[str, Dict[str, int]],
    all_contents: Dict[str, Dict[str, int]],
    top_k: int = 5
) -> List[Tuple[str, float]]:
    """
    사용자 좋아요 벡터(user_likes)와 전체 컨텐츠 벡터(all_contents)를 받아,
    코사인 유사도로 점수 매기고 top_k개 결과를 [(content_key, score), ...] 형태로 반환
    """
    user_vector = aggregate_user_vector(user_likes)
    scores = []
    for content_id, content_vector in all_contents.items():
        score = cosine_similarity(user_vector, content_vector)
        scores.append((content_id, score))
    # 유사도 점수 내림차순 정렬 후 top_k 반환
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:top_k]
