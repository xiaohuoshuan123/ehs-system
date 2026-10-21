const { crud } = require('../utils/common');
module.exports = crud('Violation', {
  filters: { description: 'contains' },
  exact: ['orgId', 'user', 'clauseId', 'status']
});
