const { crud } = require('../utils/common');
module.exports = crud('UserCourse', {
  filters: {},
  exact: ['courseId', 'userId', 'status', 'isPassed']
});
