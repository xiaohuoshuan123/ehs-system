const { crud } = require('../utils/common');
module.exports = crud('RiskChange', {
  filters: { reason: 'contains', conclusion: 'contains' },
  exact: ['riskControlId', 'changeType']
});
