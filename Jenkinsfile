// S13P11A402/Jenkinsfile (최종 완성 버전)

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
        
        stage('Build & Package Changed Services in Parallel') {
            parallel {

                stage('Business-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/business-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/business-server') {
                            echo "Business-Server 변경 감지! 빌드를 시작합니다..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build'
                            
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

                stage('Chat-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/chat-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/chat-server') {
                            echo "Chat-Server 변경 감지! 빌드를 시작합니다..."
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build'
                            
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
                
                stage('Batch-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/batch-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/batch-server') {
                            echo "Batch-Server 변경 감지! 패키징을 시작합니다..."
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

                stage('Recommend-Server') {
                    when { expression { env.CHANGED_FILES.contains('etch/backend/recommend-server/') } }
                    agent any
                    steps {
                        dir('etch/backend/recommend-server') {
                            echo "Recommend-Server 변경 감지! 패키징을 시작합니다..."
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

                stage('Frontend') {
                    when { expression { env.CHANGED_FILES.contains('etch/frontend/') } }
                    agent { docker { image 'node:20-alpine' } }
                    steps {
                        dir('etch/frontend') {
                            echo "Frontend 변경 감지! 빌드를 시작합니다..."
                            sh 'npm ci'
                            sh 'npm run build || true'

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

        stage('Deploy to EC2') {
            when {
                expression { 
                    env.CHANGED_FILES.contains('etch/backend/') || 
                    env.CHANGED_FILES.contains('etch/frontend/') 
                }
            }
            steps {
                echo "EC2 서버에 배포를 시작합니다..."
                sshagent(credentials: ['jenkins-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io '~/app/deploy.sh'
                    '''
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo "Jenkins 작업 공간을 정리합니다."
                sh "docker image prune -f"
            }
        }
    }
}
