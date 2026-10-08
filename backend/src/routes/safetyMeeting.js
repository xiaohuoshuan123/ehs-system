const { crud } = require('../utils/common');
module.exports = crud('SafetyMeeting', {
  filters: { title: 'contains' },
  exact: ['orgId', 'committeeId']
});
