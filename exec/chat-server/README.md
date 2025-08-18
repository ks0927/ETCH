\## 기술 버전

| 구분 | 항목 | 내용 |

| --- | --- | --- |

| JVM | JDK | Liberica JDK 17 |

| Web Server | Apache Tomcat | v9.0.87 (포트 8083) |

| IDE | IntelliJ IDEA Ultimate | 2024.1 |

| IDE | Visual Studio Code | 1.92.0 |



\## 환경 변수

```

\# Server Port

server.port=8083



\# Spring Datasource

spring.datasource.url=jdbc:mysql://<DB 주소>/<DB 이름>?serverTimezone=UTC\&useUnicode=true\&characterEncoding=utf8

spring.datasource.username=<username>

spring.datasource.password=<password>

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver



\# JPA

spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true



\# Redis

spring.data.redis.host=redis

spring.data.redis.port=6379



\# JWT Secret Key (business-server와 반드시 동일해야 함)

spring.jwt.secret=<jwt secretkey>



```





\## 사용 DB 정보



```
url: jdbc:mysql://ssafy-mysql-db.mysql.database.azure.com:3306/S13P12A402?serverTimezone=UTC\&useUnicode=true\&characterEncoding=utf8
username: S13P12A402
password: mmPPHmgIAU

```



