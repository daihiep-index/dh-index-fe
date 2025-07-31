#!/bin/bash

# Script để test deployment thực tế
set -e

echo "🚀 Testing Real Deployment..."

# Thiết lập biến môi trường
export DOCKER_IMAGE="dh-index-frontend"
export DOCKER_LATEST="latest"
export DEPLOY_DIR="/tmp/dh-index-frontend-test"

echo "📋 Environment variables:"
echo "  DOCKER_IMAGE: $DOCKER_IMAGE"
echo "  DEPLOY_DIR: $DEPLOY_DIR"

# Tạo thư mục deploy
echo ""
echo "🔧 Setting up deployment directory..."
mkdir -p $DEPLOY_DIR

# Copy files
cp deploy/docker-compose.prod.yml $DEPLOY_DIR/docker-compose.yml
cp .env $DEPLOY_DIR/

echo "✅ Files copied to deployment directory"

# Deploy
echo ""
echo "🚀 Starting deployment..."
cd $DEPLOY_DIR

# Stop old containers
echo "Stopping old containers..."
docker-compose down --remove-orphans || true

# Clean up
docker container prune -f || true

# Start new container
echo "Starting new container..."
docker-compose up -d --force-recreate --remove-orphans

# Wait for container to start
echo "Waiting for container to start..."
sleep 15

# Check container status
CONTAINER_STATUS=$(docker-compose ps -q | xargs docker inspect -f '{{.State.Status}}' 2>/dev/null || echo "not_found")
echo "Container status: $CONTAINER_STATUS"

if [ "$CONTAINER_STATUS" != "running" ]; then
    echo "❌ Container is not running!"
    docker-compose logs
    exit 1
fi

# Health check
echo ""
echo "🔍 Running health check..."
for i in {1..15}; do
    echo "Health check attempt $i/15..."
    
    # Check if port is open
    if netstat -tuln | grep -q ":5173 "; then
        echo "✅ Port 5173 is open"
        
        # Check HTTP response
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
    
    if [ $i -eq 15 ]; then
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

# Post-deploy verification
echo ""
echo "🔍 Running post-deploy verification..."

# Container health check
CONTAINER_ID=$(docker-compose ps -q dh-index-frontend)
if [ -z "$CONTAINER_ID" ]; then
    echo "❌ No container found!"
    exit 1
fi

echo "Container ID: $CONTAINER_ID"

# Service availability check
echo "Testing service availability..."
for i in {1..5}; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ || echo "000")
    echo "HTTP response code: $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Service is responding correctly"
        break
    fi
    
    if [ $i -eq 5 ]; then
        echo "❌ Service is not responding after 5 attempts"
        exit 1
    fi
    
    sleep 3
done

# Resource usage check
echo ""
echo "📊 Resource usage:"
docker stats --no-stream $CONTAINER_ID

# Show container info
echo ""
echo "📋 Container information:"
docker-compose ps

echo ""
echo "🎉 Deployment test completed successfully!"
echo ""
echo "Application is running at: http://localhost:5173"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo ""
echo "Deployment directory: $DEPLOY_DIR"
