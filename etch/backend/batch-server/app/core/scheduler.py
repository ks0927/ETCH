import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from zoneinfo import ZoneInfo

from ..core.config import settings
from ..service.news_service import fetch_and_store        
from ..service.company_service import refresh_top10       

SEOUL = ZoneInfo("Asia/Seoul")
logger = logging.getLogger("scheduler")

# 스케쥴링
def start_scheduler() -> None:
    scheduler = AsyncIOScheduler(timezone=SEOUL)

    # 뉴스 API 호출 및 DB 저장
    scheduler.add_job(
        lambda: fetch_and_store(settings.NEWS_QUERY),
        CronTrigger.from_crontab(settings.CRON_NEWS, timezone=SEOUL),
        id="news_batch",
        replace_existing=True,
    )

    # Top10 기업 업데이트
    scheduler.add_job(
        refresh_top10,
        CronTrigger.from_crontab(settings.CRON_TOP10, timezone=SEOUL),
        id="top10_batch",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("스케쥴러가 시작되었습니다.")
