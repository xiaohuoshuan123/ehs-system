const { crud } = require('../utils/common');
module.exports = crud('ContractorBlacklist', {
  filters: { reason: 'contains' },
  exact: ['contractorId', 'status']
});
