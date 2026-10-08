const { crud } = require('../utils/common');
module.exports = crud('EquipmentInspection', {
  filters: {},
  exact: ['equipmentId', 'orgId', 'type', 'result', 'status']
});
