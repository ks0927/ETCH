// S13P11A402/Jenkinsfile (수정 완료 버전)

pipeline {
    environment {
        // 본인의 Docker Hub 사용자 이름으로 수정했는지 확인
        DOCKERHUB_USERNAME = 'SEUNGSU'
    }

    agent any

    stages {
        stage('Build & Package All Services in Parallel') {
            parallel {
                // --- Frontend 빌드 및 패키징 ---
                stage('Frontend') {
                    agent {
                        docker { image 'node:18-alpine' }
                    }
                    steps {
                        dir('etch/frontend') {
                            echo "Frontend 빌드를 시작합니다..."
                            sh 'npm ci'
                            sh 'npm run build'

                            echo "Frontend Docker 이미지를 패키징합니다..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/etch-frontend"
                                def customImage = docker.build(imageName)

                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    customImage.push("${env.BUILD_NUMBER}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }

                
                // --- Chat-Server 빌드 및 패키징 (Spring Boot) ---
                stage('Chat-Server') {
                    agent any
                    steps {
                        dir('etch/backend/chat-server') {
                            echo "Chat-Server 빌드를 시작합니다..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build'
                            
                            echo "Chat-Server Docker 이미지를 패키징합니다..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/etch-chat-server"
                                def customImage = docker.build(imageName)
                                
                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    customImage.push("${env.BUILD_NUMBER}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }
                
                // --- Batch-Server 빌드 및 패키징 (Python) ---
                // Python 프로젝트는 별도의 빌드 과정 없이 바로 Docker 이미지 패키징을 진행합니다.
                stage('Batch-Server') {
                    agent any
                    steps {
                        dir('etch/backend/batch-server') {
                            echo "Batch-Server Docker 이미지를 패키징합니다..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/etch-batch-server"
                                def customImage = docker.build(imageName)
                                
                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    customImage.push("${env.BUILD_NUMBER}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }

                // --- Recommend-Server 빌드 및 패키징 (Python) ---
                stage('Recommend-Server') {
                    agent any
                    steps {
                        dir('etch/backend/recommend-server') {
                            echo "Recommend-Server Docker 이미지를 패키징합니다..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/etch-recommend-server"
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
                sh "docker image prune -f"
            }
        }
    }
}
