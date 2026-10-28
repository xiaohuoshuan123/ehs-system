const { crud } = require('../utils/common');
module.exports = crud('SoilMonitoring', {
  filters: { plotName: 'contains', location: 'contains', sampleType: 'contains', pollutants: 'contains' },
  exact: ['orgId', 'sampleType', 'exceedance', 'status']
});
