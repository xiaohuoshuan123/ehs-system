const { crud } = require('../utils/common');
module.exports = crud('Role', {
  filters: { name: 'contains' },
  exact: ['code', 'isActive']
});
