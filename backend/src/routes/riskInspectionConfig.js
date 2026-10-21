const { crud } = require('../utils/common');
module.exports = crud('RiskInspectionConfig', {
  filters: {},
  exact: ['orgId', 'riskControlId', 'frequency', 'inspectLevel']
});
