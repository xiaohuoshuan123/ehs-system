const { crud } = require('../utils/common');
module.exports = crud('EnvFactor', {
  filters: { factorName: 'contains', activity: 'contains', workUnit: 'contains', impact: 'contains' },
  exact: ['orgId', 'emissionType', 'grade', 'status']
});
