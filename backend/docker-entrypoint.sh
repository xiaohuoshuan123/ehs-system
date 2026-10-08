#!/bin/sh
# ============================================================
# EHS 后端容器启动脚本
# 启动时自动:
#   1. 等待数据库可连接（最多 120 秒，每 5 秒重试）
#   2. 执行 Prisma db push 同步 schema
#   3. 插入种子数据（幂等）
#   4. 启动 Node 应用
# 注意: 不用 set -e，避免重试循环被打断
# ============================================================

MIGRATE_ONLY=false
if [ "$1" = "--migrate-only" ]; then
  MIGRATE_ONLY=true
fi

echo "🔧 [entrypoint] 启动检查..."

# 确保上传目录存在
mkdir -p "${UPLOAD_DIR:-/app/uploads}"

# ============================================================
# 数据库连接重试（Render 数据库初始化要 30-60 秒）
# ============================================================
wait_for_db() {
  local max_attempts=24
  local attempt=1
  echo "🔌 [entrypoint] 等待数据库可连接（最多 ${max_attempts} 次，每次 5 秒）..."
  while [ "$attempt" -le "$max_attempts" ]; do
    if npx prisma db push --skip-generate 2>&1; then
      echo "✅ [entrypoint] 数据库可连接，第 ${attempt} 次尝试"
      return 0
    fi
    echo "⏳ [entrypoint] 第 ${attempt}/${max_attempts} 次失败，5 秒后重试..."
    sleep 5
    attempt=$((attempt + 1))
  done
  return 1
}

# 根据数据库类型执行 schema 同步
DB_OK=false
case "${DATABASE_URL}" in
  postgresql://*|postgres://*)
    echo "📦 [entrypoint] 同步 PostgreSQL schema..."
    if wait_for_db; then
      DB_OK=true
      # 种子数据（幂等）
      if node prisma/seed.js 2>&1; then
        echo "✅ [entrypoint] 种子数据完成"
      else
        echo "⚠️  [entrypoint] seed 跳过（可能已存在）"
      fi
    else
      echo "❌ [entrypoint] 数据库连接超时（120 秒），跳过同步，仍继续启动 Node 应用"
    fi
    ;;
  file:*|sqlite://*)
    if [ -f "/app/prisma/dev.db" ]; then
      echo "✅ [entrypoint] SQLite 数据库已存在，跳过初始化"
      DB_OK=true
    else
      echo "📦 [entrypoint] 初始化 SQLite 数据库..."
      npx prisma db push --skip-generate
      node prisma/seed.js 2>/dev/null || echo "⚠️  [entrypoint] seed 跳过"
      DB_OK=true
    fi
    ;;
  *)
    echo "⚠️  [entrypoint] 未知数据库类型: ${DATABASE_URL:0:30}..."
    npx prisma db push --skip-generate || echo "⚠️  [entrypoint] db push 失败但继续启动"
    DB_OK=true
    ;;
esac

if [ "$MIGRATE_ONLY" = "true" ]; then
  echo "✅ [entrypoint] 迁移完成，退出（Render preDeployCommand 模式）"
  exit 0
fi

echo "🚀 [entrypoint] 启动 Node 应用 (PORT=${PORT:-3001})..."
exec node src/index.js
