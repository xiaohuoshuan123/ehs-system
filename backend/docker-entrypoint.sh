#!/bin/sh
# ============================================================
# EHS 后端容器启动脚本
# 关键设计: Node 应用立即启动，数据库迁移后台执行
#   - Render 健康检查 60 秒超时，不能同步等 db push
#   - /api/health 不查数据库，Node 起来就能返回 200
#   - db push 在后台跑，Render 看到健康 200 就算部署成功
#   - 数据库就绪后，API 请求才能正常用业务接口
# ============================================================

MIGRATE_ONLY=false
if [ "$1" = "--migrate-only" ]; then
  MIGRATE_ONLY=true
fi

echo "🔧 [entrypoint] 启动检查..."

# 确保上传目录存在
mkdir -p "${UPLOAD_DIR:-/app/uploads}"

# ============================================================
# 数据库迁移函数（后台执行，不阻塞 Node 启动）
# ============================================================
run_migration() {
  local max_attempts=30
  local attempt=1
  echo "🔌 [migration] 等待数据库可连接（最多 150 秒）..."
  while [ "$attempt" -le "$max_attempts" ]; do
    if npx prisma db push --skip-generate 2>&1; then
      echo "✅ [migration] 数据库同步成功，第 ${attempt} 次尝试"
      if node prisma/seed.js 2>&1; then
        echo "✅ [migration] 种子数据完成"
      else
        echo "⚠️  [migration] seed 跳过（可能已存在）"
      fi
      return 0
    fi
    echo "⏳ [migration] 第 ${attempt}/${max_attempts} 次失败，5 秒后重试..."
    sleep 5
    attempt=$((attempt + 1))
  done
  echo "❌ [migration] 数据库连接超时（150 秒），应用仍可启动但 API 可能 500"
  return 1
}

# ============================================================
# --migrate-only 模式：只迁移，然后退出
# ============================================================
if [ "$MIGRATE_ONLY" = "true" ]; then
  case "${DATABASE_URL}" in
    postgresql://*|postgres://*)
      run_migration
      ;;
    file:*|sqlite://*)
      npx prisma db push --skip-generate
      node prisma/seed.js 2>/dev/null || true
      ;;
  esac
  echo "✅ [entrypoint] 迁移完成，退出"
  exit 0
fi

# ============================================================
# 正常模式：后台跑迁移，前台跑 Node（Node 立即接管进程）
# ============================================================
echo "🚀 [entrypoint] 后台启动数据库迁移..."

# 根据数据库类型选择迁移方式
case "${DATABASE_URL}" in
  postgresql://*|postgres://*)
    run_migration &
    ;;
  file:*|sqlite://*)
    npx prisma db push --skip-generate 2>&1 &
    ;;
  *)
    echo "⚠️  [entrypoint] 未知数据库类型，跳过迁移"
    ;;
esac

echo "🚀 [entrypoint] 启动 Node 应用 (PORT=${PORT:-3001})..."
exec node src/index.js
