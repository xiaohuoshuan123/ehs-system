# 永杰集团智能安全管理系统 (EHS)

永杰新材昆山工厂 EHS 智慧安全管理系统，对标《有色金属压力加工企业安全生产标准化评定标准》**13 项考评类目、46 项考评项目、239 条考评内容**，并独立增设**十四、环境管理**模块（废水 / 废气 / 固废 / 噪声 / 土壤 / 排污许可）。

- 在线访问：<https://ehs-frontend.onrender.com>
- 演示账号：`admin` / `admin123`

---

## 功能模块（14 大类，93 项子模块）

### 一、目标（3）
安全规划 `/api/plan` ｜ 年度目标 `/api/objective` ｜ 年度计划 `/api/annual-plan`

### 二、组织机构和职责（5）
安委会管理 `/api/committee` ｜ 安全会议 `/api/safety-meeting` ｜ 责任制 `/api/responsibility`
｜ 安全领导力 `/api/leadership` ｜ 安全履职评价 `/api/leadership-evaluation`

### 三、资金投入（1）
安全投入 `/api/expenditure`

### 四、法规与制度（4）
法律法规 `/api/regulation` ｜ 规章制度 `/api/internal-regulation` ｜ 合规评估 `/api/compliance`
｜ 安全理念 `/api/safety-philosophy`

### 五、教育培训（10）
安全证书 `/api/certificate` ｜ 安全课程 `/api/course` ｜ 题库管理 `/api/exam-question`
｜ 考试管理 `/api/exam` ｜ 考试记录 `/api/exam-record` ｜ 培训记录 `/api/training`
｜ 课程进度 `/api/user-course` ｜ 师带徒 `/api/mentor` ｜ 人员准入 `/api/personnel-entry`
｜ 信息沟通 `/api/safety-communication`

### 六、生产设备设施（10）
设备管理 `/api/equipment` ｜ 设备检修 `/api/equipment-maintenance` ｜ 设备点检 `/api/equipment-inspection`
｜ 化学品 `/api/chemical` ｜ 特种设备 `/api/special-eq` ｜ 消防区域 `/api/fire-zone`
｜ 消防器材 `/api/fire-equipment` ｜ 防火巡查计划 `/api/fire-patrol-plan` ｜ 防火巡查 `/api/fire-patrol`
｜ 科技保障 `/api/technology-protection`

### 七、作业安全（12）
风险因素 `/api/risk-factor` ｜ 安全观察 `/api/observation` ｜ 安全检查 `/api/work-check`
｜ 作业许可 `/api/permit` ｜ 变更管理 `/api/change` ｜ 承包商 `/api/contractor`
｜ 承包商审批 `/api/contractor-approval` ｜ 承包商黑名单 `/api/contractor-blacklist`
｜ 深井灌注监测 `/api/deep-cast-monitor` ｜ 不安全行为管控 `/api/unsafe-behavior`
｜ 异常处置 `/api/abnormal-handling` ｜ 作业行为管理 `/api/work-behavior`

### 八、隐患排查与治理（8）
排查计划 `/api/inspection-plan` ｜ 隐患排查 `/api/hazard` ｜ 隐患奖励 `/api/hazard-reward`
｜ 违章管理 `/api/violation` ｜ 安全积分 `/api/safety-score` ｜ 重大事故隐患 `/api/major-hazard`
｜ 隐患排查检查 `/api/safety-inspection` ｜ 隐患治理评估 `/api/hazard-evaluation`

### 九、危险源和环境因素（7）
作业单元 `/api/work-unit` ｜ 危险源识别 `/api/risk-control` ｜ 风险排查项 `/api/risk-inspection-config`
｜ 风险排查 `/api/risk-inspection` ｜ 危险源评审 `/api/risk-review` ｜ 危险源变更 `/api/risk-change`
｜ 危险源地图 `/api/risk-map`

### 十、职业健康（6）
PPE物品 `/api/ppe` ｜ PPE发放 `/api/ppe-issue` ｜ 剂量计 `/api/dosimeter`
｜ 警示标识 `/api/warning-sign` ｜ 防护设施 `/api/protective-facility`
｜ 职业健康档案 `/api/occupational`（含职业健康体检结果 `/api/occupational-exam-result`）

### 十一、应急救援（4）
应急预案 `/api/emergency` ｜ 应急队伍 `/api/emergency-team` ｜ 应急物资 `/api/emergency-supplies`
｜ 应急演练计划 `/api/drill-plan`

