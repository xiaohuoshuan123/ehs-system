<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/accident-action',
  columns: [
    { field: 'investigationId', label: '调查ID', width: 150 },
    { field: 'description', label: '整改描述', width: 250 },
    { field: 'responsibleId', label: '责任人', width: 120 },
    { field: 'deadline', label: '期限', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'verifyResult', label: '验证结果', width: 150 }
  ],
  formFields: [
    { field: 'investigationId', label: '调查ID', type: 'input', required: true },
    { field: 'description', label: '整改描述', type: 'textarea', required: true },
    { field: 'responsibleId', label: '责任人ID', type: 'input' },
    { field: 'deadline', label: '整改期限', type: 'date', required: true },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待整改'},{value:'in_progress',label:'整改中'},{value:'verified',label:'已验证'},{value:'closed',label:'已关闭'}] },
    { field: 'verifyResult', label: '验证结果', type: 'textarea' },
    { field: 'verifyBy', label: '验证人', type: 'input' },
    { field: 'verifyTime', label: '验证时间', type: 'datetime' }
  ],
  statusMap: { status: { pending: { label: '待整改', type: 'warning' }, in_progress: { label: '整改中', type: 'primary' }, verified: { label: '已验证', type: 'success' }, closed: { label: '已关闭', type: 'info' } } }
}
</script>