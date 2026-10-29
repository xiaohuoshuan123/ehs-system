<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/accident-investigation',
  autoOrgId: true,
  columns: [
    { field: 'reportId', label: '事故报告ID', width: 200 },
    { field: 'analysisMethod', label: '分析方法', type: 'tag', width: 100 },
    { field: 'startDate', label: '调查开始', type: 'date', width: 120 },
    { field: 'endDate', label: '调查结束', type: 'date', width: 120 },
    { field: 'rootCause', label: '根本原因', width: 200 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'reportId', label: '事故报告ID', type: 'input', required: true },
    { field: 'investigationGroup', label: '调查组JSON', type: 'textarea' },
    { field: 'startDate', label: '调查开始日期', type: 'date' },
    { field: 'endDate', label: '调查结束日期', type: 'date' },
    { field: 'directCause', label: '直接原因', type: 'textarea' },
    { field: 'indirectCause', label: '间接原因', type: 'textarea' },
    { field: 'rootCause', label: '根本原因', type: 'textarea' },
    { field: 'analysisMethod', label: '分析方法', type: 'select', options: [{value:'fishbone',label:'鱼骨图'},{value:'fault_tree',label:'故障树'},{value:'rca',label:'RCA分析'}] },
    { field: 'reportFileUrl', label: '调查报告', type: 'upload' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待调查'},{value:'in_progress',label:'调查中'},{value:'completed',label:'已完成'}] }
  ],
  statusMap: { analysisMethod: { fishbone: { label: '鱼骨图', type: 'primary' }, fault_tree: { label: '故障树', type: 'warning' }, rca: { label: 'RCA', type: 'success' } }, status: { pending: { label: '待调查', type: 'warning' }, in_progress: { label: '调查中', type: 'primary' }, completed: { label: '已完成', type: 'success' } } }
}
</script>