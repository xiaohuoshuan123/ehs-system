# ============================================================
# 永杰集团昆山工厂智慧安全管理系统 - 前端 Dockerfile
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Render 构建时通过环境变量注入后端 API 地址（不依赖 .env 文件）
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .
# 强制开发模式构建（避免 omit=dev 导致 vite 缺失）
RUN NODE_ENV=development npx vite build

# --- Nginx 生产镜像 ---
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
