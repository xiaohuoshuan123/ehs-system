<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/param',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'parameter',
  searchFields: [
    { field: 'key', label: '参数键', type: 'input' },
    { field: 'module', label: '模块', type: 'input' }
  ],
  columns: [
    { field: 'key', label: '参数键', type: 'text', width: 200 },
    { field: 'value', label: '参数值', type: 'text', width: 150 },
    { field: 'module', label: '模块', type: 'text', width: 120 },
    { field: 'category', label: '分类', type: 'text', width: 120 },
    { field: 'description', label: '描述', type: 'text', width: 200 },
    { field: 'isActive', label: '启用', type: 'boolean', width: 80 }
  ],
  formFields: [
    { field: 'key', label: '参数键', type: 'input', required: true },
    { field: 'value', label: '参数值', type: 'input' },
    { field: 'module', label: '模块', type: 'input', required: true },
    { field: 'category', label: '分类', type: 'input', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'isActive', label: '启用', type: 'switch', default: true }
  ],
  formRules: {
    key: [{ required: true, message: '请输入参数键', trigger: 'blur' }],
    module: [{ required: true, message: '请输入模块', trigger: 'blur' }],
    category: [{ required: true, message: '请输入分类', trigger: 'blur' }]
  },
  statusMap: {}
}
</script>
