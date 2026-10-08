const { crud } = require('../utils/common');
module.exports = crud('SafetyExpenditurePlan', {
  filters: {},
  exact: ['orgId', 'year', 'status']
});
