<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/fire-patrol-plan',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '计划名称', width: 200 },
    { field: 'zoneId', label: '区域ID', width: 120 },
    { field: 'frequency', label: '频次', type: 'tag', width: 100 },
    { field: 'defaultPatrolBy', label: '默认巡查人', width: 150 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'name', label: '计划名称', type: 'input', required: true },
    { field: 'zoneId', label: '区域ID', type: 'input', required: true },
    { field: 'frequency', label: '频次', type: 'select', options: [{value:'daily',label:'每日'},{value:'weekly',label:'每周'},{value:'monthly',label:'每月'}] },
    { field: 'defaultPatrolBy', label: '默认巡查人', type: 'input' },
    { field: 'patrolItems', label: '巡查项目(JSON)', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'生效'},{value:'inactive',label:'停用'}] }
  ],
  statusMap: { frequency: { daily: { label: '每日', type: 'danger' }, weekly: { label: '每周', type: 'warning' }, monthly: { label: '每月', type: 'info' } }, status: { active: { label: '生效', type: 'success' }, inactive: { label: '停用', type: 'info' } } }
}
</script>