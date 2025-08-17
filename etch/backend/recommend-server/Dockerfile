# Python 3.12 버전 이미지를 기반으로 합니다.
FROM python:3.12-slim

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# requirements.txt 파일을 복사합니다.
COPY requirements.txt .

# 의존성을 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 현재 디렉토리의 모든 파일을 /app 디렉토리로 복사합니다.
COPY . .

# 8000번 포트를 외부에 노출합니다.
EXPOSE 8084

# 애플리케이션을 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8084"]
