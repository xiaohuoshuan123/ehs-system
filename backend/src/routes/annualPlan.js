const { crud } = require('../utils/common');
module.exports = crud('AnnualPlan', {
  filters: { title: 'contains' },
  exact: ['orgId', 'year', 'status']
});
