<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/internal-regulation',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'internal-regulation',
  searchFields: [
    { field: 'title', label: '标题', type: 'input' },
    { field: 'category', label: '分类', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '制度标题', type: 'text', width: 250 },
    { field: 'regulationNo', label: '编号', type: 'text', width: 150 },
    { field: 'category', label: '分类', type: 'text', width: 120 },
    { field: 'version', label: '版本', type: 'text', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'publishTime', label: '发布时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'regulationNo', label: '编号', type: 'input' },
    { field: 'category', label: '分类', type: 'select', options: [{ label: '管理类', value: '管理类' }, { label: '技术类', value: '技术类' }, { label: '操作规程', value: '操作规程' }, { label: '管理制度', value: '管理制度' }] },
    { field: 'version', label: '版本', type: 'number', default: 1 },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '草稿', value: 'draft' }, { label: '已发布', value: 'published' }, { label: '已归档', value: 'archived' }] },
    { field: 'content', label: '内容', type: 'textarea' },
    { field: 'fileUrl', label: '文件', type: 'input' },
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
    }
  }
}
</script>
