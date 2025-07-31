#!/bin/bash

# Script để test pipeline locally trước khi chạy trên Jenkins
set -e

echo "🚀 Testing CI/CD Pipeline locally..."

# Thiết lập biến môi trường
export DOCKER_IMAGE="dh-index-frontend"
export DOCKER_TAG="test-$(date +%s)"
export DOCKER_LATEST="latest"
export VITE_API_BASE_URL="https://index-be.daihiep.click/api"

echo "📋 Environment variables:"
echo "  DOCKER_IMAGE: $DOCKER_IMAGE"
echo "  DOCKER_TAG: $DOCKER_TAG"
echo "  VITE_API_BASE_URL: $VITE_API_BASE_URL"

# Stage 1: Setup Environment
echo ""
echo "🔧 Stage 1: Setup Environment"
echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env
echo "✅ Created .env file"

# Stage 2: Build Docker Image
echo ""
echo "🏗️  Stage 2: Build Docker Image"
cd deploy
docker build -f Dockerfile -t ${DOCKER_IMAGE}:${DOCKER_TAG} ..
docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:${DOCKER_LATEST}
cd ..
echo "✅ Docker image built successfully"

# Stage 3: Test
echo ""
echo "🧪 Stage 3: Test"
# Tìm port trống để test
TEST_PORT=$(python3 -c "import socket; s=socket.socket(); s.bind(('', 0)); print(s.getsockname()[1]); s.close()")
echo "Using test port: $TEST_PORT"

docker run --rm -d --name test-frontend-${DOCKER_TAG} \
    -p ${TEST_PORT}:5173 ${DOCKER_IMAGE}:${DOCKER_TAG}

echo "Waiting for container to start..."
sleep 30

# Test health check
if curl -f http://localhost:${TEST_PORT}/ > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker logs test-frontend-${DOCKER_TAG}
    docker stop test-frontend-${DOCKER_TAG}
    exit 1
fi

# Cleanup test container
docker stop test-frontend-${DOCKER_TAG}
echo "✅ Test completed successfully"

# Stage 4: Test Production Deployment
echo ""
echo "📦 Stage 4: Test Production Deployment"
echo "Testing production deployment locally..."

# Create temporary deploy directory
TEMP_DEPLOY_DIR="/tmp/dh-index-test-deploy"
mkdir -p $TEMP_DEPLOY_DIR

# Copy deployment files
cp deploy/docker-compose.prod.yml $TEMP_DEPLOY_DIR/docker-compose.yml
cp .env $TEMP_DEPLOY_DIR/

cd $TEMP_DEPLOY_DIR

# Stop any existing containers
docker-compose down --remove-orphans || true

# Start production container
echo "Starting production container..."
docker-compose up -d --force-recreate

# Wait for container to start
echo "Waiting for container to start..."
sleep 15

# Check container status
CONTAINER_STATUS=$(docker-compose ps -q | xargs docker inspect -f '{{.State.Status}}' 2>/dev/null || echo "not_found")
echo "Container status: $CONTAINER_STATUS"

if [ "$CONTAINER_STATUS" != "running" ]; then
    echo "❌ Container is not running!"
    docker-compose logs
    cd - > /dev/null
    exit 1
fi

# Health check
echo "Running health check..."
for i in {1..10}; do
    if curl -f -s -o /dev/null http://localhost:5173/; then
        echo "✅ Production deployment health check passed!"
        break
    fi

    if [ $i -eq 10 ]; then
        echo "❌ Production deployment health check failed!"
        docker-compose logs
        cd - > /dev/null
        exit 1
    fi

    echo "Health check attempt $i failed, retrying..."
    sleep 3
done

# Show container info
echo "📊 Container information:"
docker-compose ps
docker stats --no-stream $(docker-compose ps -q)

# Cleanup
echo "Cleaning up test deployment..."
docker-compose down --remove-orphans
rm -rf $TEMP_DEPLOY_DIR

cd - > /dev/null

echo ""
echo "🎉 Pipeline test completed successfully!"
echo "✅ All stages passed including production deployment test"
echo ""
echo "To deploy manually:"
echo "  1. Copy deploy/docker-compose.prod.yml to your deploy directory"
echo "  2. Copy .env to your deploy directory"
echo "  3. Run: docker-compose up -d --force-recreate"
echo ""
echo "To monitor:"
echo "  docker-compose logs -f"
echo "  docker-compose ps"
