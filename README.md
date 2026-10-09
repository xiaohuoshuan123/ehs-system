# 永杰集团智慧安全管理系统 (EHS)

永杰新材昆山工厂安全生产管理系统，覆盖目标管理、教育培训、设备设施、作业安全、危险源、隐患治理、职业健康、应急管理、事故管理、绩效评定等15个一级模块。

---

## 技术栈

| 层 | 技术 | 版本 |
|---|---|---|
| 前端 | Vue 3 + Vite + Element Plus + Pinia + ECharts | Vue 3.5 / Vite 8 / Element Plus 2.9 |
| 后端 | Node.js + Express + Prisma ORM | Node 18+ / Express 4 / Prisma 5 |
| 数据库 | SQLite (开发) / MySQL (生产可切换) | SQLite 3 |
| 认证 | JWT (JWT Token + Bearer) | jsonwebtoken |
| 部署 | Docker + Docker Compose | Docker 24+ |

## 系统架构

```
┌─────────────────────────────────────────────────┐
│                  前端 (Vue 3 + Vite)              │
│  74个视图 · 15模块 · CrudPage通用组件              │
│  Vite代理: /api → localhost:3001                 │
└───────────────────────┬─────────────────────────┘
                        │ HTTP + JWT Bearer
┌───────────────────────▼─────────────────────────┐
│              后端 (Node.js + Express)              │
│  86个CRUD路由 · crud()工厂 · JWT认证              │
│  端口: 3001                                      │
└───────────────────────┬─────────────────────────┘
                        │ Prisma ORM
┌───────────────────────▼─────────────────────────┐
│              数据库 (SQLite / MySQL)               │
│  Prisma schema: 86个模型, 1352行                  │
└─────────────────────────────────────────────────┘
```

## 快速开始

### 1. 环境准备

```bash
# 要求: Node.js 18+, npm 9+, Docker 24+ (可选)
node -v   # v18+
npm -v    # v9+
```

### 2. 后端启动

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed          # 种子数据: 8组织机构 + 4角色 + 3用户
npm run dev                 # 端口 3001
```

### 3. 前端启动

```bash
cd frontend
npm install
npm run dev                 # 端口 3000
```

### 4. 访问系统

- 前端: http://localhost:3000
- 后端API: http://localhost:3001/api/health
- 默认账号: `admin` / `admin123`

### 5. Docker部署

```bash
docker compose up -d --build
# 前端: http://localhost:80
# 后端: http://localhost:3001
```

---

## 功能模块 (15个一级模块)

### 1. 目标管理
- 安全规划 (`/api/plan`)
- 年度目标 (`/api/objective`)
- 年度计划 (`/api/annual-plan`)
- 目标责任状 (`/api/objective-agreement`)
- 计划反馈 (`/api/plan-feedback`)

### 2. 组织构架
- 安委会管理 (`/api/committee`)
- 安全会议 (`/api/safety-meeting`)
- 责任制 (`/api/responsibility`)
- 安全组织机构 (`/api/safety-org`)

### 3. 安全生产投入
- 安全投入 (`/api/expenditure`)
- 投入记录 (`/api/expenditure-record`)

### 4. 制度化管理
- 法律法规 (`/api/regulation`)
- 规章制度 (`/api/internal-regulation`)
- 合规评估 (`/api/compliance`)

### 5. 教育培训
- 安全证书 (`/api/certificate`)
- 安全课程 (`/api/course`)
- 题库管理 (`/api/exam-question`)
- 考试管理 (`/api/exam`)
- 考试记录 (`/api/exam-record`)
- 培训记录 (`/api/training`)
- 课程进度 (`/api/user-course`)
- 师带徒 (`/api/mentor`)
- 证书标准 (`/api/certificate-standard`)

### 6. 生产设备设施
- 设备管理 (`/api/equipment`)
- 设备检修 (`/api/equipment-maintenance`)
- 设备点检 (`/api/equipment-inspection`)
- 化学品 (`/api/chemical`)
- 特种设备 (`/api/special-eq`)
- 特种设备点检 (`/api/special-eq-inspection`)
- 消防区域 (`/api/fire-zone`)
- 消防器材 (`/api/fire-equipment`)
- 防火巡查计划 (`/api/fire-patrol-plan`)
- 防火巡查 (`/api/fire-patrol`)
- 危险设施 (`/api/hazard-facility`)

### 7. 作业安全
- 风险因素 (`/api/risk-factor`)
- 安全观察 (`/api/observation`)
- 安全检查 (`/api/work-safety-check`)
- 作业许可 (`/api/work-permit`)
- 变更管理 (`/api/change-request`)
- 承包商 (`/api/contractor`)
- 承包商审批 (`/api/contractor-approval`)
- 承包商黑名单 (`/api/contractor-blacklist`)
- 深井灌注监测 (`/api/deep-cast-monitor`)

### 8. 危险源管理
- 危险源识别 (`/api/risk-control`)
- 风险排查项配置 (`/api/risk-inspection-config`)
- 作业单元 (`/api/work-unit`)
- 危险源评审 (`/api/risk-review`)
- 危险源变更 (`/api/risk-change`)
- 风险排查 (`/api/risk-inspection`)
- 危险源地图 (`/api/risk-map`)

### 9. 隐患排查治理
- 隐患排查 (`/api/hazard`)
- 排查计划 (`/api/inspection-plan`)
- 隐患奖励 (`/api/hazard-reward`)
- 违章管理 (`/api/violation`)
- 安全积分 (`/api/safety-score`)

### 10. 职业健康
- PPE物品目录 (`/api/ppe`)
- PPE发放记录 (`/api/ppe-issue`)
- 剂量计 (`/api/dosimeter`)
- 警示标识 (`/api/warning-sign`)
- 防护设施 (`/api/protective-facility`)
- 职业健康档案 (`/api/occupational`)

### 11. 应急管理
- 应急预案 (`/api/emergency`)
- 应急队伍 (`/api/emergency-team`)
- 应急物资 (`/api/emergency-supplies`)
- 演练计划 (`/api/drill-plan`)
- 演练记录 (`/api/drill-record`)
- 演练评估 (`/api/drill-assessment`)

### 12. 事故管理
- 事故报告 (`/api/accident`)
- 事故调查 (`/api/accident-investigation`)
- 事故沟通 (`/api/accident-communication`)
- 责任认定 (`/api/accident-responsibility`)
- 整改措施 (`/api/accident-action`)
- 事故档案 (`/api/accident-archive`)

### 13. 绩效改进
- 绩效评定 (`/api/performance`)
- 持续改进 (`/api/improvement`)

### 14. 系统管理
- 组织机构 (`/api/org`)
- 用户管理 (`/api/user`)
- 角色管理 (`/api/role`)
- 系统参数 (`/api/param`)

### 15. 个人工作台
- 我的待办 (`/api/todo`)
- 消息通知 (`/api/notification`)

---

## API 接口规范

### 认证

```bash
# 登录
POST /api/auth/login
Content-Type: application/json
{"username":"admin","password":"admin123"}
→ {"code":200,"data":{"token":"***","user":{...}}}

