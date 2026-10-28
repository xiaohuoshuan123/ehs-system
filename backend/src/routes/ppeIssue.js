const { crud } = require('../utils/common');
module.exports = crud('PPEIssue', {
  filters: {},
  exact: ['orgId', 'userId', 'ppeItemId', 'approveStatus', 'issueStatus']
});
