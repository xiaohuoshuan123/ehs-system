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

// 个人工作台
app.use('/api/todo', require('./routes/todo'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 文件上传
app.use('/api/upload', require('./routes/upload'));

// 健康检查
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// 错误处理
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ code: err.status || 500, message: err.message });
});

// ============================================================
// 启动前自动迁移数据库（同步等待，确保表已创建）
// ============================================================
async function ensureDatabaseReady() {
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

  // 最多重试 8 次（40 秒）
  for (let i = 1; i <= 8; i++) {
    try {
      console.log(`   第 ${i}/8 次尝试 prisma db push...`);
      execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate`, {
        stdio: 'pipe',
        timeout: 30000
      });
      console.log('✅ [DB] schema 同步成功');

      // 执行种子数据
      if (fs.existsSync(seedPath)) {
        console.log('   执行种子数据...');
        execSync(`node "${seedPath}"`, { stdio: 'pipe', timeout: 30000 });
        console.log('✅ [DB] 种子数据完成');
      }
      return true;
    } catch (err) {
      const msg = err.stderr ? err.stderr.toString().substring(0, 200) : err.message;
      console.error(`⏳ [DB] 第 ${i}/8 次失败: ${msg}`);
      if (i < 8) await new Promise(r => setTimeout(r, 5000));
    }
  }
  console.error('❌ [DB] 迁移超时，数据库表可能未创建');
  return false;
}

// 启动服务
ensureDatabaseReady().finally(() => {
  app.listen(PORT, () => {
    console.log(`🚀 [EHS] 后端服务: http://localhost:${PORT}`);
    console.log(`📡 [EHS] API健康检查: http://localhost:${PORT}/api/health`);
  });
});
