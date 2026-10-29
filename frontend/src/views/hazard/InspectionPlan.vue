<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/inspection-plan',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '检查计划名称', width: 250 },
    { field: 'planType', label: '类型', type: 'tag', width: 100 },
    { field: 'startDate', label: '开始日期', type: 'date', width: 120 },
    { field: 'endDate', label: '结束日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'name', label: '计划名称', type: 'input', required: true },
    { field: 'planType', label: '类型', type: 'select', options: [{value:'daily',label:'日常'},{value:'special',label:'专项'}] },
    { field: 'startDate', label: '开始日期', type: 'date', required: true },
    { field: 'endDate', label: '结束日期', type: 'date', required: true },
    { field: 'teamMembers', label: '检查组(JSON)', type: 'textarea' },
    { field: 'checklist', label: '检查表(JSON)', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'published',label:'已发布'},{value:'closed',label:'已关闭'}] }
  ],
  statusMap: { planType: { daily: { label: '日常', type: 'primary' }, special: { label: '专项', type: 'warning' } }, status: { draft: { label: '草稿', type: 'info' }, published: { label: '已发布', type: 'success' }, closed: { label: '已关闭', type: 'info' } } }
}
</script>