### 十二、事故报告调查和处理（7）
事故报告 `/api/accident` ｜ 事故调查 `/api/accident-investigation` ｜ 事故沟通 `/api/accident-communication`
｜ 责任认定 `/api/accident-responsibility` ｜ 整改措施 `/api/accident-action`
｜ 事故档案 `/api/accident-archive` ｜ 未遂事故 `/api/near-miss`

### 十三、绩效评定和持续改进（4）
绩效评定 `/api/performance` ｜ 持续改进 `/api/improvement` ｜ 安全金字塔KPI `/api/safety-kpi`
｜ 绩效评价 `/api/performance-assessment`

### 十四、环境管理（6）
废水管理 `/api/wastewater-emission` ｜ 废气管理 `/api/exhaust-emission` ｜ 固废台账 `/api/solid-waste-record`
｜ 噪声监测 `/api/noise-monitoring` ｜ 土壤监测 `/api/soil-monitoring` ｜ 环保许可 `/api/env-permit`

### 系统管理（4）
组织机构 `/api/org` ｜ 用户管理 `/api/user` ｜ 角色管理 `/api/role` ｜ 系统参数 `/api/param`

### 个人工作台（2）
我的待办 `/api/todo` ｜ 消息通知 `/api/notification`

> 上表为前端菜单入口。后端另有 10 个明细端点不单独挂菜单（由对应主模块页承载）：
> `/api/drill-record`（演练记录）、`/api/drill-assessment`（演练评估）、`/api/objective-agreement`（目标责任状）
> `/api/plan`（安全规划表）、`/api/plan-feedback`（计划反馈）、`/api/certificate-standard`（证书标准）
> `/api/expenditure-record`（投入记录）、`/api/hazard-facility`（危险设施）、`/api/special-eq-inspection`（特检）
> `/api/violation-clause`（违章条款）、`/api/safety-org`（安全管理机构）

---

## 合规依据

| 领域 | 标准 / 法规 |
|---|---|
| 安全生产标准化主标尺 | 《有色金属压力加工企业安全生产标准化评定标准》13 要素（46 项考评项目 / 239 条考评内容） |
| 企业安全生产标准化通用规范 | GB/T 33000-2025 |
| 工业互联网安全生产 | GB/T 46884.1-2025 |
| 标准化达标门槛 | 一级 ≥ 90 分；各要素 ≥ 80%（企业内部管控线，非评本原文条款） |
| 四项安全绩效 | 死亡率、重伤率、直接经济损失、新增职业病发病率 |
| 废水处理 | GB 21900 铝工业水污染物排放标准（重金属特征限值 / 在线监测） |
| 废气处理 | GB 21901 铝冶炼 / GB 16297 大气综合（含氟气体、颗粒物、VOCs） |
| 固废 / 危废 | GB 5085 危险废物鉴别 + 转移联单 + 承运 / 处置单位资质 |
| 噪声 | GB 12348 工业企业厂界环境噪声排放标准（1/2/3/4a 类功能区） |
| 土壤 | GB 36600 土壤环境质量标准（用地分类 + 重金属 / VOCs 因子） |
| 排污许可 | 《排污许可分类管理名录》重点 / 简化 / 登记三级管理 |

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3.5 + Vite 8 + Element Plus 2.14 + Pinia + ECharts 6 |
| 后端 | Node 20 + Express 4.19 + Prisma 5 |
| 数据库 | PostgreSQL（生产，Render 托管）/ SQLite（本地开发） |
| 认证 | JWT Bearer Token |
| 部署 | Render Blueprint（render.yaml）/ Docker Compose（内网） |

## 系统架构

```
┌──────────────────────────────────────────────────────────┐
│  前端  Vue 3 + Vite + Element Plus                        │
│  95 个视图 · CrudPage 配置驱动组件（93 模块零重复模板）    │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTP + JWT Bearer
┌──────────────────────────▼───────────────────────────────┐
│  后端  Node 20 + Express                                  │
│  107 条 /api 端点 · crud() 工厂 · JWT 认证 · 组织级隔离   │
└──────────────────────────┬───────────────────────────────┘
                           │ Prisma ORM
┌──────────────────────────▼───────────────────────────────┐
│  数据库  PostgreSQL（schema.prisma 109 模型 / 1824 行）   │
└──────────────────────────────────────────────────────────┘
```

---

## 快速开始

### 本地开发

```bash
# 后端
cd backend
npm ci
npx prisma generate
npx prisma db push      # 建表
npx prisma db seed      # 种子数据：8 组织 + 4 角色 + 3 用户
npm run dev             # :3001

# 前端
cd frontend
npm ci
npm run dev             # :3000
```

