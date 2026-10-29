# 免费部署与运维手册（方案 B：全云端，0 元）

> 目标：不花一分钱，把这套 EHS 系统跑在公网上，能登录、能录入、能导出，数据不丢。
> 适用：演示、异地查看、小范围试用。**正式长期使用请看文末"什么时候该升级"**。

---

## 一、架构（三段式，全部免费）

```
浏览器
  │ HTTPS
  ▼
Cloudflare Pages          ehs.pages.dev（静态托管，流量不限）
  ├─ 前端 dist（Vue 3 构建产物）
  └─ /api/*  ──Pages Functions 反代──▶  Render Free Web Service
                                        Node 20 + Express + Prisma
                                              │
                                              ▼
                                        Neon PostgreSQL（永久免费）
```

为什么这样搭：

| 组件 | 选它的原因 | 免费额度 |
|---|---|---|
| Cloudflare Pages | 静态托管流量不限，自带 Functions 反代 | 500 次构建/月，请求不限 |
| Render Free | 唯一"永久免费、不绑卡"的常驻 Node 容器 | 512MB / 0.1 CPU，750 实例小时/月 |
| Neon | **永久免费且不过期**，避开 Render 免费库 30 天到期坑 | 约 0.5GB 存储，100 计算小时/月 |

对比：Render 免费 PostgreSQL 创建 30 天后过期，14 天宽限后连数据一起删；Neon 不会。**这是方案 B 的关键替换点。**

---

## 二、部署（三步，约 20 分钟）

### 第 1 步：Neon 建库（5 分钟）

1. 打开 <https://neon.tech> → GitHub 登录 → New Project
2. Region 选 **AWS AP-Southeast-1（新加坡）**，与 Render 同区，延迟最低
3. 建好后进 **Dashboard → Connect**，勾选 **Connection pooling**，复制连接串
4. 在连接串末尾补两个参数（Prisma 必需）：

```
&pgbouncer=true&connection_limit=1
```

最终形如（把尖括号内容换成你自己的）：

```
postgresql://<user>:<password>@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1
```

> `connection_limit=1` 不能省：Neon 免费层连接数有限，Prisma 默认池开太大会直接连不上。

### 第 2 步：Render 部署后端（10 分钟）

1. 打开 <https://render.com> → GitHub 登录
2. **New → Blueprint** → 选 `xiaohuoshuan123/ehs-system` → **Apply**
   （`render.yaml` 已改好：只有一个 free 后端服务，不再创建 30 天过期的数据库）
3. 服务创建后在 **Environment** 里补两个变量：

| 变量 | 值 |
|---|---|
| `DATABASE_URL` | 第 1 步的 Neon 连接串 |
| `ALLOWED_ORIGINS` | 先随便填 `https://example.com`，第 3 步拿到 Pages 域名后改 |

4. 点 **Manual Deploy → Clear build cache & deploy**
5. 首次启动会自动建表 + 灌种子数据（约 1-3 分钟）。看日志出现 `✅ [DB] 建表完成` 和 `✅ [DB] 种子数据完成` 即成功
6. 访问 `https://ehs-backend-xxxx.onrender.com/api/health`，返回里有 `dbOk: true`

> 免费实例 15 分钟无请求会休眠，首次访问等 30-60 秒属正常。

### 第 3 步：Cloudflare Pages 部署前端（5 分钟）

1. 打开 <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages → Connect to Git**
2. 选同一个仓库，构建设置：

| 项 | 值 |
|---|---|
| Framework preset | Vue |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Build output directory | `dist` |

3. **Environment variables** 加一条：

| 变量 | 值 |
|---|---|
| `BACKEND_ORIGIN` | `https://ehs-backend-xxxx.onrender.com`（第 2 步的域名，**不要带 /api**） |

4. Save and Deploy。拿到 `https://xxx.pages.dev` 后，回 Render 把 `ALLOWED_ORIGINS` 改成这个域名并重新部署
5. 打开 Pages 域名，用 `admin / admin123` 登录

> 前端接口走同域 `/api`，由 `frontend/functions/api/[[path]].js` 反代到后端，所以不存在跨域问题，以后换后端域名也不用重新构建前端。

---

## 三、上线后必做四件事

