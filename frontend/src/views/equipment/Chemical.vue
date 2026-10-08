<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/chemical',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '化学品名称', width: 150 },
    { field: 'aliases', label: '别名', width: 150 },
    { field: 'casNo', label: 'CAS号', width: 150 },
    { field: 'isHazardous', label: '危险品', type: 'boolean', width: 80 },
    { field: 'isEasyToxic', label: '易制毒', type: 'boolean', width: 80 },
    { field: 'isExplosive', label: '易制爆', type: 'boolean', width: 80 },
    { field: 'storageLocation', label: '存放位置', width: 150 },
    { field: 'currentStock', label: '库存', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 80 }
  ],
  formFields: [
    { field: 'name', label: '名称', type: 'input', required: true },
    { field: 'aliases', label: '别名', type: 'input' },
    { field: 'casNo', label: 'CAS号', type: 'input' },
    { field: 'isHazardous', label: '危险化学品', type: 'switch' },
    { field: 'isEasyToxic', label: '易制毒', type: 'switch' },
    { field: 'isExplosive', label: '易制爆', type: 'switch' },
    { field: 'isProhibited', label: '禁止使用', type: 'switch' },
    { field: 'storageLocation', label: '存放位置', type: 'input' },
    { field: 'maxStock', label: '最大库存', type: 'number' },
    { field: 'currentStock', label: '当前库存', type: 'number' },
    { field: 'sdsFileUrl', label: 'SDS文件', type: 'upload' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'在用'},{value:'inactive',label:'停用'}] }
  ],
  statusMap: { status: { active: { label: '在用', type: 'success' }, inactive: { label: '停用', type: 'info' } } }
}
</script>