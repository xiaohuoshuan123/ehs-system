<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/accident',
  autoOrgId: true,
  columns: [
    { field: 'accidentNo', label: '事故编号', width: 120 },
    { field: 'title', label: '事故标题', width: 250 },
    { field: 'accidentType', label: '事故类型', type: 'tag', width: 100 },
    { field: 'accidentLevel', label: '事故等级', type: 'tag', width: 100 },
    { field: 'location', label: '地点', width: 150 },
    { field: 'happenTime', label: '发生时间', type: 'datetime', width: 180 },
    { field: 'reportTime', label: '报告时间', type: 'datetime', width: 180 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'accidentNo', label: '事故编号', type: 'input', required: true },
    { field: 'title', label: '事故标题', type: 'input', required: true },
    { field: 'accidentType', label: '事故类型', type: 'select', options: [{value:'工亡',label:'工亡'},{value:'重伤',label:'重伤'},{value:'轻伤',label:'轻伤'},{value:'职业病',label:'职业病'}] },
    { field: 'accidentLevel', label: '事故等级', type: 'select', options: [{value:'general',label:'一般'},{value:'major',label:'重大'}] },
    { field: 'location', label: '事故地点', type: 'input' },
    { field: 'happenTime', label: '发生时间', type: 'datetime', required: true },
    { field: 'reportTime', label: '报告时间', type: 'datetime', required: true },
    { field: 'reporterId', label: '报告人ID', type: 'input' },
    { field: 'description', label: '事故描述', type: 'textarea' },
    { field: 'initialHandling', label: '初步处置', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'submitted',label:'已提交'},{value:'reviewed',label:'已审核'},{value:'archived',label:'已归档'}] }
  ],
  statusMap: {
    accidentType: { '工亡': { label: '工亡', type: 'danger' }, '重伤': { label: '重伤', type: 'danger' }, '轻伤': { label: '轻伤', type: 'warning' }, '职业病': { label: '职业病', type: 'info' } },
    accidentLevel: { general: { label: '一般', type: 'warning' }, major: { label: '重大', type: 'danger' } },
    status: { draft: { label: '草稿', type: 'info' }, submitted: { label: '已提交', type: 'warning' }, reviewed: { label: '已审核', type: 'success' }, archived: { label: '已归档', type: 'info' } }
  }
}
</script>