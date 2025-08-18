## 기술 버전

| 구분 | 항목 | 내용 |

| --- | --- | --- |

| JVM | JDK | Liberica JDK 17 |

| Web Server | Apache Tomcat | v9.0.87 (포트 8081) |

| IDE | IntelliJ IDEA Ultimate | 2024.1 |

| IDE | Visual Studio Code | 1.92.0 |



## 환경 변수

```

# SERVER PORT

SERVER_PORT=8081



# Nginx용 설정

SERVER_FORWARD_HEADERS_STRATEGY=NATIVE

SPRING_MVC_MATCHING_STRATEGY=PATH_PATTERN_PARSER



# JWT 비밀키

SPRING_JWT_SECRET=<jwt secretkey>



# DB 연결 설정 - 개발

SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver

SPRING_DATASOURCE_URL=jdbc:mysql://<db 주소>/<db 이름>?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8

SPRING_DATASOURCE_USERNAME=<username>

SPRING_DATASOURCE_PASSWORD=<password>



# JPA 설정

SPRING_JPA_HIBERNATE_DDL_AUTO=update

SPRING_JPA_HIBERNATE_NAMING_PHYSICAL_STRATEGY=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect



# Redis

SPRING_DATA_REDIS_HOST=redis

SPRING_DATA_REDIS_PORT=6379

SPRING_DATA_REDIS_DATABASE=0



# Google OAuth2 설정 (EC2 환경용)

SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_NAME=google

SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=<google client id>

SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=<google secret key>

SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_REDIRECT_URI=https://etch.it.kr/login/oauth2/code/google

SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_AUTHORIZATION_GRANT_TYPE=authorization_code

SPRING\_SECURITY\_OAUTH2\_CLIENT\_REGISTRATION\_GOOGLE\_SCOPE=profile,email



\# ================================

\# ⭐️ Elasticsearch Settings (추가)

\# ================================

SPRING\_ELASTICSEARCH\_URIS=http://elasticsearch:9200

\#SPRING\_ELASTICSEARCH\_USERNAME=

\#SPRING\_ELASTICSEARCH\_PASSWORD=

SPRING\_ELASTICSEARCH\_CONNECTION\_TIMEOUT=10s

SPRING\_ELASTICSEARCH\_SOCKET\_TIMEOUT=30s



\# ================================

\# ⭐️ Repository Configuration (추가)

\# ================================

SPRING\_DATA\_ELASTICSEARCH\_REPOSITORIES\_ENABLED=true

MANAGEMENT\_HEALTH\_ELASTICSEARCH\_ENABLED=false



CLOUD\_AWS\_S3\_BUCKET=etch

CLOUD\_AWS\_CREDENTIALS\_ACCESS\_KEY=<S3 or minio id>

CLOUD\_AWS\_CREDENTIALS\_SECRET\_KEY=<S3 or minio pw>

CLOUD\_AWS\_REGION\_STATIC=us-east-1

CLOUD\_AWS\_STACK\_AUTO=false

CLOUD\_AWS\_S3\_ENDPOINT=http://minio:9000

CLOUD\_AWS\_S3\_PATH\_STYLE\_ACCESS=true



SPRING\_SERVLET\_MULTIPART\_MAX\_FILE\_SIZE=10MB

SPRING\_SERVLET\_MULTIPART\_MAX\_REQUEST\_SIZE=20MB

PUBLIC\_MINIO\_BASE\_URL=https://etch.it.kr/minio



\#Prometheus

MANAGEMENT\_ENDPOINTS\_WEB\_EXPOSURE\_INCLUDE=prometheus,health

MANAGEMENT\_ENDPOINT\_HEALTH\_SHOW\_DETAILS=always

MANAGEMENT\_METRICS\_TAGS\_APPLICATION=business-server



```



\## 사용 DB 정보



```

url: jdbc:mysql://ssafy-mysql-db.mysql.database.azure.com:3306/S13P12A402?serverTimezone=UTC\\\\\\\&useUnicode=true\\\\\\\&characterEncoding=utf8



username: S13P12A402



password: mmPPHmgIAU





```

