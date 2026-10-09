<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/safety-philosophy',
  autoOrgId: true,
  columns: [
    { field: 'version', label: '版本', width: 80 },
    { field: 'content', label: '理念内容', width: 400 },
    { field: 'slogan', label: '口号', width: 200 },
    { field: 'effectiveDate', label: '生效日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 80 }
  ],
  formFields: [
    { field: 'content', label: '理念内容', type: 'textarea', required: true },
    { field: 'slogan', label: '安全口号', type: 'input' },
    { field: 'values', label: '核心价值观', type: 'textarea' },
    { field: 'version', label: '版本', type: 'input', required: true },
    { field: 'effectiveDate', label: '生效日期', type: 'date', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'当前'},{value:'archived',label:'归档'}] }
  ],
  statusMap: {
    status: { active: { label: '当前', type: 'success' }, archived: { label: '归档', type: 'info' } }
  }
}
</script>