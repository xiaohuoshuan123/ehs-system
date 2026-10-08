const { crud } = require('../utils/common');
module.exports = crud('AccidentResponsibility', {
  filters: {},
  exact: ['reportId', 'responsibleUser', 'responsibilityType']
});
