<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/emergency-team',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '队伍名称', width: 200 },
    { field: 'teamType', label: '类型', type: 'tag', width: 100 },
    { field: 'leaderId', label: '队长', width: 150 },
    { field: 'specialty', label: '专长领域', width: 200 },
    { field: 'contactPhone', label: '联系电话', width: 130 }
  ],
  formFields: [
    { field: 'name', label: '队伍名称', type: 'input', required: true },
    { field: 'teamType', label: '类型', type: 'select', options: [{value:'full_time',label:'专职'},{value:'part_time',label:'兼职'},{value:'organization',label:'组织'}] },
    { field: 'leaderId', label: '队长ID', type: 'input' },
    { field: 'members', label: '队员JSON', type: 'textarea' },
    { field: 'specialty', label: '专长领域', type: 'input' },
    { field: 'contactPhone', label: '联系电话', type: 'input' }
  ],
  statusMap: { teamType: { full_time: { label: '专职', type: 'danger' }, part_time: { label: '兼职', type: 'warning' }, organization: { label: '组织', type: 'primary' } } }
}
</script>