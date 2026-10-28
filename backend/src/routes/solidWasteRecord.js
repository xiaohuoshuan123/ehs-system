const { crud } = require('../utils/common');
module.exports = crud('SolidWasteRecord', {
  filters: { wasteName: 'contains', wasteCode: 'contains', category: 'contains', transportUnit: 'contains' },
  exact: ['orgId', 'category', 'hazardClass', 'status']
});
