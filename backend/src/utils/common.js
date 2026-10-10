// ============================================================
// 永杰集团智慧安全管理系统 - 公共工具
// ============================================================
const { PrismaClient, Prisma } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');

const prisma = new PrismaClient();

// ---- 认证中间件 ----
// 校验 token 后从库中读取当前用户（含 orgId），挂到 req.user，
// 供各 CRUD 路由做 orgId 自动注入 / 组织级数据隔离。
const auth = async (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ code: 401, message: '未登录' });
  try {
    const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { org: true, role: true }
    });
    if (!user) return res.status(401).json({ code: 401, message: '用户不存在' });
    req.user = user;
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

// ============================================================
// 字段白名单过滤
//   不同模型字段差异大：部分模型没有 createdById/updatedById，
//   甚至没有 updatedAt。Prisma 对未知字段直接抛
//   "Unknown argument `xxx`" 并中断整个请求。
//   用 DMMF 取模型实际字段名做白名单，未知字段自动丢弃。
// ============================================================
// 缓存模型名→字段名集合（DMMF 启动后不变）
const _fieldCache = new Map();
function allowedFields(m, modelName) {
  let cached = _fieldCache.get(modelName);
  if (cached) return cached;
  try {
    // Prisma 5.x: Prisma.dmmf.datamodel.models 暴露完整模型定义
    const modelDef = Prisma.dmmf.datamodel.models.find(md => md.name === modelName);
    if (modelDef) {
      cached = new Set(modelDef.fields.map(f => f.name));
      _fieldCache.set(modelName, cached);
      return cached;
    }
  } catch {}
  _fieldCache.set(modelName, null);
  return null; // 获取失败时不过滤，保持原行为
}

// 仅保留模型真实存在的字段；无白名单时原样返回
function onlyKnownFields(m, modelName, d) {
  const allow = allowedFields(m, modelName);
  if (!allow) return d;
  const out = {};
  for (const [k, v] of Object.entries(d)) {
    if (allow.has(k)) out[k] = v;
  }
  return out;
}

// 缓存模型名→{字段名: 标量类型}映射 (DMMF 启动后不变)
// 用途: 查询参数全是字符串, Prisma 对 Int/Boolean 不接受字符串会直接抛错,
//      需按 schema 真实类型转换 (String/enum 等保持原样)。
const _fieldTypeCache = new Map();
function fieldTypes(modelName) {
  if (_fieldTypeCache.has(modelName)) return _fieldTypeCache.get(modelName);
  const map = {};
  try {
    const md = Prisma.dmmf.datamodel.models.find(x => x.name === modelName);
    if (md) md.fields.forEach(f => { map[f.name] = f.type; });
  } catch {}
  _fieldTypeCache.set(modelName, map);
  return map;
}

// 按 Prisma 标量类型转换字符串值 (无法识别时原样返回)
// NaN 防护: Prisma 收到 NaN 会抛错, 无法解析时回退原字符串保持原行为
function coerceScalar(raw, type) {
  if (type === 'Int') {
    const n = parseInt(raw, 10);
    return isNaN(n) ? raw : n;
  }
  if (type === 'Float') {
    const n = parseFloat(raw);
    return isNaN(n) ? raw : n;
  }
  if (type === 'Boolean') return ['1', 'true', 'yes'].includes(String(raw).toLowerCase());
  return raw;
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
      // 仅注入 createdAt（Prisma @default(now()) 可处理，显式设置以保兼容）；
      // 不注入 createdById —— 多数模型并无此字段
      // orgId 自动注入：若模型有 orgId 字段且前端未传/传空，则用当前用户的 orgId，
      // 避免前端 localStorage 缺失导致 Prisma "Argument orgId is missing"。
      // 用户未绑定组织（演示账号常见）时，回退到第一个组织，保证 KPI 等表可正常写入。
      const d0 = sanitizeData({ ...req.body, createdAt: new Date() });
      const d = onlyKnownFields(m, modelName, d0);
      if (d.orgId === null || d.orgId === undefined || d.orgId === '') {
        let uid = req.user && req.user.orgId;
        if (!uid) {
          const firstOrg = await prisma.organization.findFirst();
          uid = firstOrg?.id || null;
        }
        if (uid) d.orgId = uid;
      }
      const result = await m.create({ data: d });
      ok(res, result, '创建成功');
    } catch (e) { fail(res, friendlyError(e)); }
  });

  r.get('/', auth, async (req, res) => {
    try {
      const { page = 1, pageSize = 20, orderBy, ...q } = req.query;
      const where = {};
      Object.entries(filters).forEach(([k, type]) => {
        if (q[k]) where[k] = { contains: q[k] };
      });
      exact.forEach(k => {
        if (q[k] == null || q[k] === '') return;
        // 支持数组(multi-select)或逗号分隔字符串(dashboard链接),统一转 Prisma `in` 数组
        // 注意：Prisma findMany 的 where 不接受裸数组，必须是 { in: [...] } 形式
        const vals = Array.isArray(q[k])
          ? q[k].filter(Boolean)
          : String(q[k]).split(',').map(s => s.trim()).filter(Boolean);
        if (!vals.length) return;
        // 按 schema 真实标量类型转换: query 参数全是字符串,
        // Prisma 对 Int/Boolean 不接受字符串会直接抛错(400)。
        // String/enum/DateTime 等保持原样, 避免误判。
        const t = fieldTypes(modelName)[k];
        const conv = v => (t ? coerceScalar(v, t) : v);
        where[k] = vals.length === 1 ? conv(vals[0]) : { in: vals.map(conv) };
      });
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
      // 不注入 updatedById（多数模型无此字段）；
      // updatedAt 由 Prisma @updatedAt 自动维护，手动传入可能冲突，故也不注入
      const d = onlyKnownFields(m, modelName, sanitizeData({ ...req.body }));
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