const { crud } = require('../utils/common');
module.exports = crud('EmergencyPlan', {
  filters: { title: 'contains' },
  exact: ['orgId', 'planType', 'year', 'status']
});
