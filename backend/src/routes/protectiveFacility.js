const { crud } = require('../utils/common');
module.exports = crud('ProtectiveFacility', {
  filters: { name: 'contains', category: 'contains', location: 'contains' },
  exact: ['orgId', 'status']
});
