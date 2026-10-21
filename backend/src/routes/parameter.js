const { crud } = require('../utils/common');
module.exports = crud('SystemParameter', {
  filters: { key: 'contains', module: 'contains', category: 'contains', description: 'contains' },
  exact: ['isActive']
});
