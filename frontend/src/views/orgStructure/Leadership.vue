<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/leadership',
  autoOrgId: true,
  columns: [
    { field: 'leaderName', label: '领导姓名', width: 120 },
    { field: 'leaderRole', label: '职务', type: 'tag', width: 100 },
    { field: 'leadershipType', label: '领导作用', type: 'tag', width: 120 },
    { field: 'date', label: '日期', type: 'date', width: 120 },
    { field: 'content', label: '内容', width: 300 },
    { field: 'location', label: '地点', width: 150 }
  ],
  formFields: [
    { field: 'leaderName', label: '领导姓名', type: 'input', required: true },
    { field: 'leaderRole', label: '职务', type: 'select', options: [{value:'chairman',label:'董事长'},{value:'president',label:'总经理'},{value:'deputy',label:'副总经理'},{value:'chief_engineer',label:'总工程师'}] },
    { field: 'leadershipType', label: '领导作用', type: 'select', options: [{value:'philosophy_example',label:'践行理念/表率'},{value:'resource_support',label:'资源保障'},{value:'risk_control',label:'风险管控'},{value:'hazard_remediation',label:'隐患排查'},{value:'emergency',label:'应急处置'},{value:'human_rights',label:'员工权益'}] },
    { field: 'date', label: '日期', type: 'date', required: true },
    { field: 'location', label: '地点', type: 'input' },
    { field: 'participants', label: '参与人员', type: 'textarea' },
    { field: 'content', label: '内容', type: 'textarea', required: true }
  ],
  statusMap: {
    leaderRole: { chairman: { label: '董事长', type: 'danger' }, president: { label: '总经理', type: 'warning' }, deputy: { label: '副总', type: 'primary' }, chief_engineer: { label: '总工', type: 'success' } },
    leadershipType: { philosophy_example: { label: '理念表率', type: 'primary' }, resource_support: { label: '资源保障', type: 'success' }, risk_control: { label: '风险管控', type: 'warning' }, hazard_remediation: { label: '隐患排查', type: 'danger' }, emergency: { label: '应急', type: 'info' }, human_rights: { label: '员工权益', type: 'success' } }
  }
}
</script>