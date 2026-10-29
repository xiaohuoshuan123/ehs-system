<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/ppe-issue',
  autoOrgId: true,
  columns: [
    { field: 'userId', label: '申请人ID', width: 200 },
    { field: 'ppeItemId', label: 'PPE物品ID', width: 200 },
    { field: 'size', label: '尺码', width: 80 },
    { field: 'quantity', label: '数量', width: 80 },
    { field: 'applyDate', label: '申请日期', type: 'date', width: 120 },
    { field: 'approveStatus', label: '审批状态', type: 'tag', width: 100 },
    { field: 'issueStatus', label: '发放状态', type: 'tag', width: 100 },
    { field: 'issueDate', label: '发放日期', type: 'date', width: 120 }
  ],
  formFields: [
    { field: 'userId', label: '申请人ID', type: 'input', required: true },
    { field: 'ppeItemId', label: 'PPE物品ID', type: 'input', required: true },
    { field: 'size', label: '尺码', type: 'input' },
    { field: 'quantity', label: '数量', type: 'number', default: 1 },
    { field: 'applyReason', label: '申请原因', type: 'input' },
    { field: 'applyDate', label: '申请日期', type: 'date', required: true },
    { field: 'approveStatus', label: '审批状态', type: 'select', options: [{value:'pending',label:'待审批'},{value:'approved',label:'已审批'},{value:'rejected',label:'已驳回'}] },
    { field: 'approverId', label: '审批人ID', type: 'input' },
    { field: 'approveTime', label: '审批时间', type: 'datetime' },
    { field: 'issueStatus', label: '发放状态', type: 'select', options: [{value:'pending',label:'待发放'},{value:'issued',label:'已发放'}] },
    { field: 'issueDate', label: '发放日期', type: 'date' },
    { field: 'issueBy', label: '发放人', type: 'input' }
  ],
  statusMap: {
    approveStatus: { pending: { label: '待审批', type: 'warning' }, approved: { label: '已审批', type: 'success' }, rejected: { label: '已驳回', type: 'danger' } },
    issueStatus: { pending: { label: '待发放', type: 'warning' }, issued: { label: '已发放', type: 'success' } }
  }
}
</script>
