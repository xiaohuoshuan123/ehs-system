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

// Prisma 5.22 起 DateTime 字段只接受完整 ISO-8601 或 Date 对象,
// 'YYYY-MM-DD' 会抛 "premature end of input: Expected ISO-8601 DateTime",
// 从而中断整个 seed。这里对 *Date / *Time 字段统一做一次规范化。
function normalizeDates(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && /(Date|Time|Deadline|At)$/.test(k)
        && /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/.test(v)) {
      const iso = v.length === 10
        ? `${v}T00:00:00.000Z`
        : (/[Zz]|[+-]\d{2}:?\d{2}$/.test(v) ? v : `${v}Z`);
      const d = new Date(iso);
      out[k] = isNaN(d.getTime()) ? v : d;
    } else {
      out[k] = v;
    }
  }
  return out;
}

// 幂等创建: 按 where 存在则返回已有记录, 否则创建
async function ensureOne(m, where, data) {
  let r = await m.findFirst({ where: normalizeDates(where) });
  if (!r) r = await m.create({ data: normalizeDates(data) });
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
      const rows = data.scores.map((s, idx) => {
        // 不涉及项目 (actual=NA) 从评分点标记, 分值计入分母排除项
        const ex = data.excluded.find(e => e.contentNo && e.contentNo === s.contentNo);
        return {
          orgId: kunshan.id,
          itemCode: s.itemCode, year: data.year, category: s.category,
          // itemNo 在 schema 是 String 类型, 但数据文件里是 number。
          // createMany 走 unnest() 批量插入, 对 String 列传 number 会严格校验失败,
          // 故显式转 String (create 单条会被 Prisma 容忍, createMany 不会)。
          categoryNo: s.categoryNo, item: s.item, itemNo: String(s.itemNo ?? ''),
          contentNo: s.contentNo, content: s.content, score: s.score,
          // idx = 原始 Excel 行序号, 续行(13-1-2 ~ 13-6-2)紧跟其父项 13.2.2,
          // 保存该顺序即可按正确次序显示, 不受 itemCode 字典序干扰
          seq: idx,
          method: s.method, actual: s.actual,
          notApplicable: !!(ex || s.notApplicable),
          assessmentDesc: ex && ex.reason ? `${s.desc || ''}（不涉及：${ex.reason}）` : s.desc,
        };
      });
      // 用 Promise.all 批量 create 而非 createMany:
      // createMany 走 unnest() 批量路径, 类型不匹配时可能静默失败;
      // create 对类型宽容且错误会显式抛出, 便于定位问题。
      // 按 25 条一批并行, 304 条约需数秒, 远低于 120 秒超时。
      const createRows = async (list) => {
        await Promise.all(list.map(r =>
          prisma.selfAssessmentItem.create({ data: r }).catch(e => {
            const firstLine = String(e.message || e).split('\n').map(t => t.trim()).find(Boolean) || '未知错误';
            console.error(`   ⚠️  itemCode=${r.itemCode} 插入失败: ${firstLine.substring(0, 200)}`);
            throw e;
          })
        ));
      };
      for (const chunk of chunks(rows, 25)) {
        await createRows(chunk);
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

    // ---- 行序号回填 (幂等, 每次启动都会跑) ----
    // seq 是后加的列: db push 给历史行填默认值 0, 而上面的导入块只在表为空时执行,
    // 故已存在的 2019 基线与历年度行必须由这里补上原表行序号, 否则排序退化。
    // 注意 itemCode 无前缀与有前缀两种形态:
    //   - 2019 基线由 seed 直接插入, itemCode 是裸名 "13.1.1-2"
    //   - 历年度由 /init 复制生成, 加了 "年份-" 前缀 "2026-13.1.1-2"
    // 两种都要试。幂等: 只更新 seq=0 的行, seq>0 视为已确定永不覆盖 (可重入)。
    const years = new Set([data.year]);
    (await prisma.selfAssessmentItem.findMany({ select: { year: true } }))
      .forEach(g => years.add(g.year));

    // 回填: 事务内批量执行, 避免逐条 updateMany 造成数百次往返 (Render 冷启动会超时)
    let fb = 0;
    await prisma.$transaction(async (tx) => {
      // 1) 一次查出所有待回填行 (seq=0)
      const zero = await tx.selfAssessmentItem.findMany({
        where: { year: { in: [...years] }, seq: 0 },
        select: { id: true, itemCode: true, year: true }
      });
      // 2) 源表 itemCode -> 行序号 (源数组下标即原始 Excel 行号)
      const srcSeq = new Map(data.scores.map((s, i) => [s.itemCode, i]));
      // 3) 按 (year, seq) 分桶, 每桶一次 updateMany
      const buckets = new Map();
      for (const row of zero) {
        const bare = row.itemCode.replace(/^\d{4}-/, '');   // 去掉 "年份-" 前缀
        const seq = srcSeq.get(bare);
        if (seq == null) continue;                          // 非考评模板行, 跳过
        const key = `${row.year}:${seq}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(row.id);
      }
      for (const [key, ids] of buckets) {
        const seq = parseInt(key.split(':')[1], 10);
        const r = await tx.selfAssessmentItem.updateMany({
          where: { id: { in: ids }, seq: 0 },
          data: { seq }
        });
        fb += r.count;
      }
    });
    console.log(fb > 0 ? `🔢 行序号回填: ${fb} 条` : `🔢 行序号已是最新, 无需回填`);
  } catch (e) {
    // 打印完整堆栈 (原实现只打印 e.message, 丢失了根因信息)
    console.error('⚠️  标准化自评表导入失败(不影响启动):', e.message);
    console.error(e.stack);
  }

  console.log('✅ 种子数据初始化完成!');
  console.log('   管理员: admin / admin123');
  console.log('   安保经理: fanhaobin / admin123');
  console.log('   普通员工: zhangsan / admin123');

  // ============================================================
  // 以下模块数据: 幂等(用唯一键去重), 二次运行不报错
  // ============================================================

  // 取昆山工厂 orgId 和各关键 user id 作为外键
  const kunshanOrg = await ensureOne(prisma.organization, { code: 'KUNSHAN' }, {});
  const adminUser  = await prisma.user.findUnique({ where: { username: 'admin' } });
  const fanUser    = await prisma.user.findUnique({ where: { username: 'fanhaobin' } });
  const zsUser     = await prisma.user.findUnique({ where: { username: 'zhangsan' } });
  const orgId = kunshanOrg.id;
  const fanId = fanUser?.id;

  // ── 五、教育培训 ───────────────────────────────────────────
  // SafetyCourse: id/orgId/title/description/courseType/isRequired/studyHours/status/publishBy
  await ensureOne(prisma.safetyCourse, { title: '新员工三级安全教育' }, {
    orgId, title: '新员工三级安全教育', courseType: 'offline',
    isRequired: true, studyHours: 24, status: 'published',
    publishBy: fanUser?.realName, description: '厂级、车间级、班组级三级安全培训',
  });
  await ensureOne(prisma.safetyCourse, { title: '特种作业人员安全培训' }, {
    orgId, title: '特种作业人员安全培训', courseType: 'offline',
    isRequired: true, studyHours: 48, status: 'published',
    publishBy: fanUser?.realName, description: '电工/焊工/高处作业等特种工复审培训',
  });
  await ensureOne(prisma.safetyCourse, { title: '危险化学品安全操作规程' }, {
    orgId, title: '危险化学品安全操作规程', courseType: 'offline',
    isRequired: true, studyHours: 8, status: 'published',
    publishBy: fanUser?.realName, description: '乳化液、液压油的储存与使用规范',
  });

  // ExamQuestion: id/orgId/category/type/content/options/answer/explanation/score
  await ensureOne(prisma.examQuestion, { content: '下列哪项是火灾报警电话？' }, {
    orgId, category: '消防安全', type: 'single',
    content: '下列哪项是火灾报警电话？',
    options: JSON.stringify(['A:119', 'B:120', 'C:110', 'D:122']),
    answer: 'A', explanation: '火灾报警电话为119，急救为120，匪警为110。', score: 2,
  });
  await ensureOne(prisma.examQuestion, { content: '进入生产现场必须佩戴哪些劳动防护用品？' }, {
    orgId, category: '劳动防护', type: 'multiple',
    content: '进入生产现场必须佩戴哪些劳动防护用品？',
    options: JSON.stringify(['A:安全帽', 'B:防护手套', 'C:安全鞋', 'D:太阳镜']),
    answer: 'ABC', explanation: '安全帽、防护手套、安全鞋为标配，太阳镜不属于劳动防护用品。', score: 3,
  });
  await ensureOne(prisma.examQuestion, { content: '发生触电事故时，首先应采取什么措施？' }, {
    orgId, category: '电气安全', type: 'single',
    content: '发生触电事故时，首先应采取什么措施？',
    options: JSON.stringify(['A:用手拉离触电者', 'B:立即切断电源', 'C:浇水降温', 'D:大声呼救']),
    answer: 'B', explanation: '发现触电事故时，首先应立即切断电源，再进行救援，严禁直接用手拉拽触电者。', score: 2,
  });
  await ensureOne(prisma.examQuestion, { content: '下列哪些属于高处作业的等级？' }, {
    orgId, category: '高处作业', type: 'multiple',
    content: '下列哪些属于高处作业的等级？',
    options: JSON.stringify(['A:2-5米为一级', 'B:5-15米为二级', 'C:15-30米为三级', 'D:30米以上为特级']),
    answer: 'ABCD', explanation: '根据GB/T 3608-2008《高处作业分级》，高处作业分为四个等级。', score: 3,
  });
  await ensureOne(prisma.examQuestion, { content: '危化品储存的基本要求有哪些？' }, {
    orgId, category: '危化品管理', type: 'multiple',
    content: '危化品储存的基本要求有哪些？',
    options: JSON.stringify(['A:分类存放', 'B:远离火源', 'C:配备灭火器材', 'D:标识清晰']),
    answer: 'ABCD', explanation: '危化品必须分类存放、远离火源、配备相应消防器材并张贴清晰标识。', score: 3,
  });

  // ── 六、生产设备设施 ───────────────────────────────────────
  // Equipment: id/orgId/name/code/type/category/model/manufacturer/status/responsibleDept/remark
  await ensureOne(prisma.equipment, { code: 'EQ-A001' }, {
    orgId, name: '铜带轧机生产线#1', code: 'EQ-A001',
    type: '生产设备', category: '轧制设备', model: 'ZBK-320',
    manufacturer: '江苏某机械厂', purchaseDate: '2022-06-01',
    responsibleDept: '冷轧车间', status: 'in_use',
    remark: '年产能12万吨，2023年大修过主传动系统',
  });
  await ensureOne(prisma.equipment, { code: 'EQ-A002' }, {
    orgId, name: '铜带轧机生产线#2', code: 'EQ-A002',
    type: '生产设备', category: '轧制设备', model: 'ZBK-320',
    manufacturer: '江苏某机械厂', purchaseDate: '2023-03-15',
    responsibleDept: '冷轧车间', status: 'in_use',
    remark: '2023年新购，已投运',
  });
  await ensureOne(prisma.equipment, { code: 'EQ-C001' }, {
    orgId, name: '连续退火炉', code: 'EQ-C001',
    type: '热处理设备', category: '退火设备', model: 'TH-1500',
    manufacturer: '合肥某公司', purchaseDate: '2021-09-01',
    responsibleDept: '热轧车间', status: 'in_use',
    remark: '最高工作温度1200°C，氮气保护',
  });
  await ensureOne(prisma.equipment, { code: 'EQ-F001' }, {
    orgId, name: '叉车（3吨）', code: 'EQ-F001',
    type: '特种设备', category: '厂内车辆', model: 'CPD30',
    manufacturer: '合力叉车', purchaseDate: '2023-01-10',
    responsibleDept: '仓储物流', status: 'in_use', remark: '年检有效期至2027-01',
  });
  await ensureOne(prisma.equipment, { code: 'EQ-M001' }, {
    orgId, name: '压缩空气储气罐', code: 'EQ-M001',
    type: '特种设备', category: '压力容器', model: 'V-2.0',
    manufacturer: '常州压力容器厂', purchaseDate: '2020-05-20',
    responsibleDept: '设备部', status: 'in_use', remark: '容积2m³，设计压力1.0MPa',
  });

  // Chemical: orgId/name/aliases/casNo/isHazardous/storageLocation/maxStock/currentStock/status
  await ensureOne(prisma.chemical, { name: '乳化液（轧制用）' }, {
    orgId, name: '乳化液（轧制用）', aliases: '轧制液',
    casNo: '8013-36-9', isHazardous: true, isEasyToxic: false, isExplosive: false,
    storageLocation: '危化品仓库A区', maxStock: 5000, currentStock: 1200, status: 'active',
  });
  await ensureOne(prisma.chemical, { name: '液压油（HLP46）' }, {
    orgId, name: '液压油（HLP46）', aliases: '抗磨液压油',
    casNo: '64742-54-7', isHazardous: true, isEasyToxic: false, isExplosive: false,
    storageLocation: '危化品仓库B区', maxStock: 2000, currentStock: 450, status: 'active',
  });

  // ── 七、作业安全 ───────────────────────────────────────────
  // WorkPermit: id/orgId/permitNo/workType/title/location/workStartTime/workEndTime/workLevel/applicantId
  await ensureOne(prisma.workPermit, { permitNo: 'WP-2026-001' }, {
    orgId, permitNo: 'WP-2026-001', workType: 'hot_work',
    title: '精炼区焊接维修', location: '精炼C段3号炉前',
    workStartTime: '2026-05-10T08:00:00Z', workEndTime: '2026-05-10T17:00:00Z',
    workLevel: '一级', applicantId: fanId,
  });
  await ensureOne(prisma.workPermit, { permitNo: 'WP-2026-002' }, {
    orgId, permitNo: 'WP-2026-002', workType: 'confined_space',
    title: '储罐清淤作业', location: '危化品仓库储罐区',
    workStartTime: '2026-06-01T08:00:00Z', workEndTime: '2026-06-02T17:00:00Z',
    workLevel: '特殊', applicantId: fanId,
  });

  // ── 八、隐患排查与治理 ─────────────────────────────────────
  // Hazard: orgId/hazardNo/title/content/type/category/riskLevel(area)/foundDate/fixDeadline/fixMeasures/fixStatus
  // riskLevel: general/major; fixStatus: pending/in_progress/fixing/verifying/closed/overdue/deleted
  await ensureOne(prisma.hazard, { hazardNo: 'HZ-2026-001' }, {
    orgId, hazardNo: 'HZ-2026-001', title: '轧制A段电机防护罩破损',
    content: 'A段3号电机防护罩出现裂纹，高速旋转时有卷入风险，需立即停机更换。',
    type: '物的不安全状态', category: '设备设施', riskLevel: 'general',
    area: '轧制A段', foundDate: '2026-05-01', fixDeadline: '2026-06-15',
    fixMeasures: '已联系设备部采购新防护罩，待轧制B段停机时同步更换',
    fixStatus: 'in_progress',
  });
  await ensureOne(prisma.hazard, { hazardNo: 'HZ-2026-002' }, {
    orgId, hazardNo: 'HZ-2026-002', title: '精炼区消防栓前方堆物',
    content: '2号消防栓前堆放有包装材料箱，紧急情况下影响取用，已当场要求清理。',
    type: '环境因素', category: '消防安全', riskLevel: 'general',
    area: '精炼C段', foundDate: '2026-05-05', fixDeadline: '2026-05-10',
    fixMeasures: '已清理消防栓周边所有障碍物，设置警戒线',
    fixStatus: 'closed',
  });
  await ensureOne(prisma.hazard, { hazardNo: 'HZ-2026-003' }, {
    orgId, hazardNo: 'HZ-2026-003', title: 'B段通道地面油污未及时清理',
    content: 'B段主通道地面有液压油泄漏痕迹，雨天湿滑，存在滑倒风险。',
    type: '环境因素', category: '作业环境', riskLevel: 'general',
    area: '轧制B段', foundDate: '2026-05-06', fixDeadline: '2026-05-12',
    fixMeasures: '已铺设吸油棉吸收油污，联系设备方检修漏油管路接头',
    fixStatus: 'closed',
  });
  await ensureOne(prisma.hazard, { hazardNo: 'HZ-2026-004' }, {
    orgId, hazardNo: 'HZ-2026-004', title: '临时配电箱门长期敞开',
    content: 'C段检修用临时配电箱门未关闭，存在触电和短路风险。',
    type: '管理缺陷', category: '电气安全', riskLevel: 'major',
    area: '精炼C段', foundDate: '2026-05-08', fixDeadline: '2026-05-20',
    fixMeasures: '已通知设备部，本周内完成箱门更换',
    fixStatus: 'in_progress',
  });

  // Violation: orgId/user/clauseId/violationDate/description/handleResult/status/reporter
  // 违章记录按 user 字段关联责任人；violationNo 用 id 替代
  await ensureOne(prisma.violation, { user: 'WL-2026-001' }, {
    orgId, user: 'WL-2026-001', clauseId: '', violationDate: '2026-04-20',
    description: '未按规定佩戴安全帽进入生产区域（轧制A段入口）',
    handleResult: '口头警告+重新培训考核', status: 'processed',
    reporter: fanUser?.realName,
  });
  await ensureOne(prisma.violation, { user: 'WL-2026-002' }, {
    orgId, user: 'WL-2026-002', clauseId: '', violationDate: '2026-05-05',
    description: '在禁烟区吸烟（精炼C段仓库）',
    handleResult: '罚款200元+书面检查+停岗培训1天', status: 'processed',
    reporter: fanUser?.realName,
  });

  // ── 九、安全风险管控 ───────────────────────────────────────
  // RiskFactor: orgId/name/category/level/measures/status (no location/owner/likelihood/consequence)
  await ensureOne(prisma.riskFactor, { name: '轧机主传动系统' }, {
    orgId, name: '轧机主传动系统', category: '机械伤害', level: 'low',
    measures: '防护罩完好；定期点检；持证上岗', status: 'active',
  });
  await ensureOne(prisma.riskFactor, { name: '退火炉高温区' }, {
    orgId, name: '退火炉高温区', category: '灼烫', level: 'medium',
    measures: '隔热围挡；警示标识；穿戴耐高温PPE', status: 'active',
  });
  await ensureOne(prisma.riskFactor, { name: '危化品储罐区' }, {
    orgId, name: '危化品储罐区', category: '火灾/泄漏', level: 'high',
    measures: '防火堤；可燃气体报警；定期演练', status: 'active',
  });

  // ── 十、应急管理 ───────────────────────────────────────────
  // EmergencyPlan: orgId/title/planType/year/content/version/status
  // planType: comprehensive/special/on_site; version: Int
  await ensureOne(prisma.emergencyPlan, { title: '永杰昆山工厂生产安全事故综合应急预案' }, {
    orgId, title: '永杰昆山工厂生产安全事故综合应急预案',
    planType: 'comprehensive', year: 2026, version: 3,
    content: '综合应急预案，涵盖全厂各类事故的应急响应流程',
    status: 'published',
  });
  await ensureOne(prisma.emergencyPlan, { title: '危险化学品泄漏专项应急预案' }, {
    orgId, title: '危险化学品泄漏专项应急预案',
    planType: 'special', year: 2026, version: 2,
    content: '针对乳化液、液压油等危化品泄漏事故的专项应急响应',
    status: 'published',
  });
  await ensureOne(prisma.emergencyPlan, { title: '人员灼烫事故现场处置方案' }, {
    orgId, title: '人员灼烫事故现场处置方案',
    planType: 'on_site', year: 2026, version: 1,
    content: '退火炉等高温设备区域的灼烫事故现场应急处置',
    status: 'published',
  });

  // DrillPlan: orgId/planType/year/month/title/drillDate/status
  // planType: annual/monthly
  await ensureOne(prisma.drillPlan, { title: '2026年上半年消防疏散演练' }, {
    orgId, planType: 'annual', year: 2026, month: 5,
    title: '2026年上半年消防疏散演练', drillDate: '2026-05-12', status: 'completed',
  });
  await ensureOne(prisma.drillPlan, { title: '2026年危化品泄漏应急处置演练' }, {
    orgId, planType: 'annual', year: 2026, month: 9,
    title: '2026年危化品泄漏应急处置演练', drillDate: '2026-09-18', status: 'draft',
  });

  // EmergencySupplies: orgId/name/type/quantity/unit/location/checkDate/status
  // status: normal/abnormal/scrapped
  await ensureOne(prisma.emergencySupplies, { name: '空气呼吸器' }, {
    orgId, name: '空气呼吸器', type: '呼吸防护',
    quantity: 4, unit: '套', location: '消防仓库',
    checkDate: '2026-04-01', status: 'normal',
  });
  await ensureOne(prisma.emergencySupplies, { name: '防化服' }, {
    orgId, name: '防化服', type: '身体防护',
    quantity: 6, unit: '套', location: '消防仓库',
    checkDate: '2026-04-01', status: 'normal',
  });

  // ── 十二、事故管理 ─────────────────────────────────────────
  // AccidentReport: orgId/accidentNo/accidentType/accidentLevel/title/happenTime/location/description/status/reporterId
  // accidentType: 工亡/重伤/轻伤/职业病; accidentLevel: general/major
  await ensureOne(prisma.accidentReport, { accidentNo: 'AQ-2025-001' }, {
    orgId, accidentNo: 'AQ-2025-001',
    title: '2025年8月轧制A段手指轻伤事故',
    accidentType: '轻伤', accidentLevel: 'general',
    happenTime: '2025-08-15T10:30:00Z', reportTime: '2025-08-15T11:00:00Z',
    location: '轧制A段2号轧机',
    description: '操作工人未按规程佩戴防护手套，手指被卷入传动辊。左手中指末节撕脱伤，直接经济损失约2.5万元。',
    reporterId: fanId, status: 'archived',
  });

  // NearMiss: orgId/title/location/description/potentialSeverity/reportedBy/reportedAt/analysis/correctiveAction/status
  await ensureOne(prisma.nearMiss, { title: '精炼C段地面油污险些滑倒' }, {
    orgId, title: '精炼C段地面油污未及时清理险些滑倒',
    location: '精炼C段通道',
    description: '液压油管接头松动漏油，地面油污未及时清理，险些造成人员滑倒受伤。',
    potentialSeverity: 'serious', reporterId: fanId,
    reportTime: '2026-04-22',
    handleResult: '原因分析：液压油管接头松动漏油，清理不及时；整改：已更换油管接头，增设吸油棉，加强巡检频次',
    status: 'closed',
  });

  // ── 十三、绩效评定 ─────────────────────────────────────────
  // SafetyKpi: orgId/year/month/fatalities/noInjury/safetyObs/stopCount
  // (记录死亡=0, 无伤害事故, 安全观察次数, STOP计数)
  await ensureOne(prisma.safetyKpi, { orgId, year: 2026, month: 1 }, {
    orgId, year: 2026, month: 1,
    noInjuryAccidents: 2, safetyObs: 15, stopCount: 3, remark: '一季度开局良好，零死亡',
  });
  await ensureOne(prisma.safetyKpi, { orgId, year: 2026, month: 2 }, {
    orgId, year: 2026, month: 2,
    noInjuryAccidents: 1, safetyObs: 12, stopCount: 2, remark: '春节期间停产，安全状况稳定',
  });
  await ensureOne(prisma.safetyKpi, { orgId, year: 2026, month: 3 }, {
    orgId, year: 2026, month: 3,
    noInjuryAccidents: 3, safetyObs: 18, stopCount: 4, remark: '安全生产月启动，隐患整改率100%',
  });

  console.log('\n🎯 业务模块测试数据追加完成!');
  console.log('   包含: 课程(3)/考题(5)/设备(5)/危化品(2)/隐患(4)/违章(2)/作业许可(2)/风险(3)/预案(3)/演练(2)/应急物资(2)/事故(1)/未遂(1)/KPI(3)');
}

main()
  .catch(e => { console.error('❌ 种子数据初始化失败:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
