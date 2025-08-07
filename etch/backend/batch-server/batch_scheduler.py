import sys
import logging
from zoneinfo import ZoneInfo
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv, find_dotenv

# 배치 스케쥴 목록
# 1. news api 등록
from fetch_news import run_batch
# 2. top10 기업 추출 및 redis 저장
from cache_for_redis import fetch_and_store_top10

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("batch_scheduler")

load_dotenv(find_dotenv()) 

SEOUL = ZoneInfo("Asia/Seoul")

# 뉴스 호출에 대한 스케쥴링
def job_news():
    try:
        cnt = run_batch()
        logger.info("news에 대한 Batch가 끝났습니다. %d 개의 기사가 처리되었습니다.", cnt)
    except Exception as e:
        logger.exception("Batch가 실패했습니다: %s", e)

# Top 10 기업에 대한 스케쥴링
def job_top10():
    try:
        fetch_and_store_top10()
        logger.info("Top 10 기업에 대한 Batch가 끝났습니다.")
    except Exception as e:
        logger.exception("Top 10 기업에 대한 Batch가 실패했습니다: %s", e)

if __name__ == "__main__":
    scheduler = BlockingScheduler(timezone=SEOUL)
    
    # 뉴스 API 배치 스케쥴: 시간 변경 가능
    scheduler.add_job(job_news, CronTrigger(hour=12, minute=00, timezone=SEOUL), id="news_batch")

    # Top 10 기업 추출 연산 배치 스케쥴: 시간 변경 가능
    scheduler.add_job(job_top10, CronTrigger(hour=12, minute=30, timezone=SEOUL), id="top10_batch")

    logger.info("스케쥴러가 시작되었습니다.") 

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("스케쥴러를 종료합니다.")
