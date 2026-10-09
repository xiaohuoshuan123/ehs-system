const { crud } = require('../utils/common');
module.exports = crud('WastewaterEmission', {
  filters: { dischargePoint: 'contains', source: 'contains', category: 'contains', treatmentProcess: 'contains' },
  exact: ['orgId', 'category', 'exceedance', 'onlineMonitor', 'status']
});
