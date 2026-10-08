<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/work-unit',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '作业单元', width: 200 },
    { field: 'type', label: '类型', type: 'tag', width: 100 },
    { field: 'parentId', label: '上级单元', width: 200 },
    { field: 'description', label: '描述', width: 300 }
  ],
  formFields: [
    { field: 'name', label: '作业单元名称', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'select', options: [{value:'equipment',label:'设备设施'},{value:'activity',label:'作业活动'}] },
    { field: 'parentId', label: '上级单元ID', type: 'input' },
    { field: 'description', label: '描述', type: 'textarea' }
  ],
  statusMap: { type: { equipment: { label: '设备设施', type: 'primary' }, activity: { label: '作业活动', type: 'success' } } }
}
</script>