#!/bin/sh
# ============================================================
# EHS 后端容器启动脚本（简化版）
# 数据库迁移由 index.js 里的 ensureDatabaseReady() 负责
# ============================================================

echo "🔧 [entrypoint] 启动 EHS 后端..."
echo "   工作目录: $(pwd)"
echo "   DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "   PORT: ${PORT:-3001}"

mkdir -p "${UPLOAD_DIR:-/app/src/uploads}"

# 直接启动 Node（迁移逻辑在 index.js 里）
exec node index.js
