// ============================================================
// 永杰集团昆山工厂智慧安全管理系统 - 后端入口
// ============================================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// dotenv必须在设置PORT之前加载，覆盖环境变量
dotenv.config({ override: true });

const app = express();
// Render 会自动设置 PORT 环境变量，本地默认 3001
const PORT = process.env.PORT || 3001;

// CORS: 通过 ALLOWED_ORIGINS 环境变量控制白名单（逗号分隔）
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : [];
app.use(cors(allowedOrigins.length > 0
  ? { origin: allowedOrigins, credentials: true }
  : {}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 上传目录
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// ==================== API 路由 ====================
// 认证
app.use('/api/auth', require('./routes/auth'));

// 系统管理
app.use('/api/org', require('./routes/organization'));
app.use('/api/user', require('./routes/user'));
app.use('/api/role', require('./routes/role'));
app.use('/api/param', require('./routes/parameter'));

// 目标管理
app.use('/api/plan', require('./routes/safetyPlan'));
app.use('/api/objective', require('./routes/objective'));
app.use('/api/objective-agreement', require('./routes/responsibility_agreement'));
app.use('/api/annual-plan', require('./routes/annualPlan'));
app.use('/api/plan-feedback', require('./routes/planFeedback'));

// 组织构架与职责
app.use('/api/committee', require('./routes/committee'));
app.use('/api/safety-meeting', require('./routes/safetyMeeting'));
app.use('/api/safety-org', require('./routes/safetyOrg'));
app.use('/api/responsibility', require('./routes/responsibility'));

// 安全生产投入
app.use('/api/expenditure', require('./routes/expenditure'));
app.use('/api/expenditure-record', require('./routes/expenditureRecord'));

// 制度化管理
app.use('/api/regulation', require('./routes/regulation'));
app.use('/api/internal-regulation', require('./routes/internalRegulation'));
app.use('/api/compliance', require('./routes/compliance'));

// 教育培训
app.use('/api/certificate', require('./routes/certificate'));
app.use('/api/certificate-standard', require('./routes/certificateStandard'));
app.use('/api/course', require('./routes/course'));
app.use('/api/user-course', require('./routes/userCourse'));
app.use('/api/exam-question', require('./routes/examQuestion'));
app.use('/api/exam', require('./routes/exam'));
app.use('/api/exam-record', require('./routes/examRecord'));
app.use('/api/training', require('./routes/training'));
app.use('/api/mentor', require('./routes/mentor'));

// 生产设备设施
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/equipment-maintenance', require('./routes/equipmentMaintenance'));
app.use('/api/equipment-inspection', require('./routes/equipmentInspection'));
app.use('/api/chemical', require('./routes/chemical'));
app.use('/api/hazard-facility', require('./routes/hazardFacility'));
app.use('/api/special-eq', require('./routes/specialEquipment'));
app.use('/api/special-eq-inspection', require('./routes/specialEquipmentInspection'));
app.use('/api/fire-zone', require('./routes/fire'));
app.use('/api/fire-patrol-plan', require('./routes/firePatrolPlan'));
app.use('/api/fire-patrol', require('./routes/firePatrol'));
app.use('/api/fire-equipment', require('./routes/fireEquipment'));

// 作业安全
app.use('/api/risk-factor', require('./routes/riskFactor'));
app.use('/api/observation', require('./routes/observation'));
app.use('/api/contractor', require('./routes/contractor'));
app.use('/api/contractor-approval', require('./routes/contractorApproval'));
app.use('/api/contractor-blacklist', require('./routes/contractorBlacklist'));
app.use('/api/change', require('./routes/changeRequest'));
app.use('/api/permit', require('./routes/workPermit'));
app.use('/api/work-check', require('./routes/workSafetyCheck'));
app.use('/api/deep-cast-monitor', require('./routes/deepCastMonitor'));

// 危险源监控
app.use('/api/work-unit', require('./routes/workUnit'));
app.use('/api/risk-control', require('./routes/riskControl'));
app.use('/api/risk-change', require('./routes/riskChange'));
app.use('/api/risk-review', require('./routes/riskReview'));
app.use('/api/risk-map', require('./routes/riskMap'));
app.use('/api/risk-inspection-config', require('./routes/riskInspectionConfig'));
app.use('/api/risk-inspection', require('./routes/riskInspection'));

// 隐患排查治理
app.use('/api/inspection-plan', require('./routes/inspectionPlan'));
app.use('/api/hazard', require('./routes/hazard'));
app.use('/api/hazard-reward', require('./routes/hazardReward'));
app.use('/api/violation-clause', require('./routes/violationClause'));
app.use('/api/violation', require('./routes/violation'));
app.use('/api/safety-score', require('./routes/safetyScore'));

// 职业健康
app.use('/api/occupational', require('./routes/occupational'));
app.use('/api/occupational-exam-result', require('./routes/occupationalExamResult'));
app.use('/api/protective-facility', require('./routes/protectiveFacility'));
app.use('/api/dosimeter', require('./routes/dosimeter'));
app.use('/api/warning-sign', require('./routes/warningSign'));
app.use('/api/ppe', require('./routes/ppe'));
app.use('/api/ppe-issue', require('./routes/ppeIssue'));

// 应急预案
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/drill-plan', require('./routes/drillPlan'));
app.use('/api/drill-record', require('./routes/drillRecord'));
app.use('/api/drill-assessment', require('./routes/drillAssessment'));
app.use('/api/emergency-team', require('./routes/emergencyTeam'));
app.use('/api/emergency-supplies', require('./routes/emergencySupplies'));

// 事故管理
app.use('/api/accident', require('./routes/accident'));
app.use('/api/accident-investigation', require('./routes/accidentInvestigation'));
app.use('/api/accident-action', require('./routes/accidentAction'));
app.use('/api/accident-communication', require('./routes/accidentCommunication'));
app.use('/api/accident-responsibility', require('./routes/accidentResponsibility'));
app.use('/api/accident-archive', require('./routes/accidentArchive'));

// 绩效评定
app.use('/api/performance', require('./routes/performance'));
app.use('/api/improvement', require('./routes/improvement'));

// 安全金字塔 KPI
app.use('/api/safety-kpi', require('./routes/safetyKpi'));

// ==================== GB/T 33000-2025 新增模块 ====================

// 领导作用 (第4章)
app.use('/api/leadership', require('./routes/leadership'));
app.use('/api/leadership-evaluation', require('./routes/leadershipEvaluation'));

// 基础保障 - 科技保障 (第5章)
app.use('/api/technology-protection', require('./routes/technologyProtection'));

// 策划 - 安全理念 & 信息沟通 (第6章)
app.use('/api/safety-philosophy', require('./routes/safetyPhilosophy'));
app.use('/api/safety-communication', require('./routes/safetyCommunication'));

// 隐患排查治理 - 重大事故隐患 (第8章)
app.use('/api/major-hazard', require('./routes/majorHazard'));

// 人员管理 - 人员准入 & 不安全行为 (第9章)
app.use('/api/personnel-entry', require('./routes/personnelEntry'));
app.use('/api/unsafe-behavior', require('./routes/unsafeBehavior'));

// 现场管理 - 异常处置 (第10章)
app.use('/api/abnormal-handling', require('./routes/abnormalHandling'));

// 检查评价 (第12章)
app.use('/api/safety-inspection', require('./routes/safetyInspection'));
app.use('/api/performance-assessment', require('./routes/performanceAssessment'));

// 持续改进 - 未遂事故 (第13章)
app.use('/api/near-miss', require('./routes/nearMiss'));

// ==================== GB/T 46884.1-2025 新增模块 ====================

// 作业行为管理 (AI视频监控)
app.use('/api/work-behavior', require('./routes/workBehavior'));

// 隐患治理成效评估
app.use('/api/hazard-evaluation', require('./routes/hazardEvaluation'));
// 九、危险源和环境因素 - 环境因素识别 (GB/T 24001-2016 条款 6.1.2)
app.use('/api/env-factor', require('./routes/envFactor'));
// ====== 十三、绩效评定 - 标准化自评打分 (13 类目/46 项目/1000 分制) ======
app.use('/api/self-assessment-item', require('./routes/selfAssessmentItem'));
// 标准化自评表提交记录 (自评人/时间/状态) + 评分点批量 upsert
app.use('/api/self-assessment', require('./routes/selfAssessment'));
// ====== 十四、环保管理 (14.1废水/14.2废气/14.3固废/14.4噪声/14.5土壤/14.6许可) ======
app.use('/api/wastewater-emission', require('./routes/wastewaterEmission'));
app.use('/api/exhaust-emission', require('./routes/exhaustEmission'));
app.use('/api/solid-waste-record', require('./routes/solidWasteRecord'));
app.use('/api/noise-monitoring', require('./routes/noiseMonitoring'));
app.use('/api/soil-monitoring', require('./routes/soilMonitoring'));
app.use('/api/env-permit', require('./routes/envPermit'));

// 个人工作台
app.use('/api/todo', require('./routes/todo'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 文件上传
app.use('/api/upload', require('./routes/upload'));

// 健康检查
// dbOk=true 表示本次启动时 prisma db push 成功(schema 与线上库一致);
// dbOk=false 说明迁移失败, 新表/新列的查询会 400, 需看容器日志定位原因。
app.get('/api/health', (req, res) => res.json({
  status: dbMigrationOk ? 'ok' : 'degraded',
  dbOk: dbMigrationOk,
  time: new Date().toISOString()
}));

// 错误处理
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ code: err.status || 500, message: err.message });
});

