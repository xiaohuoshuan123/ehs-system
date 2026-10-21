const { crud } = require('../utils/common');
module.exports = crud('DrillRecord', {
  filters: {},
  exact: ['planId', 'status']
});
