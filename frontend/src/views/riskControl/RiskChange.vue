<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/risk-change',
  columns: [
    { field: 'riskControlId', label: '风险管控ID', width: 150 },
    { field: 'changeType', label: '变更类型', type: 'tag', width: 120 },
    { field: 'assessorId', label: '评估人', width: 120 },
    { field: 'assessmentDate', label: '评估日期', type: 'date', width: 120 },
    { field: 'oldLevel', label: '原等级', type: 'tag', width: 100 },
    { field: 'newLevel', label: '新等级', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'riskControlId', label: '风险管控ID', type: 'input', required: true },
    { field: 'changeType', label: '变更类型', type: 'select', options: [{value:'initial',label:'初始辨识'},{value:'new_project',label:'新项目'},{value:'new_process',label:'新工艺'},{value:'new_equipment',label:'新设备'},{value:'accident',label:'事故后'},{value:'annual',label:'年度评审'}] },
    { field: 'reason', label: '变更原因', type: 'textarea', required: true },
    { field: 'assessorId', label: '评估人ID', type: 'input' },
    { field: 'assessmentDate', label: '评估日期', type: 'date' },
    { field: 'oldLevel', label: '原等级', type: 'select', options: [{value:'low',label:'低'},{value:'medium',label:'中'},{value:'high',label:'高'},{value:'major',label:'重大'}] },
    { field: 'newLevel', label: '新等级', type: 'select', options: [{value:'low',label:'低'},{value:'medium',label:'中'},{value:'high',label:'高'},{value:'major',label:'重大'}] },
    { field: 'conclusion', label: '结论', type: 'textarea' },
    { field: 'fileUrl', label: '附件URL', type: 'input' }
  ],
  statusMap: { changeType: { initial: { label: '初始', type: 'info' }, new_project: { label: '新项目', type: 'primary' }, new_process: { label: '新工艺', type: 'warning' }, new_equipment: { label: '新设备', type: 'primary' }, accident: { label: '事故后', type: 'danger' }, annual: { label: '年度', type: 'info' } }, oldLevel: { low: { label: '低', type: 'success' }, medium: { label: '中', type: 'warning' }, high: { label: '高', type: 'danger' }, major: { label: '重大', type: 'danger' } }, newLevel: { low: { label: '低', type: 'success' }, medium: { label: '中', type: 'warning' }, high: { label: '高', type: 'danger' }, major: { label: '重大', type: 'danger' } } }
}
</script>