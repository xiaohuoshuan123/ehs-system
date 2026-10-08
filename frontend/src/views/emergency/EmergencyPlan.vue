<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/emergency',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '预案标题', width: 250 },
    { field: 'planType', label: '类型', type: 'tag', width: 100 },
    { field: 'year', label: '年度', width: 80 },
    { field: 'version', label: '版本', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'publishTime', label: '发布时间', type: 'date', width: 120 }
  ],
  formFields: [
    { field: 'title', label: '预案标题', type: 'input', required: true },
    { field: 'planType', label: '预案类型', type: 'select', options: [{value:'comprehensive',label:'综合预案'},{value:'special',label:'专项预案'},{value:'on_site',label:'现场处置方案'}] },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'content', label: '预案内容', type: 'textarea' },
    { field: 'fileUrl', label: '预案文件', type: 'upload' },
    { field: 'version', label: '版本', type: 'number', default: 1 },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'published',label:'已发布'},{value:'archived',label:'已归档'}] }
  ],
  statusMap: { planType: { comprehensive: { label: '综合', type: 'primary' }, special: { label: '专项', type: 'warning' }, on_site: { label: '现场', type: 'success' } }, status: { draft: { label: '草稿', type: 'info' }, published: { label: '已发布', type: 'success' }, archived: { label: '已归档', type: 'info' } } }
}
</script>