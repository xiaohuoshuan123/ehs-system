<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/dosimeter',
  autoOrgId: true,
  columns: [
    { field: 'userId', label: '员工ID', width: 150 },
    { field: 'deviceNo', label: '设备编号', width: 120 },
    { field: 'wearStartDate', label: '佩戴开始', type: 'date', width: 120 },
    { field: 'wearEndDate', label: '佩戴结束', type: 'date', width: 120 },
    { field: 'doseValue', label: '剂量值', width: 100 },
    { field: 'isAbnormal', label: '异常', type: 'boolean', width: 80 },
    { field: 'signStatus', label: '签字状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'userId', label: '员工ID', type: 'input', required: true },
    { field: 'deviceNo', label: '设备编号', type: 'input', required: true },
    { field: 'wearStartDate', label: '佩戴开始', type: 'date', required: true },
    { field: 'wearEndDate', label: '佩戴结束', type: 'date' },
    { field: 'doseValue', label: '剂量值', type: 'number' },
    { field: 'isAbnormal', label: '异常', type: 'switch' },
    { field: 'reportFileUrl', label: '报告文件', type: 'input' },
    { field: 'signStatus', label: '签字状态', type: 'select', options: [{value:'pending',label:'待签字'},{value:'signed',label:'已签字'}] }
  ],
  statusMap: { signStatus: { pending: { label: '待签字', type: 'warning' }, signed: { label: '已签字', type: 'success' } } }
}
</script>