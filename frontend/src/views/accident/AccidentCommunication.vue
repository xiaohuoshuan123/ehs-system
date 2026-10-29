<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/accident-communication',
  columns: [
    { field: 'title', label: '标题', width: 250 },
    { field: 'content', label: '内容', width: 200 },
    { field: 'publishBy', label: '发布人', width: 120 },
    { field: 'publishTime', label: '发布时间', type: 'datetime', width: 160 },
    { field: 'studyStatus', label: '学习状态', type: 'tag', width: 100 },
    { field: 'examScore', label: '考试成绩', width: 100 }
  ],
  formFields: [
    { field: 'reportId', label: '报告ID', type: 'input', required: true },
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'content', label: '内容', type: 'textarea' },
    { field: 'fileUrl', label: '附件URL', type: 'input' },
    { field: 'publishBy', label: '发布人', type: 'input' },
    { field: 'publishTime', label: '发布时间', type: 'datetime' },
    { field: 'studyStatus', label: '学习状态', type: 'select', options: [{value:'pending',label:'待学习'},{value:'studied',label:'已学习'},{value:'examined',label:'已考核'}] },
    { field: 'studySign', label: '学习签名', type: 'input' },
    { field: 'examScore', label: '考试成绩', type: 'number' }
  ],
  statusMap: { studyStatus: { pending: { label: '待学习', type: 'warning' }, studied: { label: '已学习', type: 'primary' }, examined: { label: '已考核', type: 'success' } } }
}
</script>