<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/safety-inspection',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '标题', width: 200 },
    { field: 'type', label: '类型', type: 'tag', width: 100 },
    { field: 'inspector', label: '检查人', width: 100 },
    { field: 'inspectionDate', label: '日期', type: 'date', width: 120 },
    { field: 'totalScore', label: '得分', width: 80 },
    { field: 'improvementRequired', label: '需整改', type: 'boolean', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'type', label: '检查类型', type: 'select', options: [{value:'routine',label:'日常检查'},{value:'special',label:'专项检查'},{value:'comprehensive',label:'综合检查'},{value:'internal_audit',label:'内审'}] },
    { field: 'inspector', label: '检查人', type: 'input', required: true },
    { field: 'inspectionDate', label: '检查日期', type: 'date', required: true },
    { field: 'location', label: '检查地点', type: 'input' },
    { field: 'items', label: '检查项(JSON)', type: 'textarea' },
    { field: 'totalScore', label: '总得分', type: 'input' },
    { field: 'issuesFound', label: '发现问题', type: 'textarea' },
    { field: 'improvementRequired', label: '需整改', type: 'select', options: [{value:true,label:'是'},{value:false,label:'否'}] },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待完成'},{value:'completed',label:'已完成'},{value:'improved',label:'已整改'}] }
  ],
  statusMap: {
    type: { routine: { label: '日常', type: 'primary' }, special: { label: '专项', type: 'warning' }, comprehensive: { label: '综合', type: 'success' }, internal_audit: { label: '内审', type: 'info' } },
    status: { pending: { label: '待完成', type: 'warning' }, completed: { label: '已完成', type: 'success' }, improved: { label: '已整改', type: 'info' } }
  }
}
</script>