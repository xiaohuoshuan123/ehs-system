<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/risk-review',
  autoOrgId: true,
  columns: [
    { field: 'year', label: '年度', width: 80 },
    { field: 'reviewerId', label: '评审人', width: 150 },
    { field: 'reviewDate', label: '评审日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'reviewerId', label: '评审人ID', type: 'input', required: true },
    { field: 'reviewDate', label: '评审日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待评审'},{value:'in_progress',label:'评审中'},{value:'completed',label:'已完成'}] },
    { field: 'reportFileUrl', label: '报告文件', type: 'input' }
  ],
  statusMap: { status: { pending: { label: '待评审', type: 'warning' }, in_progress: { label: '评审中', type: 'primary' }, completed: { label: '已完成', type: 'success' } } }
}
</script>