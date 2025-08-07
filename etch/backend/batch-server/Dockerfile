# Python 3.11 slim 이미지 기반
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필수 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    default-libmysqlclient-dev \
    libmariadb-dev \
    tzdata \
 && ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
 && dpkg-reconfigure -f noninteractive tzdata \
 && rm -rf /var/lib/apt/lists/*

# requirements 복사 및 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 기본 실행 커맨드 (스케줄러 실행)
CMD ["python", "batch_scheduler.py"]
