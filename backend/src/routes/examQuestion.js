const { crud } = require('../utils/common');
module.exports = crud('ExamQuestion', {
  filters: { content: 'contains', category: 'contains' },
  exact: ['orgId', 'visibility', 'type']
});
