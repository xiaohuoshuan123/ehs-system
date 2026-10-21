const { crud } = require('../utils/common');
module.exports = crud('WorkSafetyCheck', {
  filters: {},
  exact: ['orgId', 'checkType', 'result']
});
