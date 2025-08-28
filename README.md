# ETCH (엣취!)-README

> ***“Everyone 취업!”***
IT 취업 준비생을 위한 통합 취업 지원 플랫폼
> 

프로젝트 기간 : 2025.07 ~ 2025.08
---

# 🔗프로젝트 링크

<aside>

💡[**ETCH - Everyone, 취업! 엣취!**](https://etch.it.kr)

</aside>

# 👥 팀 구성

| 역할 | 이름 | 담당 업무 |
| --- | --- | --- |
| **팀장 & 인프라** | **한승수** | **CI/CD 구축, 서버 관리, DevOps** |
| **백엔드 [리드]** | **김윤수** | **백엔드 아키텍처 설계, 핵심 API 개발** |
| **백엔드** | **이재빈** | **OAuth 인증, 추천 기능, API 개발** |
| **백엔드** | **이현지** | **배치 시스템, Redis 캐싱, 데이터 수집, API 개발** |
| **프론트엔드 [리드]** | **지성현** | **프론트엔드 아키텍처, UI/UX 설계** |
| **프론트엔드** | **김성민** | **컴포넌트 개발, 사용자 인터페이스 구현** |

---

# 📋프로젝트 관리

## [Jira↗️](https://ssafy.atlassian.net/jira/software/c/projects/S13P11A402/summary)

- 스프린트 기반 일정 관리
- BE/FE/Infra 별 업무 분담
- 스토리 포인트 기반 작업량 추정
- 매주 월요일 작업 계획 수립

## [GitLab Repo↗️](https://lab.ssafy.com/s13-webmobile1-sub1/S13P11A402)

- Git Flow 적용 (master, dev, feat)
- Jira task를 통한 branch 생성

## [Notion↗️](https://www.notion.so/22a1a1b1012f809f96ecefba833c1fe9?pvs=21)

- 프로젝트 회의록 및 공유 문서 관리
- 팀 규칙 (그라운드 룰, 회의 룰) 명시
- 컨벤션 정리 (Git, Code, Naming, Jira, DB)
- 명세서 관리 (기능, API, ERD)
- 환경변수 및 설정 값 관리

---

# 🗺️ 프로젝트 아키텍쳐

![프로젝트 아키텍쳐](assets/아키텍처.jpg)

## 시스템 아키텍처 구성

**🔄 CI/CD Pipeline**
- **Jenkins**: Git Webhook을 통한 자동 빌드/배포
- **Docker Hub**: 컨테이너 이미지 저장소
- **Git**: GitLab을 통한 소스코드 관리
- **Nginx**: 리버스 프록시 및 로드 밸런서
- **Blue-Green 배포**: 무중단 배포 전략 적용
- **사용자 접근점**: EC2를 통한 서비스 제공

**🌐 Frontend**
- **React**: React + Typescript + Vite 기반 동적 웹페이지 (Blue-Green 배포)
- **UI/UX**: Figma를 통한 사용자 중심의 UI/UX 설계
- **Design Pattern**: Atomic Design Pattern 기반 프로젝트 구조 설계

**🏗️ Backend Microservices**
- **Business Server**: Spring Boot 기반 핵심 비즈니스 로직 (Blue-Green 배포)
- **Batch Server**: Python 기반 주기적 데이터 수집 및 처리
- **Recommend Server**: FastAPI + TF-IDF&LSA 기반 개인 맞춤형 추천 시스템
- **Chatting Server**: Spring Boot + STOMP + Redis 기반 실시간 채팅

**💾 Data Storage**
- **MySQL**: 메인 관계형 데이터베이스
- **Redis**: 캐싱 및 세션 관리, 채팅 메시지 저장
- **MinIO**: S3 호환 객체 스토리지 (파일 업로드)

**📊 Monitoring & Logging**
- **Grafana & Prometheus**: 시스템 모니터링 대시보드
- **Promtail & Loki**: 로그 수집 및 분석

## 서버별 기술 스택 상세

| 구분 | 기술 스택 |
|------|-----------|
| **Frontend** | React, Typescript, Vite |
| **Batch Server** | Python, Redis(인기 Top10 캐싱), MySQL(공고/뉴스/기업 데이터 저장) |
| **Business Server** | Spring Boot, MySQL(메인 DB), Redis(Refresh 토큰), MinIO(이미지 저장), OAuth(google OAuth), JWT(Access/Refresh Token), Elasticsearch(통합 검색, 인덱스/필터 적용) |
| **Chatting Server** | Spring Boot, MySQL(채팅 내역 저장), Redis(채팅방 pub/sub 구조), STOMP(메시지 규약) |
| **Recommend Server** | Python FastAPI, Redis(추천 데이터 캐싱), MySQL(사용자 데이터 추출), Elasticsearch(인덱스 데이터 추출) |
| **CI/CD** | Jenkins, Nginx(certbot 활용 SSL 과 https 적용), 블루/그린 배포를 통한 무중단 배포, gitlab webhook 활용 CI, CD 후 MM 알림 |
| **Monitoring** | Prometheus, Grafana, Promtail, Loki |

---

# ❤️ 주요 서비스 소개

## 공고/기업/뉴스 정보를 한 눈에
- 사람인 API, 전자공시 API, News API 데이터를 Batch server를 통해 주기적으로 호출
- 데이터 전처리 과정을 통하여 프로젝트 최적화 후 DB에 저장
- 사용자 중심적 UI/UX 설계

## 개인/맞춤형 추천 서비스
- 사용자 활동 데이터 기반 맞춤형 채용 공고 및 뉴스 아이템 제공
- 단어 기반 추천율 매칭
- TF-IDF+LSA 방식을 통해 추천 유사도 매칭률을 증가

## 자소서/포트폴리오 작성
- 대표 자기소개서 질문에 대한 작성 가이드라인 제공
- 포트폴리오 작성 양식 제공
- 포트폴리오 작성 시 업로드한 프로젝트 내용 선택적 첨부 가능

## 프로젝트 SNS
- GitHub보다 가벼운 프로젝트 소개 커뮤니티
- 소스코드를 올리는 것이 아닌 프로젝트 관련 사진과 설명, 링크 등을 올려 프로젝트를 소개
- 프로젝트 아이디어 영감 및 인적 네트워킹 형성

---

# ✨ 주요 기술 소개

## ✅ 뉴스/채용공고/기업정보 최적화
- Job Scheduler & Redis RR 기법을 활용한 주기적인 데이터 업데이트
- 사용자 선호도 기반 TOP10 기업 추출 후 Redis 캐싱

## ✅ 실시간 채팅
- Spring Boot + STOMP + Redis 를 사용하여 채팅 서버 구현
- Redis pub/sub 구조를 통한 채팅방 구독 시스템 적용

## ✅ 검색 시스템
- Elasticsearch를 사용하여 통합 검색 및 인덱스/필터 최적화
- Logstash 를 통한 ES↔DB 데이터 동기화 (멱등성 보장)

## ✅ 추천 시스템
- 단어 등장 빈도 기반 추천 → TF-IDF 방식
- TF-IDF에서 LSA연산 추가
  - 추가 전: 0.4 유사도 → 추가 후: 0.8 유사도

---

# ⚡주차별 업적

## 🗓1주차~2주차 - 주제 선정

- **주제 선정**: 13번의 주제 회의, 30개 아이디어 도출
![alt text](assets/image.png)
- **최종 주제**: ***“통합 취업 지원 플랫폼 서비스”***
    
    > **ETCH (엣취!)**는 IT 취업 준비생들이 한 곳에서 모든 취업 준비를 할 수 있는 통합 플랫폼입니다. 채용 정보 제공부터 개인 맞춤 추천, 프로젝트 SNS, 자소서/포트폴리오 작성 지원까지 취업 준비에 필요한 모든 기능을 제공합니다.
    > 
    

## 📄3주차 - 명세서 작성

### **기능 명세서**

| 역할        | 통합 채용 정보                                                                                        | 맞춤형 콘텐츠 추천                                               | 프로젝트 SNS                                                   | 취준 어시스턴트                                                                      |
| --------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 기능 명세서 작성 | - 다중 API (사람인 API, NewsAPI, DartAPI) 기반 데이터 수집<br>- ElasticSearch 기반 통합 검색 기능<br>- 실시간 채용 알림 전송 | - 사용자 관심 분야 및 활동 기반 추천 알고리즘<br>- 맞춤형 채용 공고, 뉴스, 기업 정보 제공 | - 프로젝트 공유 및 팀원 모집 플랫폼<br>- 커뮤니티 기반 개발자 네트워킹<br>- 실시간 채팅 기능 | - AI 기반 자기소개서/포트폴리오 작성 지원<br>- 개인 맞춤형 가이드라인 및 템플릿 제공<br>- 대시보드 기반 취업 준비 현황 분석 |


### **API 명세서**

![alt text](assets/api.png)

### **UI/UX**

![UI/UX Thumbnail](assets/design.png)
![Figma Thumbnail](assets/메인썸네일.png)

### **ERD 설계**

![ERD Thumbnail](assets/공통ERD.png)
## 데이터베이스 구조

| 카테고리 | 테이블명 | 설명 |
|---------|----------|------|
| **👤 사용자 관리** | member | 사용자 기본 정보 (로그인, 권한 등) |
| | profile | 사용자 프로필 상세 정보 |
| | tech_stack | 사용자별 기술 스택 관리 |
| **💼 채용 정보** | job | 채용 공고 정보 (사람인 API 연동) |
| | company | 기업 정보 (전자공시 API 연동) |
| | job_scrap | 사용자별 채용 공고 스크랩 |
| **📰 뉴스 & 콘텐츠** | news | IT 뉴스 정보 (News API 연동) |
| | news_scrap | 사용자별 뉴스 스크랩 |
| **🚀 프로젝트 & 포트폴리오** | project | 프로젝트 정보 및 SNS 기능 |
| | project_tech | 프로젝트별 사용 기술 |
| | project_comment | 프로젝트 댓글 |
| | portfolio | 사용자 포트폴리오 |
| | portfolio_project | 포트폴리오-프로젝트 연결 |
| **💬 채팅 시스템** | chatting | 실시간 채팅방 관리 |
| | chat_participant | 채팅방 참여자 |
| | chat_message | 채팅 메시지 |
| **🎯 추천 시스템** | recommend | TF-IDF + LSA 기반 개인 맞춤 추천 |
| | user_activity | 사용자 활동 로그 (추천 알고리즘 학습용) |

---

## 🔧4주차 - CI/CD 구축 및 개발 시작

| 역할 | 담당자 | 주요 업무 |
|------|--------|-----------|
| **🏗️ 인프라 & DevOps** | **한승수 (팀장 & 인프라)** | • Jenkins CI/CD 파이프라인 구축<br>• GitLab Webhook 연동 자동화<br>• Nginx 리버스 프록시 설정 |
| **💻 백엔드 개발** | **김윤수 (백엔드 리드)** | • 기본 CRUD 구현<br>• ElasticSearch 테스트 및 설정<br>• ERD 조정 및 백엔드 업무 분담 조정 |
| | **이재빈 (백엔드)** | • 기본 CRUD 구현<br>• Google OAuth 연동 시스템 구축<br>• JWT Token 적용 (Access, Refresh Token) |
| | **이현지 (백엔드)** | • 기본 CRUD 구현<br>• 코스피, 코스닥 기준 주요 회사 정리<br>• 회사별 NewsAPI 호출 서버 구축<br>• Redis 활용 인기 Top10 기능 구현 |
| **🎨 프론트엔드 개발** | **지성현 (프론트엔드 리드)** | • 변형 Atomic Design 패턴 적용 (atoms → molecules → organisms → pages → layout)<br>• React Router 페이지 관리 (SPA 라우팅 및 코드 스플리팅) |
| | **김성민 (프론트엔드)** | • 변형 Atomic Design 패턴 적용 (atoms → molecules → organisms → pages → layout)<br>• React Router 페이지 관리 (SPA 라우팅 및 코드 스플리팅) |

## 🎯5주차 - 집중 개발 기간

| 역할 | 담당자 | 주요 업무 |
|------|--------|-----------|
| **🏗️ 인프라 & DevOps** | **한승수 (팀장 & 인프라)** | • Prometheus와 Grafana를 적용하여 모니터링 시스템 구축<br>• 빌드/배포 시간 최적화<br>• 블루/그린 배포 전략 적용 |
| **💻 백엔드 개발** | **김윤수 (백엔드 리드)** | • 검색 API 구현<br>• ElasticSearch 적용 및 최적화<br>• ChattingServer 작업 |
| | **이재빈 (백엔드)** | • 자소서/포트폴리오 API 구현<br>• RecommendServer 작업 |
| | **이현지 (백엔드)** | • ERD 정규화 작업<br>• JPQL 쿼리 최적화<br>• 프로젝트 API 구현 |
| **🎨 프론트엔드 개발** | **지성현 (프론트엔드 리드)** | • 프로젝트/뉴스/인기/채용/좋아요 API 연결<br>• 주요 모달창 구현 |
| | **김성민 (프론트엔드)** | • 메인페이지 레이아웃 구현<br>• OAuth 연결<br>• 검색/뉴스/프로젝트/채용/파일 API 연결 |

## 🏆6주차 - 프로젝트 완성

| 역할 | 담당자 | 주요 업무 |
|------|--------|-----------|
| **🏗️ 인프라 & DevOps** | **한승수 (팀장 & 인프라)** | • Gradle 캐싱 활용 빌드/배포 시간 단축<br>• 블루/그린 배포(Frontend, Business Server) 적용 → 무중단 배포<br>• 실시간 채팅 서버 구현<br>• 최종 시스템 모니터링 및 안정화 |
| **💻 백엔드 개발** | **김윤수 (백엔드 리드)** | • Elasticsearch 인덱싱 최적화 및 필터 구현<br>• 분석/통계 API 개발<br>• 채용 공고 데이터 전처리 완성 |
| | **이재빈 (백엔드)** | • 데이터 문서화(.md) API 개발<br>• 추천 서버 구현(TF-IDF+LSA) 완성<br>• OAuth 인증 시스템 최적화 |
| | **이현지 (백엔드)** | • JPQL 쿼리 최적화<br>• 인기 TOP10 Redis 캐싱 시스템 완성<br>• Batch server 스케줄링 최적화 |
| **🎨 프론트엔드 개발** | **지성현 (프론트엔드 리드)** | • 포트폴리오 상세보기/작성/수정 화면 구현<br>• 프로젝트 상세보기/작성/수정 화면 구현<br>• API 연동 및 UI 최적화 |
| | **김성민 (프론트엔드)** | • 팔로워/팔로잉 컴포넌트 구현<br>• 통합 검색 페이지 구현<br>• API 연동 및 UI 최적화 |

---

## 🛠기술 스택

| 분류 | 기술 |
|------|------|
| **Programming Languages** | TypeScript, Java, Python |
| **Frameworks** | React, Spring Boot, Spring Security, Oauth, JWT |
| **Databases** | MySQL, Redis, MinIO(S3) |
| **Version Control** | Git, GitLab, Jira |
| **Cloud Services** | EC2, MySQL(Azure) |
| **Deployment Tools** | Docker, DockerHub |
| **CI/CD** | Jenkins, Nginx |
| **Monitoring** | Prometheus, Grafana, Promtail, Loki |
| **OpenSource** | Elasticsearch |
| **API** | 뉴스API, 기업API, 채용API |
| **Co-op** | Jira, Figma, Notion, Git/GitLab |

---

# 📄 라이센스

본 프로젝트는 다음과 같은 오픈소스 라이브러리와 프레임워크를 사용합니다:

## 주요 의존성 라이센스

### Backend (Spring Boot)
- **Spring Boot 3.5.4** - [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- **Spring Security & OAuth2** - [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- **JWT (jsonwebtoken)** - [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- **MySQL Connector/J** - [GPL v2 with FOSS Exception](https://www.mysql.com/about/legal/licensing/foss-exception/)
- **Redis** - [BSD 3-Clause License](https://redis.io/legal/licenses/)
- **Elasticsearch** - [Elastic License 2.0](https://www.elastic.co/licensing/elastic-license)

### Frontend (React)
- **React 19.1.0** - [MIT License](https://github.com/facebook/react/blob/main/LICENSE)
- **TypeScript** - [Apache License 2.0](https://github.com/Microsoft/TypeScript/blob/main/LICENSE.txt)
- **Vite** - [MIT License](https://github.com/vitejs/vite/blob/main/LICENSE)
- **Redux Toolkit** - [MIT License](https://github.com/reduxjs/redux-toolkit/blob/master/LICENSE)
- **Axios** - [MIT License](https://github.com/axios/axios/blob/v1.x/LICENSE)
- **TailwindCSS** - [MIT License](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE)

### Python Services (Batch & Recommend Server)
- **FastAPI** - [MIT License](https://github.com/tiangolo/fastapi/blob/master/LICENSE)
- **scikit-learn** - [BSD 3-Clause License](https://github.com/scikit-learn/scikit-learn/blob/main/COPYING)
- **NumPy** - [BSD 3-Clause License](https://github.com/numpy/numpy/blob/main/LICENSE.txt)
- **Requests** - [Apache License 2.0](https://github.com/psf/requests/blob/main/LICENSE)
- **PyMySQL** - [MIT License](https://github.com/PyMySQL/PyMySQL/blob/main/LICENSE)
- **APScheduler** - [MIT License](https://github.com/agronholm/apscheduler/blob/master/LICENSE.txt)

### Infrastructure & DevOps
- **Docker** - [Apache License 2.0](https://github.com/moby/moby/blob/master/LICENSE)
- **Jenkins** - [MIT License](https://github.com/jenkinsci/jenkins/blob/master/LICENSE.txt)
- **Nginx** - [BSD 2-Clause License](http://nginx.org/LICENSE)
- **Prometheus** - [Apache License 2.0](https://github.com/prometheus/prometheus/blob/main/LICENSE)
- **Grafana** - [AGPL v3 License](https://github.com/grafana/grafana/blob/main/LICENSE)

## 프로젝트 라이센스

이 프로젝트는 **MIT License** 하에 배포됩니다.

```
MIT License

Copyright (c) 2025 ETCH Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 주의사항

- **Elasticsearch**: Elastic License 2.0에 따라 상업적 용도로 사용 시 제한이 있을 수 있습니다.
- **MySQL**: GPL v2 라이센스이지만 FOSS Exception이 적용되어 오픈소스 프로젝트에서 자유롭게 사용 가능합니다.
- **외부 API**: 사람인 API, News API, 전자공시 API 등은 각각의 이용약관을 따릅니다.

자세한 라이센스 정보는 각 의존성의 공식 문서를 참조하시기 바랍니다.

---

**ETCH Team © 2025. All rights reserved.**
