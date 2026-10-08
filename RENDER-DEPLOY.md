# Render 一键部署 - 永杰集团 EHS 系统

## 方案概览

```
┌─────────────────────────────────────────────────────────┐
│  浏览器                                                  │
│  http://<your-site>.onrender.com                        │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────────┐
│  Render Static Site (Nginx)                              │
│  ehs-frontend.onrender.com                               │
│  提供前端静态文件 + API 反向代理                          │
└──────────────────┬──────────────────────────────────────┘
                   │ /api/* (内部转发)
┌──────────────────▼──────────────────────────────────────┐
│  Render Web Service                                      │
│  ehs-backend.onrender.com                                │
│  Node.js 20 + Express + Prisma                           │
│  持久化磁盘 /opt/render/uploads                           │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Render PostgreSQL (Free)                                │
│  ehs-db.onrender.com:5432                                │
│  自动备份 + 90天保留                                     │
└─────────────────────────────────────────────────────────┘
```

## 一键部署步骤

### 1. 准备 GitHub 仓库

把项目推送到 GitHub：

```bash
# 在项目根目录
cd ~/EHS智能系统

# 初始化 git
git init
git add .
git commit -m "初版"

# 创建 GitHub 仓库（私有或公开都行），然后
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

### 2. 关键：把后端 schema 切成 PostgreSQL

Render 默认用 PostgreSQL，SQLite 数据不持久（容器重启就丢）。

```bash
cd backend
cp prisma/schema.postgresql.prisma prisma/schema.prisma
```

### 3. 修改前端 API 地址

后端和前端是不同域名，前端要告诉 axios API 在哪。

创建 `frontend/.env.production`：
```
VITE_API_BASE_URL=https://ehs-backend.onrender.com/api
```

（具体地址在第5步部署后看 Render 控制台）

### 4. 部署到 Render

**方式A：用 Render Blueprint（推荐）**

1. 登录 https://render.com
2. 点右上角 **New → Blueprint**
3. 选 **GitHub**，授权后选择你刚 push 的仓库
4. 选择 `render.yaml` 文件
5. 点 **Apply Blueprint**
6. 等待 5-10 分钟构建完成

**方式B：手动创建服务**

1. 登录 https://render.com → New → Web Service
2. 选 GitHub 仓库，分支 `main`
3. Root Directory: `backend`
4. Build Command: `npm ci && npx prisma generate`
5. Start Command: `node src/index.js`
6. 添加环境变量：
   - `DATABASE_URL` → 先选 "Select a service"，选择刚创建的 PostgreSQL
   - `JWT_SECRET` → 随便填个随机字符串
   - `JWT_EXPIRES_IN` → `7d`
   - `UPLOAD_DIR` → `/opt/render/uploads`
   - `ALLOWED_ORIGINS` → 前端域名（下一步部署后填）
7. 添加 Persistent Disk → Mount Path: `/opt/render/uploads`
8. Deploy

然后 New → Static Site：
1. Root Directory: `frontend`
2. Build Command: `npm ci && npx vite build`
3. Publish Directory: `dist`
4. 添加环境变量：
   - `VITE_API_BASE_URL` → 后端域名（如 `https://ehs-backend.onrender.com/api`）
5. Deploy

### 5. 部署完成后验证

浏览器访问：
- 前端：`https://<前端域名>.onrender.com`
- 后端健康检查：`https://<后端域名>.onrender.com/api/health`

用 `admin / admin123` 登录测试。

---

## 常见问题

### Q1: 前端请求 404 或 CORS 错误

原因：前端 `.env.production` 没填，或后端 `ALLOWED_ORIGINS` 没加前端域名。

解决：
1. 前端 `.env.production` 改成后端的完整域名（带 `/api`）
2. 后端 `ALLOWED_ORIGINS` 改成前端的完整域名（不带 `/api`）
3. 两边都重新部署

### Q2: 数据库连接失败

Render 免费 PostgreSQL 有 5 个连接上限。看后端日志：
```
render.com → ehs-backend → Shell → Logs
```

如果显示 `connection refused`，多半是后端容器刚启动还没连上 DB，等 1 分钟再刷新。

### Q3: 前端白屏

按 `F12` 看 Console：
- `Failed to fetch` → API 地址不对
- `CORS error` → 后端 `ALLOWED_ORIGINS` 没加前端域名
- `500` → 后端报错，看后端日志

### Q4: 上传文件失败

Render Web Service 的持久化磁盘默认挂载到 `/opt/render`，文件放别处重启会丢。
确认后端 `UPLOAD_DIR=/opt/render/uploads`，且 Persistent Disk 已挂载。

### Q5: 免费层服务休眠

Render 免费层 15 分钟无请求会休眠，下次访问要等 30-60 秒唤醒。

解决：升级 **Starter 计划**（$7/月），不会休眠。演示演示无所谓，正式用建议升级。

### Q6: Render 免费 PostgreSQL 数据保留多久

免费层保留 15 天不活跃就删。建议：
- 演示完立刻导出：`docker exec -it ehs-db psql -U ehs -d ehs -c "\copy (SELECT *) FROM your_table TO '/tmp/data.csv' CSV HEADER"`
- 或升级付费计划（$7/月起）

---

## 演示用账号

```
admin / admin123         (超级管理员)
fanhaobin / admin123     (安保经理)
zhangsan / admin123      (普通员工)
```

---

## 成本参考

| 计划 | 月费 | 用途 |
|---|---|---|
| Free | ¥0 | 短演示（15分钟休眠） |
| Starter | $7/月 | 演示+小范围试用 |
| Standard | $25/月 | 团队正式使用 |

如果只演示几天，免费够用。长期测试建议 Starter。

---

## 演示建议

1. **先导入一些数据**：演示前用 admin 账号录入几条安全观察、隐患排查、设备点检等
2. **准备演示脚本**：从目标管理→教育培训→设备设施→作业安全→危险源→隐患治理 走一遍
3. **截图关键页面**：仪表盘、培训记录、隐患排查、设备管理
4. **演示环境用 Starter 计划**，避免休眠尴尬

---

## 后续迁移到生产

Render 演示通过后，按 `DEPLOY.md` 迁到国内云：

1. Render 数据库导出：`pg_dump -h <render-db-host> -U ehs -d ehs > ehs.sql`
2. 国内云建 MySQL，导入：`mysql -u root -p ehs < ehs.sql`
3. 改 schema 回 MySQL，改前端 `.env.production` 为国内云域名
4. `docker compose up -d --build`
