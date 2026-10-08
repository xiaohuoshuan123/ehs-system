<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/violation',
  autoOrgId: true,
  columns: [
    { field: 'user', label: '违章人', width: 120 },
    { field: 'clauseId', label: '违章条款ID', width: 200 },
    { field: 'violationDate', label: '违章日期', type: 'date', width: 120 },
    { field: 'description', label: '描述', width: 300 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'user', label: '违章人', type: 'input', required: true },
    { field: 'linkedUsers', label: '关联人员JSON', type: 'textarea' },
    { field: 'clauseId', label: '违章条款ID', type: 'input', required: true },
    { field: 'violationDate', label: '违章日期', type: 'date', required: true },
    { field: 'description', label: '违章描述', type: 'textarea' },
    { field: 'reporter', label: '上报人', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待确认'},{value:'confirmed',label:'已确认'},{value:'processed',label:'已处理'}] },
    { field: 'handleResult', label: '处理结果', type: 'textarea' }
  ],
  statusMap: { status: { pending: { label: '待确认', type: 'warning' }, confirmed: { label: '已确认', type: 'primary' }, processed: { label: '已处理', type: 'success' } } }
}
</script>