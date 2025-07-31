# DH Index Frontend - CI/CD Pipeline Guide

## 📋 Tổng quan

Pipeline CI/CD này sử dụng Jenkins để tự động build, test và deploy ứng dụng React frontend.

## 🏗️ Cấu trúc Pipeline

### Stages:
1. **Checkout** - Lấy code từ repository
2. **Setup Environment** - Tạo file .env với các biến môi trường
3. **Build Docker Image** - Build Docker image từ source code
4. **Test** - Chạy health check trên container test
5. **Deploy** - Deploy lên production (chỉ khi push vào main branch)
6. **Cleanup** - Dọn dẹp old Docker images

## 🔧 Cấu hình

### Environment Variables trong Jenkinsfile:
- `DOCKER_IMAGE`: Tên Docker image (dh-index-frontend)
- `DOCKER_TAG`: Tag của image (sử dụng BUILD_NUMBER)
- `VITE_API_BASE_URL`: URL của backend API
- `DEPLOY_DIR`: Thư mục deploy trên server (/opt/dh-index-frontend)

### Ports:
- **Production**: 5173
- **Test**: Dynamic port (tự động tìm port trống)

## 🚀 Cách sử dụng

### 1. Test Pipeline Locally
```bash
# Chạy test pipeline trước khi commit
./test-pipeline.sh
```

### 2. Deploy qua Jenkins
1. Push code lên repository
2. Jenkins sẽ tự động trigger pipeline
3. Nếu ở main branch, sẽ tự động deploy lên production

### 3. Manual Deploy
```bash
# Build image
cd deploy
docker build -f Dockerfile -t dh-index-frontend:latest ..

# Run container
docker run -d -p 5173:5173 --name dh-index-frontend dh-index-frontend:latest

# Hoặc sử dụng docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔍 Monitoring & Troubleshooting

### Health Check
```bash
curl -f http://localhost:5173/
```

### Xem logs
```bash
# Container logs
docker logs dh-index-frontend

# Docker-compose logs
cd /opt/dh-index-frontend
docker-compose logs
```

### Restart service
```bash
cd /opt/dh-index-frontend
docker-compose restart
```

## 📁 Files Structure

```
deploy/
├── Dockerfile              # Docker build configuration
├── docker-compose.prod.yml # Production docker-compose
├── docker-compose.yml      # Development docker-compose
└── README.md               # Docker deployment guide

Jenkinsfile                 # Jenkins pipeline configuration
test-pipeline.sh           # Local testing script
CICD-README.md             # This CI/CD guide
```

## ⚠️ Lưu ý quan trọng

1. **Chỉ deploy từ main branch** - Pipeline chỉ deploy khi code được push vào main branch
2. **Health check** - Pipeline sẽ fail nếu health check không pass
3. **Port conflicts** - Đảm bảo port 5173 không bị conflict
4. **Permissions** - Jenkins user cần có quyền sudo để deploy
5. **Docker cleanup** - Old images sẽ được tự động xóa (giữ lại 3 bản gần nhất)

## 🔧 Troubleshooting Common Issues

### Build fails
- Kiểm tra dependencies trong package.json
- Đảm bảo .env file có đúng format

### Test fails
- Kiểm tra port conflicts
- Xem container logs để debug

### Deploy fails
- Kiểm tra permissions của Jenkins user
- Đảm bảo thư mục /opt/dh-index-frontend tồn tại
- Kiểm tra Docker daemon đang chạy

### Health check fails
- Kiểm tra application có start đúng không
- Xem logs để tìm lỗi
- Đảm bảo port 5173 không bị block

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Jenkins build logs
2. Docker container logs
3. Application logs
4. System resources (disk space, memory)

## ✅ Các cải tiến đã thực hiện

1. **Fixed Dockerfile**: Sửa lỗi npm ci --only=production và .env copy
2. **Dynamic test port**: Tự động tìm port trống cho test
3. **Better health check**: Retry logic với error handling
4. **Improved cleanup**: Safe cleanup old Docker images
5. **Local testing**: Script test-pipeline.sh để test trước khi deploy
