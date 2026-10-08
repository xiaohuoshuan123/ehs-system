const { crud } = require('../utils/common');
module.exports = crud('Hazard', {
  filters: { title: 'contains', content: 'contains', hazardNo: 'contains', area: 'contains' },
  exact: ['orgId', 'type', 'category', 'riskLevel', 'isMajor', 'fixStatus', 'assigneeId', 'verifierId']
});
