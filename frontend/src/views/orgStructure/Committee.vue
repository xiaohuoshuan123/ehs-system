<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/committee',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'committee',
  searchFields: [
    { field: 'name', label: '委员会名称', type: 'input' }
  ],
  columns: [
    { field: 'name', label: '委员会名称', type: 'text', width: 250 },
    { field: 'orgId', label: '所属单位', type: 'text', width: 150 },
    { field: 'description', label: '描述', type: 'text', width: 300 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'name', label: '委员会名称', type: 'input', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'fileUrl', label: '架构文件', type: 'input' },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {
    name: [{ required: true, message: '请输入委员会名称', trigger: 'blur' }]
  },
  statusMap: {}
}
</script>
