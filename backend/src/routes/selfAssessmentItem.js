const { crud } = require('../utils/common');
module.exports = crud('SelfAssessmentItem', {
  filters: { content: 'contains', category: 'contains', item: 'contains', assessmentDesc: 'contains' },
  exact: ['orgId', 'itemNo', 'year', 'categoryNo', 'notApplicable', 'completed']
});
