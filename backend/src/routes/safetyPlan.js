const { crud } = require('../utils/common');
module.exports = crud('SafetyPlan', {
  filters: { title: 'contains' },
  exact: ['orgId', 'year', 'status']
});
