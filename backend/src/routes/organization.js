const { crud } = require('../utils/common');
module.exports = crud('Organization', {
  filters: { name: 'contains' },
  exact: ['code', 'level', 'parentId']
});
