<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/compliance',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'compliance',
  searchFields: [
    { field: 'title', label: '标题', type: 'input' },
    { field: 'year', label: '年度', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '评估标题', type: 'text', width: 250 },
    { field: 'year', label: '年度', type: 'text', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'orgId', label: '所属单位', type: 'text', width: 150 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '草稿', value: 'draft' }, { label: '已提交', value: 'submitted' }, { label: '已审核', value: 'reviewed' }] },
    { field: 'content', label: '评估内容', type: 'textarea' },
    { field: 'fileUrl', label: '文件', type: 'input' },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
  },
  statusMap: {
    status: {
      draft: { label: '草稿', type: 'info' },
      submitted: { label: '已提交', type: 'warning' },
      reviewed: { label: '已审核', type: 'success' }
    }
  }
}
</script>
