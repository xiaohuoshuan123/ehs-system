// 安全金字塔 KPI - 7层事故金字塔数据录入
const { crud } = require('../utils/common');
module.exports = crud('SafetyKpi', {
  filters: { remark: 'contains' },
  // year/month 精确筛选，orgId 走 autoOrgId 注入
  exact: ['orgId', 'year', 'month']
});