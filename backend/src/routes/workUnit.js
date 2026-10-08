const { crud } = require('../utils/common');
module.exports = crud('WorkUnit', {
  filters: { name: 'contains', description: 'contains' },
  exact: ['orgId', 'parentId', 'type']
});
