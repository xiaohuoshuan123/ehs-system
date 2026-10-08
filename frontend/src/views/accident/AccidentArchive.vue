<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/accident-archive',
  columns: [
    { field: 'reportId', label: '报告ID', width: 150 },
    { field: 'archiveType', label: '档案类型', type: 'tag', width: 120 },
    { field: 'fileUrl', label: '文件URL', width: 200 },
    { field: 'createdAt', label: '创建时间', type: 'datetime', width: 160 }
  ],
  formFields: [
    { field: 'reportId', label: '报告ID', type: 'input', required: true },
    { field: 'archiveType', label: '档案类型', type: 'select', options: [{value:'investigation',label:'调查报告'},{value:'signature',label:'签字材料'},{value:'photos',label:'事故照片'},{value:'other',label:'其他'}] },
    { field: 'fileUrl', label: '文件URL', type: 'input' },
    { field: 'fileContent', label: '文件内容', type: 'textarea' }
  ],
  statusMap: { archiveType: { investigation: { label: '调查报告', type: 'primary' }, signature: { label: '签字材料', type: 'success' }, photos: { label: '事故照片', type: 'warning' }, other: { label: '其他', type: 'info' } } }
}
</script>