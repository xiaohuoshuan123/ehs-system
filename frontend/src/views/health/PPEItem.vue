<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/ppe',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '物品名称', width: 200 },
    { field: 'type', label: '类型', type: 'tag', width: 120 },
    { field: 'brand', label: '品牌', width: 150 },
    { field: 'model', label: '型号', width: 150 },
    { field: 'standard', label: '标准', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'name', label: '物品名称', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'select', options: [{value:'helmet',label:'安全帽'},{value:'gloves',label:'手套'},{value:'mask',label:'口罩/面罩'},{value:'earplug',label:'耳塞/耳罩'},{value:'goggles',label:'护目镜'},{value:'goggles',label:'护目镜'},{value:'shoes',label:'劳保鞋'},{value:'clothing',label:'防护服'},{value:'other',label:'其他'}] },
    { field: 'brand', label: '品牌', type: 'input' },
    { field: 'model', label: '型号', type: 'input' },
    { field: 'standard', label: '执行标准', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'在用'},{value:'inactive',label:'停用'}] }
  ],
  statusMap: {
    type: { helmet: { label: '安全帽', type: 'primary' }, gloves: { label: '手套', type: 'info' }, mask: { label: '口罩', type: 'warning' }, earplug: { label: '耳塞', type: 'info' }, goggles: { label: '护目镜', type: 'warning' }, shoes: { label: '劳保鞋', type: 'primary' }, clothing: { label: '防护服', type: 'danger' }, other: { label: '其他', type: 'info' } },
    status: { active: { label: '在用', type: 'success' }, inactive: { label: '停用', type: 'info' } }
  }
}
</script>
