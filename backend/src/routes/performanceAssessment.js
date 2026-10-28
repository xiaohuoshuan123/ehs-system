const { crud } = require('../utils/common');
module.exports = crud('PerformanceAssessment', {
  filters: {},
  exact: ['orgId', 'year', 'period', 'status', 'grade']
});