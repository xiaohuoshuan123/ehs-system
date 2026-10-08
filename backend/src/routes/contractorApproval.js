const { crud } = require('../utils/common');
module.exports = crud('ContractorApproval', {
  filters: { comment: 'contains' },
  exact: ['contractorId', 'type', 'result']
});
