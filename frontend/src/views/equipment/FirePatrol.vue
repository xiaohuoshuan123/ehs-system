<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/fire-patrol',
  columns: [
    { field: 'planId', label: '计划ID', width: 150 },
    { field: 'patrolBy', label: '巡查人', width: 120 },
    { field: 'patrolDate', label: '巡查日期', type: 'date', width: 120 },
    { field: 'result', label: '结果', type: 'tag', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'planId', label: '计划ID', type: 'input', required: true },
    { field: 'patrolBy', label: '巡查人', type: 'input', required: true },
    { field: 'patrolDate', label: '巡查日期', type: 'date', required: true },
    { field: 'result', label: '结果', type: 'select', options: [{value:'normal',label:'正常'},{value:'abnormal',label:'异常'}] },
    { field: 'issues', label: '问题描述', type: 'textarea' },
    { field: 'photoUrls', label: '照片URL(JSON)', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待巡查'},{value:'completed',label:'已完成'},{value:'overdue',label:'已逾期'}] }
  ],
  statusMap: { result: { normal: { label: '正常', type: 'success' }, abnormal: { label: '异常', type: 'danger' } }, status: { pending: { label: '待巡查', type: 'warning' }, completed: { label: '已完成', type: 'success' }, overdue: { label: '已逾期', type: 'danger' } } }
}
</script>