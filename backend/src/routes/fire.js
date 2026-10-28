const { crud } = require('../utils/common');
module.exports = crud('FireZone', {
  filters: { name: 'contains', zoneType: 'contains' },
  exact: ['orgId']
});
