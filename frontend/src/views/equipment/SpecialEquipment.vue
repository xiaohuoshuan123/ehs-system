<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/special-eq',
  autoOrgId: true,
  columns: [
    { field: 'name', label: '设备名称', width: 200 },
    { field: 'code', label: '设备编号', width: 150 },
    { field: 'type', label: '类型', width: 120 },
    { field: 'registrationNo', label: '注册编号', width: 150 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'alertStatus', label: '预警状态', type: 'tag', width: 100 },
    { field: 'lastInspectDate', label: '上次检验', type: 'date', width: 120 },
    { field: 'nextInspectDate', label: '下次检验', type: 'date', width: 120 }
  ],
  formFields: [
    { field: 'name', label: '设备名称', type: 'input', required: true },
    { field: 'code', label: '设备编号', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'select', options: [{value:'行车',label:'行车'},{value:'叉车',label:'叉车'},{value:'压力容器',label:'压力容器'},{value:'安全阀',label:'安全阀'},{value:'压力表',label:'压力表'}] },
    { field: 'registrationNo', label: '注册编号', type: 'input' },
    { field: 'useOrg', label: '使用单位', type: 'input' },
    { field: 'commissionDate', label: '投用日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'in_use',label:'在用'},{value:'stopped',label:'停用'},{value:'scrapped',label:'报废'}] },
    { field: 'lastInspectDate', label: '上次检验日期', type: 'date' },
    { field: 'nextInspectDate', label: '下次检验日期', type: 'date' },
    { field: 'alertStatus', label: '预警状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'60d',label:'60天预警'},{value:'30d',label:'30天预警'},{value:'expired',label:'已过期'},{value:'unqualified',label:'不合格'}] },
    { field: 'fileUrl', label: '设备档案', type: 'upload' }
  ],
  statusMap: {
    status: { in_use: { label: '在用', type: 'success' }, stopped: { label: '停用', type: 'warning' }, scrapped: { label: '报废', type: 'info' } },
    alertStatus: { normal: { label: '正常', type: 'success' }, '60d': { label: '60天预警', type: 'primary' }, '30d': { label: '30天预警', type: 'warning' }, expired: { label: '已过期', type: 'danger' }, unqualified: { label: '不合格', type: 'danger' } }
  }
}
</script>