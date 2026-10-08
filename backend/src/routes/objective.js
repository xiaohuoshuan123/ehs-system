const { crud } = require('../utils/common');
module.exports = crud('AnnualObjective', {
  filters: { title: 'contains' },
  exact: ['orgId', 'year', 'level', 'status']
});
