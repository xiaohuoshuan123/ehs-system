const { crud } = require('../utils/common');
module.exports = crud('TodoItem', {
  filters: { title: 'contains' },
  exact: ['userId', 'module', 'status']
});
