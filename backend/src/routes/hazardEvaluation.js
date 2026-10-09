const { crud } = require('../utils/common');
module.exports = crud('HazardRemediationEvaluation', {
  filters: {},
  exact: ['orgId', 'year', 'quarter', 'status', 'evaluationLevel']
});