const { crud } = require('../utils/common');
module.exports = crud('WorkBehaviorMonitoring', {
  filters: { cameraName: 'contains', description: 'contains' },
  exact: ['orgId', 'behaviorType', 'riskLevel', 'status']
});