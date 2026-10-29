<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/equipment-maintenance',
  columns: [
    { field: 'equipmentId', label: '设备ID', width: 200 },
    { field: 'type', label: '类型', type: 'tag', width: 100 },
    { field: 'planDate', label: '计划日期', type: 'date', width: 120 },
    { field: 'actualDate', label: '实际日期', type: 'date', width: 120 },
    { field: 'content', label: '内容', width: 250 },
    { field: 'executor', label: '执行人', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'equipmentId', label: '设备ID', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'select', options: [{value:'inspection',label:'点检'},{value:'repair',label:'维修'},{value:'overhaul',label:'大修'}] },
    { field: 'planDate', label: '计划日期', type: 'date', required: true },
    { field: 'actualDate', label: '实际日期', type: 'date' },
    { field: 'content', label: '检修内容', type: 'textarea' },
    { field: 'executor', label: '执行人', type: 'input' },
    { field: 'result', label: '检修结果', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'planned',label:'已计划'},{value:'in_progress',label:'进行中'},{value:'completed',label:'已完成'},{value:'overdue',label:'已逾期'}] }
  ],
  statusMap: { type: { inspection: { label: '点检', type: 'primary' }, repair: { label: '维修', type: 'success' }, overhaul: { label: '大修', type: 'warning' } }, status: { planned: { label: '已计划', type: 'info' }, in_progress: { label: '进行中', type: 'warning' }, completed: { label: '已完成', type: 'success' }, overdue: { label: '已逾期', type: 'danger' } } }
}
</script>