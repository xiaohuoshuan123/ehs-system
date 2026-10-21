const { crud } = require('../utils/common');
module.exports = crud('SafetyCourse', {
  filters: { title: 'contains' },
  exact: ['orgId', 'courseType', 'isRequired', 'status']
});
