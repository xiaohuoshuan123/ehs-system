<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/fire-equipment',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '器材名称', width: 200 },
    { field: 'type', label: '类型', width: 120 },
    { field: 'location', label: '存放位置', width: 200 },
    { field: 'quantity', label: '数量', width: 80 },
    { field: 'expireDate', label: '失效日期', type: 'date', width: 120 },
    { field: 'nextInspectDate', label: '下次检查', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'name', label: '名称', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'select', options: [{value:'灭火器',label:'灭火器'},{value:'消火栓',label:'消火栓'},{value:'报警器',label:'报警器'},{value:'烟感',label:'烟感'},{value:'其他',label:'其他'}] },
    { field: 'location', label: '存放位置', type: 'input' },
    { field: 'quantity', label: '数量', type: 'number', default: 1 },
    { field: 'manufactureDate', label: '生产日期', type: 'date' },
    { field: 'expireDate', label: '失效日期', type: 'date' },
    { field: 'inspectCycle', label: '检查周期(月)', type: 'number', default: 12 },
    { field: 'lastInspectDate', label: '上次检查', type: 'date' },
    { field: 'nextInspectDate', label: '下次检查', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'expired',label:'已过期'},{value:'scrapped',label:'已报废'}] }
  ],
  statusMap: { status: { normal: { label: '正常', type: 'success' }, expired: { label: '已过期', type: 'danger' }, scrapped: { label: '已报废', type: 'info' } } }
}
</script>