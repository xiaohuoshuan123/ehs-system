const { crud } = require('../utils/common');
module.exports = crud('Notification', {
  filters: { title: 'contains', content: 'contains' },
  exact: ['userId', 'type', 'level', 'isRead']
});
