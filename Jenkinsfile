// S13P11A402/Jenkinsfile (역할 분리 최종 버전)

pipeline {
    environment {
        DOCKERHUB_USERNAME = 'kkaebu'
        //모든 스테이지에서 사용할 고유한 버전 태그를 정의합니다.
        // Git 커밋 해시의 앞 8자리를 버전으로 사용 (예: b112db70)
        GIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
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
                            // [캐시 변경] Gradle 캐시 복원
                            script {
                                try {
                                    unstash 'gradle-cache-business' 
                                    echo "Gradle cache restored for Business-Server"
                                } catch (e) {
                                    echo "No Gradle cache found for Business-Server"
                                }
                            }
                            echo "Building Business-Server..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build -x test'
                            // [캐시 변경] Gradle 캐시 저장
                            stash name: 'gradle-cache-business', includes: '.gradle/**'
                        }
                    }
                }
                stage('[Build] Chat-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/chat-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/chat-server') {
                            // [캐시 변경] Gradle 캐시 복원
                            script {
                                try {
                                    unstash 'gradle-cache-chat' 
                                    echo "Gradle cache restored for Chat-Server"
                                } catch (e) {
                                    echo "No Gradle cache found for Chat-Server"
                                }
                            }
                            echo "Building Chat-Server..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build -x test'
                            // [캐시 변경] Gradle 캐시 저장
                            stash name: 'gradle-cache-chat', includes: '.gradle/**'
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
                                    customImage.push("${env.GIT_HASH}")
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
                                    customImage.push("${env.GIT_HASH}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }

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
                                    customImage.push("${env.GIT_HASH}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }

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
                                    customImage.push("${env.GIT_HASH}")
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
                                    customImage.push("${env.GIT_HASH}")
                                    customImage.push("latest")
                                }
                            }
                        }
                    }
                }
            }
        }

        // --- 3. [수정] 배포 스테이지 ---
        // 이제 모든 서비스가 자신만의 배포 스테이지를 가집니다.
        stage('Deploy Changed Services in Parallel') {
            parallel {
                // [유지] Business-Server 무중단 배포 스테이지
                stage('[Deploy] Business-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/business-server/') } }
                    steps {
                        echo "Deploying [business-server] via Blue/Green..."
                        sshagent(credentials: ['jenkins-ssh-key']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io '~/app/deploy.sh business-server'"
                        }
                    }
                }

                // [유지] Frontend 무중단 배포 스테이지
                stage('[Deploy] Frontend') {
                    when { expression { env.CHANGED_FILES.contains('etch/frontend/') } }
                    steps {
                        echo "Deploying [frontend] via Blue/Green..."
                        sshagent(credentials: ['jenkins-ssh-key']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io '~/app/deploy.sh frontend'"
                        }
                    }
                }

                // [추가] Chat-Server 간단 재시작 배포 스테이지
                stage('[Deploy] Chat-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/chat-server/') } }
                    steps {
                        echo "Deploying [chat-server] via recreate..."
                        sshagent(credentials: ['jenkins-ssh-key']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io 'cd ~/app && docker-compose pull chat-server && docker-compose up -d --force-recreate chat-server'"
                        }
                    }
                }

                // [추가] Batch-Server 간단 재시작 배포 스테이지
                stage('[Deploy] Batch-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/batch-server/') } }
                    steps {
                        echo "Deploying [batch-server] via recreate..."
                        sshagent(credentials: ['jenkins-ssh-key']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io 'cd ~/app && docker-compose pull batch-server && docker-compose up -d --force-recreate batch-server'"
                        }
                    }
                }

                // [추가] Recommend-Server 간단 재시작 배포 스테이지
                stage('[Deploy] Recommend-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/recommend-server/') } }
                    steps {
                        echo "Deploying [recommend-server] via recreate..."
                        sshagent(credentials: ['jenkins-ssh-key']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io 'cd ~/app && docker-compose pull recommend-server && docker-compose up -d --force-recreate recommend-server'"
                        }
                    }
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

    // 이 블록은 stages 블록이 모두 끝난 후에 실행됩니다.
    post {
        always {
            echo '파이프라인 실행이 완료되었습니다.'
            cleanWs()
        }
        success {
            echo "빌드 성공!"
            mattermostSend(
                color: 'good',
                message: "✅ **빌드 성공!**\n- **Job:** `${env.JOB_NAME}`\n- **Build:** `${env.BUILD_NUMBER}`\n- **URL:** `${env.BUILD_URL}`"
            )
        }
        failure {
            echo "빌드 실패!"
            mattermostSend(
                color: 'danger',
                message: "🚨 **빌드 실패!**\n- **Job:** `${env.JOB_NAME}`\n- **Build:** `${env.BUILD_NUMBER}`\n- **URL:** `${env.BUILD_URL}`"
            )
        }
    }
}