// 数据库诊断端点: 用 raw Prisma 查询线上库真实状态
// 用途: schema 变更不生效时, 无需本地 Postgres 复现即可定位
//  (1) 哪张表/列已存在  (2) db push 的真实 stderr
//   迁移状态: dbOk / dbMigrationErr
app.get('/api/_diag', async (req, res) => {
  const { prisma } = require('./utils/common');
  const out = { dbOk: dbMigrationOk, dbMigrationErr, checks: {} };
  try {
    // 直接查 information_schema, 不经 ORM, 反映数据库真实结构
    const q = async (sql) => await prisma.$queryRawUnsafe(sql);
    // 新表是否存在
    out.checks.selfAssessmentTable = !!(await q(
      "SELECT 1 FROM information_schema.tables WHERE table_name='SelfAssessment' LIMIT 1"));
    // 新增列是否存在
    out.checks.itemAssessorCols = await q(
      "SELECT column_name FROM information_schema.columns WHERE table_name='SelfAssessmentItem' AND column_name IN ('assessorId','assessorName')");
    // SelfAssessmentItem 全部列
    out.checks.itemCols = (await q(
      "SELECT column_name FROM information_schema.columns WHERE table_name='SelfAssessmentItem' ORDER BY ordinal_position")).map(r => r.column_name);
    // 唯一约束/索引
    out.checks.itemIndexes = await q(
      "SELECT indexname, indexdef FROM pg_indexes WHERE tablename='SelfAssessmentItem'");
    // 各年度评分点数
    out.checks.yearCounts = await q(
      "SELECT year, count(*)::int AS n FROM \"SelfAssessmentItem\" GROUP BY year ORDER BY year");
  } catch (e) {
    out.checks.error = String(e.message).substring(0, 800);
  }
  res.json(out);
});

