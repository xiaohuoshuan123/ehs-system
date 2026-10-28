const { crud } = require('../utils/common');
module.exports = crud('AccidentArchive', {
  filters: {},
  exact: ['reportId', 'archiveType']
});
