# Java 17 기반 이미지 사용
FROM openjdk:17-jdk-alpine

# jar 파일 위치를 /app/app.jar 에 두도록 설정
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

# 포트 설정
EXPOSE 8081

# jar 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]

