<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/risk-map',
  autoOrgId: true,
  columns: [
    { field: 'workUnitId', label: '作业单元ID', width: 150 },
    { field: 'areaName', label: '区域名称', width: 200 },
    { field: 'mapImageUrl', label: '地图URL', width: 200 },
    { field: 'createdAt', label: '创建时间', type: 'datetime', width: 160 }
  ],
  formFields: [
    { field: 'workUnitId', label: '作业单元ID', type: 'input', required: true },
    { field: 'areaName', label: '区域名称', type: 'input', required: true },
    { field: 'mapData', label: '地图数据(JSON)', type: 'textarea' },
    { field: 'mapImageUrl', label: '地图URL', type: 'input' }
  ]
}
</script>