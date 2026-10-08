const { crud } = require('../utils/common');
module.exports = crud('EmergencySupplies', {
  filters: { name: 'contains', location: 'contains', purpose: 'contains' },
  exact: ['orgId', 'status']
});
