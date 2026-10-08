const { crud } = require('../utils/common');
module.exports = crud('SafetyCommittee', {
  filters: { name: 'contains' },
  exact: ['orgId']
});
