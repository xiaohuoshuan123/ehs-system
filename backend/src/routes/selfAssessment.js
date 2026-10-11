// 标准化自评表 —— 提交记录 (自评人/时间/状态) + 评分点批量 upsert
// 打分方式: 总入口表格内联打分 -> 暂存/提交, 不逐项弹窗
const { prisma, auth, ok, fail, friendlyError } = require('../utils/common');
const { GRADES, judgeLevel, perfIndicators } = require('../utils/gradeJudge');
const express = require('express');
const router = express.Router();

const ASSESS_FIELDS = ['actual', 'notApplicable', 'assessmentDesc', 'deductionReason', 'measure', 'completed', 'tracker'];

// 由评分点实时汇总得分 (与前端汇总口径一致: 不涉及分值从分母排除)
function computeScore(items) {
  const r = (n) => Math.round(n * 10) / 10;
  let totalScore = 0, excludedScore = 0, actualScore = 0, itemTotal = 0;
  for (const it of items) {
    if (it.score == null) continue;              // score 为空的是子项续行, 不单独计分
    itemTotal++;
    totalScore += it.score;
    if (it.notApplicable) excludedScore += it.score;
    else if (it.actual != null) actualScore += it.actual;
  }
  const denom = Math.max(totalScore - excludedScore, 0);
  return {
    itemTotal, totalScore: r(totalScore), excludedScore: r(excludedScore),
    actualScore: r(actualScore),
    score: denom ? r(actualScore / denom * 100) : 0
  };
}

// 按 25 条一批并行 upsert。
// 定位键用 id (行已存在于库中, init 时已建), 只走 update 分支。
// 关键坑: SelfAssessmentItem 的 category/categoryNo/content 是必填且无默认值,
// 若以 itemCode 为键, Prisma 会强制校验 create 分支, 缺这三个字段就报
// "Argument `category` is missing"。改用 id 定位可彻底绕开 create 校验。
// 仅当年份无 id 的行(极端情况)才退化为 itemCode 并补齐必填字段。
async function upsertItems(year, rows) {
  function* chunks(l, n) { for (let i = 0; i < l.length; i += n) yield l.slice(i, i + n); }
  for (const chunk of chunks(rows, 25)) {
    await Promise.all(chunk.map(r => {
      if (r.id) {
        return prisma.selfAssessmentItem.update({ where: { id: r.id }, data: r.data });
      }
      return prisma.selfAssessmentItem.upsert({
        where: { itemCode: r.itemCode },
        // create 必须带上无默认值的必填字段, 否则 Prisma 直接拒绝该 invocation
        create: {
          year, itemCode: r.itemCode,
          category: r.category || '', categoryNo: r.categoryNo || 0, content: r.content || '',
          ...r.data
        },
        update: { ...r.data }
      });
    }));
  }
}

// ===== 取某年度提交记录 (不存在返回 null) =====
router.get('/', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const rec = year ? await prisma.selfAssessment.findUnique({ where: { year } }) : null;
    return ok(res, rec);
  } catch (e) { return fail(res, friendlyError(e)); }
});

// ===== 按年度取全部评分点 (草稿态编辑用) =====
router.get('/items', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const items = await prisma.selfAssessmentItem.findMany({
      where: { year },
      // seq = 原始 Excel 行序号, 是唯一的正确排序键。
      // 不能按 itemCode 字典序: 续行用连字符编号('-' < '.'),
      // 会把 "13.2.2 下列事项" 的 6 条列举项排到类目最前面。
      // tiebreaker 取源表 itemCode (非年份前缀版), 仅作同一 seq 时的稳定次序。
      orderBy: [{ categoryNo: 'asc' }, { seq: 'asc' }, { itemCode: 'asc' }]
    });
    return ok(res, items);
  } catch (e) { return fail(res, friendlyError(e)); }
});

