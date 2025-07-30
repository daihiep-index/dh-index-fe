# DH Index Frontend - Docker Deployment

Thư mục này chứa các file cần thiết để deploy DH Index frontend bằng Docker.

## Files trong thư mục deploy:

- `Dockerfile` - Docker image configuration
- `docker-compose.yml` - Docker Compose configuration  
- `.dockerignore` - Files to ignore during Docker build
- `README.md` - Hướng dẫn này

## Environment Variables:

Frontend sử dụng file `.env` trong thư mục gốc với biến:
```
VITE_API_BASE_URL=https://index-be.daihiep.click/api
```

## Cách sử dụng:

### 1. Sử dụng Docker Compose (Khuyến nghị)

```bash
cd dh-index-fe/deploy
docker-compose up --build
```

### 2. Sử dụng Docker trực tiếp

```bash
cd dh-index-fe/deploy
docker build -f Dockerfile -t dh-index-frontend ..
docker run -p 5173:5173 \
  -e VITE_API_BASE_URL=https://index-be.daihiep.click/api \
  dh-index-frontend
```

### 3. Thay đổi API URL

Để thay đổi API URL mà không cần rebuild:

1. **Cập nhật file `.env`**:
   ```bash
   cd dh-index-fe
   echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
   ```

2. **Restart container**:
   ```bash
   cd deploy
   docker-compose restart
   ```

## Tính năng:

- ✅ **Node.js 18** environment
- ✅ **Port 5173**: Application chạy trên port 5173
- ✅ **Environment variables**: Sử dụng .env file cho cấu hình
- ✅ **Production build**: Tự động build và serve production version
- ✅ **Hot reload config**: Có thể thay đổi API URL mà không cần rebuild

## Truy cập:

- **Frontend Application**: http://localhost:5173

## Lưu ý:

- File `.env` được mount vào container để có thể thay đổi cấu hình
- Sử dụng `vite preview` để serve production build
- API URL có thể được override qua environment variable trong docker-compose.yml

## Development vs Production:

- **Development**: `npm run dev` (port 5173 với hot reload)
- **Production**: `npm run build && npm run preview` (port 5173 với optimized build)
