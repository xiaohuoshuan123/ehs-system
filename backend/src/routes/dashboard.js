// 仪表盘 - 聚合统计
const express = require('express');
const { prisma, auth, ok, fail } = require('../utils/common');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [hazardTotal, hazardOpen, hazardOverdue, examUpcoming, certExpiring, violationCount, accidentCount, todoPending, hazardRewards, activePermits] = await Promise.all([
      prisma.hazard.count(),
      prisma.hazard.count({ where: { fixStatus: { in: ['pending', 'in_progress', 'fixing'] } } }),
      prisma.hazard.count({ where: { fixStatus: 'overdue' } }),
      prisma.exam.count({ where: { status: 'active' } }),
      prisma.safetyCertificate.count({ where: { alertLevel: { in: ['30d', 'overdue'] } } }),
      prisma.violation.count(),
      prisma.accidentReport.count(),
      prisma.todoItem.count({ where: { userId: req.user.id, status: 'pending' } }),
      prisma.hazardReward.count({ where: { status: 'approved' } }),
      prisma.workPermit.count({ where: { status: { in: ['submitted', 'in_progress'] } } })
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

    ok(res, {
      summary: {
        hazardTotal, hazardOpen, hazardOverdue,
        examUpcoming, certExpiring, violationCount,
        accidentCount, todoPending, hazardRewards, activePermits
      },
      monthlyHazards,
      riskDistribution,
      trainingStats
    });
  } catch (e) { fail(res, e.message); }
});

module.exports = router;
