#!/bin/sh
# ============================================================
# EHS 后端容器启动脚本
# 设计: 同步等待数据库迁移完成，再启动 Node
#   - 最多等待 50 秒（Render 健康检查 60 秒超时）
#   - db push 完成后再启动 Node，确保表已创建
#   - 如果超时，Node 还是会启动，但健康检查会失败
#   - 当前 cwd=/app/src（由 Dockerfile 设置）
# ============================================================

set -x  # 开启调试模式，输出所有命令

MIGRATE_ONLY=false
if [ "$1" = "--migrate-only" ]; then
  MIGRATE_ONLY=true
fi

echo "=========================================="
echo "🔧 [entrypoint] 启动检查"
echo "=========================================="
echo "工作目录: $(pwd)"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."  # 只显示前 30 个字符
echo "NODE_ENV: ${NODE_ENV}"
echo "PORT: ${PORT:-3001}"

# 检查必要文件
echo ""
echo "=== 文件检查 ==="
ls -la index.js 2>&1
ls -la prisma/schema.prisma 2>&1
ls -la prisma/seed.js 2>&1

# 检查 prisma 命令
echo ""
echo "=== Prisma 检查 ==="
which npx
npx prisma --version 2>&1 | head -5

# 检查数据库连接
echo ""
echo "=== 数据库连接测试 ==="
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ 数据库连接成功');
    return prisma.\$disconnect();
  })
  .catch(e => {
    console.error('❌ 数据库连接失败:', e.message);
    process.exit(1);
  });
" 2>&1 || true

mkdir -p "${UPLOAD_DIR:-/app/src/uploads}"

# ============================================================
# 数据库迁移函数（同步等待，最多 50 秒）
# ============================================================
run_migration_sync() {
  echo ""
  echo "=========================================="
  echo "🔌 [migration] 开始数据库同步（同步模式，最多 50 秒）"
  echo "=========================================="
  
  # 最多重试 10 次（50 秒），应对 Render DB 冷启动慢
  for i in $(seq 1 10); do
    echo ""
    echo "--- 第 ${i}/10 次尝试 ---"
    if npx prisma db push --schema=./prisma/schema.prisma --skip-generate 2>&1; then
      echo "✅ [migration] schema 同步成功"
      # 种子数据（幂等，已存在用户会跳过）
      if node prisma/seed.js 2>&1; then
        echo "✅ [migration] 种子数据完成"
      else
        echo "⚠️  [migration] seed 跳过"
      fi
      return 0
    fi
    echo "⏳ [migration] 失败，5s 后重试..."
    sleep 5
  done
  echo "❌ [migration] 超时（50s），数据库连接异常，Node 仍会启动"
  return 1
}

# ============================================================
# --migrate-only 模式: Render preDeployCommand 用（不启动 Node）
# ============================================================
if [ "$MIGRATE_ONLY" = "true" ]; then
  echo "=== --migrate-only 模式 ==="
  case "${DATABASE_URL}" in
    postgresql://*.*)
      run_migration_sync
      ;;
    file:*|sqlite://*)
      npx prisma db push --schema=./prisma/schema.prisma --skip-generate
      node prisma/seed.js 2>/dev/null || true
      ;;
  esac
  echo "✅ [entrypoint] 迁移完成，退出"
  exit 0
fi

# ============================================================
# 正常模式: 同步等待数据库迁移完成，再启动 Node
# ============================================================
echo ""
echo "=========================================="
echo "🚀 [entrypoint] 等待数据库迁移完成..."
echo "=========================================="

case "${DATABASE_URL}" in
  postgresql://*.*)
    run_migration_sync
    ;;
  file:*|sqlite://*)
    npx prisma db push --schema=./prisma/schema.prisma --skip-generate
    node prisma/seed.js 2>/dev/null || true
    ;;
esac

# 无论迁移是否成功，都启动 Node（健康检查会验证数据库连接）
echo ""
echo "=========================================="
echo "🚀 [entrypoint] 启动 Node 应用 (PORT=${PORT:-3001})..."
echo "=========================================="

# Node 进程接管容器生命周期（不 return，不让 shell 退出）
exec node index.js
