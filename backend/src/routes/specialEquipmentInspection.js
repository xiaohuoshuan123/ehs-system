const { crud } = require('../utils/common');
module.exports = crud('SpecialEquipmentInspection', {
  filters: {},
  exact: ['equipmentId', 'result']
});
