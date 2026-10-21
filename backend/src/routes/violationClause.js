const { crud } = require('../utils/common');
module.exports = crud('ViolationClause', {
  filters: { title: 'contains', clauseNo: 'contains', content: 'contains' },
  exact: ['orgId', 'category', 'status']
});
