const { crud } = require('../utils/common');
module.exports = crud('HazardFacility', {
  filters: { name: 'contains', location: 'contains' },
  exact: ['orgId', 'type', 'status']
});
