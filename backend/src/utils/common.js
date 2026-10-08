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

// ---- 通用CRUD生成器 ----
// options: { filters: {field:'contains'...}, exact: ['field'...], include: [...] }
function crud(modelName, opts = {}) {
  const r = express.Router();
  const m = prisma[modelName];
  if (!m) return r;

  const { filters = {}, exact = [], include } = opts;

  r.post('/', auth, async (req, res) => {
    try {
      const d = { ...req.body, createdById: req.user.id, createdAt: new Date() };
      const result = await m.create({ data: d });
      ok(res, result, '创建成功');
    } catch (e) { fail(res, e.message); }
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
    } catch (e) { fail(res, e.message); }
  });

  r.get('/:id', auth, async (req, res) => {
    try {
      const result = await m.findUnique({ where: { id: req.params.id }, include });
      if (!result) return fail(res, '记录不存在', 404);
      ok(res, result);
    } catch (e) { fail(res, e.message); }
  });

  r.put('/:id', auth, async (req, res) => {
    try {
      const { id, ...data } = req.params;
      const d = { ...req.body, updatedById: req.user.id, updatedAt: new Date() };
      const result = await m.update({ where: { id }, data: d });
      ok(res, result, '更新成功');
    } catch (e) { fail(res, e.message); }
  });

  r.delete('/:id', auth, async (req, res) => {
    try {
      await m.delete({ where: { id: req.params.id } });
      ok(res, null, '删除成功');
    } catch (e) { fail(res, e.message); }
  });

  return r;
}

module.exports = { prisma, auth, hashPw, cmpPw, sign, ok, fail, crud };
