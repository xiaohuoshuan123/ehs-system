const { crud } = require('../utils/common');
module.exports = crud('EnvPermit', {
  filters: { permitType: 'contains', permitName: 'contains', permitNo: 'contains', issuingAuthority: 'contains' },
  exact: ['orgId', 'permitType', 'managementCategory', 'annualReport', 'renewalPlan', 'status']
});
