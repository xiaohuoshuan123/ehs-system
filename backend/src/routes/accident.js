const { crud } = require('../utils/common');
module.exports = crud('AccidentReport', {
  filters: { title: 'contains', accidentNo: 'contains', location: 'contains' },
  exact: ['orgId', 'accidentType', 'accidentLevel', 'status']
});
