const { crud } = require('../utils/common');
module.exports = crud('OccupationalExamResult', {
  filters: {},
  exact: ['planId', 'orgId', 'userId', 'resultType', 'signStatus', 'processStatus']
});
