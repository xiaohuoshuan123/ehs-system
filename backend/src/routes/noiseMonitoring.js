const { crud } = require('../utils/common');
module.exports = crud('NoiseMonitoring', {
  filters: { boundaryPoint: 'contains', noiseSource: 'contains', monitoringUnit: 'contains' },
  exact: ['orgId', 'standardClass', 'exceedance', 'status']
});
