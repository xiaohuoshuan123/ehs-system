const { crud } = require('../utils/common');
module.exports = crud('SafetyCommunication', {
  filters: { title: 'contains', content: 'contains' },
  exact: ['orgId', 'type', 'channel']
});