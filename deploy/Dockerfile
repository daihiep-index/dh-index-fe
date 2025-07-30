# Sử dụng Node.js 18 official image
FROM node:18-alpine

# Thiết lập biến môi trường
ENV NODE_ENV=production

# Thiết lập thư mục làm việc
WORKDIR /app

# Cập nhật hệ thống và cài đặt dependencies cần thiết
RUN apk update && apk upgrade && apk add --no-cache git

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Copy environment file
COPY .env .env

# Build application
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Command để chạy server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
