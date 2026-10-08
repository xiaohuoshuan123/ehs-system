const { crud } = require('../utils/common');
module.exports = crud('RiskFactor', {
  filters: { name: 'contains', category: 'contains' },
  exact: ['orgId', 'level', 'status']
});
