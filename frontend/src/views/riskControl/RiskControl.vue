<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/risk-control',
  autoOrgId: true,
  columns: [
    { field: 'hazardSource', label: '危险源', width: 200 },
    { field: 'riskCategory', label: '分类', type: 'tag', width: 100 },
    { field: 'riskLevel', label: '风险等级', type: 'tag', width: 100 },
    { field: 'isMajorAbove', label: '较大及以上', type: 'boolean', width: 100 },
    { field: 'controlMeasures', label: '管控措施', width: 300 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'hazardSource', label: '危险源', type: 'input', required: true },
    { field: 'riskCategory', label: '分类', type: 'select', options: [{value:'activity',label:'作业活动'},{value:'equipment',label:'设备设施'}] },
    { field: 'potentialConsequence', label: '潜在后果', type: 'input' },
    { field: 'riskLevel', label: '风险等级', type: 'select', options: [{value:'low',label:'低风险'},{value:'general',label:'一般风险'},{value:'major',label:'较大风险'},{value:'major_above',label:'重大风险'}] },
    { field: 'isMajorAbove', label: '较大及以上', type: 'switch' },
    { field: 'controlMeasures', label: '管控措施', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'有效'},{value:'archived',label:'已归档'}] }
  ],
  statusMap: {
    riskCategory: { activity: { label: '作业活动', type: 'primary' }, equipment: { label: '设备设施', type: 'success' } },
    riskLevel: { low: { label: '低风险', type: 'success' }, general: { label: '一般', type: 'warning' }, major: { label: '较大', type: 'danger' }, major_above: { label: '重大', type: 'danger' } },
    status: { active: { label: '有效', type: 'success' }, archived: { label: '已归档', type: 'info' } }
  }
}
</script>