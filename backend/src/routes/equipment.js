const { crud } = require('../utils/common');
module.exports = crud('Equipment', {
  filters: { name: 'contains', code: 'contains', type: 'contains', spec: 'contains' },
  exact: ['orgId', 'status', 'responsibleDept']
});
