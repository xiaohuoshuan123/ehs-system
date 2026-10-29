<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/contractor-approval',
  columns: [
    { field: 'contractorId', label: '承包商ID', width: 150 },
    { field: 'type', label: '审批类型', type: 'tag', width: 120 },
    { field: 'applicantId', label: '申请人', width: 120 },
    { field: 'applyDate', label: '申请日期', type: 'date', width: 120 },
    { field: 'result', label: '结果', type: 'tag', width: 100 },
    { field: 'reviewer', label: '审批人', width: 120 }
  ],
  formFields: [
    { field: 'contractorId', label: '承包商ID', type: 'input', required: true },
    { field: 'type', label: '审批类型', type: 'select', options: [{value:'entry',label:'入场审批'},{value:'qualification',label:'资质审批'},{value:'extension',label:'延期审批'}] },
    { field: 'applicantId', label: '申请人ID', type: 'input', required: true },
    { field: 'applyDate', label: '申请日期', type: 'date', required: true },
    { field: 'reviewDate', label: '审批日期', type: 'date' },
    { field: 'result', label: '结果', type: 'select', options: [{value:'pending',label:'待审批'},{value:'approved',label:'已批准'},{value:'rejected',label:'已驳回'}] },
    { field: 'reviewer', label: '审批人', type: 'input' },
    { field: 'comment', label: '审批意见', type: 'textarea' },
    { field: 'fileUrl', label: '附件URL', type: 'input' }
  ],
  statusMap: { result: { pending: { label: '待审批', type: 'warning' }, approved: { label: '已批准', type: 'success' }, rejected: { label: '已驳回', type: 'danger' } }, type: { entry: { label: '入场', type: 'primary' }, qualification: { label: '资质', type: 'warning' }, extension: { label: '延期', type: 'info' } } }
}
</script>