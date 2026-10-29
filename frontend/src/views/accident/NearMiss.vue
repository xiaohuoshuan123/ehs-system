<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/near-miss',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '标题', width: 200 },
    { field: 'location', label: '位置', width: 150 },
    { field: 'potentialSeverity', label: '潜在严重性', type: 'tag', width: 120 },
    { field: 'reportedBy', label: '报告人', width: 100 },
    { field: 'reportedAt', label: '报告日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'location', label: '位置', type: 'input', required: true },
    { field: 'description', label: '描述', type: 'textarea', required: true },
    { field: 'potentialSeverity', label: '潜在严重性', type: 'select', options: [{value:'minor',label:'轻微'},{value:'serious',label:'严重'},{value:'catastrophic',label:'灾难性'}] },
    { field: 'reportedBy', label: '报告人', type: 'input', required: true },
    { field: 'reportedAt', label: '报告日期', type: 'date', required: true },
    { field: 'analysis', label: '原因分析', type: 'textarea' },
    { field: 'correctiveAction', label: '纠正措施', type: 'textarea' },
    { field: 'completedAt', label: '完成日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'reported',label:'已报告'},{value:'analyzing',label:'分析中'},{value:'corrected',label:'已纠正'},{value:'closed',label:'已关闭'}] }
  ],
  statusMap: {
    potentialSeverity: { minor: { label: '轻微', type: 'info' }, serious: { label: '严重', type: 'warning' }, catastrophic: { label: '灾难性', type: 'danger' } },
    status: { reported: { label: '已报告', type: 'primary' }, analyzing: { label: '分析中', type: 'warning' }, corrected: { label: '已纠正', type: 'success' }, closed: { label: '已关闭', type: 'info' } }
  }
}
</script>