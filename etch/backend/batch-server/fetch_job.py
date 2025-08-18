import requests
import time
import re
from urllib.parse import urlparse, parse_qs
from datetime import datetime

import os
import sys
import logging
from typing import Any, Dict, List, Optional

import pymysql
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

def env_required(key: str) -> str:
    v = os.getenv(key)
    if not v:
        raise RuntimeError(f"환경 변수 {key}를 설정하세요.")
    return v

def env_int(key: str, default: Optional[int] = None) -> int:
    v = os.getenv(key)
    if v is None:
        if default is None:
            raise RuntimeError(f"환경 변수 {key}를 설정하세요.")
        return default
    return int(v)

ACCESS_KEY = env_required("ACCESS_KEY")
BASE_URL = 'https://oapi.saramin.co.kr/job-search'
HEADERS = {'Accept': 'application/json'}

REGION_CODE_MAP = {
    '101': '서울',
    '102': '경기',
    '103': '광주',
    '104': '대구',
    '105': '대전',
    '106': '부산',
    '107': '울산',
    '108': '인천',
    '109': '강원',
    '110': '경남',
    '111': '경북',
    '112': '전남',
    '113': '전북',
    '114': '충북',
    '115': '충남',
    '116': '제주',
    '117': '전국',
    '118': '세종'
    # 2XX: 해외 → 제외 대상
}

INDUSTRY_CODE_MAP = {
    '1': '서비스업',
    '2': '제조,화학',
    '3': 'IT,웹,통신',
    '4': '은행,금융업',
    '5': '미디어,디자인',
    '6': '교육업',
    '7': '의료,제약,복지',
    '8': '판매,유통',
    '9': '건설업',
    '10': '기관,협회'
}

