<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/unsafe-behavior',
  autoOrgId: true,
  columns: [
    { field: 'employeeName', label: '姓名', width: 100 },
    { field: 'behaviorType', label: '行为类型', type: 'tag', width: 120 },
    { field: 'location', label: '位置', width: 150 },
    { field: 'date', label: '日期', type: 'date', width: 120 },
    { field: 'reportedBy', label: '报告人', width: 100 },
    { field: 'handlingType', label: '处理', type: 'tag', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 80 }
  ],
  formFields: [
    { field: 'employeeName', label: '姓名', type: 'input', required: true },
    { field: 'employeeNo', label: '工号', type: 'input' },
    { field: 'behaviorType', label: '行为类型', type: 'select', options: [{value:'smoking',label:'吸烟'},{value:'missing_ppe',label:'未佩戴PPE'},{value:'improper_operation',label:'违规操作'},{value:'speed_racing',label:'超速/抢工'},{value:'other',label:'其他'}] },
    { field: 'description', label: '描述', type: 'textarea', required: true },
    { field: 'location', label: '位置', type: 'input' },
    { field: 'date', label: '日期', type: 'date', required: true },
    { field: 'reportedBy', label: '报告人', type: 'input', required: true },
    { field: 'handlingType', label: '处理类型', type: 'select', options: [{value:'education',label:'教育'},{value:'warning',label:'警告'},{value:'punishment',label:'处罚'}] },
    { field: 'handlingResult', label: '处理结果', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待处理'},{value:'handled',label:'已处理'},{value:'closed',label:'已关闭'}] }
  ],
  statusMap: {
    behaviorType: { smoking: { label: '吸烟', type: 'danger' }, missing_ppe: { label: '未戴PPE', type: 'warning' }, improper_operation: { label: '违规操作', type: 'danger' }, speed_racing: { label: '抢工', type: 'warning' }, other: { label: '其他', type: 'info' } },
    handlingType: { education: { label: '教育', type: 'primary' }, warning: { label: '警告', type: 'warning' }, punishment: { label: '处罚', type: 'danger' } },
    status: { pending: { label: '待处理', type: 'danger' }, handled: { label: '已处理', type: 'success' }, closed: { label: '已关闭', type: 'info' } }
  }
}
</script>