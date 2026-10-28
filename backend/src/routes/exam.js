const { crud } = require('../utils/common');
module.exports = crud('Exam', {
  filters: { title: 'contains' },
  exact: ['orgId', 'status', 'isPractice']
});
