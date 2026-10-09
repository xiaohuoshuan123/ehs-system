<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/work-behavior',
  autoOrgId: true,
  columns: [
    { field: 'cameraName', label: '摄像头', width: 150 },
    { field: 'cameraLocation', label: '位置', width: 150 },
    { field: 'behaviorType', label: '行为类型', type: 'tag', width: 120 },
    { field: 'riskLevel', label: '风险', type: 'tag', width: 80 },
    { field: 'detectTime', label: '检测时间', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'cameraId', label: '摄像头ID', type: 'input' },
    { field: 'cameraName', label: '摄像头名称', type: 'input' },
    { field: 'cameraLocation', label: '摄像头位置', type: 'input', required: true },
    { field: 'behaviorType', label: '行为类型', type: 'select', options: [{value:'missing_helmet',label:'未戴安全帽'},{value:'missing_ppe',label:'未佩戴PPE'},{value:'smoking',label:'吸烟'},{value:'fall_risk',label:'跌落风险'},{value:'intrusion',label:'违规闯入'},{value:'unsafe_action',label:'不安全行为'}] },
    { field: 'riskLevel', label: '风险等级', type: 'select', options: [{value:'low',label:'低'},{value:'medium',label:'中'},{value:'high',label:'高'},{value:'critical',label:'紧急'}] },
    { field: 'detectTime', label: '检测时间', type: 'date', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'handledBy', label: '处理人', type: 'input' },
    { field: 'handledAt', label: '处理时间', type: 'date' },
    { field: 'handlingResult', label: '处理结果', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'待处理'},{value:'handled',label:'已处理'},{value:'closed',label:'已关闭'}] }
  ],
  statusMap: {
    behaviorType: { missing_helmet: { label: '未戴帽', type: 'danger' }, missing_ppe: { label: '未戴PPE', type: 'warning' }, smoking: { label: '吸烟', type: 'danger' }, fall_risk: { label: '跌落风险', type: 'warning' }, intrusion: { label: '闯入', type: 'danger' }, unsafe_action: { label: '不安全行为', type: 'warning' } },
    riskLevel: { low: { label: '低', type: 'success' }, medium: { label: '中', type: 'primary' }, high: { label: '高', type: 'warning' }, critical: { label: '紧急', type: 'danger' } },
    status: { active: { label: '待处理', type: 'danger' }, handled: { label: '已处理', type: 'success' }, closed: { label: '已关闭', type: 'info' } }
  }
}
</script>