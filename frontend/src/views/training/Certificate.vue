<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/certificate',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'certificate',
  searchFields: [
    { field: 'certNo', label: '证书编号', type: 'input' },
    { field: 'userId', label: '持证人工号', type: 'input' }
  ],
  columns: [
    { field: 'certType', label: '证书类型', type: 'text', width: 120 },
    { field: 'certCategory', label: '类别', type: 'text', width: 120 },
    { field: 'certNo', label: '证书编号', type: 'text', width: 150 },
    { field: 'userId', label: '持证人工号', type: 'text', width: 120 },
    { field: 'issueDate', label: '发证日期', type: 'date', width: 180 },
    { field: 'expireDate', label: '到期日期', type: 'date', width: 180 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'alertLevel', label: '预警等级', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'userId', label: '持证人', type: 'input' },
    { field: 'certType', label: '类型', type: 'select', options: [{ label: '企业负责人', value: '企业负责人' }, { label: '安全管理人员', value: '安全管理人员' }, { label: '特种作业', value: '特种作业' }, { label: '消防', value: '消防' }] },
    { field: 'certCategory', label: '类别', type: 'input' },
    { field: 'certItem', label: '项目', type: 'input' },
    { field: 'certNo', label: '编号', type: 'input' },
    { field: 'issueOrg', label: '发证机构', type: 'input' },
    { field: 'issueDate', label: '发证日期', type: 'date' },
    { field: 'expireDate', label: '到期日期', type: 'date' },
    { field: 'reviewDate', label: '复审日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '有效', value: 'valid' }, { label: '待复审', value: 'review_pending' }, { label: '已过期', value: 'expired' }, { label: '已吊销', value: 'revoked' }] },
    { field: 'alertLevel', label: '预警', type: 'select', options: [{ label: '正常', value: 'normal' }, { label: '90天', value: '90d' }, { label: '60天', value: '60d' }, { label: '30天', value: '30d' }, { label: '已逾期', value: 'overdue' }] },
    { field: 'fileUrl', label: '证书扫描件', type: 'input' },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {},
  statusMap: {
    status: {
      valid: { label: '有效', type: 'success' },
      review_pending: { label: '待复审', type: 'warning' },
      expired: { label: '已过期', type: 'danger' },
      revoked: { label: '已吊销', type: 'info' }
    },
    alertLevel: {
      normal: { label: '正常', type: 'success' },
      '90d': { label: '90天', type: 'info' },
      '60d': { label: '60天', type: 'warning' },
      '30d': { label: '30天', type: 'danger' },
      overdue: { label: '已逾期', type: 'danger' }
    }
  }
}
</script>
