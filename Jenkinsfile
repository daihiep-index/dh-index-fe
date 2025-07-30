pipeline {
    agent any
    
    environment {
        // Docker image names
        DOCKER_IMAGE = "dh-index-frontend"
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_LATEST = "latest"
        
        // Docker registry (nếu sử dụng private registry)
        // DOCKER_REGISTRY = "your-registry.com"
        
        // Deployment directory
        DEPLOY_DIR = "/opt/dh-index-frontend"
        
        // Environment variables
        VITE_API_BASE_URL = "https://index-be.daihiep.click/api"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                echo 'Setting up environment...'
                dir('dh-index-fe') {
                    script {
                        // Tạo .env file
                        sh """
                            echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
                        """
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                dir('dh-index-fe') {
                    script {
                        // Build Docker image
                        sh """
                            cd deploy
                            docker build -f Dockerfile -t ${DOCKER_IMAGE}:${DOCKER_TAG} ..
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:${DOCKER_LATEST}
                        """
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                dir('dh-index-fe') {
                    script {
                        // Chạy container tạm để test
                        sh """
                            docker run --rm -d --name test-frontend-${BUILD_NUMBER} \
                                -p 5174:5173 ${DOCKER_IMAGE}:${DOCKER_TAG}
                            
                            # Đợi container khởi động
                            sleep 15
                            
                            # Test health check
                            curl -f http://localhost:5174/ || exit 1
                            
                            # Dọn dẹp
                            docker stop test-frontend-${BUILD_NUMBER}
                        """
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main' // Chỉ deploy khi push vào main branch
            }
            steps {
                echo 'Deploying to production...'
                script {
                    sh """
                        # Tạo thư mục deploy nếu chưa có
                        sudo mkdir -p ${DEPLOY_DIR}
                        
                        # Copy files
                        sudo cp dh-index-fe/deploy/docker-compose.yml ${DEPLOY_DIR}/
                        sudo cp dh-index-fe/.env ${DEPLOY_DIR}/
                        
                        # Stop old container
                        cd ${DEPLOY_DIR}
                        sudo docker-compose down || true
                        
                        # Remove old image
                        sudo docker rmi ${DOCKER_IMAGE}:${DOCKER_LATEST} || true
                        
                        # Start new container
                        sudo docker-compose up -d
                        
                        # Health check
                        sleep 20
                        curl -f http://localhost:5173/ || exit 1
                    """
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'Cleaning up old Docker images...'
                script {
                    sh """
                        # Xóa images cũ (giữ lại 3 bản gần nhất)
                        docker images ${DOCKER_IMAGE} --format "table {{.Tag}}" | grep -v TAG | grep -v latest | sort -nr | tail -n +4 | xargs -r docker rmi ${DOCKER_IMAGE}: || true
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
            // Dọn dẹp workspace nếu cần
            cleanWs()
        }
        success {
            echo 'Deployment successful!'
            // Có thể gửi notification thành công
        }
        failure {
            echo 'Pipeline failed!'
            // Có thể gửi notification lỗi
        }
    }
}
