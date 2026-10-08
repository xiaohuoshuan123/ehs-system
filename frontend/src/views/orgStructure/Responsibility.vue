<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/responsibility',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'responsibility',
  searchFields: [
    { field: 'title', label: '标题', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '责任制标题', type: 'text', width: 250 },
    { field: 'version', label: '版本', type: 'text', width: 80 },
    { field: 'year', label: '年度', type: 'text', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'reviewStatus', label: '审核状态', type: 'tag', width: 100 },
    { field: 'publishBy', label: '发布人', type: 'text', width: 120 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'version', label: '版本', type: 'number', default: 1 },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '草稿', value: 'draft' }, { label: '已发布', value: 'published' }, { label: '已归档', value: 'archived' }] },
    { field: 'reviewStatus', label: '审核状态', type: 'select', options: [{ label: '待审核', value: 'pending' }, { label: '已审核', value: 'reviewed' }, { label: '已归档', value: 'archived' }] },
    { field: 'content', label: '内容', type: 'textarea' },
    { field: 'publishBy', label: '发布人', type: 'input' },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
  },
  statusMap: {
    status: {
      draft: { label: '草稿', type: 'info' },
      published: { label: '已发布', type: 'success' },
      archived: { label: '已归档', type: 'warning' }
    },
    reviewStatus: {
      pending: { label: '待审核', type: 'warning' },
      reviewed: { label: '已审核', type: 'success' },
      archived: { label: '已归档', type: 'info' }
    }
  }
}
</script>
