const { crud } = require('../utils/common');
module.exports = crud('DrillAssessment', {
  filters: { conclusion: 'contains', suggestions: 'contains' },
  exact: ['recordId', 'approveStatus']
});
