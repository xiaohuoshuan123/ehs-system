const { crud } = require('../utils/common');
module.exports = crud('ExhaustEmission', {
  filters: { emissionSource: 'contains', category: 'contains', pollutant: 'contains', treatmentDevice: 'contains' },
  exact: ['orgId', 'category', 'exceedance', 'onlineMonitor', 'status']
});