> `schema.prisma` 的 `provider` 为 `postgresql`。本地无 PostgreSQL 时，可临时改回
> `provider = "sqlite"` + `DATABASE_URL="file:./dev.db"` 用单文件开发。
> 仓库内 `schema.sqlite.prisma` / `schema.mysql.prisma` / `schema.postgresql.prisma`
> 为三套 schema 存档，切换前请先合并业务模型改动。

### Render 一键部署（生产）

仓库已含 `render.yaml` Blueprint，在 Render 点 **Deploy** 即自动创建
PostgreSQL（basic-256mb）+ 后端容器 + 前端 Nginx 容器；后端启动时自动 `prisma db push` 并执行 seed。

### 内网 Docker 部署

```bash
docker compose up -d --build
# 前端 http://localhost:80   后端 :3001
```

> **注意**：`docker/.env` 仍是 SQLite 连接串（`file:/app/prisma/dev.db`），而 `schema.prisma`
> 的 `provider` 已切为 `postgresql`。按 PostgreSQL 部署时必须同步修改 `DATABASE_URL`。

---

## API 规范

### 统一响应

```json
{"code": 200, "message": "ok", "data": {}}
```

### 通用查询参数

| 参数 | 说明 | 示例 |
|---|---|---|
| `page` / `pageSize` | 分页（默认 1 / 20） | `?page=1&pageSize=20` |
| `<字段名>` | 模糊搜索（`contains`） | `?name=安全帽` |
| `<字段名>` | 精确筛选，支持逗号多值（转 Prisma `in`） | `?status=active,closed` |
| `orgId` / `userId` | 组织 / 用户隔离筛选 | `?orgId=cml2xxx` |

> 各字段是否可筛由对应路由 `crud()` 的 `filters`（模糊）与 `exact`（精确）声明决定，
> 见 `backend/src/routes/*.js`。

### CRUD 五接口

`POST /api/<entity>` · `GET /api/<entity>` · `GET /api/<entity>/:id` · `PUT /api/<entity>/:id` · `DELETE /api/<entity>/:id`

所有业务实体由 `crud('ModelName')` 工厂统一生成，内建三项处理：
- **orgId 自动注入**：前端未传时取当前用户 orgId，未绑定组织则回退首个组织
- **字段白名单**：`onlyKnownFields` 过滤模型外字段，规避 Prisma 400
- **日期规范化**：`YYYY-MM-DD` → ISO-8601，空值 → `null`

### 特殊端点

| 端点 | 说明 |
|---|---|
| `POST /api/auth/login` | 登录，返回 `data.token` |
| `GET /api/auth/me` | 当前用户（含组织 / 角色） |
| `/api/dashboard/*` | 仪表盘聚合统计 |
| `POST /api/upload` | 文件上传（multer） |

---

## 数据库模型（109 个）

`backend/prisma/schema.prisma`，1824 行

| 业务域 | 模型 |
|---|---|
| 系统管理 | Organization, User, Role, Authorization, SystemParameter |
| 目标管理 | SafetyPlan, AnnualObjective, ObjectiveResponsibilityAgreement, AnnualPlan, PlanFeedback |
| 组织构架与职责 | SafetyCommittee, SafetyCommitteeMember, SafetyMeeting, SafetyManagementOrg, ResponsibilitySystem, ResponsibilityFeedback |
| 安全生产投入 | SafetyExpenditurePlan, SafetyExpenditureRecord |
| 制度化管理 | LegalRegulation, InternalRegulation, ComplianceAssessment |
| 教育培训 | SafetyCertificate, CertificateStandard, SafetyCourse, UserCourse, ExamQuestion, Exam, ExamRecord, SafetyTraining, Mentor |
| 生产设备设施 | Equipment, EquipmentMaintenance, EquipmentInspection, Chemical, HazardFacility, SpecialEquipment, SpecialEquipmentInspection, FireZone, FireEquipment, FirePatrol, FirePatrolPlan |
| 作业安全 | RiskFactor, SafetyObservation, Contractor, ContractorApproval, ContractorBlacklist, ChangeRequest, WorkPermit, WorkSafetyCheck, DeepCastMonitor |
| 危险源监控 | WorkUnit, RiskControlList, RiskChange, RiskReview, RiskMap, RiskInspectionConfig, RiskInspection |
| 隐患排查治理 | InspectionPlan, Hazard, HazardReward, ViolationClause, Violation, MajorHazard, SafetyInspection, HazardRemediationEvaluation |
| 职业健康 | OccupationalHazardPosition, OccupationalExposurePerson, OccupationalExamPlan, OccupationalExamResult, ProtectiveFacility, DosimeterRecord, PPEItem, PPEIssue, WarningSign |
| 应急管理 | EmergencyPlan, DrillPlan, DrillRecord, DrillAssessment, EmergencyTeam, EmergencySupplies |
| 事故调查和处理 | AccidentReport, AccidentInvestigation, AccidentActionPlan, AccidentCommunication, AccidentResponsibility, AccidentArchive |
| 绩效评定和持续改进 | PerformanceReview, PerformanceAssessment, SafetyKpi, ContinuousImprovement, NearMiss |
| 个人工作台 | TodoItem, Notification |
| GB/T 33000-2025 领导作用 | SafetyLeadership, LeadershipEvaluation |
| GB/T 33000-2025 基础保障 | TechnologyProtection |
| GB/T 33000-2025 策划 | SafetyPhilosophy, SafetyCommunication |
| GB/T 33000-2025 人员管理 | PersonnelEntry, UnsafeBehavior |
| GB/T 33000-2025 现场管理 | AbnormalHandling |
| GB/T 46884.1-2025 工业互联网 | WorkBehaviorMonitoring |
| **十四、环境管理** | WastewaterEmission, ExhaustEmission, SolidWasteRecord, NoiseMonitoring, SoilMonitoring, EnvPermit |

