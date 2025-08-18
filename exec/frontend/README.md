\## 기술 ver

| 구분 | 항목 | 내용 |

| --- | --- | --- |

| IDE | Visual Studio Code | 1.92.0 |

| Language | Python | 3.11 |



\## 환경 변수 (배포 환경)

```

\# NewsAPI

NEWSAPI\_KEY=<api key>



NEWS\_QUERY=삼성전자

NEWS\_LANGUAGE=ko

NEWS\_PAGE\_SIZE=100

NEWS\_SORT\_BY=publishedAt



\# MySQL 

MYSQL\_HOST=ssafy-mysql-db.mysql.database.azure.com

MYSQL\_PORT=3306

MYSQL\_USER=<db user>

MYSQL\_PASSWORD=<db password>

MYSQL\_DB=<db name>

MYSQL\_CHARSET=utf8mb4

\#MYSQL\_SSL\_CA=certs/azure-ca.pem #local 환경

MYSQL\_SSL\_CA=<인증서 경로>#EC2 환경



\# Redis 

REDIS\_HOST=i13a402.p.ssafy.io

REDIS\_PORT=6379



\# BATCH

NEWSAPI\_DAILY\_COUNT=100

NEWSAPI\_TEST\_COUNT=5

NEWSAPI\_CALL\_INTERVAL\_SEC=0.2

NEWSAPI\_LANG=



\# LOCK / RR

NEWS\_LOCK\_KEY=news:lock

NEWS\_LOCK\_TTL=900

NEWS\_RR\_INDEX\_KEY=news:rr:index



\#  사람인 api key

ACCESS\_KEY=<사람인 api key>

```



\## 주의 사항

* 사람인 API는 발급 시 별도의 메일을 넣어야 할 수 있음(기업이 아닌 개인 이용시)



\## 사용DB 정보

```
url: jdbc:mysql://ssafy-mysql-db.mysql.database.azure.com:3306/S13P12A402?serverTimezone=UTC\&useUnicode=true\&characterEncoding=utf8

username: S13P12A402

password: mmPPHmgIAU
```
