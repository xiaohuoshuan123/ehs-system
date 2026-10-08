<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/safety-score',
  autoOrgId: true,
  columns: [
    { field: 'orgName', label: '单位', width: 150 },
    { field: 'year', label: '年度', width: 80 },
    { field: 'month', label: '月份', width: 80 },
    { field: 'totalScore', label: '总分', width: 80 },
    { field: 'alertLevel', label: '预警等级', type: 'tag', width: 120 }
  ],
  formFields: [
    { field: 'orgName', label: '单位名称', type: 'input', required: true },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'month', label: '月份', type: 'number', default: 1 },
    { field: 'trainingScore', label: '培训得分', type: 'number' },
    { field: 'hazardScore', label: '隐患得分', type: 'number' },
    { field: 'violationScore', label: '违章得分', type: 'number' },
    { field: 'accidentScore', label: '事故得分', type: 'number' },
    { field: 'newEmployeeScore', label: '新员工得分', type: 'number' },
    { field: 'hpScore', label: 'HP得分', type: 'number' },
    { field: 'totalScore', label: '总分', type: 'number' },
    { field: 'alertLevel', label: '预警等级', type: 'select', options: [{value:'green',label:'绿'},{value:'yellow',label:'黄'},{value:'orange',label:'橙'},{value:'red',label:'红'}] },
    { field: 'detail', label: '明细(JSON)', type: 'textarea' }
  ],
  statusMap: { alertLevel: { green: { label: '绿', type: 'success' }, yellow: { label: '黄', type: 'warning' }, orange: { label: '橙', type: 'warning' }, red: { label: '红', type: 'danger' } } }
}
</script>