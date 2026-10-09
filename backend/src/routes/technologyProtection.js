const { crud } = require('../utils/common');
module.exports = crud('TechnologyProtection', {
  filters: { name: 'contains', description: 'contains' },
  exact: ['orgId', 'type', 'status']
});