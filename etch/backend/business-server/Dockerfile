# backend/business-server/Dockerfile
FROM openjdk:17
WORKDIR /app

# JAR 복사
COPY build/libs/*.jar app.jar

# 환경 변수 설정이 있다면 여기 추가 가능
ENV JAVA_OPTS=""

EXPOSE 8081
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

