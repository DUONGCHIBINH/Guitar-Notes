# Sử dụng image node chính thức
FROM node:18-alpine

# Tạo thư mục app
WORKDIR /app

# Copy package.json và package-lock.json trước để cache layer cài đặt
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ code vào container
COPY . .

# Expose port 3000
EXPOSE 3000

# Chạy app
CMD ["node", "main.js"] 