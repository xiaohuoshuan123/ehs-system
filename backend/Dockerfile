# ============================================================
# 永杰集团昆山工厂智慧安全管理系统 - 后端 Dockerfile
# ============================================================
FROM node:20-alpine

WORKDIR /app

# 复制依赖文件
COPY backend/package.json backend/package-lock.json ./
# 安装全部依赖（含 prisma CLI，用于 migrate deploy）
RUN npm ci

# 复制源码
COPY backend/src ./src
COPY backend/prisma ./prisma

# 生成 Prisma Client
RUN npx prisma generate

# 复制启动脚本
COPY backend/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# 创建上传目录
RUN mkdir -p uploads

EXPOSE 3001

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
