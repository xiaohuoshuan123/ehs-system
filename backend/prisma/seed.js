// 永杰集团智慧安全管理系统 - 种子数据
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 初始化种子数据...');

  // 创建组织机构
  const group = await prisma.organization.create({
    data: { name: '永杰集团', code: 'YJGROUP', level: 1 }
  });

  const opsCenter = await prisma.organization.create({
    data: { name: '运营中心', code: 'OPERATIONS', level: 2, parentId: group.id }
  });

  const kunshan = await prisma.organization.create({
    data: { name: '昆山工厂', code: 'KUNSHAN', level: 3, parentId: opsCenter.id }
  });

  const departments = [
    { name: '安保部', code: 'KUNSHAN-SEC', level: 4 },
    { name: '熔铸车间', code: 'KUNSHAN-CAST', level: 4 },
    { name: '冷轧车间', code: 'KUNSHAN-ROLL', level: 4 },
    { name: '热轧车间', code: 'KUNSHAN-HOTROLL', level: 4 },
    { name: '仓储物流', code: 'KUNSHAN-LOG', level: 4 },
  ];

  for (const dept of departments) {
    await prisma.organization.create({
      data: { ...dept, parentId: kunshan.id }
    });
  }

  // 创建角色
  const adminRole = await prisma.role.create({
    data: { name: '系统管理员', code: 'ADMIN', description: '系统管理员', permissions: '["*"]' }
  });

  const secManager = await prisma.role.create({
    data: { name: '安保经理', code: 'SEC_MANAGER', description: '安保部经理', permissions: '["org:read","user:read","org:write","user:write","plan:all","objective:all","annualPlan:all","committee:all","responsibility:all","expenditure:all","regulation:all","compliance:all","certificate:all","course:all","exam:all","training:all","equipment:all","chemical:all","specialEq:all","fire:all","risk:all","hazard:all","violation:all","occupational:all","emergency:all","accident:all","performance:all","dashboard:read"]' }
  });

  const secEngineer = await prisma.role.create({
    data: { name: '安保工程师', code: 'SEC_ENGINEER', description: '安保工程师', permissions: '["plan:read","objective:read","annualPlan:read","committee:read","responsibility:read","expenditure:read","regulation:read","compliance:read","certificate:read","course:read","exam:read","training:read","equipment:read","chemical:read","specialEq:read","fire:read","risk:read","hazard:read","violation:read","occupational:read","emergency:read","accident:read","performance:read","dashboard:read"]' }
  });

  const employee = await prisma.role.create({
    data: { name: '员工', code: 'EMPLOYEE', description: '普通员工', permissions: '["course:read","exam:read","hazard:read","hazard:create","todo:read","notification:read","dashboard:read","ppe:read","ppe:create"]' }
  });

  // 创建管理员账号
  const hashedPw = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPw,
      realName: '系统管理员',
      employeeNo: 'YJ001',
      email: 'admin@yongjiexc.com',
      phone: '13800000001',
      orgId: group.id,
      roleId: adminRole.id
    }
  });

  // 创建安保经理账号
  await prisma.user.create({
    data: {
      username: 'fanhaobin',
      password: hashedPw,
      realName: '范浩斌',
      employeeNo: 'YJ002',
      email: 'haobin.fan@yongjiexc.com',
      phone: '13800000002',
      gender: '男',
      orgId: kunshan.id,
      roleId: secManager.id
    }
  });

  // 创建普通员工
  await prisma.user.create({
    data: {
      username: 'zhangsan',
      password: hashedPw,
      realName: '张三',
      employeeNo: 'YJ101',
      email: 'zhangsan@yongjiexc.com',
      phone: '13800000101',
      gender: '男',
      orgId: kunshan.id,
      roleId: employee.id
    }
  });

  // 创建安全规划
  await prisma.safetyPlan.create({
    data: {
      orgId: kunshan.id,
      year: 2024,
      title: '永杰集团2024年度安全规划',
      status: 'published',
      uploadBy: '范浩斌',
      fileUrl: '/uploads/plans/2024-safety-plan.pdf'
    }
  });

  // 创建年度目标
  await prisma.annualObjective.create({
    data: {
      orgId: kunshan.id,
      year: 2024,
      level: 'company',
      title: '2024年度安全目标',
      indicators: JSON.stringify([
        { name: '工伤事故率', target: 0, unit: '%', actual: 0 },
        { name: '隐患整改率', target: 98, unit: '%', actual: 96.5 },
        { name: '安全培训覆盖率', target: 100, unit: '%', actual: 98.2 },
        { name: '特种设备检验合格率', target: 100, unit: '%', actual: 100 },
        { name: '应急演练完成率', target: 100, unit: '%', actual: 95 },
        { name: 'PPE发放合规率', target: 100, unit: '%', actual: 99.1 },
      ]),
      status: 'published',
      responsibleUser: '范浩斌'
    }
  });

  // 创建年度计划
  await prisma.annualPlan.create({
    data: {
      orgId: kunshan.id,
      year: 2024,
      title: '2024年度安全生产工作计划',
      content: '全面落实安全生产责任制，推进双重预防机制建设...',
      status: 'published',
      publishTime: new Date('2024-01-10')
    }
  });

  // 创建安委会
  await prisma.safetyCommittee.create({
    data: {
      orgId: kunshan.id,
      name: '昆山工厂安全生产委员会',
      description: '负责昆山工厂安全生产工作的统一领导和协调'
    }
  });

  // 创建系统参数
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
    await prisma.systemParameter.create({ data: p });
  }

  console.log('✅ 种子数据初始化完成！');
  console.log('   管理员: admin / admin123');
  console.log('   安保经理: fanhaobin / admin123');
  console.log('   普通员工: zhangsan / admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