| # | 事项 | 怎么做 | 为什么 |
|---|---|---|---|
| 1 | 改密码 | 登录后 → 用户管理 → 改 `admin` 密码 | 初始密码是公开的 `admin123` |
| 2 | 换 JWT 密钥 | Render → Environment → `JWT_SECRET` 改成 32 位随机串（`openssl rand -hex 32`） | 密钥泄露等于任意伪造登录 |
| 3 | 配保活 | <https://cron-job.org>（免费）每 10 分钟 GET `https://<后端>/api/health` | 防休眠，避免每次打开等 1 分钟 |
| 4 | 配监控 | UptimeRobot 免费版每 5 分钟探活，告警 Webhook 指向飞书机器人 | 挂了能第一时间知道 |

> 保活注意：Render 750 实例小时/月 ≈ 31.2 天，**只够一个服务 7×24 常驻**。如果再开第二个免费服务，两边都会中途被停到下月。

---

## 四、日常运维

### 更新代码

```bash
git push origin main        # Render 和 Pages 都会自动重新部署
```

数据库表结构有改动时（`schema.prisma` 变了）：`prisma db push` 在"表已存在"时会跳过，需手动执行一次：

```bash
# 本地装了 Node 的情况下，用 Neon 连接串直连
cd backend
DATABASE_URL="<你的 Neon 连接串>" npx prisma db push
```

### 备份（数据库）

Neon 免费版自带 **6 小时** 时间点恢复，够应付误删；长期备份用 GitHub Actions 每天导出一份：

- 文件：`.github/workflows/db-backup.yml`（已随仓库提供）
- 启用：GitHub 仓库 → Settings → Secrets → 新建 `DATABASE_URL`（Neon 连接串，**用非 pooler 的直连串**）
- 产物：Actions 运行记录里下载 `ehs-db-YYYYMMDD.sql.gz`，默认保留 90 天

### 日志与排障

| 现象 | 先看哪里 | 常见原因 |
|---|---|---|
| 打开页面转圈 1 分钟 | Render 日志 | 免费实例冷启动，正常 |
| 登录提示"网络错误" | Pages → Functions 日志 | `BACKEND_ORIGIN` 填错或后端休眠中 |
| `dbOk: false` | Render 日志搜 `[DB]` | 连接串错 / 少了 `connection_limit=1` |
| 上传附件后文件打不开 | — | **免费层的已知限制**，见下节 |
| 页面 404 | Pages 部署日志 | Build output 目录不是 `dist` |

### 免费层三条红线

1. **上传附件会丢**：Render 免费实例没有持久磁盘，容器重启/重新部署后 `uploads/` 清空。隐患照片、培训签到表这类文件不要依赖它长期保存。需要长期留存时接 Cloudflare R2（10GB 免费，S3 兼容），改造点在后端 `/api/upload` 一处。
2. **数据库上限约 0.5GB**：纯文本台账够用很多年；如果开始存照片/扫描件（尤其是转 base64 存库），很快会满。
3. **月流量 5GB（Render 出站）**：Excel 导出、附件下载都算。日常几十人用没问题，别当文件服务器。

---

## 五、什么时候该升级（别等到出事）

| 信号 | 说明 | 建议动作 |
|---|---|---|
| 每天有人反馈"打不开，要等一分钟" | 冷启动影响正常办公 | Render Starter $7/月，或改走内网自托管（0 元） |
| 附件必须长期留存 | 免费层满足不了 | 接 R2，或整体迁内网 |
| 数据超过 0.5GB | Neon 免费上限 | Neon Launch 按量计费，或迁内网 |
| 要做等保/审计留痕 | 境外云 + 免费层不适合 | 迁厂内服务器（数据不出厂，见 `DEPLOY.md`） |

> 务实建议：这套系统真正长期跑，**厂内一台常开旧电脑 + Docker Compose + Cloudflare Tunnel** 比免费云更稳、更快、更省心（数据在厂里、不休眠、附件不丢）。免费云适合演示和阶段验证。

---

## 六、账号与安全清单

- [ ] `admin` 初始密码已改
- [ ] `JWT_SECRET` 已换成随机串
- [ ] `ALLOWED_ORIGINS` 只填正式域名，别用 `*`
- [ ] Neon 连接串只存在 Render 环境变量和 GitHub Secret 里，**不要提交进仓库**
- [ ] Render 免费实例的 `3001` 端口不要另行暴露（走 Render 域名即可）
- [ ] 演示结束若长期不用，可在 Render 手动 Suspend，避免额度被白白消耗