job_code_to_category = {
    80: '게임/그래픽', 81: '기타/공통', 82: '데이터/AI', 83: '데이터/AI', 84: '백엔드', 85: '보안/인프라',
    86: '모바일', 87: '프론트엔드', 88: '프론트엔드', 89: '기타/공통', 90: '보안/인프라', 91: '프론트엔드',
    92: '프론트엔드', 93: '보안/인프라', 94: '기타/공통', 95: '백엔드', 96: '기타/공통', 97: '게임/그래픽',
    98: '기타/공통', 99: '기타/공통', 100: '보안/인프라', 101: '백엔드', 102: '기타/공통', 103: '기타/공통',
    104: '백엔드', 106: '데이터/AI', 107: '데이터/AI', 108: '데이터/AI', 109: '데이터/AI', 110: '게임/그래픽',
    111: '보안/인프라', 112: '백엔드', 113: '프론트엔드', 114: '보안/인프라', 115: '기타/공통', 116: '데이터/AI',
    117: '기타/공통', 118: '기타/공통', 119: '백엔드', 120: '데이터/AI', 121: '보안/인프라', 122: '데이터/AI',
    123: '데이터/AI', 124: '프론트엔드', 125: '데이터/AI', 126: '데이터/AI', 127: 'DevOps/클라우드',
    128: '임베디드/하드웨어', 129: '기타/공통', 130: '기타/공통', 131: '데이터/AI', 132: '보안/인프라',
    133: '기타/공통', 134: '프론트엔드', 135: '기타/공통', 136: 'DevOps/클라우드', 137: '데이터/AI',
    138: '기타/공통', 139: '임베디드/하드웨어', 140: '기타/공통', 141: '기타/공통', 142: '기타/공통',
    143: '기타/공통', 144: '게임/그래픽', 145: '백엔드', 146: 'DevOps/클라우드', 147: '보안/인프라',
    148: '기타/공통', 149: '기타/공통', 150: '기타/공통', 151: '임베디드/하드웨어', 152: '기타/공통',
    153: '임베디드/하드웨어', 154: '기타/공통', 155: '기타/공통', 157: '보안/인프라', 158: '임베디드/하드웨어',
    159: '기타/공통', 160: '데이터/AI', 161: '데이터/AI', 162: '데이터/AI', 163: '데이터/AI',
    164: '백엔드', 165: '기타/공통', 166: '임베디드/하드웨어', 167: '기타/공통', 168: '기타/공통',
    169: '기타/공통', 170: '백엔드', 171: '기타/공통', 172: '기타/공통', 173: '보안/인프라', 174: '기타/공통',
    175: '기타/공통', 176: '기타/공통', 177: '보안/인프라', 178: '게임/그래픽', 179: '기타/공통',
    180: '기타/공통', 181: '데이터/AI', 182: '기타/공통', 183: '기타/공통', 184: '기타/공통',
    185: '기타/공통', 186: '임베디드/하드웨어', 187: '기타/공통', 188: '기타/공통', 189: '기타/공통',
    190: '보안/인프라', 191: '기타/공통', 192: '기타/공통', 193: '기타/공통', 194: '기타/공통',
    195: '모바일', 196: '모바일', 197: '기타/공통', 198: '기타/공통', 199: '기타/공통', 200: '기타/공통',
    201: 'DevOps/클라우드', 202: 'DevOps/클라우드', 203: '기타/공통', 204: '백엔드', 205: '백엔드',
    206: '백엔드', 207: '기타/공통', 208: '기타/공통', 209: '프론트엔드', 210: '프론트엔드', 211: '기타/공통',
    212: '기타/공통', 213: '기타/공통', 214: 'DevOps/클라우드', 215: '기타/공통', 216: '기타/공통',
    217: 'DevOps/클라우드', 218: '기타/공통', 219: '기타/공통', 220: '모바일', 221: 'DevOps/클라우드',
    222: '기타/공통', 223: '기타/공통', 224: '기타/공통', 225: '기타/공통', 226: '기타/공통', 227: '기타/공통',
    228: '기타/공통', 229: '프론트엔드', 230: '백엔드', 231: '기타/공통', 232: '기타/공통', 233: '모바일',
    234: '모바일', 235: '백엔드', 236: '프론트엔드', 237: '기타/공통', 238: '백엔드', 239: '프론트엔드',
    240: '백엔드', 241: '기타/공통', 242: '기타/공통', 243: '모바일', 244: 'DevOps/클라우드',
    245: '기타/공통', 246: '기타/공통', 247: '보안/인프라', 248: '기타/공통', 249: '기타/공통',
    250: '기타/공통', 251: '기타/공통', 252: '기타/공통', 253: '기타/공통', 254: '기타/공통',
    255: '기타/공통', 256: '백엔드', 257: '백엔드', 258: '모바일', 259: '기타/공통', 260: '모바일',
    261: '기타/공통', 262: '기타/공통', 263: '기타/공통', 264: '기타/공통', 265: '기타/공통',
    266: '데이터/AI', 267: '기타/공통', 268: '백엔드', 269: '백엔드', 270: '백엔드', 271: '기타/공통',
    272: '백엔드', 273: '데이터/AI', 274: '데이터/AI', 275: '기타/공통', 276: '데이터/AI', 277: '프론트엔드',
    278: '모바일', 279: '모바일', 280: '백엔드', 281: '기타/공통', 282: '백엔드', 283: '백엔드',
    284: '기타/공통', 285: '데이터/AI', 286: '백엔드', 287: '백엔드', 288: '기타/공통', 289: '데이터/AI',
    290: '보안/인프라', 291: '백엔드', 292: '백엔드', 293: '백엔드', 294: '백엔드', 295: '백엔드',
    296: '백엔드', 297: '기타/공통', 298: '모바일', 299: '기타/공통', 300: '데이터/AI', 301: '기타/공통',
    302: '기타/공통', 303: '기타/공통', 304: '게임/그래픽', 305: '기타/공통', 306: '게임/그래픽',
    307: '기타/공통', 308: '기타/공통', 309: '기타/공통', 310: '기타/공통', 311: '기타/공통',
    312: '프론트엔드', 313: '기타/공통', 314: '프론트엔드', 315: '프론트엔드', 316: '기타/공통',
    317: '기타/공통', 318: '기타/공통', 319: '임베디드/하드웨어', 320: '임베디드/하드웨어'
}


def clean_industry_codes(raw_industry_list):
    """업종 리스트에서 상위 업종 코드만 추출 (뒤 2자리 제거 후 매핑)"""
    industries = set()

    for ind in raw_industry_list:
        code = ind.get('code')
        if not code or len(code) < 3:
            continue

        # 뒤 2자리 제거 → 상위 업종 코드
        upper_code = code[:-2]  # ex: '303' → '3', '1001' → '10'

        name = INDUSTRY_CODE_MAP.get(upper_code)
        if name:
            industries.add(name)

    return ','.join(sorted(industries)) if industries else None


def clean_region_codes(raw_location_list):
    """API로 받은 복수 지역(콤마 포함 가능)에서 국내 1차 지역(3자리 prefix)만 추출"""
    region_prefixes = set()

    # 입력이 dict로 오는 경우 리스트로 통일
    if isinstance(raw_location_list, dict):
        raw_location_list = [raw_location_list]
    elif raw_location_list is None:
        raw_location_list = []

    for loc in raw_location_list:
        code_field = loc.get('code')
        if not code_field:
            continue

        # code_field가 "101050,101060,101070"처럼 콤마로 묶여 있을 수 있음
        for code in str(code_field).split(','):
            code = code.strip()
            if len(code) < 6 or not code.isdigit():
                continue
            prefix = code[:3]  # 1차 지역
            # 해외(2로 시작하는 대륙 코드) 제외
            if prefix.startswith('2'):
                continue
            if prefix in REGION_CODE_MAP:
                region_prefixes.add(prefix)

    regions = [REGION_CODE_MAP[p] for p in sorted(region_prefixes)]
    return ','.join(regions) if regions else None


