<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/training',
  autoOrgId: true,
  columns: [
    { field: 'trainType', label: '培训类型', type: 'tag', width: 120 },
    { field: 'userId', label: '受训人', width: 120 },
    { field: 'trainDate', label: '培训日期', type: 'date', width: 120 },
    { field: 'teacher', label: '培训人', width: 120 },
    { field: 'hours', label: '学时', width: 80 },
    { field: 'testScore', label: '测试成绩', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'trainType', label: '培训类型', type: 'select', options: [{value:'three_level',label:'三级教育'},{value:'re_education',label:'再教育'},{value:'team_level',label:'班组教育'}] },
    { field: 'userId', label: '受训人ID', type: 'input' },
    { field: 'trainDate', label: '培训日期', type: 'date' },
    { field: 'teacher', label: '培训人', type: 'input' },
    { field: 'hours', label: '学时', type: 'number' },
    { field: 'content', label: '培训内容', type: 'textarea' },
    { field: 'testScore', label: '测试成绩', type: 'number' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'completed',label:'已完成'}] }
  ],
  statusMap: { trainType: { three_level: { label: '三级教育', type: 'primary' }, re_education: { label: '再教育', type: 'success' }, team_level: { label: '班组教育', type: 'warning' } } }
}
</script>