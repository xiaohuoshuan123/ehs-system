const { crud } = require('../utils/common');
module.exports = crud('SafetyCertificate', {
  filters: { certType: 'contains', certCategory: 'contains', certNo: 'contains' },
  exact: ['userId', 'orgId', 'status', 'alertLevel']
});
