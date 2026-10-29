<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/annual-plan',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'annual-plan',
  searchFields: [
    { field: 'title', label: '计划标题', type: 'input' },
    { field: 'year', label: '年度', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '计划标题', type: 'text', width: 250 },
    { field: 'year', label: '年度', type: 'text', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'publishTime', label: '发布时间', type: 'date', width: 180 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '计划标题', type: 'input', required: true },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '草稿', value: 'draft' }, { label: '已发布', value: 'published' }, { label: '已关闭', value: 'closed' }] },
    { field: 'content', label: '计划内容', type: 'textarea' },
    { field: 'orgId', label: '组织', type: 'input', autoOrgId: true }
  ],
  formRules: {
    title: [{ required: true, message: '请输入计划标题', trigger: 'blur' }]
  },
  statusMap: {
    status: {
      draft: { label: '草稿', type: 'info' },
      published: { label: '已发布', type: 'success' },
      closed: { label: '已关闭', type: 'warning' }
    }
  }
}
</script>
