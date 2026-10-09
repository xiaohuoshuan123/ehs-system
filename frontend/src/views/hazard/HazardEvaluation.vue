<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/hazard-evaluation',
  autoOrgId: true,
  columns: [
    { field: 'year', label: '年度', width: 80 },
    { field: 'quarter', label: '季度', width: 80 },
    { field: 'totalHazards', label: '隐患总数', width: 100 },
    { field: 'remediatedHazards', label: '已整改', width: 100 },
    { field: 'remediationRate', label: '整改率%', width: 100 },
    { field: 'overdueHazards', label: '逾期', width: 80 },
    { field: 'evaluationScore', label: '评分', width: 80 },
    { field: 'evaluationLevel', label: '评价', type: 'tag', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'year', label: '年度', type: 'input', required: true },
    { field: 'quarter', label: '季度', type: 'select', options: [{value:1,label:'Q1'},{value:2,label:'Q2'},{value:3,label:'Q3'},{value:4,label:'Q4'}] },
    { field: 'totalHazards', label: '隐患总数', type: 'input' },
    { field: 'remediatedHazards', label: '已整改数', type: 'input' },
    { field: 'majorHazards', label: '重大隐患数', type: 'input' },
    { field: 'majorRemediated', label: '重大已整改', type: 'input' },
    { field: 'overdueHazards', label: '逾期数', type: 'input' },
    { field: 'remediationRate', label: '整改率%', type: 'input' },
    { field: 'averageRemediationDays', label: '平均整改天数', type: 'input' },
    { field: 'evaluationScore', label: '评分', type: 'input' },
    { field: 'evaluationLevel', label: '评价等级', type: 'select', options: [{value:'excellent',label:'优秀'},{value:'good',label:'良好'},{value:'qualified',label:'合格'},{value:'poor',label:'差'}] },
    { field: 'evaluationContent', label: '评价内容', type: 'textarea' },
    { field: 'evaluator', label: '评价人', type: 'input' },
    { field: 'evaluatedAt', label: '评价日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'completed',label:'已完成'}] }
  ],
  statusMap: {
    evaluationLevel: { excellent: { label: '优秀', type: 'success' }, good: { label: '良好', type: 'primary' }, qualified: { label: '合格', type: 'info' }, poor: { label: '差', type: 'danger' } },
    status: { draft: { label: '草稿', type: 'info' }, completed: { label: '已完成', type: 'success' } }
  }
}
</script>