const { crud } = require('../utils/common');
module.exports = crud('SafetyLeadership', {
  filters: { leaderName: 'contains', content: 'contains' },
  exact: ['orgId', 'leaderRole', 'leadershipType']
});