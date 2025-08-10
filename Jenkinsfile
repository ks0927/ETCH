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
                        // Gradle 캐시를 사용하도록 추가
                        dir('etch/backend/business-server') {
                            jobcacher(
                                // 캐시를 저장하고 불러올 기본 브랜치 지정 (주 사용 브랜치로 설정)
                                defaultBranch: 'dev',
                                caches: [
                                    // .gradle/caches 디렉토리를 캐싱
                                    [path: '.gradle/caches', id: 'gradle-caches'],
                                    // .gradle/wrapper/dists 디렉토리를 캐싱
                                    [path: '.gradle/wrapper/dists', id: 'gradle-wrapper']
                                ]
                            ) {
                                echo "Building Business-Server with JobCacher..."
                                sh 'chmod +x ./gradlew'
                                sh './gradlew clean build -x test'
                            }
                        }
                    }
                }
                stage('[Build] Chat-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/chat-server/') } }
                    agent any
                    steps {
                        // Gradle 캐시를 사용하도록 추가
                        dir('etch/backend/chat-server') {
                            jobcacher(
                                defaultBranch: 'dev',
                                caches: [
                                    [path: '.gradle/caches', id: 'gradle-caches'],
                                    [path: '.gradle/wrapper/dists', id: 'gradle-wrapper']
                                ]
                            ) {
                                echo "Building Chat-Server with JobCacher..."
                                sh 'chmod +x ./gradlew'
                                sh './gradlew clean build -x test'
                            }
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
                                //docker.build 명령어는 이미지 이름만 받으므로, 태그는 push 단계에서 지정합니다.
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
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io 'cd ~/app && docker-compose pull chat-server && docker-compose up -d --force-recreate --no-deps chat-server'"
                        }
                    }
                }

                // [추가] Batch-Server 간단 재시작 배포 스테이지
                stage('[Deploy] Batch-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/batch-server/') } }
                    steps {
                        echo "Deploying [batch-server] via recreate..."
                        sshagent(credentials: ['jenkins-ssh-key']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io 'cd ~/app && docker-compose pull batch-server && docker-compose up -d --force-recreate --no-deps batch-server'"
                        }
                    }
                }

                // [추가] Recommend-Server 간단 재시작 배포 스테이지
                stage('[Deploy] Recommend-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/recommend-server/') } }
                    steps {
                        echo "Deploying [recommend-server] via recreate..."
                        sshagent(credentials: ['jenkins-ssh-key']) {
                            sh "ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io 'cd ~/app && docker-compose pull recommend-server && docker-compose up -d --force-recreate --no-deps recommend-server'"
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
        // 파이프라인의 성공/실패 여부와 관계없이 '항상' 실행됩니다.
        always {
            echo '파이프라인 실행이 완료되었습니다.'
            cleanWs()
        }
        // 파이프라인이 성공적으로 완료되었을 때만 실행됩니다.
        success {
            echo "빌드 성공!"
            // 성공 시 Mattermost로 알림을 보냅니다.
            mattermostSend(
                color: 'good', // 'good'은 초록색으로 표시됩니다.
                message: "✅ **빌드 성공!**\n- **Job:** `${env.JOB_NAME}`\n- **Build:** `${env.BUILD_NUMBER}`\n- **URL:** `${env.BUILD_URL}`"
            )
        }
        // 파이프라인이 실패했을 때만 실행됩니다.
        failure {
            echo "빌드 실패!"
            // 실패 시 Mattermost로 알림을 보냅니다.
            mattermostSend(
                color: 'danger', // 'danger'는 붉은색으로 표시됩니다.
                message: "🚨 **빌드 실패!**\n- **Job:** `${env.JOB_NAME}`\n- **Build:** `${env.BUILD_NUMBER}`\n- **URL:** `${env.BUILD_URL}`"
            )
        }
    }

}

