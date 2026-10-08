const { crud } = require('../utils/common');
module.exports = crud('PPEItem', {
  filters: { name: 'contains', type: 'contains' },
  exact: ['orgId', 'status']
});
