const { crud } = require('../utils/common');
module.exports = crud('ExamRecord', {
  filters: {},
  exact: ['examId', 'userId', 'isPassed']
});