# 获取当前用户
GET /api/auth/me
Authorization: Bearer <token>
```

### CRUD 通用模式

每个业务实体均提供标准CRUD接口：

```bash
# 新增
POST /api/<entity>
Content-Type: application/json
Authorization: Bearer <token>

# 查询列表 (分页)
GET /api/<entity>?page=1&pageSize=20
Authorization: Bearer <token>

# 获取详情
GET /api/<entity>/<id>
Authorization: Bearer <token>

# 更新
PUT /api/<entity>/<id>
Content-Type: application/json
Authorization: Bearer <token>

# 删除
DELETE /api/<entity>/<id>
Authorization: Bearer <token>
```

### 通用查询参数

| 参数 | 说明 | 示例 |
|------|------|------|
| page | 页码 | 1 |
| pageSize | 每页条数 | 20 |
| search | 关键词搜索 | 安全帽 |
| status | 状态筛选 | active |
| orgId | 组织机构筛选 | 1 |

---

## 数据库模型 (86个)

Prisma schema: `backend/prisma/schema.prisma` (1352行)

```
目标管理:  SafetyPlan, Objective, ObjectiveAgreement, AnnualPlan, PlanFeedback
组织构架:  Organization, Committee, SafetyMeeting, Responsibility, SafetyOrg
安全投入:  Expenditure, ExpenditureRecord
制度化管理: Regulation, InternalRegulation, Compliance
教育培训:  Certificate, CertificateStandard, Course, ExamQuestion, Exam, ExamRecord,
           Training, UserCourse, Mentor
设备设施:  Equipment, EquipmentMaintenance, EquipmentInspection, Chemical,
           HazardFacility, SpecialEquipment, SpecialEquipmentInspection,
           FireZone, FireEquipment, FirePatrol, FirePatrolPlan
作业安全:  RiskFactor, Observation, WorkSafetyCheck, WorkPermit, ChangeRequest,
           Contractor, ContractorApproval, ContractorBlacklist, DeepCastMonitor
危险源:    RiskControl, RiskInspectionConfig, WorkUnit, RiskReview, RiskChange,
           RiskInspection, RiskMap
隐患治理:  Hazard, InspectionPlan, HazardReward, Violation, SafetyScore
职业健康:  PPEItem, PPEIssue, Dosimeter, WarningSign, ProtectiveFacility, Occupational
应急管理:  Emergency, EmergencyTeam, EmergencySupplies, DrillPlan, DrillRecord, DrillAssessment
事故管理:  Accident, AccidentInvestigation, AccidentCommunication,
           AccidentResponsibility, AccidentAction, AccidentArchive
