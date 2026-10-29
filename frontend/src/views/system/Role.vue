<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/role',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'role',
  searchFields: [
    { field: 'name', label: '角色名称', type: 'input' }
  ],
  columns: [
    { field: 'name', label: '角色名称', type: 'text', width: 150 },
    { field: 'code', label: '角色编码', type: 'text', width: 150 },
    { field: 'description', label: '描述', type: 'text', width: 300 },
    { field: 'permissions', label: '权限', type: 'text', width: 300 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'name', label: '角色名称', type: 'input', required: true },
    { field: 'code', label: '角色编码', type: 'input', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'permissions', label: '权限JSON', type: 'textarea' },
    { field: 'isActive', label: '启用', type: 'switch', default: true }
  ],
  formRules: {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
  },
  statusMap: {}
}
</script>
