<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/risk-inspection-config',
  autoOrgId: true,
  columns: [
    { field: 'riskControlId', label: '风险管控ID', width: 150 },
    { field: 'frequency', label: '检查频次', type: 'tag', width: 120 },
    { field: 'inspectLevel', label: '检查层级', type: 'tag', width: 120 }
  ],
  formFields: [
    { field: 'riskControlId', label: '风险管控ID', type: 'input', required: true },
    { field: 'frequency', label: '检查频次', type: 'select', options: [{value:'daily',label:'每日'},{value:'weekly',label:'每周'},{value:'monthly',label:'每月'},{value:'quarterly',label:'每季'},{value:'half_yearly',label:'半年'},{value:'yearly',label:'每年'}] },
    { field: 'inspectLevel', label: '检查层级', type: 'select', options: [{value:'worker',label:'员工'},{value:'section',label:'工段'},{value:'dept',label:'部门'},{value:'company',label:'公司'}] }
  ],
  statusMap: { frequency: { daily: { label: '每日', type: 'danger' }, weekly: { label: '每周', type: 'warning' }, monthly: { label: '每月', type: 'primary' }, quarterly: { label: '每季', type: 'info' }, half_yearly: { label: '半年', type: 'info' }, yearly: { label: '每年', type: 'success' } }, inspectLevel: { worker: { label: '员工', type: 'info' }, section: { label: '工段', type: 'primary' }, dept: { label: '部门', type: 'warning' }, company: { label: '公司', type: 'danger' } } }
}
</script>