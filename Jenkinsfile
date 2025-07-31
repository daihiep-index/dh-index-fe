pipeline {
    agent any
    
    environment {
        // Docker image names
        DOCKER_IMAGE = "dh-index-frontend"
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_LATEST = "latest"
        
        // Docker registry (nếu sử dụng private registry)
        // DOCKER_REGISTRY = "your-registry.com"
        
        // Deployment directory (sử dụng home directory của user)
        DEPLOY_DIR = "\$HOME/dh-index-frontend"
        
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

        stage('Debug Info') {
            steps {
                echo 'Debug Information...'
                script {
                    sh """
                        echo "=== BRANCH DEBUG INFO ==="
                        echo "BRANCH_NAME env var: '${env.BRANCH_NAME}'"
                        echo "GIT_BRANCH env var: '${env.GIT_BRANCH}'"
                        echo "Git branch (show-current): '\$(git branch --show-current)'"
                        echo "Git branch (all): \$(git branch -a)"
                        echo "Git remote: \$(git remote -v)"
                        echo "Build number: ${BUILD_NUMBER}"
                        echo "Workspace: ${WORKSPACE}"
                        echo "========================="
                    """
                }
            }
        }

        stage('Deploy') {
            // Temporarily removing 'when' condition for debugging
            // when {
            //     branch 'main'
            // }
            steps {
                echo 'Deploying to production...'
                script {
                    sh """
                        # Tạo thư mục deploy nếu chưa có (sử dụng thư mục mà user có quyền)
                        DEPLOY_DIR_USER="\$HOME/dh-index-frontend"
                        mkdir -p \$DEPLOY_DIR_USER

                        # Copy files
                        cp deploy/docker-compose.prod.yml \$DEPLOY_DIR_USER/docker-compose.yml
                        cp .env \$DEPLOY_DIR_USER/

                        # Stop và remove old container
                        cd \$DEPLOY_DIR_USER
                        docker-compose down --remove-orphans || true

                        # Remove old containers và networks
                        docker container prune -f || true
                        docker network prune -f || true

                        # Pull latest image (nếu có registry)
                        # docker pull ${DOCKER_IMAGE}:${DOCKER_LATEST} || true

                        # Start new container với force recreate
                        docker-compose up -d --force-recreate --remove-orphans

                        # Đợi container khởi động
                        echo "Waiting for container to start..."
                        sleep 10

                        # Kiểm tra container status
                        CONTAINER_STATUS=\$(docker-compose ps -q | xargs docker inspect -f '{{.State.Status}}' 2>/dev/null || echo "not_found")
                        echo "Container status: \$CONTAINER_STATUS"

                        if [ "\$CONTAINER_STATUS" != "running" ]; then
                            echo "❌ Container is not running!"
                            docker-compose logs
                            exit 1
                        fi

                        # Health check với retry và detailed logging
                        echo "Starting health check..."
                        for i in {1..15}; do
                            echo "Health check attempt \$i/15..."

                            # Kiểm tra port có open không
                            if netstat -tuln | grep -q ":5173 "; then
                                echo "✅ Port 5173 is open"

                                # Kiểm tra HTTP response
                                if curl -f -s -o /dev/null http://localhost:5173/; then
                                    echo "✅ HTTP health check passed!"
                                    echo "🎉 Deployment successful! Application is running at http://localhost:5173"
                                    break
                                else
                                    echo "⚠️  Port is open but HTTP check failed"
                                fi
                            else
                                echo "⚠️  Port 5173 is not yet available"
                            fi

                            if [ \$i -eq 15 ]; then
                                echo "❌ Health check failed after 15 attempts"
                                echo "Container logs:"
                                docker-compose logs --tail=50
                                echo "Container status:"
                                docker-compose ps
                                echo "Port status:"
                                netstat -tuln | grep 5173 || echo "Port 5173 not found"
                                exit 1
                            fi

                            sleep 5
                        done

                        # Final verification
                        echo "🔍 Final verification..."
                        docker-compose ps
                        echo "✅ Deployment completed successfully!"
                    """
                }
            }
        }

        stage('Post-Deploy Verification') {
            // Temporarily removing 'when' condition for debugging
            // when {
            //     branch 'main'
            // }
            steps {
                echo 'Verifying deployment...'
                script {
                    sh """
                        cd \$HOME/dh-index-frontend

                        # Comprehensive health check
                        echo "🔍 Running comprehensive health check..."

                        # 1. Container health check
                        CONTAINER_ID=\$(docker-compose ps -q dh-index-frontend)
                        if [ -z "\$CONTAINER_ID" ]; then
                            echo "❌ No container found!"
                            exit 1
                        fi

                        HEALTH_STATUS=\$(docker inspect \$CONTAINER_ID --format='{{.State.Health.Status}}' 2>/dev/null || echo "no-healthcheck")
                        echo "Container health status: \$HEALTH_STATUS"

                        # 2. Service availability check
                        echo "Testing service availability..."
                        for i in {1..5}; do
                            HTTP_CODE=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ || echo "000")
                            echo "HTTP response code: \$HTTP_CODE"

                            if [ "\$HTTP_CODE" = "200" ]; then
                                echo "✅ Service is responding correctly"
                                break
                            fi

                            if [ \$i -eq 5 ]; then
                                echo "❌ Service is not responding after 5 attempts"
                                exit 1
                            fi

                            sleep 3
                        done

                        # 3. Resource usage check
                        echo "Checking resource usage..."
                        docker stats --no-stream \$CONTAINER_ID

                        # 4. Log check for errors
                        echo "Checking logs for errors..."
                        ERROR_COUNT=\$(docker-compose logs --tail=100 | grep -i "error\\|exception\\|failed" | wc -l)
                        if [ \$ERROR_COUNT -gt 0 ]; then
                            echo "⚠️  Found \$ERROR_COUNT error(s) in logs:"
                            docker-compose logs --tail=100 | grep -i "error\\|exception\\|failed"
                        else
                            echo "✅ No errors found in recent logs"
                        fi

                        echo "🎉 Post-deploy verification completed successfully!"
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
