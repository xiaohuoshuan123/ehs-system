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
6. 访问 `https://ehs-api-xxxx.onrender.com/api/health`，返回里有 `dbOk: true`

> 免费实例 15 分钟无请求会休眠，首次访问等 30-60 秒属正常。

### 第 3 步：Cloudflare 部署前端（5 分钟）

仓库里准备了两套托管配置，按你实际创建的项目类型选一套。**新版 Dashboard 里 New 出来的项目默认是 Workers（构建详情能看到「部署命令 `npx wrangler deploy`」），那就走 A。**

#### A. Workers（新项目默认）

| 字段 | 值 |
|---|---|
| 根目录 | `frontend` |
| 构建命令 | `npm run build` |
| 部署命令 | `npx wrangler deploy`（保持默认，不要改） |

> **别把 `frontend` 填进「构建命令」**——它是「根目录」的值。填错会看到
> `Executing user build command: frontend` → `/bin/sh: 1: frontend: not found`。

后端地址写在 `frontend/wrangler.jsonc` 的 `vars.BACKEND_ORIGIN`，改后端只改这一处。
`dist` 由 `wrangler.jsonc` 的 `assets.directory` 声明；`run_worker_first: ["/api/*"]` 保证接口请求先走 `worker.js` 而不是被 SPA 兜底吃掉。

#### B. Pages（老项目或手动建 Pages 时）

| 项 | 值 |
|---|---|
| Framework preset | Vue |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Build output directory | `dist` |

环境变量加 `BACKEND_ORIGIN` = `https://ehs-api-xxxx.onrender.com`（**不要带 /api**）。

#### 两套配置为什么都在

| 文件 | 生效于 | 作用 |
|---|---|---|
| `frontend/worker.js` + `wrangler.jsonc` | Workers | worker 入口，`/api/*` 反代、其余交给静态资源 |
| `frontend/functions/api/[[path]].js` | Pages | Pages Functions 反代（导出格式不同，无法共用一份） |
| `frontend/public/_redirects` | Pages | SPA 兜底。Cloudflare 官方明确 Functions 优先于 `_redirects`，不会劫持 `/api/*` |

部署成功后拿到 `https://<项目名>.<子域>.workers.dev`（Pages 则是 `.pages.dev`），回 Render 把 `ALLOWED_ORIGINS` 改成这个域名并重新部署，然后用 `admin / admin123` 登录。

> ⚠️ **`*.workers.dev` / `*.pages.dev` 在国内打不开，必须绑自有域名。**
> 实测 `ehs-system.fanhaobin.workers.dev` 被 DNS 污染解析到 `199.16.156.103` 和
> `2a03:2880:f127:283:face:b00c:0:25de`（都是 Twitter 的 IP，`face:b00c` 是其特征），
> 浏览器必然连不上。做法：Workers 项目 → **设置 → 域和路由 → 添加 → 自定义域**，
> 填 `ehs.<你自己的域名>`（域名需已托管在同一 Cloudflare 账号），约 1 分钟自动签发证书。
>
> 后端是 **Cloudflare 边缘发起的服务端到服务端**请求，不经过用户本地网络，
> 所以 `onrender.com` 是否被污染不影响前端调用；只有用户直接访问后端域名时才会受影响。

> 前端是 hash 路由 + 同域 `/api`，产物里没有硬编码后端域名，换后端不需要重新构建前端。

---

## 三、上线后必做四件事

| # | 事项 | 怎么做 | 为什么 |
|---|---|---|---|
| 1 | 改密码 | 登录后 → 用户管理 → 改 `admin` 密码 | 初始密码是公开的 `admin123` |
| 2 | 换 JWT 密钥 | Render → Environment → `JWT_SECRET` 改成 32 位随机串（`openssl rand -hex 32`） | 密钥泄露等于任意伪造登录 |
| 3 | 配保活 | <https://cron-job.org>（免费）**只在工作时段**每 10 分钟 GET `https://<后端>/api/health` | 防休眠，避免每次打开等 1 分钟 |
| 4 | 配监控 | UptimeRobot 免费版每 5 分钟探活，告警 Webhook 指向飞书机器人 | 挂了能第一时间知道 |

> **保活不能 7×24，否则一定被冻结。** Render 免费额度是 750 实例小时/月，一个月有 744 小时——7×24 保活等于把额度用光，任何一点额外开销就会在月中把服务停到下月（这就是旧架构"前端+后端两个服务"半个月就全挂的原因：750 小时是两个服务共享的）。
>
> 正确做法：cron-job.org 里把执行时间限制为 **工作日 08:00–18:00**（约 220 小时/月），其余时间让它休眠。休眠期间**不计**实例小时，额度永远用不完，代价只是早上第一次打开等 30 秒。

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
| Blueprint 报 `cannot deploy suspended service` | Render 服务页顶部横幅 | 服务被挂起（多为免费额度用尽），挂起的服务既不能改计划也不能部署，见下节 |
| 国内浏览器打不开 `*.workers.dev` | `nslookup <域名>` | 被 DNS 污染（解析到 `199.16.156.x` 或 `2a03:2880:*`），绑自有域名解决 |
| 访问 `/api/health` 返回 HTML 而不是 JSON | 构建日志 | `run_worker_first` 没生效，`/api/*` 被 SPA 兜底截走 |

#### 服务被挂起（suspended）怎么恢复

`Update web service xxx plan to Free (cannot deploy suspended service)` 的意思是：Blueprint 匹配到一个**已存在但被挂起**的同名服务，想改它的计划，而 Render 不允许对挂起服务做任何变更。处理顺序：

1. **先确认是不是额度用尽**。打开该服务页，若顶部有"免费实例小时已用尽 / 将在下月恢复"之类的横幅，那就是整个 workspace 被冻结——**新建服务同样会被立刻冻结**，此时任何配置改动都没用，只能等下个月 1 日额度重置，或换平台（见路线 B 备选）。
2. **如果是服务级挂起**（旧服务早已废弃、只是占着名字），直接删掉它：服务页 → Settings → 拉到底 → **Delete Web Service**。Blueprint 下次 sync 会重新创建。
3. **不想删旧服务**：改 `render.yaml` 里的 `name`（本项目已从 `ehs-backend` 改为 `ehs-api`，就是为了绕开被挂起的旧服务），Blueprint 会建全新服务，不碰旧的。
4. 删/改名后回到 Blueprint → **Manual sync**，此时不应再出现该报错。

> 判断额度是否用尽的旁证：同一 workspace 下**所有**服务（含早期的前端服务）同时 503，基本可以确定是 workspace 级冻结，而不是某个服务部署失败。


### 免费层四条红线

1. **上传附件会丢**：Render 免费实例没有持久磁盘，容器重启/重新部署后 `uploads/` 清空。隐患照片、培训签到表这类文件不要依赖它长期保存。需要长期留存时接 Cloudflare R2（10GB 免费，S3 兼容），改造点在后端 `/api/upload` 一处。
2. **数据库上限约 0.5GB**：纯文本台账够用很多年；如果开始存照片/扫描件（尤其是转 base64 存库），很快会满。
3. **月流量 5GB（Render 出站）**：Excel 导出、附件下载都算。日常几十人用没问题，别当文件服务器。
4. **750 实例小时/月是 workspace 共享的**：跑多个免费服务、或 7×24 保活，都会在月中把额度吃光，导致**所有**免费服务一起被冻结到下月 1 日——现象就是全部 503、Blueprint 报 `cannot deploy suspended service`。只保留一个后端服务、保活限制在工作时段，是这套方案能长期免费的前提。

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
