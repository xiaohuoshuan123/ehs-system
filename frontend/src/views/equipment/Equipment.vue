<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/equipment',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '设备名称', width: 200 },
    { field: 'code', label: '设备编码', width: 150 },
    { field: 'type', label: '类型', width: 120 },
    { field: 'model', label: '型号', width: 150 },
    { field: 'responsibleDept', label: '责任部门', width: 150 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'commissionDate', label: '投用日期', type: 'date', width: 120 }
  ],
  formFields: [
    { field: 'name', label: '设备名称', type: 'input', required: true },
    { field: 'code', label: '设备编码', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'input' },
    { field: 'category', label: '分类', type: 'input' },
    { field: 'model', label: '型号', type: 'input' },
    { field: 'spec', label: '规格', type: 'input' },
    { field: 'manufacturer', label: '制造商', type: 'input' },
    { field: 'purchaseDate', label: '采购日期', type: 'date' },
    { field: 'commissionDate', label: '投用日期', type: 'date' },
    { field: 'responsibleDept', label: '责任部门', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'in_use',label:'在用'},{value:'under_maintenance',label:'维护中'},{value:'scrapped',label:'已报废'}] },
    { field: 'remark', label: '备注', type: 'textarea' }
  ],
  formRules: { name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }], code: [{ required: true, message: '请输入设备编码', trigger: 'blur' }] },
  statusMap: { status: { in_use: { label: '在用', type: 'success' }, under_maintenance: { label: '维护中', type: 'warning' }, scrapped: { label: '已报废', type: 'info' } } }
}
</script>