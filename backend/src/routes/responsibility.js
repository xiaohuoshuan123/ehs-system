const { crud } = require('../utils/common');
module.exports = crud('ResponsibilitySystem', {
  filters: { title: 'contains' },
  exact: ['orgId', 'version', 'year', 'status', 'reviewStatus']
});
