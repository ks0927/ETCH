import logging
import uvicorn
from fastapi import FastAPI

from .api import news, companies
from .api import healthcheck 

from .core.scheduler import start_scheduler

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Batch-Server",
    description="News·Top10 연산 배치 + API",
    version="1.0.0",
)

# 기본 + 헬스체크 
@app.get("/", tags=["Meta"])
def root():
    return {"message": "success"}

@app.get("/health", tags=["Meta"])
def health():
    return {"status": "ok"}

# FastAPI + APScheduler 
@app.on_event("startup")
def _start_scheduler_once() -> None:
    start_scheduler()

# API 라우터
app.include_router(news.router)
app.include_router(companies.router)
app.include_router(healthcheck.router)  

# Uvicorn 서버 실행 - main.py에서 직접 실행할 때만 사용
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
