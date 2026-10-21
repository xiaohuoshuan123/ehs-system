const { crud } = require('../utils/common');
module.exports = crud('ChangeRequest', {
  filters: { title: 'contains', changeNo: 'contains', changeType: 'contains' },
  exact: ['orgId', 'approveStatus']
});
