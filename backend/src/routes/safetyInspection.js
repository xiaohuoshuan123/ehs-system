const { crud } = require('../utils/common');
module.exports = crud('SafetyInspection', {
  filters: { title: 'contains', location: 'contains' },
  exact: ['orgId', 'type', 'status', 'inspector']
});