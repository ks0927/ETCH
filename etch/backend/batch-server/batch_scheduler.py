import sys
import logging
from zoneinfo import ZoneInfo
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv, find_dotenv

from fetch_news import run_batch         
from cache_for_redis import fetch_and_store_top10  

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("batch_scheduler")

load_dotenv(find_dotenv())
SEOUL = ZoneInfo("Asia/Seoul")

def job_news():
    try:
        cnt = run_batch()
        logger.info("News Batch 완료: %d 개 기사", cnt)
    except Exception as e:
        logger.exception("News Batch 실패: %s", e)

def job_top10():
    try:
        fetch_and_store_top10()
        logger.info("Top10 Batch 완료")
    except Exception as e:
        logger.exception("Top10 Batch 실패: %s", e)

if __name__ == "__main__":
    sched = BlockingScheduler(timezone=SEOUL)

    sched.add_job(job_news,
                  CronTrigger(hour=14, minute=15, timezone=SEOUL),
                  id="news_batch")

    sched.add_job(job_top10,
                  CronTrigger(hour=14, minute=17, timezone=SEOUL),
                  id="top10_batch")

    logger.info("스케쥴러 시작")
    try:
        sched.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("스케쥴러 종료")
