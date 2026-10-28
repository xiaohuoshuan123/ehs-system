const { crud } = require('../utils/common');
module.exports = crud('RiskControlList', {
  filters: { hazardSource: 'contains', controlMeasures: 'contains' },
  exact: ['orgId', 'workUnitId', 'riskCategory', 'riskLevel', 'isMajorAbove', 'status']
});
