<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/warning-sign',
  autoOrgId: true,
  columns: [
    { field: 'hazardFactor', label: '危害因素', width: 150 },
    { field: 'location', label: '位置', width: 200 },
    { field: 'signType', label: '标志类型', type: 'tag', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'hazardFactor', label: '危害因素', type: 'input', required: true },
    { field: 'location', label: '位置', type: 'input', required: true },
    { field: 'signType', label: '标志类型', type: 'select', options: [{value:'danger',label:'危险'},{value:'warning',label:'警告'},{value:'notice',label:'注意'},{value:'instruction',label:'指令'}] },
    { field: 'photoUrl', label: '照片URL', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'missing',label:'缺失'},{value:'damaged',label:'损坏'}] }
  ],
  statusMap: { signType: { danger: { label: '危险', type: 'danger' }, warning: { label: '警告', type: 'warning' }, notice: { label: '注意', type: 'primary' }, instruction: { label: '指令', type: 'info' } }, status: { normal: { label: '正常', type: 'success' }, missing: { label: '缺失', type: 'danger' }, damaged: { label: '损坏', type: 'warning' } } }
}
</script>