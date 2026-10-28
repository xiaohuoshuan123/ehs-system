const { crud } = require('../utils/common');
module.exports = crud('PerformanceReview', {
  filters: { title: 'contains' },
  exact: ['orgId', 'year', 'reviewType', 'status']
});
