const { crud } = require('../utils/common');
module.exports = crud('SpecialEquipment', {
  filters: { name: 'contains', code: 'contains', type: 'contains', registrationNo: 'contains' },
  exact: ['orgId', 'status', 'alertStatus']
});
