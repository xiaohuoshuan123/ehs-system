<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/performance',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '评定标题', width: 250 },
    { field: 'reviewType', label: '类型', type: 'tag', width: 120 },
    { field: 'year', label: '年度', width: 80 },
    { field: 'assessorId', label: '评定人', width: 120 },
    { field: 'score', label: '得分', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '评定标题', type: 'input', required: true },
    { field: 'reviewType', label: '评定类型', type: 'select', options: [{value:'internal_audit',label:'内审'},{value:'standardization_assessment',label:'标准化评定'}] },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'scope', label: '评定范围', type: 'input' },
    { field: 'assessorId', label: '评定人ID', type: 'input' },
    { field: 'startDate', label: '开始日期', type: 'date' },
    { field: 'endDate', label: '结束日期', type: 'date' },
    { field: 'score', label: '得分', type: 'number' },
    { field: 'result', label: '评定结果', type: 'textarea' },
    { field: 'reportFileUrl', label: '评定报告', type: 'upload' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'in_progress',label:'进行中'},{value:'completed',label:'已完成'}] }
  ],
  statusMap: { reviewType: { internal_audit: { label: '内审', type: 'primary' }, standardization_assessment: { label: '标准化评定', type: 'warning' } }, status: { draft: { label: '草稿', type: 'info' }, in_progress: { label: '进行中', type: 'warning' }, completed: { label: '已完成', type: 'success' } } }
}
</script>