const { crud } = require('../utils/common');

module.exports = crud('SelfAssessmentItem', {
  filters: { content: 'contains', category: 'contains', item: 'contains', assessmentDesc: 'contains' },
  exact: ['orgId', 'itemNo', 'year', 'categoryNo', 'notApplicable', 'completed'],
  // 考评内容必须按原始 Excel 行序显示。
  // 关键: 不能用 itemCode 字典序 —— 考评内容续行 (如 13-1-2~13-6-2, 是 "13.2.2 明确下列事项"
  // 的 (1)~(6) 列举项) 用连字符编号, ASCII 里 '-'(45) < '.'(46), 字典序会把整组续行
  // 挤到类目最前面, 用户看到 "13.2持续改进" 孤行、且续行脱离父项, 完全读不懂。
  // seq 由 seed 按原始 Excel 行号回填, 是最忠实于原表的排序键。
  // categoryNo 在前, 保证先按 13 个类目分组, 类目内再按行序。
  defaultOrderBy: [{ categoryNo: 'asc' }, { seq: 'asc' }, { itemCode: 'asc' }]
});
