<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/occupational-exam-result',
  autoOrgId: true,
  columns: [
    { field: 'userId', label: '员工ID', width: 200 },
    { field: 'examDate', label: '体检日期', type: 'date', width: 120 },
    { field: 'examOrg', label: '体检机构', width: 150 },
    { field: 'resultType', label: '结果类型', type: 'tag', width: 120 },
    { field: 'signStatus', label: '签字状态', type: 'tag', width: 100 },
    { field: 'processStatus', label: '处理状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'userId', label: '员工ID', type: 'input', required: true },
    { field: 'examDate', label: '体检日期', type: 'date', required: true },
    { field: 'examOrg', label: '体检机构', type: 'input' },
    { field: 'resultType', label: '结果类型', type: 'select', options: [{value:'normal',label:'正常'},{value:'occupational_disease',label:'职业病'},{value:'contraindication',label:'禁忌证'},{value:'suspected_disease',label:'疑似职业病'}] },
    { field: 'resultDetail', label: '结果详情', type: 'textarea' },
    { field: 'reportFileUrl', label: '体检报告', type: 'upload' },
    { field: 'signStatus', label: '签字状态', type: 'select', options: [{value:'pending',label:'待签字'},{value:'signed',label:'已签字'}] },
    { field: 'processStatus', label: '处理状态', type: 'select', options: [{value:'pending',label:'待处理'},{value:'processed',label:'已处理'},{value:'reviewed',label:'已审核'}] }
  ],
  statusMap: {
    resultType: { normal: { label: '正常', type: 'success' }, occupational_disease: { label: '职业病', type: 'danger' }, contraindication: { label: '禁忌证', type: 'warning' }, suspected_disease: { label: '疑似', type: 'warning' } },
    signStatus: { pending: { label: '待签字', type: 'warning' }, signed: { label: '已签字', type: 'success' } },
    processStatus: { pending: { label: '待处理', type: 'warning' }, processed: { label: '已处理', type: 'success' }, reviewed: { label: '已审核', type: 'info' } }
  }
}
</script>