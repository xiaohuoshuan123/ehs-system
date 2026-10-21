const { crud } = require('../utils/common');
module.exports = crud('RiskReview', {
  filters: {},
  exact: ['orgId', 'year', 'status']
});
