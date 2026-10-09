#!/bin/sh
# ============================================================
# EHS 后端容器启动脚本
# 设计: 同步等待数据库迁移完成，再启动 Node
#   - 最多等待 50 秒（Render 健康检查 60 秒超时）
#   - db push 完成后再启动 Node，确保表已创建
#   - 如果超时，Node 还是会启动，但健康检查会失败
#   - 当前 cwd=/app/src（由 Dockerfile 设置）
# ============================================================

MIGRATE_ONLY=false
if [ "$1" = "--migrate-only" ]; then
  MIGRATE_ONLY=true
fi

echo "🔧 [entrypoint] 启动检查..."
mkdir -p "${UPLOAD_DIR:-/app/src/uploads}"

# ============================================================
# 数据库迁移函数（同步等待，最多 50 秒）
# ============================================================
run_migration_sync() {
  echo "🔌 [migration] 开始数据库同步（同步模式，最多 50 秒）..."
  # 最多重试 10 次（50 秒），应对 Render DB 冷启动慢
  for i in $(seq 1 10); do
    if npx prisma db push --skip-generate 2>&1; then
      echo "✅ [migration] schema 同步成功（第 ${i} 次尝试）"
      # 种子数据（幂等，已存在用户会跳过）
      node prisma/seed.js 2>&1 && echo "✅ [migration] 种子数据完成" || echo "⚠️  [migration] seed 跳过"
      return 0
    fi
    echo "⏳ [migration] 第 ${i}/10 次失败，5s 后重试..."
    sleep 5
  done
  echo "❌ [migration] 超时（50s），数据库连接异常，Node 仍会启动"
  return 1
}

# ============================================================
# --migrate-only 模式: Render preDeployCommand 用（不启动 Node）
# ============================================================
if [ "$MIGRATE_ONLY" = "true" ]; then
  case "${DATABASE_URL}" in
    postgresql://*.*)
      run_migration_sync
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
# 正常模式: 同步等待数据库迁移完成，再启动 Node
# ============================================================
echo "🚀 [entrypoint] 等待数据库迁移完成..."

case "${DATABASE_URL}" in
  postgresql://*.*)
    run_migration_sync
    ;;
  file:*|sqlite://*)
    npx prisma db push --skip-generate
    node prisma/seed.js 2>/dev/null || true
    ;;
esac

# 无论迁移是否成功，都启动 Node（健康检查会验证数据库连接）
echo "🚀 [entrypoint] 启动 Node 应用 (PORT=${PORT:-3001})..."
echo "⚠️  [entrypoint] 当前工作目录: $(pwd)"
echo "⚠️  [entrypoint] index.js 存在: $(ls -la index.js 2>&1)"
echo "⚠️  [entrypoint] routes 目录: $(ls routes/ 2>&1 | head -5)"

# Node 进程接管容器生命周期（不 return，不让 shell 退出）
exec node index.js
