const { crud } = require('../utils/common');
module.exports = crud('SafetyObservation', {
  filters: { content: 'contains', location: 'contains' },
  exact: ['orgId', 'obsType', 'observer', 'status', 'followUpStatus']
});
