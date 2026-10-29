<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/emergency-supplies',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '物资名称', width: 200 },
    { field: 'type', label: '类型', width: 120 },
    { field: 'quantity', label: '数量', width: 80 },
    { field: 'unit', label: '单位', width: 80 },
    { field: 'location', label: '存放位置', width: 200 },
    { field: 'checkDate', label: '检查日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'name', label: '物资名称', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'input' },
    { field: 'quantity', label: '数量', type: 'number', default: 0 },
    { field: 'unit', label: '单位', type: 'input' },
    { field: 'purpose', label: '用途', type: 'input' },
    { field: 'location', label: '存放位置', type: 'input' },
    { field: 'checkDate', label: '检查日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'expiring',label:'即将过期'},{value:'expired',label:'已过期'}] }
  ],
  statusMap: { status: { normal: { label: '正常', type: 'success' }, expiring: { label: '即将过期', type: 'warning' }, expired: { label: '已过期', type: 'danger' } } }
}
</script>