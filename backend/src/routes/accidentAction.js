const { crud } = require('../utils/common');
module.exports = crud('AccidentActionPlan', {
  filters: { description: 'contains' },
  exact: ['investigationId', 'responsibleId', 'status']
});
