const { crud } = require('../utils/common');
module.exports = crud('RiskMap', {
  filters: { areaName: 'contains' },
  exact: ['orgId', 'workUnitId']
});
