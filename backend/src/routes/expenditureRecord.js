const { crud } = require('../utils/common');
module.exports = crud('SafetyExpenditureRecord', {
  filters: { category: 'contains', description: 'contains' },
  exact: ['planId', 'orgId', 'month']
});
