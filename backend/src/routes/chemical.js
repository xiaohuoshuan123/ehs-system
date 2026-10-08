const { crud } = require('../utils/common');
module.exports = crud('Chemical', {
  filters: { name: 'contains', aliases: 'contains', casNo: 'contains' },
  exact: ['orgId', 'isHazardous', 'isEasyToxic', 'isExplosive', 'isProhibited', 'status']
});
