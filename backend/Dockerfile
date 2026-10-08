# ============================================================
# 永杰集团昆山工厂智慧安全管理系统 - 后端 Dockerfile
# 修复: 调整目录结构，确保 require 路径正确
#   - WORKDIR /app/src，这样 require('./routes/xxx') 能找到 src/routes/
#   - prisma/schema 放在 /app/src/prisma/（相对于 cwd）
# ============================================================
FROM node:20-alpine

WORKDIR /app/src

# 复制依赖文件到 /app/src/
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# 复制源码（保持 src/routes/ 目录结构）
COPY backend/src ./
COPY backend/prisma ./prisma

# 生成 Prisma Client（cwd=/app/src，所以 prisma/schema 在 ./prisma/）
RUN npx prisma generate

# 复制启动脚本到 /app/src/
COPY backend/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x /app/src/docker-entrypoint.sh

# 创建上传目录
RUN mkdir -p uploads

EXPOSE 3001

# 启动时从 /app/src/ 运行
ENTRYPOINT ["sh", "/app/src/docker-entrypoint.sh"]
