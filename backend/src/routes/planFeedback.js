const { crud } = require('../utils/common');
module.exports = crud('PlanFeedback', {
  filters: { feedbackBy: 'contains', actions: 'contains', measures: 'contains' },
  exact: ['planId', 'orgId', 'status']
});
