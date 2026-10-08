<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/equipment-inspection',
  autoOrgId: true,
  columns: [
    { field: 'equipmentId', label: '设备ID', width: 200 },
    { field: 'type', label: '点检类型', type: 'tag', width: 100 },
    { field: 'inspectDate', label: '点检日期', type: 'date', width: 120 },
    { field: 'inspector', label: '点检人', width: 120 },
    { field: 'result', label: '结果', type: 'tag', width: 100 },
    { field: 'issues', label: '问题', width: 200 }
  ],
  formFields: [
    { field: 'equipmentId', label: '设备ID', type: 'input', required: true },
    { field: 'inspectDate', label: '点检日期', type: 'date', required: true },
    { field: 'inspector', label: '点检人', type: 'input', required: true },
    { field: 'type', label: '点检类型', type: 'select', options: [{value:'daily',label:'日常点检'},{value:'safety_device',label:'安全装置'},{value:'calibration',label:'校准'}] },
    { field: 'result', label: '结果', type: 'select', options: [{value:'normal',label:'正常'},{value:'abnormal',label:'异常'}] },
    { field: 'issues', label: '问题描述', type: 'textarea' }
  ],
  statusMap: { result: { normal: { label: '正常', type: 'success' }, abnormal: { label: '异常', type: 'danger' } }, type: { daily: { label: '日常点检', type: 'primary' }, safety_device: { label: '安全装置', type: 'success' }, calibration: { label: '校准', type: 'warning' } } }
}
</script>