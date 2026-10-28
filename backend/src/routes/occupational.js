const { crud } = require('../utils/common');
module.exports = crud('OccupationalExamPlan', {
  filters: {},
  exact: ['orgId', 'year', 'planType', 'status']
});
