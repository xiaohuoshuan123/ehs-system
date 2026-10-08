<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/risk-factor',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '风险因素', width: 200 },
    { field: 'category', label: '分类', width: 150 },
    { field: 'level', label: '等级', type: 'tag', width: 100 },
    { field: 'measures', label: '管控措施', width: 300 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'name', label: '风险因素名称', type: 'input', required: true },
    { field: 'category', label: '分类', type: 'select', options: [{value:'人的因素',label:'人的因素'},{value:'物的因素',label:'物的因素'},{value:'环境因素',label:'环境因素'},{value:'管理因素',label:'管理因素'}] },
    { field: 'level', label: '等级', type: 'select', options: [{value:'low',label:'低风险'},{value:'medium',label:'中风险'},{value:'high',label:'高风险'},{value:'major',label:'重大风险'}] },
    { field: 'measures', label: '管控措施', type: 'textarea' },
    { field: 'reviewDate', label: '评审日期', type: 'date' },
    { field: 'reviewer', label: '评审人', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'有效'},{value:'archived',label:'已归档'}] }
  ],
  statusMap: {
    level: { low: { label: '低风险', type: 'success' }, medium: { label: '中风险', type: 'warning' }, high: { label: '高风险', type: 'danger' }, major: { label: '重大风险', type: 'danger' } },
    status: { active: { label: '有效', type: 'success' }, archived: { label: '已归档', type: 'info' } }
  }
}
</script>