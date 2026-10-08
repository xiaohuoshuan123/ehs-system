const { crud } = require('../utils/common');
module.exports = crud('FireEquipment', {
  filters: { name: 'contains', location: 'contains' },
  exact: ['orgId', 'type', 'status']
});
