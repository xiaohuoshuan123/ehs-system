<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/work-check',
  autoOrgId: true,
  columns: [
    { field: 'checkType', label: '点检类型', type: 'tag', width: 120 },
    { field: 'checker', label: '点检人', width: 120 },
    { field: 'checkDate', label: '点检日期', type: 'date', width: 120 },
    { field: 'result', label: '结果', type: 'tag', width: 100 },
    { field: 'issues', label: '问题', width: 200 }
  ],
  formFields: [
    { field: 'checkType', label: '点检类型', type: 'select', options: [{value:'pre_cast',label:'铸前点检'},{value:'rigging',label:'吊具点检'},{value:'emulsion',label:'乳液点检'},{value:'waste_storage',label:'危废库点检'},{value:'fire_extinguisher',label:'灭火器检查'}] },
    { field: 'checker', label: '点检人', type: 'input', required: true },
    { field: 'checkDate', label: '点检日期', type: 'date', required: true },
    { field: 'items', label: '点检项目(JSON)', type: 'textarea' },
    { field: 'result', label: '结果', type: 'select', options: [{value:'normal',label:'正常'},{value:'abnormal',label:'异常'}] },
    { field: 'issues', label: '问题描述', type: 'textarea' },
    { field: 'photos', label: '照片URL(JSON)', type: 'textarea' }
  ],
  statusMap: { checkType: { pre_cast: { label: '铸前', type: 'primary' }, rigging: { label: '吊具', type: 'warning' }, emulsion: { label: '乳液', type: 'info' }, waste_storage: { label: '危废库', type: 'danger' }, fire_extinguisher: { label: '灭火器', type: 'success' } }, result: { normal: { label: '正常', type: 'success' }, abnormal: { label: '异常', type: 'danger' } } }
}
</script>