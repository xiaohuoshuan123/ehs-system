const { crud } = require('../utils/common');
module.exports = crud('DosimeterRecord', {
  filters: { deviceNo: 'contains' },
  exact: ['orgId', 'userId', 'isAbnormal', 'signStatus']
});
