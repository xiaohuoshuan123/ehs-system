# ============================================================
# 永杰集团昆山工厂智慧安全管理系统 - 后端 Dockerfile
# ============================================================
FROM node:20-alpine

# 安装 OpenSSL（Prisma Client 需要）
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app/src

# 复制依赖文件
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# 复制源码
COPY backend/src ./
COPY backend/prisma ./prisma

# 数据源方言：云上必须 postgresql（免费层无持久盘，SQLite 会丢）。
# DB_PROVIDER=sqlite 可构建纯离线内网镜像。
ARG DB_PROVIDER=postgresql
RUN if [ "$DB_PROVIDER" = "postgresql" ]; then \
      sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma && \
      echo "✅ Prisma provider -> postgresql"; \
    else \
      echo "ℹ️ Prisma provider 保持 sqlite"; \
    fi

# 生成 Prisma Client（必须在上面的方言切换之后）
RUN npx prisma generate

# 复制启动脚本
COPY backend/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x /app/src/docker-entrypoint.sh

# 创建上传目录
RUN mkdir -p uploads

EXPOSE 3001

ENTRYPOINT ["sh", "/app/src/docker-entrypoint.sh"]
