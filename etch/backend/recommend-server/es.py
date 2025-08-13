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


def nori_tokenize(text: str, index: str = "news") -> str:
    """Elasticsearch의 nori 분석기를 사용하여 텍스트를 토큰화하고 공백으로 구분된 문자열로 반환"""
    if not text:
        return ""
    try:
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
        return " ".join(tokens)
    except requests.exceptions.RequestException as e:
        print(f"Error during ES analysis for index {index}: {e}")
        return ""


def tokenize_user_liked_items(sql_result: Dict[str, Any]) -> Dict[str, List[str]]:
    """사용자가 '좋아요'한 아이템들의 텍스트를 타입별로 그룹화된 딕셔너리로 반환"""
    item_types = ['NEWS', 'PROJECT', 'JOB']
    liked_docs_by_type = {item_type: [] for item_type in item_types}
    
    for item_type in item_types:
        items = sql_result.get(item_type, [])
        for item in items:
            title = item.get('title', "")
            content = item.get('content') or item.get('description', "")
            
            # [가중치 적용] title을 두 번 반복하여 가중치를 부여
            combined_text = f"{title} {title} {content}"

            # 만약 아이템 타입이 'JOB'이면 추가 컬럼을 텍스트에 포함
            if item_type == 'JOB':
                company_name = item.get('company_name', "")
                industry = item.get('industry', "")
                category = item.get('category', "")
                combined_text += f" {company_name} {industry} {category}"

            combined_text = combined_text.strip()

            if combined_text:
                index_name = item_type.lower()
                tokenized_text = nori_tokenize(combined_text, index=index_name)
                if tokenized_text:
                    liked_docs_by_type[item_type].append(tokenized_text)
                    
    return liked_docs_by_type


def fetch_and_tokenize_all(index: str = "news", size: int = 1000) -> Dict[str, str]:
    """Elasticsearch에서 전체 문서를 조회하여 {문서_id: 토큰화된_문자열} 딕셔너리로 반환"""
    
    source_fields = ["title", "content", "description"]
    # job 인덱스의 경우 추가 필드를 source에 포함
    if index == "job":
        source_fields.extend(["company_name", "industry", "category"])

    query = {
        "query": {"match_all": {}},
        "_source": source_fields,
        "size": size
    }
    try:
        resp = requests.get(
            f"{ES_URL}/{index}/_search",
            auth=ES_AUTH,
            headers=HEADERS,
            json=query
        )
        resp.raise_for_status()
        hits = resp.json().get('hits', {}).get('hits', [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from ES index {index}: {e}")
        return {}

    tokenized_docs = {}
    for doc in hits:
        doc_id = doc.get('_id')
        if not doc_id:
            continue
            
        source = doc.get('_source', {})
        title = source.get('title', "")
        content = source.get('content') or source.get('description', "")
        
        # [가중치 적용] title을 두 번 반복하여 가중치를 부여
        combined_text = f"{title} {title} {content}"

        # job 인덱스의 경우 추가 필드를 텍스트에 포함
        if index == "job":
            company_name = source.get('company_name', "")
            industry = source.get('industry', "")
            category = source.get('category', "")
            combined_text += f" {company_name} {industry} {category}"

        combined_text = combined_text.strip()
        
        if combined_text:
            doc_index = doc.get('_index', index)
            tokenized_text = nori_tokenize(combined_text, index=doc_index)
            if tokenized_text:
                tokenized_docs[doc_id] = tokenized_text

    print(f"~~~~~~~~~~~~~~~ Fetched and tokenized {len(tokenized_docs)} documents from index: {index} ~~~~~~~~~~~~~~~")
    return tokenized_docs
