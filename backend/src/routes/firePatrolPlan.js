const { crud } = require('../utils/common');
module.exports = crud('FirePatrolPlan', {
  filters: { name: 'contains' },
  exact: ['orgId', 'zoneId', 'status']
});