绩效改进:  Performance, Improvement
系统管理:  User, Role, Authorization, Parameter, Log, Todo, Notification
基础设施:  File
```

---

## 项目结构

```
EHS智能系统/
├── backend/                        # 后端
│   ├── prisma/
│   │   ├── schema.prisma           # Prisma schema (86模型, 1352行)
│   │   ├── seed.js                 # 种子数据
│   │   └── dev.db                  # SQLite数据库
│   ├── src/
│   │   ├── index.js                # 应用入口 (86路由注册)
│   │   ├── utils/
│   │   │   └── common.js           # 公共工具 (PrismaClient+auth+crud工厂)
│   │   └── routes/                 # 86个路由文件
│   │       ├── auth.js             # 认证 (完整实现)
│   │       ├── dashboard.js        # 仪表盘统计 (完整实现)
│   │       ├── upload.js           # 文件上传 (multer)
│   │       └── *.js                # 83个crud工厂调用
│   ├── uploads/                    # 上传文件目录
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── frontend/                       # 前端
│   ├── src/
│   │   ├── main.js                 # 入口
│   │   ├── App.vue                 # 根组件
│   │   ├── api/
│   │   │   └── index.js            # axios封装 (baseURL: /api)
│   │   ├── router/
│   │   │   └── index.js            # 75条路由
│   │   ├── stores/
│   │   │   └── user.js             # Pinia用户store
│   │   ├── layouts/
│   │   │   └── MainLayout.vue      # 主布局 (侧边栏+顶栏+内容区)
│   │   ├── components/
│   │   │   └── CrudPage.vue        # 通用CRUD组件 (搜索+表格+表单+详情)
│   │   ├── views/                  # 74个视图页面
│   │   │   ├── Dashboard.vue       # 仪表盘
│   │   │   ├── Login.vue           # 登录
│   │   │   ├── target/             # 目标管理 (3)
│   │   │   ├── orgStructure/       # 组织构架 (3)
│   │   │   ├── expenditure/        # 安全投入 (1)
│   │   │   ├── regulation/         # 制度化管理 (3)
│   │   │   ├── training/           # 教育培训 (8)
│   │   │   ├── equipment/          # 设备设施 (10)
│   │   │   ├── workSafety/         # 作业安全 (9)
│   │   │   ├── riskControl/        # 危险源 (7)
│   │   │   ├── hazard/             # 隐患治理 (5)
│   │   │   ├── health/             # 职业健康 (6)
│   │   │   ├── emergency/          # 应急管理 (4)
│   │   │   ├── accident/           # 事故管理 (6)
│   │   │   ├── performance/        # 绩效改进 (2)
│   │   │   ├── system/             # 系统管理 (4)
│   │   │   └── profile/            # 个人工作台 (2)
│   │   └── assets/
│   │       └── main.css            # 全局样式
│   ├── dist/                       # 构建产物 (78个JS模块)
│   ├── vite.config.js              # Vite配置 (proxy: /api→3001)
│   └── Dockerfile
├── docker/                         # Docker配置
│   ├── nginx.conf                  # Nginx反向代理
│   └── .env                        # 环境变量
├── docker-compose.yml              # Docker编排
├── .dockerignore
└── README.md
```

---

## 种子数据

| 类型 | 数量 | 说明 |
|------|------|------|
| 组织机构 | 8 | 永杰集团→运营中心→昆山工厂→(安全/生产/设备/人力/行政) |
| 角色 | 4 | 管理员、安保经理、安保工程师、员工 |
| 用户 | 3 | admin/admin123, fanhaobin/admin123, zhangsan/admin123 |
| 系统参数 | 1 | 系统名称 |

---

## 环境变量 (backend/.env)

```env
DATABASE_URL="file:./dev.db"           # SQLite路径 (生产改mysql://)
JWT_SECRET="ehs-secret-2024"           # JWT密钥 (生产务必更换)
JWT_EXPIRES_IN="7d"                    # Token有效期
PORT=3001                              # 后端端口
UPLOAD_DIR="./uploads"                 # 上传目录
```

---

## 部署说明

### 内网服务器部署

```bash
# 1. 同步代码
scp -r EHS智能系统/ user@server:/opt/ehs/

# 2. 修改.env (数据库/密钥/端口)

# 3. Docker部署
cd /opt/ehs
docker compose up -d --build

# 4. Nginx反向代理 (可选)
server {
    listen 80;
    server_name ehs.yongjie.local;
    location / {
        proxy_pass http://frontend:80;
    }
    location /api {
        proxy_pass http://backend:3001;
    }
}
```

### 切换MySQL

1. 修改 `backend/.env`: `DATABASE_URL="mysql://user:pass@host:3306/ehs"`
2. 修改 `schema.prisma`: `provider = "mysql"`
3. 执行 `npx prisma migrate dev`

---

## 开发统计

| 指标 | 数值 |
|------|------|
| 一级模块 | 15 |
| 数据库模型 | 86 |
| 后端路由文件 | 86 |
| 前端视图页面 | 74 |
| 前端路由条目 | 75 |
| Prisma schema | 1352行 |
| 构建产物(JS模块) | 78 |
| CrudPage组件 | 1 (配置驱动, 复用74个视图) |

<!-- Deploy trigger: 2026-10-09 16:25:02 -->
