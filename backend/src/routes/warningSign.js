const { crud } = require('../utils/common');
module.exports = crud('WarningSign', {
  filters: { hazardFactor: 'contains', location: 'contains' },
  exact: ['orgId', 'signType', 'status']
});
