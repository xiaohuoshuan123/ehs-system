<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/plan',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'safety-plan',
  searchFields: [
    { field: 'title', label: '标题', type: 'input' },
    { field: 'year', label: '年度', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '标题', type: 'text', width: 250 },
    { field: 'year', label: '年度', type: 'number', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'uploadBy', label: '上传人', type: 'text', width: 120 },
    { field: 'fileUrl', label: '文件', type: 'text', width: 200 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'year', label: '年度', type: 'number', required: true, default: 2024 },
    { field: 'status', label: '状态', type: 'select', default: 'draft', options: [{ label: '草稿', value: 'draft' }, { label: '已发布', value: 'published' }, { label: '已归档', value: 'archived' }] },
    { field: 'uploadBy', label: '上传人', type: 'input' },
    { field: 'fileUrl', label: '文件链接', type: 'input' },
    { field: 'orgId', label: '组织', type: 'input', autoOrgId: true }
  ],
  formRules: {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    year: [{ required: true, message: '请输入年度', trigger: 'blur' }]
  },
  statusMap: {
    status: {
      draft: { label: '草稿', type: 'info' },
      published: { label: '已发布', type: 'success' },
      archived: { label: '已归档', type: 'warning' }
    }
  }
}
</script>
