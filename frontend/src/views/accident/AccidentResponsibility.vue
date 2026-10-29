<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/accident-responsibility',
  columns: [
    { field: 'reportId', label: '报告ID', width: 150 },
    { field: 'responsibleUser', label: '责任人', width: 120 },
    { field: 'responsibilityType', label: '责任类型', type: 'tag', width: 120 },
    { field: 'handleResult', label: '处理结果', width: 200 },
    { field: 'handleDate', label: '处理日期', type: 'date', width: 120 }
  ],
  formFields: [
    { field: 'reportId', label: '报告ID', type: 'input', required: true },
    { field: 'responsibleUser', label: '责任人', type: 'input', required: true },
    { field: 'responsibilityType', label: '责任类型', type: 'select', options: [{value:'major',label:'主要责任'},{value:'secondary',label:'次要责任'},{value:'leadership',label:'领导责任'}] },
    { field: 'handleResult', label: '处理结果', type: 'textarea' },
    { field: 'handleDate', label: '处理日期', type: 'date' },
    { field: 'fileUrl', label: '附件URL', type: 'input' }
  ],
  statusMap: { responsibilityType: { major: { label: '主要', type: 'danger' }, secondary: { label: '次要', type: 'warning' }, leadership: { label: '领导', type: 'primary' } } }
}
</script>