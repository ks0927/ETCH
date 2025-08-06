// S13P11A402/Jenkinsfile (역할 분리 최종 버전)

pipeline {
    environment {
        DOCKERHUB_USERNAME = 'kkaebu'
    }

    agent any

    stages {
        stage('Prepare') {
            steps {
                script {
                    def changedFiles = sh(script: 'git diff --name-only HEAD~1 HEAD', returnStdout: true).trim()
                    echo "Changed files in this commit:\n${changedFiles}"
                    env.CHANGED_FILES = changedFiles
                }
            }
        }
        
        // --- 1. 빌드 스테이지 ---
        // 각 서비스의 소스 코드를 컴파일하거나 빌드하여 실행 가능한 파일(JAR, 정적 파일 등)을 만듭니다.
        stage('Build Changed Services in Parallel') {
            parallel {
                stage('[Build] Business-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/business-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/business-server') {
                            echo "Building Business-Server..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build -x test'
                        }
                    }
                }
                stage('[Build] Chat-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/chat-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/chat-server') {
                            echo "Building Chat-Server..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build -x test'
                        }
                    }
                }
                stage('[Build] Frontend') {
                    when { expression { env.CHANGED_FILES.contains('etch/frontend/') } }
                    agent { docker { image 'node:20-alpine' } }
                    steps {
                        dir('etch/frontend') {
                            echo "Building Frontend..."
                            sh 'npm ci'
                            sh 'npm run build || true'
                        }
                    }
                }
            }
        }

        // --- 2. 패키징 스테이지 ---
        // 빌드 단계에서 생성된 결과물을 사용하여 Docker 이미지를 만듭니다.
        stage('Package Changed Services as Docker Images in Parallel') {
            parallel {
                stage('[Package] Business-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/business-server/') } }
                    agent any // Docker CLI가 설치된 Jenkins Master에서 실행
                    steps {
                        dir('etch/backend/business-server') {
                            echo "Packaging Business-Server Docker image..."
                            script {
                                def imageName = "${env.DOCKERHUB_USERNAME}/etch-business-server"
                                def customImage = docker.build(imageName)
                                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                                    customImage.push("${env.BUILD_NUMBER}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }
                stage('[Package] Chat-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/chat-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/chat-server') {
                            echo "Packaging Chat-Server Docker image..."
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
		/*
                stage('[Package] Batch-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/batch-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/batch-server') {
                            echo "Packaging Batch-Server Docker image..."
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
		*/
                stage('[Package] Recommend-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/recommend-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/recommend-server') {
                            echo "Packaging Recommend-Server Docker image..."
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
                stage('[Package] Frontend') {
                    when { expression { env.CHANGED_FILES.contains('etch/frontend/') } }
                    agent any
                    steps {
                        dir('etch/frontend') {
                            echo "Packaging Frontend Docker image..."
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
            }
        }

        // --- 3. 배포 스테이지 ---
        stage('Deploy to EC2') {
            when { expression { env.CHANGED_FILES.contains('etch/backend/') || env.CHANGED_FILES.contains('etch/frontend/') } }
            steps {
                echo "Deploying to EC2 server..."
                sshagent(credentials: ['jenkins-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io '~/app/deploy.sh'
                    '''
                }
            }
        }
        
        // --- 4. 정리 스테이지 ---
        stage('Cleanup') {
            steps {
                echo "Cleaning up Jenkins workspace..."
                sh "docker image prune -f"
            }
        }
    }
}
