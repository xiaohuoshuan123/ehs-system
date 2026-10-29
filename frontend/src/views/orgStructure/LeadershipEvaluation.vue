<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/leadership-evaluation',
  autoOrgId: true,
  columns: [
    { field: 'leaderName', label: '领导', width: 100 },
    { field: 'leaderRole', label: '职务', type: 'tag', width: 100 },
    { field: 'year', label: '年度', width: 80 },
    { field: 'quarter', label: '季度', width: 80 },
    { field: 'totalScore', label: '总分', width: 80 },
    { field: 'grade', label: '等级', type: 'tag', width: 100 },
    { field: 'resultApplied', label: '纳入绩效', type: 'boolean', width: 100 }
  ],
  formFields: [
    { field: 'leaderName', label: '领导姓名', type: 'input', required: true },
    { field: 'leaderRole', label: '职务', type: 'select', options: [{value:'chairman',label:'董事长'},{value:'president',label:'总经理'},{value:'deputy',label:'副总经理'},{value:'chief_engineer',label:'总工程师'}] },
    { field: 'year', label: '年度', type: 'input', required: true },
    { field: 'quarter', label: '季度', type: 'select', options: [{value:1,label:'Q1'},{value:2,label:'Q2'},{value:3,label:'Q3'},{value:4,label:'Q4'}] },
    { field: 'evaluationPeriod', label: '评价周期', type: 'select', options: [{value:'quarterly',label:'季度'},{value:'semi_annual',label:'半年'},{value:'annual',label:'年度'}] },
    { field: 'philosophyScore', label: '理念分', type: 'input' },
    { field: 'exampleScore', label: '表率分', type: 'input' },
    { field: 'resourceScore', label: '资源分', type: 'input' },
    { field: 'riskControlScore', label: '风控分', type: 'input' },
    { field: 'hazardScore', label: '隐患分', type: 'input' },
    { field: 'emergencyScore', label: '应急分', type: 'input' },
    { field: 'humanRightsScore', label: '权益分', type: 'input' },
    { field: 'totalScore', label: '总分', type: 'input' },
    { field: 'grade', label: '等级', type: 'select', options: [{value:'excellent',label:'优秀'},{value:'good',label:'良好'},{value:'qualified',label:'合格'},{value:'unqualified',label:'不合格'}] },
    { field: 'evaluatedAt', label: '评价日期', type: 'date', required: true },
    { field: 'evaluator', label: '评价人', type: 'input' },
    { field: 'remarks', label: '备注', type: 'textarea' },
    { field: 'resultApplied', label: '纳入绩效', type: 'select', options: [{value:true,label:'是'},{value:false,label:'否'}] }
  ],
  statusMap: {
    leaderRole: { chairman: { label: '董事长', type: 'danger' }, president: { label: '总经理', type: 'warning' }, deputy: { label: '副总', type: 'primary' }, chief_engineer: { label: '总工', type: 'success' } },
    grade: { excellent: { label: '优秀', type: 'success' }, good: { label: '良好', type: 'primary' }, qualified: { label: '合格', type: 'info' }, unqualified: { label: '不合格', type: 'danger' } }
  }
}
</script>