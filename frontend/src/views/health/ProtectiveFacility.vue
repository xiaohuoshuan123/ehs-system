<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/protective-facility',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '名称', width: 200 },
    { field: 'category', label: '类别', type: 'tag', width: 120 },
    { field: 'location', label: '位置', width: 150 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'lastInspectDate', label: '上次检查', type: 'date', width: 120 }
  ],
  formFields: [
    { field: 'name', label: '设施名称', type: 'input', required: true },
    { field: 'category', label: '类别', type: 'select', options: [{value:'noise',label:'噪声'},{value:'dust',label:'粉尘'},{value:'chemical',label:'化学'},{value:'temperature',label:'高温'},{value:'ventilation',label:'通风'}] },
    { field: 'type', label: '类型', type: 'input' },
    { field: 'location', label: '位置', type: 'input' },
    { field: 'hazardFactorId', label: '危害因素ID', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'abnormal',label:'异常'},{value:'scrapped',label:'报废'}] },
    { field: 'lastInspectDate', label: '上次检查日期', type: 'date' }
  ],
  statusMap: { category: { noise: { label: '噪声', type: 'primary' }, dust: { label: '粉尘', type: 'warning' }, chemical: { label: '化学', type: 'danger' }, temperature: { label: '高温', type: 'danger' }, ventilation: { label: '通风', type: 'info' } }, status: { normal: { label: '正常', type: 'success' }, abnormal: { label: '异常', type: 'danger' }, scrapped: { label: '报废', type: 'info' } } }
}
</script>