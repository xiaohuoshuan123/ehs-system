<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/regulation',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'regulation',
  searchFields: [
    { field: 'title', label: '标题', type: 'input' },
    { field: 'regulationNo', label: '编号', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '法规标题', type: 'text', width: 250 },
    { field: 'regulationNo', label: '法规编号', type: 'text', width: 150 },
    { field: 'source', label: '来源', type: 'text', width: 120 },
    { field: 'effectiveDate', label: '生效日期', type: 'date', width: 180 },
    { field: 'expireDate', label: '失效日期', type: 'date', width: 180 },
    { field: 'isApplicable', label: '适用', type: 'boolean', width: 80 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'regulationNo', label: '编号', type: 'input' },
    { field: 'source', label: '来源', type: 'input' },
    { field: 'effectiveDate', label: '生效日期', type: 'date' },
    { field: 'expireDate', label: '失效日期', type: 'date' },
    { field: 'isApplicable', label: '适用', type: 'switch', default: true },
    { field: 'applicableScope', label: '适用范围', type: 'input' },
    { field: 'content', label: '内容', type: 'textarea' },
    { field: 'fileUrl', label: '文件', type: 'input' }
  ],
  formRules: {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
  },
  statusMap: {}
}
</script>
