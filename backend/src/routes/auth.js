// 用户认证 - 登录/登出/注册
const express = require('express');
const { prisma, hashPw, cmpPw, sign, ok, fail } = require('../utils/common');
const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return fail(res, '用户不存在', 401);
    if (!user.isActive) return fail(res, '用户已禁用', 403);
    const valid = await cmpPw(password, user.password);
    if (!valid) return fail(res, '密码错误', 401);
    const { password: _, ...userData } = user;
    const token = sign({ id: user.id, username: user.username, name: user.realName });
    ok(res, { token, user: userData }, '登录成功');
  } catch (e) { fail(res, e.message); }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const h = req.headers.authorization;
    if (!h) return fail(res, '未登录', 401);
    const token = h.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { org: true, role: true }
    });
    if (!user) return fail(res, '用户不存在', 404);
    const { password, ...userData } = user;
    ok(res, userData);
  } catch (e) { fail(res, 'Token无效', 401); }
});

// 修改密码
router.put('/password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const h = req.headers.authorization;
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return fail(res, '用户不存在', 404);
    const valid = await cmpPw(oldPassword, user.password);
    if (!valid) return fail(res, '原密码错误');
    const hashed = await hashPw(newPassword);
    await prisma.user.update({ where: { id: decoded.id }, data: { password: hashed } });
    ok(res, null, '密码修改成功');
  } catch (e) { fail(res, e.message); }
});

module.exports = router;
