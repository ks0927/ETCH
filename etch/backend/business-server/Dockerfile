# =========================
# Business-Server Dockerfile
# =========================

# [수정] 기존 'builder:latest' → gradle:8.8-jdk17 사용
#  - Docker Hub에서 pull 가능
#  - Gradle과 JDK 17이 포함된 공식 이미지
FROM gradle:8.8-jdk17 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 소스 복사
COPY . .

# Gradle 빌드 수행 (테스트 제외)
RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test

# ----------------------------------------------------
# 실행 이미지 (경량화)
# [수정] openjdk:17-jdk-slim 사용
# ----------------------------------------------------
FROM openjdk:17-jdk-slim

WORKDIR /app

# 빌드 산출물만 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 컨테이너 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]

