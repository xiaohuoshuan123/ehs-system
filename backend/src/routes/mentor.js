const { crud } = require('../utils/common');
module.exports = crud('MentorApprentice', {
  filters: {},
  exact: ['orgId', 'mentorId', 'apprenticeId', 'status']
});
