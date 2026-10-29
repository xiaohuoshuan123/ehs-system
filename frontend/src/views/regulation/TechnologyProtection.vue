<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/technology-protection',
  autoOrgId: true,
  columns: [
    { field: 'type', label: '类型', type: 'tag', width: 120 },
    { field: 'name', label: '名称', width: 200 },
    { field: 'vendor', label: '供应商', width: 150 },
    { field: 'implementDate', label: '实施日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'investment', label: '投入(万元)', width: 120 }
  ],
  formFields: [
    { field: 'type', label: '类型', type: 'select', options: [{value:'monitoring_warning',label:'监测预警系统'},{value:'intelligent_system',label:'智能化系统'},{value:'robot_automation',label:'机器人/自动化'},{value:'digital_twin',label:'数字孪生'}] },
    { field: 'name', label: '名称', type: 'input', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'vendor', label: '供应商', type: 'input' },
    { field: 'implementDate', label: '实施日期', type: 'date' },
    { field: 'investment', label: '投入(万元)', type: 'input' },
    { field: 'effectiveness', label: '效果评价', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'planning',label:'规划中'},{value:'implementing',label:'实施中'},{value:'running',label:'运行中'},{value:'deprecated',label:'已淘汰'}] }
  ],
  statusMap: {
    type: { monitoring_warning: { label: '监测预警', type: 'primary' }, intelligent_system: { label: '智能化', type: 'success' }, robot_automation: { label: '机器人', type: 'warning' }, digital_twin: { label: '数字孪生', type: 'info' } },
    status: { planning: { label: '规划中', type: 'info' }, implementing: { label: '实施中', type: 'warning' }, running: { label: '运行中', type: 'success' }, deprecated: { label: '已淘汰', type: 'danger' } }
  }
}
</script>