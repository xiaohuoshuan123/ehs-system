const { crud } = require('../utils/common');
module.exports = crud('EmergencyTeam', {
  filters: { name: 'contains', specialty: 'contains' },
  exact: ['orgId', 'teamType']
});
