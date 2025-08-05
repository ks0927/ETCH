# Python 3.10 slim 이미지 기반
FROM python:3.10-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치 및 타임존 설정
RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    build-essential \
    default-libmysqlclient-dev \
    tzdata \
    && ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/*

# requirements.txt 먼저 복사하고 패키지 설치
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스 복사
COPY . .

# 기본 실행 명령어: 배치 스케줄러 실행
CMD ["python", "batch_scheduler.py"]
