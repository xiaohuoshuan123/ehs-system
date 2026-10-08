<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/hazard-reward',
  columns: [
    { field: 'hazardId', label: '隐患ID', width: 200 },
    { field: 'rewardType', label: '奖励类型', width: 150 },
    { field: 'rewardAmount', label: '奖励金额', width: 100 },
    { field: 'rewardDesc', label: '奖励说明', width: 250 },
    { field: 'awardTime', label: '奖励时间', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'hazardId', label: '隐患ID', type: 'input', required: true },
    { field: 'rewardType', label: '奖励类型', type: 'input', required: true },
    { field: 'rewardAmount', label: '奖励金额', type: 'number', required: true },
    { field: 'rewardDesc', label: '奖励说明', type: 'textarea' },
    { field: 'awardTime', label: '奖励时间', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待审批'},{value:'approved',label:'已审批'},{value:'paid',label:'已发放'}] }
  ],
  statusMap: { status: { pending: { label: '待审批', type: 'warning' }, approved: { label: '已审批', type: 'success' }, paid: { label: '已发放', type: 'info' } } }
}
</script>