<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/expenditure',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'expenditure',
  searchFields: [
    { field: 'year', label: '年度', type: 'input' }
  ],
  columns: [
    { field: 'orgId', label: '所属单位', type: 'text', width: 150 },
    { field: 'year', label: '年度', type: 'text', width: 80 },
    { field: 'totalAmount', label: '总金额', type: 'text', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'categories', label: '分类明细', type: 'text', width: 300 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'year', label: '年度', type: 'number', required: true, default: 2024 },
    { field: 'totalAmount', label: '总金额', type: 'number', required: true },
    { field: 'categories', label: '分类JSON', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '草稿', value: 'draft' }, { label: '已提交', value: 'submitted' }, { label: '已审批', value: 'approved' }, { label: '已驳回', value: 'rejected' }] },
    { field: 'fileUrl', label: '附件', type: 'input' },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {
    year: [{ required: true, message: '请输入年度', trigger: 'blur' }],
    totalAmount: [{ required: true, message: '请输入总金额', trigger: 'blur' }]
  },
  statusMap: {
    status: {
      draft: { label: '草稿', type: 'info' },
      submitted: { label: '已提交', type: 'warning' },
      approved: { label: '已审批', type: 'success' },
      rejected: { label: '已驳回', type: 'danger' }
    }
  }
}
</script>
