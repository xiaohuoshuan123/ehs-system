<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/performance-assessment',
  autoOrgId: true,
  columns: [
    { field: 'year', label: '年度', width: 80 },
    { field: 'period', label: '周期', type: 'tag', width: 100 },
    { field: 'totalScore', label: '总分', width: 80 },
    { field: 'grade', label: '等级', type: 'tag', width: 100 },
    { field: 'evaluatedAt', label: '评价日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'year', label: '年度', type: 'input', required: true },
    { field: 'period', label: '周期', type: 'select', options: [{value:'quarterly',label:'季度'},{value:'semi_annual',label:'半年'},{value:'annual',label:'年度'}] },
    { field: 'leaderScore', label: '领导分', type: 'input' },
    { field: 'targetScore', label: '目标分', type: 'input' },
    { field: 'organizationScore', label: '组织分', type: 'input' },
    { field: 'riskControlScore', label: '风控分', type: 'input' },
    { field: 'hazardScore', label: '隐患分', type: 'input' },
    { field: 'personnelScore', label: '人员分', type: 'input' },
    { field: 'siteScore', label: '现场分', type: 'input' },
    { field: 'emergencyScore', label: '应急分', type: 'input' },
    { field: 'improvementScore', label: '改进分', type: 'input' },
    { field: 'totalScore', label: '总分', type: 'input' },
    { field: 'grade', label: '等级', type: 'select', options: [{value:'excellent',label:'优秀'},{value:'good',label:'良好'},{value:'qualified',label:'合格'},{value:'unqualified',label:'不合格'}] },
    { field: 'summary', label: '总结', type: 'textarea' },
    { field: 'evaluator', label: '评价人', type: 'input' },
    { field: 'evaluatedAt', label: '评价日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'completed',label:'已完成'},{value:'approved',label:'已批准'}] }
  ],
  statusMap: {
    period: { quarterly: { label: '季度', type: 'primary' }, semi_annual: { label: '半年', type: 'warning' }, annual: { label: '年度', type: 'success' } },
    grade: { excellent: { label: '优秀', type: 'success' }, good: { label: '良好', type: 'primary' }, qualified: { label: '合格', type: 'info' }, unqualified: { label: '不合格', type: 'danger' } },
    status: { draft: { label: '草稿', type: 'info' }, completed: { label: '已完成', type: 'success' }, approved: { label: '已批准', type: 'primary' } }
  }
}
</script>