// ===== 初始化年度自评表 (从基线年度复制考评模板, 清空分数与扣分) =====
// body: { year, fromYear? }  默认 fromYear=2019
// 用于开启新年度自评: 复制 13 类目考评点结构, 分数/不涉及/扣分说明全部清空
router.post('/init', auth, async (req, res) => {
  const { year, fromYear = 2019 } = req.body || {};
  const y = parseInt(year);
  if (!y) return fail(res, 'year 必填', 400);
  const baseYear = parseInt(fromYear);

  const baseCount = await prisma.selfAssessmentItem.count({ where: { year: y } });
  if (baseCount > 0) return fail(res, `${y} 年已有 ${baseCount} 条评分点，不能重复初始化`, 400);

  const base = await prisma.selfAssessmentItem.findMany({ where: { year: baseYear } });
  if (!base.length) return fail(res, `${baseYear} 年基线数据不存在`, 400);

  function* chunks(l, n) { for (let i = 0; i < l.length; i += n) yield l.slice(i, i + n); }
  const rows = base.map((b, idx) => ({
    year: y, category: b.category, categoryNo: b.categoryNo, item: b.item,
    itemNo: b.itemNo, contentNo: b.contentNo, content: b.content,
    score: b.score, method: b.method,
    // seq: 基线按 categoryNo+seq 有序取出, 故数组下标即原表行序号,
    // 新年度完整继承同一行序 (续行仍紧跟其父项, 不被字典序打散)
    seq: b.seq || idx,
    // itemCode 是全局唯一, 历年复用同一套考评编码会撞约束。
    // 故新年度加 "年份-" 前缀 (2019 基线保持原样: "1.1.1", 2026 年: "2026-1.1.1")
    itemCode: `${y}-${b.itemCode}`
  }));
  for (const chunk of chunks(rows, 25)) {
    await Promise.all(chunk.map(r => prisma.selfAssessmentItem.create({ data: r })));
  }
  return ok(res, { year: y, items: rows.length }, `${y} 年自评表已初始化 ${rows.length} 条评分点`);
});

// ===== 暂存 / 提交 =====
// body: { year, items: [{id, itemCode, actual, notApplicable, ...}], submit: bool, note }
router.post('/', auth, async (req, res) => {
  try {
  const { year, items = [], submit = false, note = '' } = req.body || {};
  const y = parseInt(year);
  if (!y) return fail(res, 'year 必填', 400);
  if (!Array.isArray(items)) return fail(res, 'items 格式错误', 400);

  // 1) 落库评分点 (仅保存有实际变更的项, 未变更的不动, 保留历史基线数据)
  if (items.length) {
    const rows = items
      .filter(it => it.itemCode || it.id)
      .map(it => ({
        // 行已存在于库(init 时创建), 用 id 定位只走 update,
        // 绕开 Prisma 对 create 分支必填字段的强制校验
        id: it.id || undefined,
        itemCode: it.itemCode,
        data: {
          year: y,
          actual: it.actual === '' || it.actual == null ? null : Number(it.actual),
          notApplicable: !!it.notApplicable,
          assessmentDesc: it.assessmentDesc || '',
          deductionReason: it.deductionReason || '',
          measure: it.measure || '',
          completed: it.completed == null ? null : !!it.completed,
          tracker: it.tracker || ''
        }
      }));
    await upsertItems(y, rows);
  }

  // 2) 汇总该年度全部评分点
  const allItems = await prisma.selfAssessmentItem.findMany({ where: { year: y } });
  const s = computeScore(allItems);
  const assessorName = req.user.realName || req.user.username;

  // 3) 提交校验: 每个评分点必须已打分 (不涉及 或 已填实得)
  if (submit) {
    const missing = allItems.filter(it => it.score != null && !it.notApplicable && it.actual == null);
    if (missing.length) {
      return fail(res, `还有 ${missing.length} 个评分点未打分，无法提交`, 400);
    }
    const blankDesc = allItems.filter(it => it.score != null && !it.notApplicable && it.actual < (it.score || 0) && !(it.deductionReason || '').trim());
    if (blankDesc.length) {
      return fail(res, `${blankDesc.length} 个扣分点未填写扣分说明，无法提交`, 400);
    }
  }

  // 4) 写入/更新提交记录 (一年一张)
  const rec = await prisma.selfAssessment.upsert({
    where: { year: y },
    create: {
      year: y,
      orgId: req.user.orgId || null,
      assessorId: req.user.id,
      assessorName,
      status: submit ? 'submitted' : 'draft',
      submittedAt: submit ? new Date() : null,
      itemTotal: s.itemTotal, totalScore: s.totalScore, excludedScore: s.excludedScore,
      actualScore: s.actualScore, score: s.score,
      note
    },
    update: {
      orgId: req.user.orgId || null,
      assessorId: req.user.id,
      assessorName,
      status: submit ? 'submitted' : 'draft',
      submittedAt: submit ? new Date() : undefined,
      itemTotal: s.itemTotal, totalScore: s.totalScore, excludedScore: s.excludedScore,
      actualScore: s.actualScore, score: s.score,
      note
    }
  });

  // 自评人/时间只固化在提交记录表 (SelfAssessment),
  // 不落在评分点上 —— 评分点保持纯数据, 也避免了对已上线表的列迁移。

  return ok(res, { record: rec, summary: s, unscored: submit ? 0 : allItems.filter(it => it.score != null && !it.notApplicable && it.actual == null).length },
    submit ? '已提交' : '已暂存');
  } catch (e) {
    // 必须捕获: 否则未处理异常会让 Node 进程直接退出,
    // 表现为客户端收到 502 且服务需要 Render 重启
    console.error('   ❌ 暂存/提交失败:', e.message);
    return fail(res, friendlyError(e));
  }
});

