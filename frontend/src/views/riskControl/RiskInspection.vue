<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/risk-inspection',
  autoOrgId: true,
  columns: [
    { field: 'inspectDate', label: '检查日期', type: 'date', width: 120 },
    { field: 'inspectorId', label: '检查人', width: 150 },
    { field: 'result', label: '结果', type: 'tag', width: 100 },
    { field: 'issues', label: '问题', width: 300 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'configId', label: '检查配置ID', type: 'input', required: true },
    { field: 'inspectDate', label: '检查日期', type: 'date', required: true },
    { field: 'inspectorId', label: '检查人ID', type: 'input', required: true },
    { field: 'result', label: '结果', type: 'select', options: [{value:'normal',label:'正常'},{value:'abnormal',label:'异常'}] },
    { field: 'issues', label: '问题描述', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待检查'},{value:'completed',label:'已完成'},{value:'overdue',label:'已逾期'}] }
  ],
  statusMap: { result: { normal: { label: '正常', type: 'success' }, abnormal: { label: '异常', type: 'danger' } }, status: { pending: { label: '待检查', type: 'warning' }, completed: { label: '已完成', type: 'success' }, overdue: { label: '已逾期', type: 'danger' } } }
}
</script>