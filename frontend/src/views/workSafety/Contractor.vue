<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/contractor',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '承包商名称', width: 250 },
    { field: 'unifiedCode', label: '统一社会信用代码', width: 180 },
    { field: 'contactPerson', label: '联系人', width: 120 },
    { field: 'contactPhone', label: '联系电话', width: 130 },
    { field: 'licenseExpiry', label: '资质到期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'name', label: '承包商名称', type: 'input', required: true },
    { field: 'unifiedCode', label: '统一社会信用代码', type: 'input' },
    { field: 'licenseNo', label: '资质证书编号', type: 'input' },
    { field: 'licenseExpiry', label: '资质到期日期', type: 'date' },
    { field: 'contactPerson', label: '联系人', type: 'input' },
    { field: 'contactPhone', label: '联系电话', type: 'input' },
    { field: 'address', label: '地址', type: 'input' },
    { field: 'qualificationFileUrl', label: '资质文件', type: 'upload' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'有效'},{value:'suspended',label:'暂停'},{value:'blacklisted',label:'黑名单'}] }
  ],
  statusMap: { status: { active: { label: '有效', type: 'success' }, suspended: { label: '暂停', type: 'warning' }, blacklisted: { label: '黑名单', type: 'danger' } } }
}
</script>