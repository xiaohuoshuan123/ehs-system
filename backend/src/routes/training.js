const { crud } = require('../utils/common');
module.exports = crud('SafetyTraining', {
  filters: { teacher: 'contains' },
  exact: ['orgId', 'trainType', 'userId']
});
