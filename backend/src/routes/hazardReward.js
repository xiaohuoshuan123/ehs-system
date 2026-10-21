const { crud } = require('../utils/common');
module.exports = crud('HazardReward', {
  filters: { rewardType: 'contains', rewardDesc: 'contains' },
  exact: ['hazardId', 'status']
});
