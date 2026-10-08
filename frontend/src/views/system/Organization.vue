<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/org',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'organization',
  searchFields: [
    { field: 'name', label: '名称', type: 'input' }
  ],
  columns: [
    { field: 'name', label: '名称', type: 'text', width: 200 },
    { field: 'code', label: '编码', type: 'text', width: 120 },
    { field: 'level', label: '层级', type: 'text', width: 80 },
    { field: 'description', label: '描述', type: 'text', width: 300 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'name', label: '名称', type: 'input', required: true },
    { field: 'code', label: '编码', type: 'input', required: true },
    { field: 'level', label: '层级', type: 'number', default: 4 },
    { field: 'parentId', label: '上级单位', type: 'input' },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'orgId', label: '组织机构', type: 'hidden', autoOrgId: true }
  ],
  formRules: {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
  },
  statusMap: {}
}
</script>
