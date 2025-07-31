# Sử dụng Node.js 20 official image (yêu cầu của React Router 7.6.3)
FROM node:20-alpine

# Thiết lập biến môi trường
ENV NODE_ENV=production

# Thiết lập thư mục làm việc
WORKDIR /app

# Cập nhật hệ thống và cài đặt dependencies cần thiết
RUN apk update && apk upgrade && apk add --no-cache git

# Copy package files
COPY package*.json ./

# Cài đặt dependencies (bao gồm devDependencies để build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build application (sẽ sử dụng .env từ build context)
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Command để chạy server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
