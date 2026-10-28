const { crud } = require('../utils/common');
module.exports = crud('NearMiss', {
  filters: { title: 'contains', description: 'contains' },
  exact: ['orgId', 'potentialSeverity', 'status']
});