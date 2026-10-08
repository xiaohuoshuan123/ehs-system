const { crud } = require('../utils/common');
module.exports = crud('AccidentCommunication', {
  filters: { title: 'contains', content: 'contains' },
  exact: ['reportId', 'studyStatus']
});
