# DH Index Frontend

React TypeScript frontend cho hệ thống quản lý danh mục đầu tư.

## 🚀 Repository Structure

```
dh-index-fe/
├── src/                # React source code
├── deploy/             # Docker deployment files
├── Jenkinsfile         # CI/CD pipeline
├── .env                # Environment variables
└── README.md          # This file
```

## 🛠 Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Docker & Docker Compose**
- **Jenkins CI/CD**

## 🏃‍♂️ Quick Start

### Local Development:
```bash
npm install
npm run dev
```

### Docker Development:
```bash
cd deploy
docker-compose up --build
```

### Production Deployment:
```bash
cd deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Environment Variables

Tạo file `.env` với nội dung:
```
VITE_API_BASE_URL=https://index-be.daihiep.click/api
```

Hoặc cho local development:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: Cấu hình trong `.env`

## 🔄 CI/CD

Sử dụng Jenkins với Jenkinsfile để tự động:
- Build Docker image
- Run tests
- Deploy to production (khi push vào main branch)

### Setup Jenkins:
1. Tạo Pipeline job trong Jenkins
2. Repository URL: `https://github.com/daihiep-index/dh-index-fe.git`
3. Script Path: `Jenkinsfile`

## 📁 Key Features

- ✅ **Environment-based configuration**
- ✅ **Production-ready build**
- ✅ **Health checks**
- ✅ **Responsive design**
- ✅ **TypeScript support**
- ✅ **Hot reload development**

## 🔗 Related Repositories

- **Backend**: https://github.com/daihiep-index/dh-index-be
