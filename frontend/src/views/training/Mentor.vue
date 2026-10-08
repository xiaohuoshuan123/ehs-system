<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/mentor',
  autoOrgId: true,
  columns: [
    { field: 'mentorId', label: '师傅', width: 150 },
    { field: 'apprenticeId', label: '徒弟', width: 150 },
    { field: 'startDate', label: '开始日期', type: 'date', width: 120 },
    { field: 'endDate', label: '结束日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'mentorId', label: '师傅ID', type: 'input', required: true },
    { field: 'apprenticeId', label: '徒弟ID', type: 'input', required: true },
    { field: 'startDate', label: '开始日期', type: 'date', required: true },
    { field: 'endDate', label: '结束日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'进行中'},{value:'completed',label:'已完成'},{value:'terminated',label:'已终止'}] },
    { field: 'agreementFileUrl', label: '协议文件', type: 'upload' }
  ],
  formRules: { mentorId: [{ required: true, message: '请输入师傅ID', trigger: 'blur' }], apprenticeId: [{ required: true, message: '请输入徒弟ID', trigger: 'blur' }] },
  statusMap: { status: { active: { label: '进行中', type: 'success' }, completed: { label: '已完成', type: 'info' }, terminated: { label: '已终止', type: 'warning' } } }
}
</script>