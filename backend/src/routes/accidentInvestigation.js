const { crud } = require('../utils/common');
module.exports = crud('AccidentInvestigation', {
  filters: { directCause: 'contains', indirectCause: 'contains', rootCause: 'contains' },
  exact: ['reportId', 'orgId', 'status']
});
