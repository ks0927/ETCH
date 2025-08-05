// S13P11A402/Jenkinsfile

pipeline {
    // 이 파이프라인 전체에서 사용할 환경 변수를 정의합니다.
    environment {
        // Docker Hub 아이디 또는 이미지를 올릴 Registry의 사용자/조직 이름을 입력합니다.
        DOCKERHUB_USERNAME = 'SEUNGSU'
    }

    // 파이프라인의 전체 실행 환경을 Jenkins Master로 지정합니다.
    // 각 스테이지에서 필요에 따라 별도의 실행 환경(Agent)을 지정할 것입니다.
    agent any

    stages {
        // 여러 서비스를 병렬로 빌드하여 전체 시간을 단축합니다.
        stage('Build & Package All Services in Parallel') {
            parallel {
                // --- Frontend 빌드 및 패키징 ---
                stage('Frontend') {
                    // 이 스테이지만 별도의 Docker 환경에서 실행합니다.
                    // React 빌드를 위해 Node.js가 설치된 Docker 컨테이너를 임시로 사용합니다.
                    agent {
                        docker { image 'node:18-alpine' }
                    }
                    steps {
                        // 프론트엔드 디렉토리로 이동
                        dir('etch/frontend') {
                            echo "Frontend 빌드를 시작합니다..."
                            // npm ci: package-lock.json 기반으로 의존성 설치
                            sh 'npm ci'
                            // npm run build: React 앱 빌드
                            sh 'npm run build'

                            echo "Frontend Docker 이미지를 패키징합니다..."
                            // 스크립트 블록으로 Docker 관련 작업을 묶습니다.
                            script {
                                // 이미지 이름을 '계정명/프로젝트명-서비스명' 형식으로 정의
                                def imageName = "${env.DOCKERHUB_USERNAME}/a402-frontend"
                                // docker.build 명령어로 현재 디렉토리의 Dockerfile을 사용하여 이미지를 빌드합니다.
                                def customImage = docker.build(imageName)

                                // Docker Hub에 로그인합니다. 'dockerhub-credentials'는 Jenkins에 등록한 ID입니다.
                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    // 빌드된 이미지를 Docker Hub에 push합니다. 태그는 빌드 번호로 지정합니다.
                                    customImage.push("${env.BUILD_NUMBER}")
                                    // 최신 버전을 가리키는 'latest' 태그도 함께 push합니다.
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }

                
                // --- Chat-Server 빌드 및 패키징 ---
                stage('Chat-Server') {
                    agent any
                    steps {
                        dir('etch/backend/chat-server') {
                            echo "Chat-Server 빌드를 시작합니다..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build'
                            
                            echo "Chat-Server Docker 이미지를 패키징합니다..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/a402-chat-server"
                                def customImage = docker.build(imageName)
                                
                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    customImage.push("${env.BUILD_NUMBER}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }
                
                // 다른 Python 서버(recommend, batch)들도 위와 동일한 구조로 추가할 수 있습니다.
                // --- Batch-Server 빌드 및 패키징 ---
                stage('Bhat-Server') {
                    agent any
                    steps {
                        dir('etch/backend/batch-server') {
                            echo "Batch-Server 빌드를 시작합니다..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build'
                            
                            echo "Batch-Server Docker 이미지를 패키징합니다..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/a402-batch-server"
                                def customImage = docker.build(imageName)
                                
                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    customImage.push("${env.BUILD_NUMBER}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }

                // --- Recommend-Server 빌드 및 패키징 ---
                stage('Recommend-Server') {
                    agent any
                    steps {
                        dir('etch/backend/recommend-server') {
                            echo "Recommend-Server 빌드를 시작합니다..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build'
                            
                            echo "Recommend-Server Docker 이미지를 패키징합니다..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/a402-recommend-server"
                                def customImage = docker.build(imageName)
                                
                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    customImage.push("${env.BUILD_NUMBER}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo "모든 빌드가 완료되었습니다. 중간 생성물을 정리합니다."
                // 빌드가 끝난 후 생성된 Docker 이미지들을 로컬에서 삭제하여 디스크 공간을 확보합니다.
                sh "docker image prune -f"
            }
        }
    }
}