// ============================================================
// 启动前自动迁移数据库
// dbMigrationOk/dbMigrationErr: health 端点据此报告迁移状态
// ============================================================
let dbMigrationOk = false;
let dbMigrationErr = '';

// ============================================================
// 启动流程: 先 app.listen 通过 Render health check, 再后台迁移
// 原因: Render 免费实例 health check 超时 ~60s, 而 db push(111 个模型)
// + seed(304 条) 冷启动可能远超 60s。若在启动阶段同步阻塞,
// Render 会判定不健康杀死容器 -> 迁移永远跑不完 -> dbOk 永远 false。
// ============================================================
async function migrateDB() {
  const { execSync } = require('child_process');
  // Docker: __dirname=/app/src, prisma 在 ./prisma/
  // 本地: __dirname=backend/src, prisma 在 ../prisma/
  let schemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
  }
  const seedPath = schemaPath.replace('schema.prisma', 'seed.js');

  console.log('🔧 [DB] 开始数据库迁移...');
  console.log(`   schema: ${schemaPath}`);
  console.log(`   DATABASE_URL: ${(process.env.DATABASE_URL || '').substring(0, 30)}...`);

  // 最多重试 6 次; db push 单次 120 秒
  // 注意: db push 只支持 --schema/--skip-generate/--accept-data-loss/--force-reset,
  // 没有 --allow-diff-in-production (那是 migrate 系参数)。此前误加该参数导致
  // prisma 直接报 "unknown or unexpected option" 退出, 迁移 6 次全部失败。
  // 不加 --accept-data-loss / --force-reset: 本次 schema 只新增 SelfAssessment 表,
  // 不改动已上线表的列和索引, db push 应为空操作, 无需任何数据丢失选项。
  // --force-reset 会 DROP 全库重建, 必须避免(会清空 SelfAssessmentItem 的 304 条)。
  for (let i = 1; i <= 6; i++) {
    try {
      console.log(`   第 ${i}/6 次尝试 prisma db push (超时 120s)...`);
      execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate`, {
        stdio: 'pipe',
        timeout: 120000
      });
      console.log('✅ [DB] schema 同步成功');

      // 执行种子数据 (自评表含 304 条评分点导入, 冷启动较慢, 给 150 秒)
      if (fs.existsSync(seedPath)) {
        console.log('   执行种子数据...');
        // stdio:'inherit' 实时透传日志; 用 'pipe' 会静默丢弃自评块的 console.error
        execSync(`node "${seedPath}"`, { stdio: 'inherit', timeout: 150000 });
        console.log('✅ [DB] 种子数据完成');
      }
      dbMigrationOk = true;
      console.log('✅ [DB] 迁移完成, 数据库就绪');
      return true;
    } catch (err) {
      // 完整输出 stderr + seed 的 stdout 尾部:
      // 自评块错误走 stderr 但自带 try/catch 不抛错, 需回显日志尾部定位
      const stderr = err.stderr ? err.stderr.toString() : '';
      const stdout = err.stdout ? err.stdout.toString() : '';
      dbMigrationErr = `第 ${i}/6 次失败 | stderr: ${stderr.substring(0, 800)}`;
      console.error(`❌ [DB] 第 ${i}/6 次失败:`);
      console.error(`   stderr: ${stderr.substring(0, 2500)}`);
      console.error(`   stdout(尾部): ${stdout.substring(Math.max(0, stdout.length - 1500))}`);
      if (i < 6) await new Promise(r => setTimeout(r, 10000));
    }
  }
  // 迁移失败不 exit: 带旧 schema 上线虽部分接口 400, 但已有数据可用,
  // 且避免 Render 反复重启容器导致整体不可用。失败原因已打印到日志。
  console.error(`❌ [EHS] 数据库迁移失败(服务继续运行, 新表/新列查询可能 400): ${dbMigrationErr}`);
  return false;
}

// 先启动服务: health check 立即可用, 迁移在后台进行
app.listen(PORT, () => {
  console.log(`🚀 [EHS] 后端服务已启动: http://localhost:${PORT}`);
  console.log(`📡 [EHS] API健康检查: http://localhost:${PORT}/api/health`);
  console.log(`   DB 迁移: 进行中 (完成后 dbOk 置 true)`);
});

// 后台迁移: 不阻塞监听, Render health check 不会超时杀容器
migrateDB().then(ok => {
  if (!ok) {
    console.error(`❌ [EHS] 数据库未就绪。db push 失败原因: ${dbMigrationErr}`);
  }
});
