const { crud } = require('../utils/common');
module.exports = crud('InspectionPlan', {
  filters: { name: 'contains' },
  exact: ['orgId', 'planType', 'status']
});
