const { crud } = require('../utils/common');
module.exports = crud('EquipmentMaintenance', {
  filters: { content: 'contains' },
  exact: ['equipmentId', 'type', 'status']
});
