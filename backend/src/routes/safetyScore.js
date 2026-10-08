const { crud } = require('../utils/common');
module.exports = crud('SafetyScore', {
  filters: { orgName: 'contains' },
  exact: ['orgId', 'year', 'month', 'alertLevel']
});