---

## 种子数据

| 类型 | 数量 | 内容 |
|---|---|---|
| 组织机构 | 8 | 永杰集团 → 运营中心 → 昆山工厂 →（安保部 / 熔铸车间 / 冷轧车间 / 热轧车间 / 仓储物流） |
| 角色 | 4 | 系统管理员、安保经理、安保工程师、员工 |
| 用户 | 3 | `admin` / `fanhaobin` / `zhangsan`，密码均 `admin123` |
| 系统参数 | 1 | 系统名称 |

## 环境变量（backend/.env）

```env
DATABASE_URL="postgresql://user:pass@host:5432/ehs"    # 生产必须 PostgreSQL
JWT_SECRET="***"               # 生产务必更换
JWT_EXPIRES_IN="7d"
PORT=3001
UPLOAD_DIR="./uploads"
ALLOWED_ORIGINS="https://ehs-frontend.onrender.com"    # CORS 白名单，逗号分隔
```

---

## 项目结构

```
EHS智能系统/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # 109 模型（provider: postgresql）
│   │   ├── seed.js                # 种子数据
│   │   ├── schema.sqlite.prisma   # 历史多库 schema 存档
│   │   ├── schema.mysql.prisma
│   │   ├── schema.postgresql.prisma
│   │   └── dev.db                 # SQLite 开发库
│   ├── src/
│   │   ├── index.js               # 入口：107 条路由 + 启动自动 db push + seed
│   │   ├── utils/common.js        # PrismaClient / auth / crud 工厂 / 数据规范化
│   │   └── routes/                # 107 个路由（auth、dashboard、upload 为独立实现）
│   ├── Dockerfile                 # node:20-alpine + OpenSSL
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── main.js                # 全局注册 Element Plus + 全部图标
│   │   ├── api/index.js           # axios 封装（baseURL: VITE_API_BASE_URL）
│   │   ├── router/index.js        # 96 条路由
│   │   ├── stores/user.js         # Pinia 用户 store
│   │   ├── layouts/MainLayout.vue # 侧边栏 menuGroups（硬编码，新增模块须同步改此文件）
│   │   ├── components/CrudPage.vue# 配置驱动通用组件：搜索+表格+表单+详情
│   │   └── views/                 # 95 个视图，按要素分子目录
│   ├── vite.config.js
│   └── Dockerfile                 # 多阶段：Vite 构建 → nginx:alpine
├── docker/                        # nginx.conf + .env
├── docker-compose.yml
├── render.yaml                    # Render Blueprint 一键部署
└── README.md
```

---

## 开发统计

| 指标 | 数值 |
|---|---|
| 功能模块大类 | 14（13 要素 + 环境管理） |
| 前端菜单入口 | 93 项子模块（+ 个人工作台 2 项） |
| 前端视图页面 | 95 |
| 前端路由条目 | 96 |
| Prisma 数据模型 | 109 |
| Prisma schema | 1824 行 |
| 后端路由文件 | 107 |
| `/api` 端点注册 | 107 |
| CrudPage 复用 | 1 个组件覆盖 93 个模块 |
