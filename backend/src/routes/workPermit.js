const { crud } = require('../utils/common');
module.exports = crud('WorkPermit', {
  filters: { title: 'contains', permitNo: 'contains', workType: 'contains', location: 'contains' },
  exact: ['orgId', 'approveStatus', 'status']
});
