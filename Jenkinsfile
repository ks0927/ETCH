// etch/Jenkinsfile

pipeline {
    // 이 파이프라인을 실행할 환경을 지정합니다.
    // 'any'는 가용한 Jenkins 에이전트 아무거나 사용하겠다는 의미입니다.
    agent any

    // 빌드 과정을 여러 단계(Stage)로 나누어 정의합니다.
    stages {
        // 첫 번째 단계: 'Checkout'
        // GitLab으로부터 소스 코드를 가져오는 단계입니다.
        stage('Checkout') {
            steps {
                // checkout scm: Jenkins Job에 설정된 Git 정보를 기반으로 코드를 가져오는 명령어입니다.
                checkout scm
                echo '소스 코드 체크아웃 완료!'
            }
        }

        // 두 번째 단계: 'Simple Build Test'
        // 실제 빌드 전에 간단한 테스트를 수행하는 단계입니다.
        // 각 서버가 잘 존재하는지 확인하는 정도만 진행합니다.
        stage('Simple Build Test') {
            steps {
                echo "빌드 테스트를 시작합니다..."
                sh 'ls -al' // 현재 디렉토리 파일 목록 출력
                sh 'ls -al etch/frontend'
                sh 'ls -al etch/backend/business-server'
                echo "빌드 테스트 성공! (실제 빌드는 추후 구현)"
            }
        }
    }

    // 파이프라인 실행이 끝나면 항상 실행되는 블록입니다.
    post {
        always {
            echo '파이프라인 실행 완료.'
        }
        success {
            echo '성공적으로 완료되었습니다!'
        }
        failure {
            echo '실패했습니다. 로그를 확인하세요.'
        }
    }
}
