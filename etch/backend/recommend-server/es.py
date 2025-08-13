import requests
from typing import Dict, List, Any
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

ES_URL = os.getenv("ES_HOST")
ES_USER = os.getenv("ES_USER")
ES_PASSWORD = os.getenv("ES_PASSWORD")
ES_AUTH = (ES_USER, ES_PASSWORD) if ES_USER and ES_PASSWORD else None

HEADERS = {"Content-Type": "application/json"}
ANALYZER_NAME = "my_nori_analyzer"  # 인덱스 설정과 일치해야 함


def nori_tokenize_with_freq(text: str, index: str = "news") -> Dict[str, int]:
    if not text:
        return {}
    resp = requests.post(
        f"{ES_URL}/{index}/_analyze",
        auth=ES_AUTH,
        headers=HEADERS,
        json={
            "analyzer": ANALYZER_NAME,
            "text": text
        }
    )
    resp.raise_for_status()
    tokens = [token['token'] for token in resp.json().get('tokens', [])]
    freq = {}
    for t in tokens:
        freq[t] = freq.get(t, 0) + 1
    return freq


def tokenize_user_liked_items(sql_result: Dict[str, Any], index: str = "news") -> Dict[str, Dict[str, int]]:
    liked_docs_dict = {}

    for item_type in ['NEWS', 'PROJECT', 'JOB']:
        items = sql_result.get(item_type, [])
        for i, item in enumerate(items):
            # id 없으면 순번을 키로 사용
            doc_id = item.get('id') or f"{item_type}_{i}"

            title = item.get('title', "")
            content = item.get('content') or item.get('description', "")  # content 또는 description 필드 사용
            combined_text = f"{title} {content}".strip()
            tokens_freq = nori_tokenize_with_freq(combined_text, index=index)
            liked_docs_dict[str(doc_id)] = tokens_freq
    return liked_docs_dict




def fetch_and_tokenize_all(index: str = "news", size: int = 1000) -> Dict[str, Dict[str, int]]:
    """
    Elasticsearch에서 전체 뉴스, 프로젝트, 직무 문서를 조회해,
    {문서_id: {토큰: 빈도}} 딕셔너리로 반환
    """
    query = {
        "query": {"match_all": {}},
        "_source": ["title", "content", "description"],  # 필요한 모든 필드
        "size": size
    }
    resp = requests.get(
        f"{ES_URL}/{index}/_search",
        auth=ES_AUTH,
        headers=HEADERS,
        json=query
    )
    resp.raise_for_status()
    hits = resp.json().get('hits', {}).get('hits', [])

    tokenized_docs = {}
    for doc in hits:
        doc_id = doc.get('_id')
        if not doc_id:
            continue
            
        source = doc.get('_source', {})
        title = source.get('title', "")
        content = source.get('content') or source.get('description', "")  # content 또는 description 필드 사용
        combined_text = f"{title} {content}".strip()
        tokens_freq = nori_tokenize_with_freq(combined_text, index=doc.get('_index', 'news'))  # 수정된 부분
        tokenized_docs[doc_id] = tokens_freq

    print("~~~~~~~~~~~~~~~ end fetching and tokenizing all "+index+"documents ~~~~~~~~~~~~~~~")
    return tokenized_docs
