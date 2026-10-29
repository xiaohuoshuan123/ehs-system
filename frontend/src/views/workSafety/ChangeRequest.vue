<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/change',
  autoOrgId: true,
  columns: [
    { field: 'changeNo', label: '变更编号', width: 150 },
    { field: 'title', label: '变更标题', width: 250 },
    { field: 'changeType', label: '变更类型', type: 'tag', width: 100 },
    { field: 'applicantId', label: '申请人', width: 120 },
    { field: 'applyDate', label: '申请日期', type: 'date', width: 120 },
    { field: 'approveStatus', label: '审批状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'changeNo', label: '变更编号', type: 'input', required: true },
    { field: 'title', label: '变更标题', type: 'input', required: true },
    { field: 'changeType', label: '变更类型', type: 'select', options: [{value:'工艺',label:'工艺'},{value:'设备',label:'设备'},{value:'安全',label:'安全'}] },
    { field: 'description', label: '变更描述', type: 'textarea' },
    { field: 'riskAssessment', label: '风险评估', type: 'textarea' },
    { field: 'measures', label: '管控措施', type: 'textarea' },
    { field: 'applicantId', label: '申请人ID', type: 'input' },
    { field: 'applyDate', label: '申请日期', type: 'date' },
    { field: 'approveStatus', label: '审批状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'submitted',label:'已提交'},{value:'approved',label:'已审批'},{value:'rejected',label:'已驳回'}] }
  ],
  statusMap: { approveStatus: { draft: { label: '草稿', type: 'info' }, submitted: { label: '已提交', type: 'warning' }, approved: { label: '已审批', type: 'success' }, rejected: { label: '已驳回', type: 'danger' } } }
}
</script>