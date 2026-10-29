<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/wastewater-emission',
  autoOrgId: true,
  columns: [
    { field: 'dischargePoint', label: '排放口', width: 150 },
    { field: 'source', label: '产生工序', width: 140 },
    { field: 'category', label: '废水类别', type: 'tag', width: 110 },
    { field: 'pollutants', label: '主要污染物', width: 180 },
    { field: 'phRange', label: 'pH', width: 90 },
    { field: 'cod', label: 'COD mg/L', width: 100 },
    { field: 'exceedance', label: '达标', type: 'tag', width: 90 },
    { field: 'onlineMonitor', label: '在线监测', type: 'tag', width: 100 },
    { field: 'measurementDate', label: '监测日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 90 }
  ],
  formFields: [
    { field: 'dischargePoint', label: '排放口编号/名称', type: 'input', required: true },
    { field: 'source', label: '产生工序', type: 'select', required: true, options: [{value:'熔炼',label:'熔炼'},{value:'铸轧',label:'铸轧'},{value:'挤压',label:'挤压'},{value:'酸洗',label:'酸洗'},{value:'阳极氧化',label:'阳极氧化'},{value:'清洗',label:'清洗'},{value:'生活污水',label:'生活污水'}] },
    { field: 'category', label: '废水类别', type: 'select', required: true, options: [{value:'general_chemistry',label:'一般化学废水'},{value:'heavy_metal',label:'含重金属废水'},{value:'cooling',label:'循环冷却水'},{value:'domestic',label:'生活污水'}] },
    { field: 'pollutants', label: '主要污染物', type: 'input', required: true },
    { field: 'treatmentProcess', label: '处理工艺', type: 'input', required: true, placeholder: '如: 调节池+气浮+混凝沉淀+深度处理' },
    { field: 'designFlow', label: '设计流量 m³/h', type: 'number' },
    { field: 'measuredFlow', label: '实测流量 m³/h', type: 'number' },
    { field: 'phRange', label: 'pH 实测范围', type: 'input' },
    { field: 'cod', label: 'COD mg/L', type: 'number' },
    { field: 'ammoniaNitrogen', label: '氨氮 mg/L', type: 'number' },
    { field: 'heavyMetal', label: '重金属含量', type: 'textarea' },
    { field: 'standardLimit', label: '执行标准限值', type: 'textarea' },
    { field: 'exceedance', label: '达标情况', type: 'select', options: [{value:'normal',label:'达标'},{value:'exceeded',label:'超标'}] },
    { field: 'onlineMonitor', label: '在线监测', type: 'select', options: [{value:'yes',label:'有在线监测'},{value:'no',label:'无在线监测'}] },
    { field: 'measurementDate', label: '监测日期', type: 'date' },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'remark', label: '备注', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'abnormal',label:'异常'},{value:'repair',label:'设施检修'}] }
  ],
  statusMap: {
    category: { general_chemistry: { label: '一般化学', type: 'primary' }, heavy_metal: { label: '含重金属', type: 'danger' }, cooling: { label: '冷却水', type: 'info' }, domestic: { label: '生活污水', type: 'success' } },
    exceedance: { normal: { label: '达标', type: 'success' }, exceeded: { label: '超标', type: 'danger' } },
    onlineMonitor: { yes: { label: '在线', type: 'primary' }, no: { label: '无', type: 'info' } },
    status: { normal: { label: '正常', type: 'success' }, abnormal: { label: '异常', type: 'danger' }, repair: { label: '检修', type: 'warning' } }
  }
}
</script>
