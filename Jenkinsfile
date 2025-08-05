// S13P11A402/Jenkinsfile (수정 완료 버전)

pipeline {
    environment {
        // 본인의 Docker Hub 사용자 이름으로 수정했는지 확인
        DOCKERHUB_USERNAME = 'kkaebu'
    }

    agent any

    stages {
        stage('Build & Package All Services in Parallel') {
            parallel {

                
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

        // --- 새로운 배포 스테이지 ---
        stage('Deploy to EC2') {
            steps {
                echo "EC2 서버에 배포를 시작합니다..."
                // sshagent 플러그인을 사용하여 Jenkins에 등록된 SSH 키로 인증을 수행합니다.
                sshagent(credentials: ['jenkins-ssh-key']) {
                    // -o StrictHostKeyChecking=no 옵션은 SSH 처음 접속 시 'yes'를 입력하는 과정을 생략해줍니다.
                    // Jenkins가 EC2 호스트에 접속하여 ~/app/deploy.sh 스크립트를 실행합니다.
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@i13a402.p.ssafy.io '~/app/deploy.sh'
                    '''
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
