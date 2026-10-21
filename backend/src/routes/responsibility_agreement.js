const { crud } = require('../utils/common');
module.exports = crud('ObjectiveResponsibilityAgreement', {
  filters: {},
  exact: ['objectiveId', 'user', 'signStatus', 'approverId']
});
