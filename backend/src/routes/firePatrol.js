const { crud } = require('../utils/common');
module.exports = crud('FirePatrol', {
  filters: { result: 'contains' },
  exact: ['planId', 'status']
});
