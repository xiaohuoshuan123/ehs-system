<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/contractor-blacklist',
  columns: [
    { field: 'contractorId', label: '承包商ID', width: 150 },
    { field: 'reason', label: '原因', width: 250 },
    { field: 'blacklistDate', label: '列入日期', type: 'date', width: 120 },
    { field: 'unblockDate', label: '解除日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'contractorId', label: '承包商ID', type: 'input', required: true },
    { field: 'reason', label: '列入原因', type: 'textarea', required: true },
    { field: 'blacklistDate', label: '列入日期', type: 'date', required: true },
    { field: 'unblockDate', label: '解除日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'有效'},{value:'unblocked',label:'已解除'}] }
  ],
  statusMap: { status: { active: { label: '有效', type: 'danger' }, unblocked: { label: '已解除', type: 'success' } } }
}
</script>