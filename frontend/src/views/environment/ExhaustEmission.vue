<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/exhaust-emission',
  autoOrgId: true,
  columns: [
    { field: 'emissionSource', label: '排放源', width: 130 },
    { field: 'category', label: '废气类别', type: 'tag', width: 100 },
    { field: 'pollutant', label: '污染物', width: 150 },
    { field: 'measuredRate', label: '实测速率 kg/h', width: 130 },
    { field: 'concentration', label: '浓度 mg/m³', width: 110 },
    { field: 'exceedance', label: '达标', type: 'tag', width: 90 },
    { field: 'treatmentDevice', label: '治理设施', width: 180 },
    { field: 'measurementDate', label: '监测日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 90 }
  ],
  formFields: [
    { field: 'emissionSource', label: '排放源', type: 'select', required: true, options: [{value:'熔炼炉',label:'熔炼炉'},{value:'铸轧机',label:'铸轧机'},{value:'挤压',label:'挤压'},{value:'氧化线',label:'氧化线'},{value:'喷涂房',label:'喷涂房'},{value:'酸洗槽',label:'酸洗槽'},{value:'退火炉',label:'退火炉'},{value:'其他',label:'其他'}] },
    { field: 'category', label: '废气类别', type: 'select', required: true, options: [{value:'particulate',label:'颗粒物'},{value:'fluorine',label:'含氟气体'},{value:'nox',label:'氮氧化物'},{value:'so2',label:'二氧化硫'},{value:'vocs',label:'挥发性有机物'},{value:'acid_gas',label:'酸雾'}] },
    { field: 'pollutant', label: '具体污染物', type: 'input', required: true },
    { field: 'treatmentDevice', label: '治理设施', type: 'input', required: true, placeholder: '如: 布袋除尘/湿法脱硫/喷淋塔/蓄热焚烧RTO' },
    { field: 'stackHeight', label: '排气筒高度 m', type: 'number' },
    { field: 'designRate', label: '设计排放速率 kg/h', type: 'number' },
    { field: 'measuredRate', label: '实测排放速率 kg/h', type: 'number' },
    { field: 'concentration', label: '实测浓度 mg/m³', type: 'number' },
    { field: 'standardLimit', label: '执行限值', type: 'input' },
    { field: 'exceedance', label: '达标情况', type: 'select', options: [{value:'normal',label:'达标'},{value:'exceeded',label:'超标'}] },
    { field: 'onlineMonitor', label: '在线监测', type: 'select', options: [{value:'yes',label:'有在线监测'},{value:'no',label:'无在线监测'}] },
    { field: 'measurementDate', label: '监测日期', type: 'date' },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'remark', label: '备注', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'abnormal',label:'异常'},{value:'repair',label:'设施检修'}] }
  ],
  statusMap: {
    category: { particulate: { label: '颗粒物', type: 'warning' }, fluorine: { label: '含氟气体', type: 'danger' }, nox: { label: '氮氧化物', type: 'primary' }, so2: { label: '二氧化硫', type: 'primary' }, vocs: { label: 'VOCs', type: 'danger' }, acid_gas: { label: '酸雾', type: 'warning' } },
    exceedance: { normal: { label: '达标', type: 'success' }, exceeded: { label: '超标', type: 'danger' } },
    onlineMonitor: { yes: { label: '在线', type: 'primary' }, no: { label: '无', type: 'info' } },
    status: { normal: { label: '正常', type: 'success' }, abnormal: { label: '异常', type: 'danger' }, repair: { label: '检修', type: 'warning' } }
  }
}
</script>
