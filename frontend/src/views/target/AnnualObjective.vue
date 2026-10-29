<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/objective',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'annual-objective',
  searchFields: [
    { field: 'title', label: '目标标题', type: 'input' },
    { field: 'year', label: '年度', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '目标标题', type: 'text', width: 250 },
    { field: 'year', label: '年度', type: 'text', width: 80 },
    { field: 'level', label: '层级', type: 'tag', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'responsibleUser', label: '负责人', type: 'text', width: 120 },
    { field: 'achievement', label: '完成率', type: 'text', width: 100 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '目标标题', type: 'input', required: true },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'level', label: '层级', type: 'select', options: [{ label: '公司', value: 'company' }, { label: '部门', value: 'department' }, { label: '工段', value: 'section' }, { label: '个人', value: 'individual' }] },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '草稿', value: 'draft' }, { label: '已发布', value: 'published' }, { label: '已替代', value: 'superseded' }] },
    { field: 'responsibleUser', label: '负责人', type: 'input' },
    { field: 'indicators', label: '指标JSON', type: 'textarea' },
    { field: 'achievement', label: '完成率', type: 'number' },
    { field: 'orgId', label: '组织', type: 'input', autoOrgId: true }
  ],
  formRules: {
    title: [{ required: true, message: '请输入目标标题', trigger: 'blur' }]
  },
  statusMap: {
    level: {
      company: { label: '公司', type: 'primary' },
      department: { label: '部门', type: 'success' },
      section: { label: '工段', type: 'warning' },
      individual: { label: '个人', type: 'info' }
    },
    status: {
      draft: { label: '草稿', type: 'info' },
      published: { label: '已发布', type: 'success' },
      superseded: { label: '已替代', type: 'warning' }
    }
  }
}
</script>
