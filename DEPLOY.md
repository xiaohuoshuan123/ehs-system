# 永杰集团 EHS 系统 - 部署手册

## 推荐方案

**阿里云/腾讯云 Linux 云服务器 + Docker Compose**

| 项 | 配置 | 价格参考 |
|---|---|---|
| 云服务器 | 2核4G 或 4核8G（Ubuntu 22.04 LTS） | ¥70-150/月 |
| 带宽 | 5Mbps 起 | 含 |
| 公网IP | 必需 | 含 |
| 域名（可选） | ehs.yongjie.com | 阿里云 ¥35/年 |

---

## 部署流程（4步）

### 第1步：云服务器购买

在阿里云/腾讯云控制台购买 **Ubuntu 22.04 LTS** 云服务器：
- 2核4G 最低配置（推荐4核8G）
- 系统盘 40G SSD
- 公网 IP 必需
- **安全组**放通：`80`（Web访问）、`22`（SSH）、`3001`（可选，API直连调试）

---

### 第2步：上传代码到服务器

**在你本机（能访问 EHS智能系统 目录的机器）**执行：

```bash
# 打包项目（排除不需要的内容）
cd ~/EHS智能系统
tar --exclude='node_modules' --exclude='data' --exclude='dist' --exclude='backend/prisma/dev.db' -czf ehs-deploy.tar.gz .

# 上传到服务器（替换为你的公网IP）
scp ehs-deploy.tar.gz root@你的公网IP:/opt/ehs/
```

如果没有上传工具，用 WinSCP/FileZilla 拖拽上传。

---

### 第3步：在服务器上部署

SSH 登录服务器：`ssh root@你的公网IP`

```bash
# 1. 创建目录并解压
mkdir -p /opt/ehs
cd /opt/ehs
tar -xzf ehs-deploy.tar.gz

# 2. 创建持久化数据目录
mkdir -p data/db data/uploads
chmod 777 data/db data/uploads

# 3. 安装 Docker + Docker Compose（如果服务器没装）
curl -fsSL https://get.docker.com | bash
systemctl enable docker && systemctl start docker

# 验证
docker --version
docker compose version

# 4. 编辑环境变量
vim docker/.env
```

`docker/.env` 内容：
```env
# 应用
PORT=3001
NODE_ENV=production

# JWT 密钥（生产务必改！建议用 openssl rand -hex 32 生成）
JWT_SECRET=请改成你自己的随机字符串

# Token 有效期
JWT_EXPIRES_IN=7d

# 数据库（SQLite，默认）
DATABASE_URL=file:/app/prisma/dev.db

# 上传目录
UPLOAD_DIR=./uploads

# 前端访问
FRONTEND_URL=http://你的公网IP
```

---

### 第4步：启动服务

```bash
# 构建并启动（首次会下载镜像，约5分钟）
docker compose up -d --build

# 查看状态
docker compose ps

# 看后端日志
docker compose logs -f backend

# 等 backend healthy 后，测试
curl http://localhost/api/health
```

浏览器访问 `http://你的公网IP/`，用 `admin/admin123` 登录。

---

## 访问方案

| 访问类型 | 地址 | 配置 |
|---|---|---|
| 公网（员工/出差） | `http://公网IP/` | 安全组放通 80 端口 |
| 内网（车间/办公室） | 同上 IP | 云 VPC 内网访问 |

**内网专线建议**：如果工厂有公网专线，配置 DNS 解析 `ehs.yongjie.com` 到公网 IP，云服务商一般支持内网回源。

---

## 常用运维命令

```bash
cd /opt/ehs

# 查看所有容器
docker compose ps

# 看日志
docker compose logs backend       # 后端日志
docker compose logs frontend      # 前端日志
docker compose logs -f            # 持续跟踪

# 重启
docker compose restart

# 停止
docker compose down               # 保留数据
docker compose down -v            # 清空数据（危险！）

# 更新代码
git pull                          # 或用 scp 覆盖文件
docker compose up -d --build

# 备份数据库
cp data/db/dev.db data/db/dev.db.$(date +%Y%m%d).bak
```

---

## 切换到 MySQL（可选）

SQLite 适合 <50 人并发，超过建议切 MySQL。

### 1. 修改 schema

```bash
cd /opt/ehs/backend
cp prisma/schema.mysql.prisma prisma/schema.prisma
```

### 2. 修改 docker-compose.yml

取消 `mysql:` 服务整块注释（把开头的 `#` 删掉），修改 backend 服务的 `DATABASE_URL`：

