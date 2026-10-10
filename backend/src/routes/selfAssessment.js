// 标准化自评表 —— 提交记录 (自评人/时间/状态) + 评分点批量 upsert
// 打分方式: 总入口表格内联打分 -> 暂存/提交, 不逐项弹窗
const { prisma, auth, ok, fail, friendlyError } = require('../utils/common');
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

// 按 25 条一批并行 upsert (updateMany 走 unnest 批量路径, 对类型严格;
// 这里逐条 upsert 对类型宽容且错误显式抛出, 便于定位)
// 定位键用 itemCode (全局唯一)。历年自评复用同一套考评编码, 新年度用
// "年份-" 前缀区分 (2019 年 "1.1.1" / 2026 年 "2026-1.1.1"), 故 itemCode
// 仍保持全局唯一, 也避免了对已上线表删约束触发 db push 数据丢失警告。
async function upsertItems(year, rows) {
  function* chunks(l, n) { for (let i = 0; i < l.length; i += n) yield l.slice(i, i + n); }
  for (const chunk of chunks(rows, 25)) {
    await Promise.all(chunk.map(r =>
      prisma.selfAssessmentItem.upsert({
        where: { itemCode: r.itemCode },
        create: { year, itemCode: r.itemCode, ...r.data },
        update: { ...r.data }
      }).catch(e => {
        console.error(`   ⚠️  itemCode=${r.itemCode} 保存失败: ${String(e.message).split('\n')[0].substring(0, 200)}`);
        throw e;
      })
    ));
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
      orderBy: [{ categoryNo: 'asc' }, { itemCode: 'asc' }]
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
  const rows = base.map(b => ({
    year: y, category: b.category, categoryNo: b.categoryNo, item: b.item,
    itemNo: b.itemNo, contentNo: b.contentNo, content: b.content,
    score: b.score, method: b.method,
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
  const { year, items = [], submit = false, note = '' } = req.body || {};
  const y = parseInt(year);
  if (!y) return fail(res, 'year 必填', 400);
  if (!Array.isArray(items)) return fail(res, 'items 格式错误', 400);

  // 1) 落库评分点 (仅保存有实际变更的项, 未变更的不动, 保留历史基线数据)
  if (items.length) {
    const rows = items
      .filter(it => it.itemCode)
      .map(it => ({
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
