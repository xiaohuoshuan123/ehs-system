<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/improvement',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '改进项目', width: 250 },
    { field: 'gap', label: '差距', width: 200 },
    { field: 'improvementPlan', label: '改进计划', width: 300 },
    { field: 'responsibleId', label: '责任人', width: 120 },
    { field: 'deadline', label: '截止日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '改进项目', type: 'input', required: true },
    { field: 'gap', label: '差距描述', type: 'textarea' },
    { field: 'improvementPlan', label: '改进计划', type: 'textarea' },
    { field: 'responsibleId', label: '责任人ID', type: 'input' },
    { field: 'deadline', label: '截止日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待处理'},{value:'in_progress',label:'进行中'},{value:'completed',label:'已完成'}] },
    { field: 'verifyResult', label: '验证结果', type: 'textarea' }
  ],
  statusMap: { status: { pending: { label: '待处理', type: 'warning' }, in_progress: { label: '进行中', type: 'primary' }, completed: { label: '已完成', type: 'success' } } }
}
</script>