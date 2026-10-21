const { crud } = require('../utils/common');
module.exports = crud('LeadershipEvaluation', {
  filters: { leaderName: 'contains' },
  exact: ['orgId', 'leaderRole', 'year', 'quarter', 'grade']
});