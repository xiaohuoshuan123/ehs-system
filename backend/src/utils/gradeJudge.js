// 安全生产标准化评定等级判定
// 等级须同时满足「标准化得分达线」+「安全绩效条件」，二者缺一不可。
//
// 口径逐字对照《有色金属压力加工企业安全生产标准化评定标准》（安监总管四〔2011〕130号）:
//   一级 ≥90  申请评审之日前一年内，无人员死亡的生产安全事故，千人重伤率≤1；
//              无100万元以上直接经济损失的事故；在评定年度内无职业病发生。
//   二级 ≥75  千人死亡率≤0.1，千人重伤率≤3；无300万元以上直接经济损失的事故；
//              在评定年度内职业病发病率≤1‰。
//   三级 ≥60  千人死亡率≤0.3，无较大以上事故，千人重伤率≤5；无500万元以上直接经济损失
//              的事故；在评定年度内职业病发病率≤2‰。
//
// 千人 = 每千名员工；职业病发病率按每千人计。
// 安全绩效由自评人在自评表填报（系统无事故/职业病/经济损失数据源），
// 缺任一字段（含 0 员工数）即视为未填报，不做推断。

const GRADES = [
  {
    level: '一级', min: 90,
    cond: '申请评审之日前一年内，无人员死亡的生产安全事故，千人重伤率≤1；无100万元以上直接经济损失的事故；在评定年度内无职业病发生。',
    test: p => p.deaths === 0 && p.injuryRate <= 1 && p.econLossMax <= 100 && p.odIncidence === 0
  },
  {
    level: '二级', min: 75,
    cond: '申请评审之日前一年内，千人死亡率≤0.1，千人重伤率≤3；无300万元以上直接经济损失的事故；在评定年度内职业病发病率≤1‰。',
    test: p => p.deathRate <= 0.1 && p.injuryRate <= 3 && p.econLossMax <= 300 && p.odIncidence <= 1
  },
  {
    level: '三级', min: 60,
    cond: '申请评审之日前一年内，千人死亡率≤0.3，无较大以上事故，千人重伤率≤5；无500万元以上直接经济损失的事故；在评定年度内职业病发病率≤2‰。',
    test: p => p.deathRate <= 0.3 && p.majorOrAbove === false && p.injuryRate <= 5 && p.econLossMax <= 500 && p.odIncidence <= 2
  }
];

// 由填报的原始量算出实际千人率。employees 无效时返回 null（视为未填报，避免除零）。
function perfIndicators(p) {
  const n = Number(p && p.employees);
  if (!n || n <= 0) return null;
  return {
    employees: n,
    deathRate: Number(p.deaths || 0) / n * 1000,
    injuryRate: Number(p.seriousInjuries || 0) / n * 1000,
    odIncidence: Number(p.odCases || 0) / n * 1000,
    deaths: Number(p.deaths || 0),
    econLossMax: Number(p.econLossMax || 0),
    majorOrAbove: !!p.majorOrAbove
  };
}

// 等级判定：逐档检查。GRADES 按门槛降序排列（一级 90 / 二级 75 / 三级 60），
// 得分不达某档门槛时只跳过该档（continue），低门槛档仍需检查——
// 例如 61 分不达一级/二级门槛，但达三级，必须继续往下判。
// 得分达标但绩效不过 -> 该档不成立，继续试下一档；两者都满足 -> 取该档返回。
// perf 为 null 表示安全绩效未填报，不做推断。
function judgeLevel(score, perf) {
  const byScore = GRADES.find(g => score >= g.min);
  if (!byScore) {
    return {
      level: '未达三级', byScore: null, perfFilled: !!perf,
      reason: `标准化得分 ${score} 分，未达三级要求（≥60 分）`
    };
  }
  if (!perf) {
    return {
      level: `得分对应${byScore.level}`, byScore: byScore.level, perfFilled: false,
      reason: `标准化得分达${byScore.level}门槛；安全绩效未填报，等级须核对安全绩效后确认`
    };
  }
  const p0 = { ...perf, majorOrAbove: !!perf.majorOrAbove };
  for (const g of GRADES) {
    if (score < g.min) continue;      // 仅跳过本档, 低门槛档继续检查
    if (g.test(p0)) {
      return {
        level: g.level, byScore: byScore.level, perfFilled: true,
        reason: `标准化得分 ${score} 分（达${byScore.level}门槛），安全绩效满足${g.level}全部条件`
      };
    }
  }
  return {
    level: byScore.level === '三级' ? '未达三级' : `绩效降级至三级以下`,
    byScore: byScore.level, perfFilled: true,
    reason: `标准化得分 ${score} 分（达${byScore.level}门槛），但安全绩效不满足任何一档条件；等级须得分与绩效同时满足，需整改后重新自评`
  };
}

module.exports = { GRADES, judgeLevel, perfIndicators };
