const { crud } = require('../utils/common');
module.exports = crud('RiskInspection', {
  filters: {},
  exact: ['configId', 'orgId', 'inspectorId', 'result', 'status']
});
