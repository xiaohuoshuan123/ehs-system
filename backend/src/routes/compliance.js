const { crud } = require('../utils/common');
module.exports = crud('ComplianceAssessment', {
  filters: { title: 'contains' },
  exact: ['orgId', 'year', 'status']
});
