const { crud } = require('../utils/common');
module.exports = crud('SafetyPhilosophy', {
  filters: { content: 'contains' },
  exact: ['orgId', 'status', 'version']
});