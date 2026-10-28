const { crud } = require('../utils/common');
module.exports = crud('DeepCastMonitor', {
  filters: { description: 'contains' },
  exact: ['orgId', 'alarmType', 'alarmLevel', 'status']
});