```yaml
backend:
  environment:
    - DATABASE_URL=mysql://ehs:ehs_pass@mysql:3306/ehs
    - DIRECT_URL=mysql://root:root123@mysql:3306/ehs
  depends_on:
    mysql:
      condition: service_healthy
```

### 3. 修改 docker/.env

```env
DATABASE_URL=mysql://ehs:ehs_pass@mysql:3306/ehs
DIRECT_URL=mysql://root:root123@mysql:3306/ehs
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=ehs
MYSQL_USER=ehs
MYSQL_PASSWORD=ehs_pass
```

### 4. 重建

```bash
docker compose down -v    # 清空旧数据
docker compose up -d --build
```

---

## HTTPS 配置（推荐）

生产环境建议配 HTTPS。用 Let's Encrypt 免费证书：

```bash
# 1. 装 certbot
apt install -y certbot

# 2. 申请证书（假设你已配好 DNS 解析）
certbot certonly --standalone -d ehs.yongjie.com

# 3. 修改 docker/nginx.conf
```

修改 nginx.conf：
```nginx
server {
    listen 443 ssl http2;
    server_name ehs.yongjie.com;
    
    ssl_certificate /etc/letsencrypt/live/ehs.yongjie.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ehs.yongjie.com/privkey.pem;
    
    # 其余同前...
}

server {
    listen 80;
    server_name ehs.yongjie.com;
    return 301 https://$server_name$request_uri;
}
```

挂载证书：docker-compose.yml 的 frontend 服务加：
```yaml
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
```

自动续期：
```bash
crontab -e
# 加一行
0 0 * * * certbot renew --post-hook "docker compose -f /opt/ehs/docker-compose.yml restart frontend"
```

---

## 数据备份

### 自动备份脚本

创建 `/opt/ehs/scripts/backup.sh`：
```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M)
BACKUP_DIR=/opt/ehs/backups
mkdir -p $BACKUP_DIR

# 备份 SQLite 数据库
cp /opt/ehs/data/db/dev.db $BACKUP_DIR/dev.$DATE.db

# 备份上传文件
tar -czf $BACKUP_DIR/uploads.$DATE.tar.gz /opt/ehs/data/uploads/

# 保留最近30天
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "备份完成: $DATE"
```

设置定时任务：
```bash
chmod +x /opt/ehs/scripts/backup.sh
crontab -e
# 每天凌晨3点备份
0 3 * * * /opt/ehs/scripts/backup.sh >> /var/log/ehs-backup.log 2>&1
```

### 同步到对象存储（可选）

如果需要异地容灾，把 backups 目录同步到阿里云 OSS / 腾讯云 COS。

---

## 故障排查

### 1. 容器起不来

```bash
docker compose logs backend    # 看错误
docker compose ps              # 看状态
```

常见：
- `ECONNREFUSED` → 数据库没起来，`docker compose logs mysql` 看
- `permission denied` → `chmod 777 data/db data/uploads`
- `migrate failed` → `docker compose exec backend npx prisma migrate deploy` 手动执行

### 2. 端口冲突

```bash
ss -tlnp | grep 80      # 看谁占用了80
fuser -k 80/tcp          # 杀掉占用进程
```

### 3. 内存不足

2核4G 一般够用。如果 OOM：
```bash
free -h                          # 看内存
docker system df                 # 看容器占用
docker system prune -f           # 清缓存
```

### 4. 前端白屏

浏览器按 `F12` 看 Console：
- `Failed to load resource` → API 请求失败，检查 nginx.conf 的 proxy_pass
- `TypeError` → 前端代码 bug

### 5. 上传文件失败

```bash
docker exec ehs-backend ls -la /app/uploads
```

---

## 更新上线流程

```bash
# 1. 拉取最新代码（或用 scp 覆盖）
cd /opt/ehs
git pull   # 或 scp 覆盖文件

# 2. 重新构建
docker compose down
docker compose up -d --build

# 3. 验证
curl http://localhost/api/health
```

---

## 服务器规格建议

| 用户数 | CPU | 内存 | 存储 |
|--------|-----|------|------|
| <20 | 2核 | 4G | 40G |
| 20-100 | 4核 | 8G | 100G |
| >100 | 8核 | 16G | 200G + 独立MySQL |

---

## 安全清单

- [ ] 修改 JWT_SECRET 为随机字符串
- [ ] 修改 admin 用户初始密码（登录后在用户管理改）
- [ ] 云安全组限制 22/3001 端口只允许公司出口IP
- [ ] 开启自动备份（daily）
- [ ] 配置 HTTPS
- [ ] 定期 `docker compose pull` 更新基础镜像
- [ ] 生产环境不要暴露 3001 端口到公网，只通过 Nginx 80 访问
