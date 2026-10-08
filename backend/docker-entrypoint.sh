#!/bin/sh
# ============================================================
# EHS 后端容器启动脚本
# 支持:
#   - 本地/容器默认: 启动 Node 应用
#   - --migrate-only: 只执行 Prisma db push（用于 Render preDeployCommand）
# ============================================================

MIGRATE_ONLY=false
if [ "$1" = "--migrate-only" ]; then
  MIGRATE_ONLY=true
fi

echo "🔧 [entrypoint] 启动检查..."

# 确保上传目录存在
mkdir -p "${UPLOAD_DIR:-./uploads}"

# 根据数据库类型执行 schema 同步（无迁移文件，用 db push）
case "${DATABASE_URL}" in
  postgresql://*|postgres://*|mysql://*)
    echo "📦 [entrypoint] 同步数据库 schema (db push)..."
    npx prisma db push --skip-generate
    if [ $? -ne 0 ]; then
      echo "❌ [entrypoint] 数据库同步失败"
      exit 1
    fi
    # 首次启动尝试插入种子数据（幂等：按 username unique 查）
    node prisma/seed.js 2>/dev/null || echo "⚠️ [entrypoint] seed 跳过（可能已存在）"
    ;;
  file:*|sqlite://*)
    if [ -f "/app/prisma/dev.db" ]; then
      echo "✅ [entrypoint] SQLite 数据库已存在，跳过初始化"
    else
      echo "📦 [entrypoint] 初始化 SQLite 数据库..."
      npx prisma db push --skip-generate
      node prisma/seed.js 2>/dev/null || echo "⚠️ [entrypoint] seed 跳过"
    fi
    ;;
  *)
    echo "⚠️ [entrypoint] 未知数据库类型: ${DATABASE_URL:0:20}"
    npx prisma db push --skip-generate
    ;;
esac

if [ "$MIGRATE_ONLY" = "true" ]; then
  echo "✅ [entrypoint] 迁移完成，退出（Render preDeployCommand 模式）"
  exit 0
fi

echo "🚀 [entrypoint] 启动 Node 应用 (PORT=${PORT:-10000})..."
exec node src/index.js
