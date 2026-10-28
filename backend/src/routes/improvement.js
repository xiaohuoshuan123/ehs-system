const { crud } = require('../utils/common');
module.exports = crud('ContinuousImprovement', {
  filters: { title: 'contains', gap: 'contains' },
  exact: ['orgId', 'reviewId', 'responsibleId', 'status']
});
