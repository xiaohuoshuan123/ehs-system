const { crud } = require('../utils/common');
module.exports = crud('User', {
  filters: { realName: 'contains', username: 'contains', employeeNo: 'contains', email: 'contains', phone: 'contains' },
  exact: ['orgId', 'roleId', 'isActive', 'isExternal']
});
