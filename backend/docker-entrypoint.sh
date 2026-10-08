#!/bin/sh
# ============================================================
# EHS 后端容器启动脚本
# 设计: Node 立即前台运行，db push 放后台用 nohup
#   - Render 健康检查等 /api/health 200 秒级返回
#   - db push 在后台跑，渲染日志里能看到进度
#   - Node 崩溃时容器退出（exec 不 fork）
# ============================================================

MIGRATE_ONLY=false
if [ "$1" = "--migrate-only" ]; then
  MIGRATE_ONLY=true
fi

echo "🔧 [entrypoint] 启动检查..."
mkdir -p "${UPLOAD_DIR:-/app/uploads}"

# ============================================================
# 数据库迁移函数（供后台和 --migrate-only 两种模式复用）
# ============================================================
run_migration() {
  echo "🔌 [migration] 开始数据库同步..."
  # 最多重试 30 次（150 秒），应对 Render DB 冷启动慢
  for i in $(seq 1 30); do
    if npx prisma db push --skip-generate 2>&1; then
      echo "✅ [migration] schema 同步成功（第 ${i} 次尝试）"
      # 种子数据（幂等，已存在用户会跳过）
      node prisma/seed.js 2>&1 && echo "✅ [migration] 种子数据完成" || echo "⚠️  [migration] seed 跳过"
      return 0
    fi
    echo "⏳ [migration] 第 ${i}/30 次失败，5s 后重试..."
    sleep 5
  done
  echo "❌ [migration] 超时（150s），数据库连接异常"
  return 1
}

# ============================================================
# --migrate-only 模式: Render preDeployCommand 用（不启动 Node）
# ============================================================
if [ "$MIGRATE_ONLY" = "true" ]; then
  case "${DATABASE_URL}" in
    postgresql://*.*)
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
# 正常模式:
#   1. 启动 Node（前台，被 exec 接管）
#   2. 同时后台跑 db push（nohup + disown）
# ============================================================
echo "🚀 [entrypoint] 启动 Node 应用 (PORT=${PORT:-3001})..."
echo "⚡ [entrypoint] 后台启动数据库迁移..."

# 后台执行迁移，输出到文件方便查看 Render Logs
case "${DATABASE_URL}" in
  postgresql://*.*)
    nohup sh -c 'for i in $(seq 1 30); do if npx prisma db push --skip-generate >>/tmp/migrate.log 2>&1; then echo "✅ db push 成功"; node prisma/seed.js >>/tmp/migrate.log 2>&1; echo "✅ seed 完成"; exit 0; fi; echo "⏳ 第${i}/30次失败，5s后重试"; sleep 5; done; echo "❌ db push 超时";' > /tmp/migrate.log 2>&1 &
    ;;
  file:*|sqlite://*)
    nohup sh -c 'npx prisma db push >>/tmp/migrate.log 2>&1; node prisma/seed.js >>/tmp/migrate.log 2>&1 || true' > /tmp/migrate.log 2>&1 &
    ;;
esac

# Node 进程接管容器生命周期（不 return，不让 shell 退出）
exec node src/index.js
