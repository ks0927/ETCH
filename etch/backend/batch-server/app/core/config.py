from pydantic_settings import BaseSettings 

class Settings(BaseSettings):
    # NewsAPI 
    NEWSAPI_KEY: str
    NEWS_QUERY: str 
    NEWS_PAGE_SIZE: int = 20
    NEWS_LANGUAGE: str 
    NEWS_SORT_BY: str 

    # MySQL 
    MYSQL_HOST: str
    MYSQL_PORT: int 
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DB: str
    MYSQL_CHARSET: str

    # Redis 
    REDIS_HOST: str 
    REDIS_PORT: int 

    # Scheduler (시간 수정 가능)
    CRON_NEWS: str = "0 9 * * *"     # 매일 09:00
    CRON_TOP10: str = "0 10 * * *"   # 매일 10:00

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
