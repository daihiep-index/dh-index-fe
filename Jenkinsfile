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
                script {
                    // Tạo .env file
                    sh """
                        echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
                    """
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
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
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                script {
                    // Chạy container tạm để test
                    sh """
                        # Tìm port trống để test
                        TEST_PORT=\$(python3 -c "import socket; s=socket.socket(); s.bind(('', 0)); print(s.getsockname()[1]); s.close()")

                        docker run --rm -d --name test-frontend-${BUILD_NUMBER} \
                            -p \${TEST_PORT}:5173 ${DOCKER_IMAGE}:${DOCKER_TAG}

                        # Đợi container khởi động
                        sleep 30

                        # Test health check
                        curl -f http://localhost:\${TEST_PORT}/ || exit 1

                        # Dọn dẹp
                        docker stop test-frontend-${BUILD_NUMBER}
                    """
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
                        sudo cp deploy/docker-compose.prod.yml ${DEPLOY_DIR}/docker-compose.yml
                        sudo cp .env ${DEPLOY_DIR}/

                        # Stop old container
                        cd ${DEPLOY_DIR}
                        sudo docker-compose down || true

                        # Remove old image (chỉ khi có image mới)
                        sudo docker rmi ${DOCKER_IMAGE}:${DOCKER_LATEST} || true

                        # Start new container
                        sudo docker-compose up -d

                        # Health check với retry
                        for i in {1..10}; do
                            sleep 5
                            if curl -f http://localhost:5173/ > /dev/null 2>&1; then
                                echo "Health check passed!"
                                break
                            fi
                            if [ \$i -eq 10 ]; then
                                echo "Health check failed after 10 attempts"
                                sudo docker-compose logs
                                exit 1
                            fi
                            echo "Health check attempt \$i failed, retrying..."
                        done
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
                        OLD_IMAGES=\$(docker images ${DOCKER_IMAGE} --format "{{.Tag}}" | grep -v latest | grep '^[0-9]' | sort -nr | tail -n +4)
                        if [ ! -z "\$OLD_IMAGES" ]; then
                            echo "Removing old images: \$OLD_IMAGES"
                            echo "\$OLD_IMAGES" | xargs -I {} docker rmi ${DOCKER_IMAGE}:{} || true
                        else
                            echo "No old images to remove"
                        fi
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
