// 仪表盘 - 聚合统计
const express = require('express');
const { prisma, auth, ok, fail } = require('../utils/common');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    // 注意：count 的 where 条件不接受裸数组，必须用 { in: [...] } 形式
    const [hazardTotal, hazardOpen, hazardOverdue, examUpcoming, certExpiring, violationCount, accidentCount, todoPending, hazardRewards, activePermits, accidents] = await Promise.all([
      prisma.hazard.count(),
      prisma.hazard.count({ where: { fixStatus: { in: ['pending', 'in_progress', 'fixing'] } } }),
      prisma.hazard.count({ where: { fixStatus: 'overdue' } }),
      prisma.exam.count({ where: { status: 'active' } }),
      prisma.safetyCertificate.count({ where: { alertLevel: { in: ['30d', 'overdue'] } } }),
      prisma.violation.count(),
      prisma.accidentReport.count(),
      prisma.todoItem.count({ where: { status: 'pending' } }), // 全局待办（不限制 userId）
      prisma.hazardReward.count({ where: { status: 'approved' } }),
      prisma.workPermit.count({ where: { status: { in: ['submitted', 'in_progress'] } } }),
      // 事故列表 - 用于海因里希三角按等级分类
      prisma.accidentReport.findMany({ select: { accidentLevel: true } })
    ]);

    // 本月隐患趋势
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyHazards = await prisma.hazard.groupBy({
      by: ['category'],
      where: { foundDate: { gte: startOfMonth } },
      _count: { _all: true }
    });

    // 风险等级分布
    const riskDistribution = await prisma.riskControlList.groupBy({
      by: ['riskLevel'],
      where: { status: 'active' },
      _count: { _all: true }
    });

    // 培训统计
    const trainingStats = await prisma.userCourse.groupBy({
      by: ['status'],
      _count: { _all: true }
    });

    // ============================================================
    // 海因里希三角 (Heinrich's Triangle)
    // 经典比例 1:29:300：每 1 起重伤，伴随 29 起轻伤和 300 起无伤害事件
    // 实际数据分类规则：
    //   serious  - 重伤及以上 (重伤事故 / 死亡事故 / serious)
    //   minor    - 轻伤       (轻伤 / 设备事故 / minor)
    //   unrecorded - 未遂     (未遂事故 / unrecorded) + 违章 + 隐患
    // 违章与隐患属于"无伤害事件"（未遂事件），因为它们是被发现的潜在风险，
    // 尚未转化为事故，符合海因里希法则中"300"层的定义。
    // ============================================================
    const levels = {};
    for (const a of accidents) {
      levels[a.accidentLevel] = (levels[a.accidentLevel] || 0) + 1;
    }
    const heinrich = {
      serious: (levels['重伤事故'] || 0) + (levels['死亡事故'] || 0) + (levels['serious'] || 0),
      minor: (levels['轻伤'] || 0) + (levels['设备事故'] || 0) + (levels['minor'] || 0),
      unrecorded: (levels['未遂事故'] || 0) + (levels['unrecorded'] || 0) + violationCount + hazardTotal
    };
    // 海因里希比例：1 : 29 : 300
    // 实际比例 = 1 : (minor / serious) : (unrecorded / serious)
    // 当 serious=0 时无法计算真实比例，使用经典值 1:29:300 作为基准展示
    const seriousBase = heinrich.serious > 0 ? heinrich.serious : 1
    const ratio = {
      minor: +(heinrich.minor / seriousBase).toFixed(1),
      unrecorded: +(heinrich.unrecorded / seriousBase).toFixed(1)
    }
    heinrich.ratio = ratio
    // 标记是否为经典基准（serious=0 时使用）
    heinrich.isClassic = heinrich.serious === 0

    ok(res, {
      summary: {
        hazardTotal, hazardOpen, hazardOverdue,
        examUpcoming, certExpiring, violationCount,
        accidentCount, todoPending, hazardRewards, activePermits
      },
      heinrich,
      monthlyHazards,
      riskDistribution,
      trainingStats
    });
  } catch (e) { fail(res, e.message); }
});

module.exports = router;
