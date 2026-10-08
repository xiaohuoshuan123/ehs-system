<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/fire-zone',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '消防区域名称', width: 200 },
    { field: 'zoneType', label: '区域类型', width: 120 },
    { field: 'description', label: '描述', width: 300 },
    { field: 'fireGroup', label: '防火小组', width: 150 },
    { field: 'ertMembers', label: 'ERT队员', width: 150 }
  ],
  formFields: [
    { field: 'name', label: '区域名称', type: 'input', required: true },
    { field: 'zoneType', label: '区域类型', type: 'input' },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'mapUrl', label: '区域地图', type: 'upload' },
    { field: 'planFileUrl', label: '消防预案', type: 'upload' },
    { field: 'fireGroup', label: '防火小组', type: 'input' },
    { field: 'ertMembers', label: 'ERT队员', type: 'input' }
  ],
  formRules: { name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }] }
}
</script>