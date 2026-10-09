<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/solid-waste-record',
  autoOrgId: true,
  columns: [
    { field: 'wasteName', label: '废物名称', width: 170 },
    { field: 'wasteCode', label: '废物代码', width: 110 },
    { field: 'category', label: '类别', type: 'tag', width: 90 },
    { field: 'hazardClass', label: '危险特性', type: 'tag', width: 100 },
    { field: 'quantity', label: '数量 kg', width: 100 },
    { field: 'generationDate', label: '产生日期', type: 'date', width: 110 },
    { field: 'storageDays', label: '贮存天数', width: 90 },
    { field: 'disposalUnit', label: '处置单位', width: 170 },
    { field: 'status', label: '处置状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'wasteName', label: '废物名称', type: 'input', required: true, placeholder: '如: 含氟废渣 / 废油渣 / 含铝污泥 / 废铝灰' },
    { field: 'wasteCode', label: '废物代码', type: 'input', required: true, placeholder: 'GB 5085 八位代码, 如 HW49-900-041-49' },
    { field: 'category', label: '废物类别', type: 'select', required: true, options: [{value:'general',label:'一般工业固废'},{value:'solid',label:'固体废物'},{value:'hazardous',label:'危险废物'}] },
    { field: 'hazardClass', label: '危险特性', type: 'select', options: [{value:'none',label:'无'},{value:'toxicity',label:'毒性'},{value:'corrosive',label:'腐蚀性'},{value:'flammable',label:'易燃性'},{value:'reactive',label:'反应性'},{value:'infectious',label:'感染性'}] },
    { field: 'originProcess', label: '产生工序', type: 'input', required: true },
    { field: 'generationDate', label: '产生日期', type: 'date', required: true },
    { field: 'quantity', label: '数量', type: 'number' },
    { field: 'unit', label: '单位', type: 'select', options: [{value:'kg',label:'kg'},{value:'t',label:'t'},{value:'L',label:'L'},{value:'m³',label:'m³'}] },
    { field: 'storageLocation', label: '贮存位置', type: 'input', required: true, placeholder: '如: 危废间A区1号库' },
    { field: 'storageDays', label: '贮存天数', type: 'number' },
    { field: 'transportUnit', label: '承运单位', type: 'input' },
    { field: 'carrierLicense', label: '承运资质编号', type: 'input' },
    { field: 'disposalMethod', label: '处置方式', type: 'select', required: true, options: [{value:'incinerate',label:'焚烧'},{value:'solidify',label:'固化/稳定化'},{value:'utilize',label:'综合利用'},{value:'landfill',label:'安全填埋'}] },
    { field: 'disposalUnit', label: '处置单位', type: 'input', required: true },
    { field: 'disposalUnitLicense', label: '处置单位经营许可编号', type: 'input' },
    { field: 'manifestNo', label: '转移联单编号', type: 'input' },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'remark', label: '备注', type: 'textarea' },
    { field: 'status', label: '处置状态', type: 'select', options: [{value:'generated',label:'已产生'},{value:'stored',label:'贮存中'},{value:'transferred',label:'已转移'},{value:'disposed',label:'已处置'}] }
  ],
  statusMap: {
    category: { general: { label: '一般固废', type: 'info' }, solid: { label: '固废', type: 'primary' }, hazardous: { label: '危险废物', type: 'danger' } },
    hazardClass: { none: { label: '无', type: 'info' }, toxicity: { label: '毒性', type: 'danger' }, corrosive: { label: '腐蚀性', type: 'warning' }, flammable: { label: '易燃性', type: 'warning' }, reactive: { label: '反应性', type: 'danger' }, infectious: { label: '感染性', type: 'danger' } },
    status: { generated: { label: '已产生', type: 'info' }, stored: { label: '贮存中', type: 'warning' }, transferred: { label: '已转移', type: 'primary' }, disposed: { label: '已处置', type: 'success' } }
  }
}
</script>