def extract_csn(href):
    if not href:
        return None
    try:
        parsed = urlparse(href)
        qs = parse_qs(parsed.query)
        csn = qs.get('csn', [None])[0]
        if csn:
            match = re.search(r'\d{10}', csn)
            return match.group() if match else None
    except Exception:
        return None

def timestamp_to_datetime_str(ts):
    try:
        return datetime.fromtimestamp(int(ts)).strftime('%Y-%m-%d %H:%M:%S')
    except:
        return None

def clean_to_string(value):
    if isinstance(value, list):
        return ','.join(value)
    return str(value) if value else None

def fetch_and_clean_jobs():
    page = 0
    max_count = 110
    cleaned_jobs = []

    while True:
        params = {
            'access-key': ACCESS_KEY,
            'job_mid_cd': 2,
            'stock': 'kospi,kosdaq,konex',
            'count': max_count,
            'start': page,
            'sort': 'pd'
        }

        print(f"📡 요청 중... page={page}")
        response = requests.get(BASE_URL, headers=HEADERS, params=params)
        if response.status_code != 200:
            print(f"❌ 요청 실패: {response.status_code}")
            break

        data = response.json().get('jobs', {})
        jobs = data.get('job', [])
        total = int(data.get('total', 0))
        print(f"✅ 받은 공고 수: {len(jobs)} / 전체: {total}")

        if not jobs:
            print("🛑 더 이상 가져올 공고가 없습니다.")
            break

        for job in jobs:
            try:
                exp_code = job['position']['experience-level']['code']
                if str(exp_code) not in ('1', '3', '0'):  # 신입 조건
                    continue

                position = job.get('position', {})
                company = job.get('company', {}).get('detail', {})

                # 사업자 등록번호 → DB 조회 후 company_id로 매핑 필요 (여기선 추출만)
                csn = extract_csn(company.get('href'))

                # 🔸 지역 리스트 처리 (list of dicts)
                location_list = position.get('location', [])
                if isinstance(location_list, dict):
                  location_list = [location_list]

                #업종 처리
                industry_list = position.get('industry', [])
                if isinstance(industry_list, dict):
                  industry_list = [industry_list]

                # 직무 코드 → 대분류 매핑
                job_category = None

                try:
                    job_code_str = job.get("position", {}).get("job-code", {}).get("code")

                    if not job_code_str:
                        raise ValueError("직무 코드가 없음")

                    job_categories = set()
                    for code_str in job_code_str.split(','):
                        code_str = code_str.strip()
                        if not code_str.isdigit():
                            continue
                        code = int(code_str)
                        category = job_code_to_category.get(code)
                        if category:
                            job_categories.add(category)

                    job_category = ",".join(sorted(job_categories)) if job_categories else None

                except Exception as e:
                    print(f"⚠️ 직무 코드 파싱 실패: {e}")
                    job_category = None


                # 정제된 데이터 생성
                cleaned_jobs.append({
                    'company_id': csn,  # 실제 사용 시 DB 조회 필요
                    'company_name': company.get('name'),
                    'title': position.get('title'),
                    'industry': clean_industry_codes(industry_list),
                    'job_category': job_category,
                    'region': clean_region_codes(location_list),
                    'work_type': clean_to_string(position.get('job-type', {}).get('name')),
                    'education_level': position.get('required-education-level', {}).get('name'),
                    'opening_date': timestamp_to_datetime_str(job.get('opening-timestamp')),
                    'expiration_date': timestamp_to_datetime_str(job.get('expiration-timestamp')),
                    'external_job_id': str(job.get('id'))
                })

            except Exception as e:
                print(f"⚠️ 처리 중 오류 발생: {e}")
                continue

        page += 1
        time.sleep(1.0)

    return cleaned_jobs

# -----------------------------------------------------------------------------
# 환경설정
# -----------------------------------------------------------------------------


MYSQL_HOST     = env_required("MYSQL_HOST")
MYSQL_PORT     = env_int("MYSQL_PORT", 3306)
MYSQL_USER     = env_required("MYSQL_USER")
MYSQL_PASSWORD = env_required("MYSQL_PASSWORD")
MYSQL_DB       = env_required("MYSQL_DB")
MYSQL_CHARSET  = os.getenv("MYSQL_CHARSET", "utf8mb4")
#MYSQL_SSL_CA   = os.getenv("MYSQL_SSL_CA")


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("job_saver")