// ===== 导出年度自评报告 (xlsx) =====
// GET /api/self-assessment/export?year=2026
// 按需求文档第 13 模块: "按照《有色金属压力加工企业安全生产标准化评定标准》…
// 评定结果输入，并生成正式评定报告，预设标准模板"。
//
// 用 SheetJS 而非 ExcelJS: xlsx 能直接输出 Buffer，可正常设置 Content-Length，
// 下载时文件大小显示正确; ExcelJS 是流式写，设不了 Content-Length，渲染出来是 0 bytes。
//
// 报告四表: 封面(基本信息+评分汇总) / 各类目得分汇总 / 自评明细 / 扣分与整改清单
//
// 注意路由顺序: 此端点必须定义在 router.put('/:id/approve') 之前无关(方法不同不会冲突),
// 但为可读性放在业务端点之后、approve 之前。
router.get('/export', auth, async (req, res) => {
  try {
  const XLSX = require('xlsx');
  const year = parseInt(req.query.year);
  if (!year) return fail(res, 'year 必填', 400);

  const [items, record] = await Promise.all([
    prisma.selfAssessmentItem.findMany({
      where: { year },
      // 必须按原表行序取: 续行(score 为空)紧跟其父项，后续合并依赖这个顺序
      orderBy: [{ categoryNo: 'asc' }, { seq: 'asc' }, { itemCode: 'asc' }]
    }),
    prisma.selfAssessment.findUnique({ where: { year } })
  ]);
  if (!items.length) return fail(res, `${year} 年自评表尚未初始化`, 400);

  // 续行并入父项 (仅用于报告展示, 不影响计分)。
  // 每条续行本身作为独立一行 —— 原表里 "(1)组织建立...;(2)组织制定..." 的列举项在库里
  // 就是一条一条的续行, 直接按行输出即天然是分行, 不要在这里做二次切分 (会把
  // "（7）其他与安全生产直接相关的物品或者活动。制定职业危害防治..." 这类同段续写的文字切碎)。
  function mergeItems(rows) {
    const out = []; let cur = null, buf = [];
    for (const it of rows) {
      if (it.score != null) {
        if (cur) { cur._content = joinLines(cur, buf); out.push(cur); }
        cur = { ...it }; buf = [];
      } else if (cur) {
        buf.push({ text: it.content || '' });
      }
    }
    if (cur) { cur._content = joinLines(cur, buf); out.push(cur); }
    return out;
  }
  function joinLines(p, buf) {
    const segs = buf.map(b => b.text).filter(Boolean);
    return segs.length ? `${p.content}\n${segs.join('\n')}` : p.content;
  }
  const merged = mergeItems(items);
  const s = computeScore(items);

  // 给整列单元格加自动换行 (aoa_to_sheet 不认 s 属性, 需逐格写).
  // skipHead 是跳过的表头行数 —— 封面式表格的表头不是单行, 要跳过。
  function wrapCol(ws, col, skipHead) {
    const ref = ws['!ref'];
    if (!ref) return;
    const last = XLSX.utils.decode_range(ref).e.r;
    for (let r = skipHead; r <= last; r++) {
      const key = XLSX.utils.encode_cell({ r, c: col });
      if (ws[key]) ws[key].s = { alignment: { wrapText: true, vertical: 'top' } };
    }
  }

  // 各类目汇总: 类目名取该类目首行 (同一 categoryNo 只有一条类目名)
  const catMap = new Map();
  for (const it of items) {
    if (it.score == null) continue;                 // 续行不计分
    if (!catMap.has(it.categoryNo)) catMap.set(it.categoryNo, { category: it.category, total: 0, actual: 0, excluded: 0, cnt: 0 });
    const c = catMap.get(it.categoryNo);
    c.total += it.score; c.cnt++;
    if (it.notApplicable) c.excluded += it.score;
    else if (it.actual != null) c.actual += it.actual;
  }
  const cats = [...catMap.entries()].sort((a, b) => a[0] - b[0])
    .map(([no, c]) => ({ no, ...c }));

  // 单位名: 标准化评定按工厂级，主体固定为"永杰集团昆山工厂"（与系统名一致）。
  // 目前 admin 账号 orgId 指向集团层(永杰集团)，若按组织链取会得到不完整的名字；
  // 待将来有多家工厂、各厂独立自评时，再改为按 orgId 解析到工厂级节点。
  let orgName = '永杰集团昆山工厂';

  const now = new Date();
  const statusLabel = { draft: '暂存', submitted: '已提交', approved: '已审批归档' }[record?.status] || '未提交';
  const fmtTime = t => t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '—';

  // 安全绩效 -> 千人率 -> 等级判定 (字段名与 schema / gradeJudge 的期望严格一致)
  const perfRaw = {
    employees: record?.perfEmployees, deaths: record?.perfDeaths,
    seriousInjuries: record?.perfSeriousInjuries, odCases: record?.perfOdCases,
    econLossMax: record?.perfEconLossMax, majorOrAbove: record?.perfMajorAbove
  };
  const perf = perfIndicators(perfRaw);
  const judged = judgeLevel(s.score, perf);

  // --- 表1 封面 ---
  const w1 = XLSX.utils.aoa_to_sheet([
    [`${year} 年度安全生产标准化自评报告`],
    [orgName],
    [],
    ['一、基本信息'],
    ['自评年度', `${year} 年`],
    ['评定依据', '《有色金属压力加工企业安全生产标准化评定标准》（安监总管四〔2011〕130号）'],
    ['自评人', record?.assessorName || '—'],
    ['自评时间', fmtTime(record?.createdAt)],
    ['提交时间', fmtTime(record?.submittedAt)],
    ['审批人 / 时间', record?.approvedByName ? `${record.approvedByName} / ${fmtTime(record.approvedAt)}` : '—'],
    ['当前状态', statusLabel],
    [],
    ['二、安全绩效指标（申请评审之日前一年内）'],
    ['职工平均人数', perf ? `${perf.employees} 人` : '（未填报）'],
    ['死亡人数', perf ? `${perf.deaths} 人` : '—'],
    ['千人死亡率', perf ? `${(Math.round(perf.deathRate * 100) / 100)} ‰` : '—'],
    ['千人重伤率', perf ? `${(Math.round(perf.injuryRate * 100) / 100)} ‰` : '—'],
    ['较大以上事故', perf ? (perf.majorOrAbove ? '有' : '无') : '—'],
    ['最大一次事故直接经济损失', perf ? `${perf.econLossMax} 万元` : '—'],
    ['职业病发病率', perf ? `${(Math.round(perf.odIncidence * 100) / 100)} ‰` : '—'],
    [],
    ['三、评分汇总'],
    ['评分点数量', s.itemTotal, '条'],
    ['标准满分', s.totalScore, '分'],
    ['不涉及项目分值', s.excludedScore, '分'],
    ['实际得分', s.actualScore, '分'],
    ['标准化得分', s.score, '分'],
    ['计算公式', `标准化得分 = 实际得分 ÷ (标准满分 - 不涉及分值) × 100 = ${s.actualScore} ÷ (${s.totalScore} - ${s.excludedScore}) × 100`],
    [],
    ['四、等级判定'],
    ['标准化得分对应等级', `${s.score} 分 → ${judged.byScore || '未达三级'}`],
    ['安全绩效核对结果', perf ? '已填报，见「安全绩效指标」与「评定等级判定标准」表' : '未填报，等级待自评人依据事故/职业病/经济损失台账核对'],
    ['自评等级结论', judged.level],
    ['判定依据', judged.reason],
    [],
    ['五、自评结论', record?.note || '(待填写)'],
    [],
    ['报告生成时间', fmtTime(now)]
  ]);
  w1['!cols'] = [{ wch: 24 }, { wch: 76 }];
  w1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
  ];

  // --- 表2 各类目得分汇总 ---
  const r1x = n => Math.round(n * 10) / 10;
  const aoa2 = [['序号', '考评类目', '评分点数', '标准满分', '实得', '不涉及分值', '达标率(%)', '说明']];
  cats.forEach((c, i) => {
    const denom = Math.max(c.total - c.excluded, 0);
    aoa2.push([
      i + 1, c.category, c.cnt, r1x(c.total), r1x(c.actual), r1x(c.excluded),
      denom ? r1x(c.actual / denom * 100) : 0,
      denom === 0 ? '不涉及' : (c.actual >= c.total - c.excluded ? '达标' : '存在扣分项')
    ]);
  });
  aoa2.push(['合计', '', s.itemTotal, s.totalScore, s.actualScore, s.excludedScore, s.score, '']);
  const w2 = XLSX.utils.aoa_to_sheet(aoa2);
  w2['!cols'] = [{ wch: 6 }, { wch: 26 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 16 }];
  w2['!merges'] = [{ s: { r: aoa2.length - 1, c: 0 }, e: { r: aoa2.length - 1, c: 1 } }];

  // --- 表3 自评明细 (全部评分点) ---
  const aoa3 = [['序号', '考评类目', '考评项目', '编号', '考评内容', '标准分值', '实得',
    '不涉及', '自评/评审描述', '扣分说明', '整改措施', '整改状态', '跟踪人']];
  merged.forEach((it, i) => {
    aoa3.push([
      i + 1, it.category, it.item || '', it.contentNo || it.itemCode, it._content,
      it.score ?? '', it.notApplicable ? '不涉及' : (it.actual ?? ''),
      it.notApplicable ? '是' : '', it.assessmentDesc || '',
      it.notApplicable ? `不涉及原因：${it.deductionReason || ''}` : (it.deductionReason || ''),
      it.measure || '', it.deductionReason ? (it.completed ? '已整改' : '未整改') : '', it.tracker || ''
    ]);
  });
  const w3 = XLSX.utils.aoa_to_sheet(aoa3);
  w3['!cols'] = [{ wch: 6 }, { wch: 20 }, { wch: 18 }, { wch: 10 }, { wch: 56 }, { wch: 8 },
    { wch: 6 }, { wch: 8 }, { wch: 52 }, { wch: 34 }, { wch: 34 }, { wch: 9 }, { wch: 10 }];
  // 考评内容/描述/扣分说明含换行 (列举项已逐条分行), 必须开自动换行否则 Excel 里显示成空格
  for (const col of [4, 8, 9, 10]) wrapCol(w3, col, 2);

  // --- 表4 扣分与整改清单 (仅扣分/不涉及项) ---
  const flagged = merged.filter(it => it.deductionReason || it.measure);
  const aoa4 = [['序号', '考评类目', '考评项目', '编号', '考评内容', '标准分值', '实得',
    '扣分', '扣分说明 / 不涉及原因', '整改措施', '整改状态', '跟踪人']];
  flagged.forEach((it, i) => aoa4.push([
    i + 1, it.category, it.item || '', it.contentNo || it.itemCode, it._content,
    it.score ?? '', it.notApplicable ? '不涉及' : (it.actual ?? ''),
    it.notApplicable ? '' : r1x(it.score - (it.actual ?? 0)),
    it.deductionReason || '', it.measure || '',
    it.deductionReason ? (it.completed ? '已整改' : '未整改') : '', it.tracker || ''
  ]));
  const w4 = XLSX.utils.aoa_to_sheet(aoa4);
  w4['!cols'] = [{ wch: 6 }, { wch: 20 }, { wch: 18 }, { wch: 10 }, { wch: 46 }, { wch: 8 },
    { wch: 6 }, { wch: 6 }, { wch: 40 }, { wch: 34 }, { wch: 9 }, { wch: 10 }];

  // --- 表5 评定等级判定标准 (逐字引用标准条件; 本企情况取填报的安全绩效) ---
  const r2x = n => Math.round(n * 100) / 100
  const rateStr = n => (r2x(n)) + ' ‰'
  const aoa5 = [['评定等级', '标准化得分要求', '安全绩效条件（申请评审之日前一年内）', '本企实际', '达标', '核对人 / 日期']];
  // 达标列 = 本档「得分门槛」与「安全绩效条件」是否同时满足(逐档独立判定)
  const scoreOk = g => s.score >= g.min
  const perfOk = (g, p) => p && g.test({ ...p, majorOrAbove: !!p.majorOrAbove })
  for (const g of GRADES) {
    const actual = perf
      ? `得分 ${s.score} 分；千人死亡率 ${rateStr(perf.deathRate)}；千人重伤率 ${rateStr(perf.injuryRate)}；较大以上事故 ${perf.majorOrAbove ? '有' : '无'}；最大经济损失 ${perf.econLossMax} 万元；职业病发病率 ${rateStr(perf.odIncidence)}`
      : '（未填报）';
    // 注意: 此处只标"本档条件是否满足", 不等于"评定为该级"。
    // 实际等级 = 最高满足档(见封面"自评意见"), 二级/三级在一级成立时同样满足其条件。
    let pass = ''
    if (!perf) pass = '待核对'
    else if (scoreOk(g) && perfOk(g, perf)) pass = '条件满足'
    else if (scoreOk(g)) pass = '安全绩效不满足'
    else pass = '得分不达门槛'
    const checkBy = perf ? `${record?.perfChecker || '—'} / ${record?.perfCheckDate ? fmtTime(record.perfCheckDate).slice(0, 10) : '—'}` : '—'
    aoa5.push([g.level, `≥ ${g.min} 分`, g.cond, actual, pass, checkBy])
  }
  aoa5.push(['结论', '', '等级须同时满足「标准化得分达线」且「安全绩效条件」，二者缺一不可', judged.level, '', '—']);
  const w5 = XLSX.utils.aoa_to_sheet(aoa5);
  w5['!cols'] = [{ wch: 10 }, { wch: 16 }, { wch: 62 }, { wch: 50 }, { wch: 16 }, { wch: 18 }];
  w5['!merges'] = [{ s: { r: aoa5.length - 1, c: 0 }, e: { r: aoa5.length - 1, c: 1 } }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, w1, '封面');
  XLSX.utils.book_append_sheet(wb, w2, '各类目得分汇总');
  XLSX.utils.book_append_sheet(wb, w3, '自评明细');
  XLSX.utils.book_append_sheet(wb, w4, '扣分与整改清单');
  XLSX.utils.book_append_sheet(wb, w5, '评定等级判定标准');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="self-assessment-report-${year}.xlsx"`);
  res.setHeader('Content-Length', buf.length);
  res.send(buf);
  } catch (e) {
    // 必须捕获: 未处理异常会让进程退出，表现为 502 + Render 重启
    console.error('   ❌ 自评报告导出失败:', e.message);
    return fail(res, friendlyError(e));
  }
});

// ===== 安全绩效指标填报 (独立于打分, 不因"未打分"校验被阻塞) =====
// 安全绩效涉及死亡率/重伤率/直接经济损失/职业病发病率, 系统内无数据来源,
// 由自评人依据事故/职业病/经济损失台账人工填报。
// 单独成端点的原因: 这些指标常先于打分填报, 若挂在 POST 里会被
// "还有 N 个评分点未打分" 拦住。只改记录表字段, 不触碰评分点。
const numOf = (v, max) => {
  if (v === '' || v == null) return 0;
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(Math.round(n), 0), max);
};

// 由记录表字段组装判定入参 (字段名与 schema 严格一致)
function perfOfRecord(rec) {
  if (!rec) return null;
  return {
    employees: rec.perfEmployees, deaths: rec.perfDeaths,
    seriousInjuries: rec.perfSeriousInjuries, odCases: rec.perfOdCases,
    econLossMax: rec.perfEconLossMax, majorOrAbove: rec.perfMajorAbove
  };
}

// GET: 取当前安全绩效 + 实时等级判定 (供自评页实时显示)
router.get('/:year/performance', auth, async (req, res) => {
  try {
  const y = parseInt(req.params.year);
  if (!y) return fail(res, 'year 必填', 400);
  const [rec, items] = await Promise.all([
    prisma.selfAssessment.findUnique({ where: { year: y } }),
    prisma.selfAssessmentItem.findMany({ where: { year: y } })
  ]);
  const s = computeScore(items);
  const perf = perfIndicators(perfOfRecord(rec));
  return ok(res, {
    year: y,
    // 填报原始量
    perfEmployees: rec?.perfEmployees ?? 0,
    perfDeaths: rec?.perfDeaths ?? 0,
    perfSeriousInjuries: rec?.perfSeriousInjuries ?? 0,
    perfMajorAbove: !!rec?.perfMajorAbove,
    perfEconLossMax: rec?.perfEconLossMax ?? 0,
    perfOdCases: rec?.perfOdCases ?? 0,
    perfChecker: rec?.perfChecker ?? '',
    perfCheckDate: rec?.perfCheckDate ?? null,
    // 实时算出的千人率 (不落库)
    rates: perf,
    // 标准化得分 + 等级判定
    score: s.score, actualScore: s.actualScore, totalScore: s.totalScore, excludedScore: s.excludedScore,
    grade: judgeLevel(s.score, perf),
    grades: GRADES.map(g => ({ level: g.level, min: g.min, cond: g.cond }))
  });
  } catch (e) { return fail(res, friendlyError(e)); }
});

// PUT: 保存安全绩效
router.put('/:year/performance', auth, async (req, res) => {
  try {
  const y = parseInt(req.params.year);
  if (!y) return fail(res, 'year 必填', 400);
  const b = req.body || {};
  const data = {
    perfEmployees: numOf(b.perfEmployees, 100000),
    perfDeaths: numOf(b.perfDeaths, 10000),
    perfSeriousInjuries: numOf(b.perfSeriousInjuries, 10000),
    perfMajorAbove: !!b.perfMajorAbove,
    perfEconLossMax: Number.isFinite(Number(b.perfEconLossMax)) ? Math.max(0, Number(b.perfEconLossMax)) : 0,
    perfOdCases: numOf(b.perfOdCases, 10000),
    perfChecker: String(b.perfChecker || '').slice(0, 50),
    perfCheckDate: b.perfCheckDate ? new Date(b.perfCheckDate) : null
  };
  const rec = await prisma.selfAssessment.upsert({
    where: { year: y },
    create: { year: y, orgId: req.user.orgId || null, ...data },
    update: { ...data }
  });
  return ok(res, rec, '安全绩效已保存');
  } catch (e) { return fail(res, friendlyError(e)); }
});

// ===== 审批归档 (系统管理员) =====
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const rec = await prisma.selfAssessment.update({
      where: { id: req.params.id },
      data: {
        status: 'approved',
        approvedById: req.user.id,
        approvedByName: req.user.realName || req.user.username,
        approvedAt: new Date(),
        note: (req.body.note || '')
      }
    });
    return ok(res, rec, '已审批归档');
  } catch (e) { return fail(res, friendlyError(e)); }
});

module.exports = router;
