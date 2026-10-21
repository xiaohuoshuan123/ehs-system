const { crud } = require('../utils/common');
module.exports = crud('LegalRegulation', {
  filters: { title: 'contains', source: 'contains', regulationNo: 'contains' },
  exact: ['isApplicable']
});