# -----------------------------------------------------------------------------
# DB 연결
# -----------------------------------------------------------------------------
def get_conn():
    kwargs = dict(
        host        = MYSQL_HOST,
        port        = MYSQL_PORT,
        user        = MYSQL_USER,
        password    = MYSQL_PASSWORD,
        database    = MYSQL_DB,
        charset     = MYSQL_CHARSET,
        autocommit  = True,
        cursorclass = pymysql.cursors.DictCursor,
    )

    # if MYSQL_SSL_CA:
    #    kwargs["ssl"] = {"ca": MYSQL_SSL_CA}

    return pymysql.connect(**kwargs)

# -----------------------------------------------------------------------------
# 유틸: company_id 조회 (사업자등록번호 -> company.id)
# -----------------------------------------------------------------------------
def _to_date_or_none(dt_str: Optional[str]) -> Optional[str]:
    """'YYYY-MM-DD HH:MM:SS' 또는 'YYYY-MM-DD' -> 'YYYY-MM-DD' (DATE 컬럼용)"""
    if not dt_str:
        return None
    return dt_str[:19]

def get_company_id_by_business_no(conn, business_no: str) -> Optional[int]:
    if not business_no:
        return None
    sql = "SELECT id FROM company WHERE business_no = %s"
    with conn.cursor() as cur:
        cur.execute(sql, (business_no,))
        row = cur.fetchone()
        return row["id"] if row else None

def save_cleaned_jobs(cleaned_jobs: List[Dict[str, Any]], get_conn_func) -> Dict[str, int]:
    """
    cleaned_jobs 예시 키:
      company_id(=사업자번호), company_name, title, industry, job_category,
      region, work_type, education_level, opening_date, expiration_date
    """
    stats = {"inserted": 0, "skipped_no_company": 0, "skipped_missing_fields": 0, "errors": 0}

    insert_sql = """
        INSERT INTO job (
            title,
            company_name,
            region,
            industry,
            job_category,
            work_type,
            education_level,
            opening_date,
            expiration_date,
            created_at,
            updated_at,
            company_id,
            external_job_id
        ) VALUES (
            %(title)s,
            %(company_name)s,
            %(region)s,
            %(industry)s,
            %(job_category)s,
            %(work_type)s,
            %(education_level)s,
            %(opening_date)s,
            %(expiration_date)s,
            CURDATE(),
            CURDATE(),
            %(company_id)s,
            %(external_job_id)s
        )
        ON DUPLICATE KEY UPDATE
            company_name    = VALUES(company_name),
            region          = VALUES(region),
            industry        = VALUES(industry),
            job_category    = VALUES(job_category),
            work_type       = VALUES(work_type),
            education_level = VALUES(education_level),
            opening_date    = VALUES(opening_date),
            expiration_date = VALUES(expiration_date),
            updated_at      = CURDATE();
    """


    with get_conn_func() as conn, conn.cursor() as cur:
        for idx, j in enumerate(cleaned_jobs, start=1):
            try:
                biz_no = j.get("company_id")   # 정제단계에서 csn(사업자번호)이 들어있음
                title  = j.get("title")
                if not biz_no or not title:
                    stats["skipped_missing_fields"] += 1
                    logger.warning("행 %d 스킵: 필수값 누락(business_no/title). data=%s", idx, j)
                    continue

                cid = get_company_id_by_business_no(conn, biz_no)
                if not cid:
                    stats["skipped_no_company"] += 1
                    logger.warning("행 %d 스킵: company(business_no=%s) 미존재", idx, biz_no)
                    continue

                params = {
                    "company_id": cid,
                    "title": title,
                    "company_name": j.get("company_name"),
                    "region": j.get("region"),
                    "industry": j.get("industry"),
                    "job_category": j.get("job_category"),
                    "work_type": j.get("work_type"),
                    "education_level": j.get("education_level"),
                    "opening_date": _to_date_or_none(j.get("opening_date")),
                    "expiration_date": _to_date_or_none(j.get("expiration_date")),
                    "external_job_id": j.get("external_job_id")
                }

                cur.execute(insert_sql, params)
                stats["inserted"] += 1

            except Exception as e:
                stats["errors"] += 1
                logger.exception("행 %d 저장 실패: %s", idx, e)

    logger.info("저장 요약: %s", stats)
    return stats


if __name__ == "__main__":
    job_data = fetch_and_clean_jobs()
    save_cleaned_jobs(job_data, get_conn)