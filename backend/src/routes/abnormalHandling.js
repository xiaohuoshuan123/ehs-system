const { crud } = require('../utils/common');
module.exports = crud('AbnormalHandling', {
  filters: { title: 'contains', description: 'contains', location: 'contains' },
  exact: ['orgId', 'abnormalType', 'riskLevel', 'status']
});