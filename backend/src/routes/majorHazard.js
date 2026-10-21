const { crud } = require('../utils/common');
module.exports = crud('MajorHazard', {
  filters: { title: 'contains', description: 'contains', location: 'contains' },
  exact: ['orgId', 'riskLevel', 'category', 'status', 'reportStatus']
});