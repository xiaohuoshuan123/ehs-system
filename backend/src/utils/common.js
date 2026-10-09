// ============================================================
// 永杰集团智慧安全管理系统 - 公共工具
// ============================================================
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');

const prisma = new PrismaClient();

// ---- 认证中间件 ----
const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ code: 401, message: '未登录' });
  try {
    req.user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ code: 401, message: 'Token无效' });
  }
};

const hashPw = (p) => bcrypt.hash(p, 10);
const cmpPw = (p, h) => bcrypt.compare(p, h);
const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

// ---- 统一响应 ----
const ok = (res, data, msg = 'ok') => res.json({ code: 200, message: msg, data });
const fail = (res, msg = 'error', status = 400) => res.status(status).json({ code: status, message: msg });

// ============================================================
// 数据规范化：前端日期/空值 → Prisma 期望的类型
//   - Element Plus 日期选择器用 value-format="YYYY-MM-DD" 提交纯日期字符串，
//     而 Prisma DateTime 字段需要 ISO-8601 时间戳，否则报
//     "Invalid value for argument xxx: Expected ISO-8601 DateTime"
//   - Element Plus 单选/级联清空后提交空字符串 ""，Prisma 可空字段需 null
//   - 日期/空值转换均按字段名模式判断，不依赖具体模型
// ============================================================

// 判断字段名是否为日期类型（xxxDate / xxxTime / xxxAt / deadline / expire ...）
function isDateField(key) {
  return /(?:Date|Time|At|Deadline|Expiry|Expire)$/i.test(key);
}

// 解析前端传入的日期值，返回 Date 对象或原值
function parseDateVal(v) {
  // Date 实例或已是 ISO 格式 → 直接返回
  if (v instanceof Date) return v;
  if (typeof v === 'number') return new Date(v);

  if (typeof v !== 'string' || !v.trim()) return null; // 空值 → null

  const s = v.trim();
  // ISO-8601 带时区（T 或 Z）→ 时区已明确，直接解析
  if (/T/i.test(s) || s.endsWith('Z')) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  // "YYYY-MM-DD HH[:mm[:ss]]" → 无时区信息的日期时间。
  // 注意：Node 对 "YYYY-MM-DDTHH:mm" 形式按 UTC 解析，而日期选择器期望按本地时区理解。
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):?(\d{1,2})?(?::?(\d{1,2})?)?$/);
  if (m) {
    const [, y, mo, d_, h, mi, se] = m;
    const d = new Date(+y, +mo - 1, +d_, +h, +(mi || '0'), +(se || '0')); // 本地时区构造
    return isNaN(d.getTime()) ? null : d;
  }
  // "YYYY-MM-DD" → 按 UTC 当日 0 点存储，前端本地时区显示仍是当日
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T00:00:00.000Z`);
    return isNaN(d.getTime()) ? null : d;
  }
  // 其余格式尝试解析，失败返回 null（不返回 Invalid Date）
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// 统一规范化 create/update 的 data
function sanitizeData(d) {
  const out = {};
  for (const [k, v] of Object.entries(d)) {
    if (v === '' || v === null || v === undefined) {
      out[k] = null;                       // 空字符串统一转 null（可空字段安全）
    } else if (isDateField(k)) {
      out[k] = parseDateVal(v);            // 日期字段 → Date 对象
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ============================================================
// Prisma 错误 → 中文提示
//   原始报错（如 "Invalid value for argument `meetingDate`: premature end of input.
//   Expected ISO-8601 DateTime."）对用户不可读，此处做有限度的友好化。
//   仅映射字段名能被准确提取的情况，否则原样返回，避免误导。
// ============================================================
function friendlyError(e) {
  // e 可能是 Error 实例，也可能是无 message 的对象/字符串，统一兜底
  let msg;
  if (e && typeof e.message === 'string' && e.message) msg = e.message;
  else if (e instanceof Error) msg = String(e);
  else if (typeof e === 'string') msg = e;
  else msg = '未知错误';

  // 日期格式错误：字段名后紧跟标点或空白才算有效提取
  let m = msg.match(/Invalid value for argument `[a-zA-Z0-9_]+`(?:[:\s])/);
  if (m) {
    const field = m[0].match(/`([^`]+)`/)[1];
    if (isDateField(field)) return `日期格式不正确：${field}，请选择有效日期`;
  }

  // 外键关联不存在
  if (/The related record was not found/i.test(msg)) return '关联的记录不存在，请检查引用的对象';

  // 唯一键冲突（字段名可能被反引号包裹，也可能外套一层括号）
  if (/Unique constraint failed/i.test(msg)) {
    m = msg.match(/on the fields: \(?`([^`]+)`\)?/);
    return m ? `已存在相同记录：${m[1]}` : '已存在相同记录';
  }

  // 字段缺失
  if (/You have to provide either data or where/i.test(msg)) return '提交数据不完整';

  return msg;
}

// ---- 通用CRUD生成器 ----
// options: { filters: {field:'contains'...}, exact: ['field'...], include: [...] }
function crud(modelName, opts = {}) {
  const r = express.Router();
  const m = prisma[modelName];
  if (!m) return r;

  const { filters = {}, exact = [], include } = opts;

  r.post('/', auth, async (req, res) => {
    try {
      const d = sanitizeData({ ...req.body, createdById: req.user.id, createdAt: new Date() });
      const result = await m.create({ data: d });
      ok(res, result, '创建成功');
    } catch (e) { fail(res, friendlyError(e)); }
  });

  r.get('/', auth, async (req, res) => {
    try {
      const { page = 1, pageSize = 20, ...q } = req.query;
      const where = {};
      Object.entries(filters).forEach(([k, type]) => {
        if (q[k]) where[k] = { contains: q[k] };
      });
      exact.forEach(k => { if (q[k]) where[k] = q[k]; });
      // 组织过滤
      if (q.orgId) where.orgId = q.orgId;
      if (q.userId) where.userId = q.userId;

      const s = (parseInt(page) - 1) * parseInt(pageSize);
      const t = parseInt(pageSize);
      const [total, data] = await Promise.all([
        m.count({ where }),
        m.findMany({ where, skip: s, take: t, orderBy: { createdAt: 'desc' }, include })
      ]);
      ok(res, { total, page: +page, pageSize: t, data });
    } catch (e) { fail(res, friendlyError(e)); }
  });

  r.get('/:id', auth, async (req, res) => {
    try {
      const result = await m.findUnique({ where: { id: req.params.id }, include });
      if (!result) return fail(res, '记录不存在', 404);
      ok(res, result);
    } catch (e) { fail(res, friendlyError(e)); }
  });

  r.put('/:id', auth, async (req, res) => {
    try {
      const { id, ...data } = req.params;
      const d = sanitizeData({ ...req.body, updatedById: req.user.id, updatedAt: new Date() });
      const result = await m.update({ where: { id }, data: d });
      ok(res, result, '更新成功');
    } catch (e) { fail(res, friendlyError(e)); }
  });

  r.delete('/:id', auth, async (req, res) => {
    try {
      await m.delete({ where: { id: req.params.id } });
      ok(res, null, '删除成功');
    } catch (e) { fail(res, friendlyError(e)); }
  });

  return r;
}

module.exports = { prisma, auth, hashPw, cmpPw, sign, ok, fail, crud, sanitizeData, friendlyError };
