const { crud } = require('../utils/common');
module.exports = crud('PersonnelEntry', {
  filters: { employeeName: 'contains', position: 'contains' },
  exact: ['orgId', 'department', 'education', 'status', 'healthCheck']
});