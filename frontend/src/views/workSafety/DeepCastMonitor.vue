<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/deep-cast-monitor',
  autoOrgId: true,
  columns: [
    { field: 'cameraName', label: '摄像头', width: 150 },
    { field: 'alarmType', label: '报警类型', type: 'tag', width: 120 },
    { field: 'alarmLevel', label: '报警等级', type: 'tag', width: 100 },
    { field: 'alarmTime', label: '报警时间', type: 'datetime', width: 160 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'cameraId', label: '摄像头ID', type: 'input', required: true },
    { field: 'cameraName', label: '摄像头名称', type: 'input', required: true },
    { field: 'alarmType', label: '报警类型', type: 'select', options: [{value:'personnel',label:'人员作业'},{value:'process_safety',label:'工艺安全'}] },
    { field: 'alarmLevel', label: '报警等级', type: 'select', options: [{value:'warning',label:'警告'},{value:'critical',label:'严重'},{value:'emergency',label:'紧急'}] },
    { field: 'alarmTime', label: '报警时间', type: 'datetime' },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'imageUrl', label: '图片URL', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'活跃'},{value:'acknowledged',label:'已确认'},{value:'resolved',label:'已处理'}] },
    { field: 'acknowledgeBy', label: '确认人', type: 'input' },
    { field: 'acknowledgeTime', label: '确认时间', type: 'datetime' }
  ],
  statusMap: { alarmLevel: { warning: { label: '警告', type: 'warning' }, critical: { label: '严重', type: 'danger' }, emergency: { label: '紧急', type: 'danger' } }, status: { active: { label: '活跃', type: 'danger' }, acknowledged: { label: '已确认', type: 'primary' }, resolved: { label: '已处理', type: 'success' } }, alarmType: { personnel: { label: '人员', type: 'primary' }, process_safety: { label: '工艺', type: 'warning' } } }
}
</script>