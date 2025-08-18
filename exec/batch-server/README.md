## 기술 버전

| 구분 | 항목 | 내용 |

| --- | --- | --- |

| IDE | Visual Studio Code | 1.92.0 |

| Language | Python | 3.11 |





## 환경 변수

```

# NewsAPI

NEWSAPI_KEY=<api key>



NEWS_QUERY=삼성전자

NEWS_LANGUAGE=ko

NEWS_PAGE_SIZE=100

NEWS_SORT_BY=publishedAt



# MySQL 

MYSQL_HOST=ssafy-mysql-db.mysql.database.azure.com

MYSQL_PORT=3306

MYSQL_USER=<db user>

MYSQL_PASSWORD=<db password>

MYSQL_DB=<db name>

MYSQL_CHARSET=utf8mb4

#MYSQL_SSL_CA=certsazure-ca.pem #local 환경

MYSQL_SSL_CA=<인증서 경로>#EC2 환경



# Redis 

REDIS_HOST=i13a402.p.ssafy.io

REDIS_PORT=6379



# BATCH

NEWSAPI_DAILY_COUNT=100

NEWSAPI_TEST_COUNT=5

NEWSAPI_CALL_INTERVAL_SEC=0.2

NEWSAPI_LANG=



# LOCK RR

NEWS_LOCK_KEY=news:lock

NEWS_LOCK_TTL=900

NEWS_RR_INDEX_KEY=news:rr:index



#  사람인 api key

ACCESS_KEY=<사람인 api key>

```



## 사용DB 정보

```
url: jdbc:mysql://ssafy-mysql-db.mysql.database.azure.com:3306/S13P12A402?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8

username: S13P12A402

password: mmPPHmgIAU


```

