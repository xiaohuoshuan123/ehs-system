<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/soil-monitoring',
  autoOrgId: true,
  columns: [
    { field: 'plotName', label: '地块', width: 150 },
    { field: 'location', label: '采样点', width: 130 },
    { field: 'depth', label: '采样深度', width: 110 },
    { field: 'sampleType', label: '用地类型', type: 'tag', width: 100 },
    { field: 'pollutants', label: '监测因子', width: 170 },
    { field: 'exceedance', label: '达标', type: 'tag', width: 90 },
    { field: 'monitoringDate', label: '监测日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'plotName', label: '地块名称', type: 'input', required: true },
    { field: 'location', label: '采样点位置', type: 'input', required: true, placeholder: '如: 熔炼区东侧50m / 危废间周边' },
    { field: 'depth', label: '采样深度', type: 'select', options: [{value:'0-0.5m',label:'表层 0-0.5m'},{value:'0.5-1.5m',label:'0.5-1.5m'},{value:'1.5-6m',label:'1.5-6m'}] },
    { field: 'sampleType', label: '用地类型', type: 'select', required: true, options: [{value:'industrial',label:'工业用地'},{value:'residential',label:'居住用地'},{value:'farm',label:'农用地'},{value:'commercial',label:'商业服务用地'}] },
    { field: 'pollutants', label: '监测因子', type: 'input', required: true, placeholder: '如: 砷/铅/汞/镉/铬/苯系物/甲苯' },
    { field: 'ph', label: '土壤 pH', type: 'number' },
    { field: 'heavyMetals', label: '重金属实测值', type: 'textarea', placeholder: '砷 mg/kg: -; 铅 mg/kg: -; 汞 mg/kg: -' },
    { field: 'vocs', label: '挥发性有机物实测值', type: 'textarea' },
    { field: 'standardLimit', label: '执行标准', type: 'input', placeholder: '如: GB 36600-2018 第一类用地标准' },
    { field: 'exceedance', label: '达标情况', type: 'select', options: [{value:'normal',label:'达标'},{value:'exceeded',label:'超标'}] },
    { field: 'monitoringDate', label: '监测日期', type: 'date', required: true },
    { field: 'monitoringUnit', label: '监测单位', type: 'input', required: true },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'treatmentMeasure', label: '风险管控/修复措施', type: 'textarea' },
    { field: 'remark', label: '备注', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'exceeded',label:'超标待处置'},{value:'remediated',label:'已修复'}] }
  ],
  statusMap: {
    sampleType: { industrial: { label: '工业用地', type: 'warning' }, residential: { label: '居住用地', type: 'primary' }, farm: { label: '农用地', type: 'success' }, commercial: { label: '商业服务', type: 'info' } },
    exceedance: { normal: { label: '达标', type: 'success' }, exceeded: { label: '超标', type: 'danger' } },
    status: { normal: { label: '正常', type: 'success' }, exceeded: { label: '超标待处置', type: 'danger' }, remediated: { label: '已修复', type: 'primary' } }
  }
}
</script>
