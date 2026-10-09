<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/abnormal-handling',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '标题', width: 200 },
    { field: 'location', label: '位置', width: 150 },
    { field: 'abnormalType', label: '类型', type: 'tag', width: 100 },
    { field: 'riskLevel', label: '风险', type: 'tag', width: 80 },
    { field: 'discoveredAt', label: '发现时间', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'location', label: '位置', type: 'input', required: true },
    { field: 'abnormalType', label: '异常类型', type: 'select', options: [{value:'equipment',label:'设备异常'},{value:'process',label:'工艺异常'},{value:'environment',label:'环境异常'},{value:'personnel',label:'人员异常'},{value:'other',label:'其他'}] },
    { field: 'description', label: '描述', type: 'textarea', required: true },
    { field: 'discoveredBy', label: '发现人', type: 'input', required: true },
    { field: 'discoveredAt', label: '发现时间', type: 'date', required: true },
    { field: 'riskLevel', label: '风险等级', type: 'select', options: [{value:'low',label:'低'},{value:'medium',label:'中'},{value:'high',label:'高'},{value:'critical',label:'紧急'}] },
    { field: 'immediateAction', label: '立即措施', type: 'textarea' },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'handlingPlan', label: '处置方案', type: 'textarea' },
    { field: 'handlingResult', label: '处置结果', type: 'textarea' },
    { field: 'completedAt', label: '完成时间', type: 'date' },
    { field: 'reviewResult', label: '回顾总结', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待处置'},{value:'handling',label:'处置中'},{value:'completed',label:'已完成'},{value:'reviewed',label:'已回顾'}] }
  ],
  statusMap: {
    abnormalType: { equipment: { label: '设备', type: 'warning' }, process: { label: '工艺', type: 'primary' }, environment: { label: '环境', type: 'success' }, personnel: { label: '人员', type: 'danger' }, other: { label: '其他', type: 'info' } },
    riskLevel: { low: { label: '低', type: 'success' }, medium: { label: '中', type: 'primary' }, high: { label: '高', type: 'warning' }, critical: { label: '紧急', type: 'danger' } },
    status: { pending: { label: '待处置', type: 'danger' }, handling: { label: '处置中', type: 'warning' }, completed: { label: '已完成', type: 'success' }, reviewed: { label: '已回顾', type: 'info' } }
  }
}
</script>