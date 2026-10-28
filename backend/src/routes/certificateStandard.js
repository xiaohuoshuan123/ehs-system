const { crud } = require('../utils/common');
module.exports = crud('CertificateStandard', {
  filters: { certType: 'contains' },
  exact: ['orgId']
});
