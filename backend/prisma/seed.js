// 永杰集团智慧安全管理系统 - 种子数据
// 完全幂等: 每个数据块按唯一键/业务键去重, 二次部署不会因唯一约束违反而中止。
// 背景: 原实现所有基础数据用裸 create(), 二次部署在 organization.create() 处
//       抛唯一约束违反 -> .catch -> process.exit(1), 导致位于 main() 末尾的
//       标准化自评表块从未执行, 自评数据为空。
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// 数组分块 (Prisma createMany 有批量上限)
function chunks(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// 幂等创建: 按 where 存在则返回已有记录, 否则创建
async function ensureOne(m, where, data) {
  let r = await m.findFirst({ where });
  if (!r) r = await m.create({ data });
  return r;
}

async function main() {
  console.log('🌱 初始化种子数据...');

  // ===== 组织机构 (去重键: code) =====
  const group = await ensureOne(prisma.organization, { code: 'YJGROUP' },
    { name: '永杰集团', code: 'YJGROUP', level: 1 });

  const opsCenter = await ensureOne(prisma.organization, { code: 'OPERATIONS' },
    { name: '运营中心', code: 'OPERATIONS', level: 2, parentId: group.id });

  const kunshan = await ensureOne(prisma.organization, { code: 'KUNSHAN' },
    { name: '昆山工厂', code: 'KUNSHAN', level: 3, parentId: opsCenter.id });

  const departments = [
    { name: '安保部', code: 'KUNSHAN-SEC', level: 4 },
    { name: '熔铸车间', code: 'KUNSHAN-CAST', level: 4 },
    { name: '冷轧车间', code: 'KUNSHAN-ROLL', level: 4 },
    { name: '热轧车间', code: 'KUNSHAN-HOTROLL', level: 4 },
    { name: '仓储物流', code: 'KUNSHAN-LOG', level: 4 },
  ];
  for (const dept of departments) {
    await ensureOne(prisma.organization, { code: dept.code },
      { ...dept, parentId: kunshan.id });
  }

  // ===== 角色 (去重键: code) =====
  const adminRole = await ensureOne(prisma.role, { code: 'ADMIN' },
    { name: '系统管理员', code: 'ADMIN', description: '系统管理员', permissions: '["*"]' });

  const secManager = await ensureOne(prisma.role, { code: 'SEC_MANAGER' },
    { name: '安保经理', code: 'SEC_MANAGER', description: '安保部经理', permissions: '["org:read","user:read","org:write","user:write","plan:all","objective:all","annualPlan:all","committee:all","responsibility:all","expenditure:all","regulation:all","compliance:all","certificate:all","course:all","exam:all","training:all","equipment:all","chemical:all","specialEq:all","fire:all","risk:all","hazard:all","violation:all","occupational:all","emergency:all","accident:all","performance:all","dashboard:read"]' });

  await ensureOne(prisma.role, { code: 'SEC_ENGINEER' },
    { name: '安保工程师', code: 'SEC_ENGINEER', description: '安保工程师', permissions: '["plan:read","objective:read","annualPlan:read","committee:read","responsibility:read","expenditure:read","regulation:read","compliance:read","certificate:read","course:read","exam:read","training:read","equipment:read","chemical:read","specialEq:read","fire:read","risk:read","hazard:read","violation:read","occupational:read","emergency:read","accident:read","performance:read","dashboard:read"]' });

  const employee = await ensureOne(prisma.role, { code: 'EMPLOYEE' },
    { name: '员工', code: 'EMPLOYEE', description: '普通员工', permissions: '["course:read","exam:read","hazard:read","hazard:create","todo:read","notification:read","dashboard:read","ppe:read","ppe:create"]' });

  // ===== 用户 (去重键: username) =====
  const hashedPw = await bcrypt.hash('admin123', 10);
  await ensureOne(prisma.user, { username: 'admin' },
    { username: 'admin', password: hashedPw, realName: '系统管理员',
      employeeNo: 'YJ001', email: 'admin@yongjiexc.com', phone: '13800000001',
      orgId: group.id, roleId: adminRole.id });

  await ensureOne(prisma.user, { username: 'fanhaobin' },
    { username: 'fanhaobin', password: hashedPw, realName: '范浩斌',
      employeeNo: 'YJ002', email: 'haobin.fan@yongjiexc.com', phone: '13800000002',
      gender: '男', orgId: kunshan.id, roleId: secManager.id });

  await ensureOne(prisma.user, { username: 'zhangsan' },
    { username: 'zhangsan', password: hashedPw, realName: '张三',
      employeeNo: 'YJ101', email: 'zhangsan@yongjiexc.com', phone: '13800000101',
      gender: '男', orgId: kunshan.id, roleId: employee.id });

  // ===== 安全规划 (去重键: orgId+year) =====
  await ensureOne(prisma.safetyPlan, { orgId: kunshan.id, year: 2024 },
    { orgId: kunshan.id, year: 2024, title: '永杰集团2024年度安全规划',
      status: 'published', uploadBy: '范浩斌', fileUrl: '/uploads/plans/2024-safety-plan.pdf' });

  // ===== 年度目标 (去重键: orgId+year+level) =====
  await ensureOne(prisma.annualObjective, { orgId: kunshan.id, year: 2024, level: 'company' },
    { orgId: kunshan.id, year: 2024, level: 'company', title: '2024年度安全目标',
      indicators: JSON.stringify([
        { name: '工伤事故率', target: 0, unit: '%', actual: 0 },
        { name: '隐患整改率', target: 98, unit: '%', actual: 96.5 },
        { name: '安全培训覆盖率', target: 100, unit: '%', actual: 98.2 },
        { name: '特种设备检验合格率', target: 100, unit: '%', actual: 100 },
        { name: '应急演练完成率', target: 100, unit: '%', actual: 95 },
        { name: 'PPE发放合规率', target: 100, unit: '%', actual: 99.1 },
      ]),
      status: 'published', responsibleUser: '范浩斌' });

  // ===== 年度计划 (去重键: orgId+year+title) =====
  await ensureOne(prisma.annualPlan, { orgId: kunshan.id, year: 2024, title: '2024年度安全生产工作计划' },
    { orgId: kunshan.id, year: 2024, title: '2024年度安全生产工作计划',
      content: '全面落实安全生产责任制，推进双重预防机制建设...',
      status: 'published', publishTime: new Date('2024-01-10') });

  // ===== 安委会 (去重键: orgId+name) =====
  await ensureOne(prisma.safetyCommittee, { orgId: kunshan.id, name: '昆山工厂安全生产委员会' },
    { orgId: kunshan.id, name: '昆山工厂安全生产委员会',
      description: '负责昆山工厂安全生产工作的统一领导和协调' });

  // ===== 系统参数 (去重键: key) =====
  const params = [
    { module: 'hazard', category: '配置', key: 'hazard_major_days', value: '60', description: '重大隐患整改期限（天）' },
    { module: 'hazard', category: '配置', key: 'hazard_general_days', value: '30', description: '一般隐患整改期限（天）' },
    { module: 'certificate', category: '预警', key: 'cert_alert_90', value: '90', description: '证书90天预警' },
    { module: 'certificate', category: '预警', key: 'cert_alert_60', value: '60', description: '证书60天预警' },
    { module: 'certificate', category: '预警', key: 'cert_alert_30', value: '30', description: '证书30天预警' },
    { module: 'special_equipment', category: '预警', key: 'se_alert_60', value: '60', description: '特种设备60天预警' },
    { module: 'special_equipment', category: '预警', key: 'se_alert_30', value: '30', description: '特种设备30天预警' },
    { module: 'violation', category: '配置', key: 'violation_score_threshold', value: '12', description: '违章累计扣分处理阈值' },
    { module: 'accident', category: '配置', key: 'accident_report_hours', value: '24', description: '事故报告时限（小时）' },
  ];
  for (const p of params) {
    await ensureOne(prisma.systemParameter, { key: p.key }, p);
  }

  // ===== 标准化自评表 (13 类目/46 项目/1000 分制) =====
  // 数据来源: prisma/selfassessment_data.js (Arconic标准化自评表-2019.8.xlsx)
  // 幂等: 按 itemCode 唯一键插入, 存在性检查限定到本年度
  try {
    const data = require('./selfassessment_data');
    const exist = await prisma.selfAssessmentItem.count({ where: { year: data.year } });
    if (exist === 0) {
      const rows = data.scores.map(s => {
        // 不涉及项目 (actual=NA) 从评分点标记, 分值计入分母排除项
        const ex = data.excluded.find(e => e.contentNo && e.contentNo === s.contentNo);
        return {
          itemCode: s.itemCode, year: data.year, category: s.category,
          categoryNo: s.categoryNo, item: s.item, itemNo: s.itemNo,
          contentNo: s.contentNo, content: s.content, score: s.score,
          method: s.method, actual: s.actual,
          notApplicable: !!(ex || s.notApplicable),
          assessmentDesc: s.desc,
          // 不涉及原因只写 remark，不与扣分明细的 deductionReason 混用
          remark: ex ? ex.reason : '',
        };
      });
      for (const chunk of chunks(rows, 100)) {
        await prisma.selfAssessmentItem.createMany({ data: chunk });
      }
      // 扣分明细回填到对应评分点 (按 contentNo 匹配)
      // 不涉及行与扣分行无交集，两者不会互相覆盖
      for (const d of data.deductions) {
        if (!d.contentNo) continue;
        await prisma.selfAssessmentItem.updateMany({
          where: { contentNo: d.contentNo, year: data.year },
          data: {
            deductionReason: d.reason,
            measure: d.measure,
            completed: d.done,
            tracker: d.tracker,
          }
        });
      }
      console.log(`📋 标准化自评表导入: ${rows.length} 条评分点, ` +
        `${data.deductions.length} 条扣分明细, ${data.excluded.length} 条不涉及项目`);
      console.log(`   满分 ${data.totalScore}, ${data.year} 实际得分 ${data.actualScore}, ` +
        `标准化得分 ${(data.actualScore / (data.totalScore - data.excludedScore) * 100).toFixed(1)}`);
    } else {
      console.log(`⏭️  ${data.year} 年标准化自评表已存在 ${exist} 条, 跳过导入`);
    }
  } catch (e) {
    // 打印完整堆栈 (原实现只打印 e.message, 丢失了根因信息)
    console.error('⚠️  标准化自评表导入失败(不影响启动):', e.message);
    console.error(e.stack);
  }

  console.log('✅ 种子数据初始化完成！');
  console.log('   管理员: admin / admin123');
  console.log('   安保经理: fanhaobin / admin123');
  console.log('   普通员工: zhangsan / admin123');
}

main()
  .catch(e => { console.error('❌ 种子数据初始化失败:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
