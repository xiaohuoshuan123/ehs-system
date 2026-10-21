const { crud } = require('../utils/common');
module.exports = crud('UnsafeBehavior', {
  filters: { employeeName: 'contains', description: 'contains' },
  exact: ['orgId', 'behaviorType', 'handlingType', 'status']
});