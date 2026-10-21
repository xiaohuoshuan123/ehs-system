const { crud } = require('../utils/common');
module.exports = crud('DrillPlan', {
  filters: { title: 'contains', location: 'contains' },
  exact: ['orgId', 'planType', 'year', 'month', 'status']
});
