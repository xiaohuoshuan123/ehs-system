const { crud } = require('../utils/common');
module.exports = crud('InternalRegulation', {
  filters: { title: 'contains', regulationNo: 'contains', category: 'contains' },
  exact: ['orgId', 'status']
});
