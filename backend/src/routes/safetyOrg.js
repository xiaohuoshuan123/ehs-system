const { crud } = require('../utils/common');
module.exports = crud('SafetyManagementOrg', {
  filters: { name: 'contains' },
  exact: ['orgId', 'parentId']
});
