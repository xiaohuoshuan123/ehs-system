const { crud } = require('../utils/common');
module.exports = crud('Contractor', {
  filters: { name: 'contains', contactPerson: 'contains' },
  exact: ['orgId', 'status']
});
