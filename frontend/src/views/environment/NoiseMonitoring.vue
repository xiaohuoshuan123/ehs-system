<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/noise-monitoring',
  autoOrgId: true,
  columns: [
    { field: 'boundaryPoint', label: '测点位置', width: 120 },
    { field: 'pointCode', label: '测点编号', width: 110 },
    { field: 'noiseSource', label: '声源', width: 150 },
    { field: 'standardClass', label: '功能区', type: 'tag', width: 90 },
    { field: 'dayValue', label: '昼间 dB(A)', width: 110 },
    { field: 'nightValue', label: '夜间 dB(A)', width: 110 },
    { field: 'exceedance', label: '达标', type: 'tag', width: 90 },
    { field: 'monitoringDate', label: '监测日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 90 }
  ],
  formFields: [
    { field: 'boundaryPoint', label: '厂界测点', type: 'select', required: true, options: [{value:'东厂界',label:'东厂界'},{value:'南厂界',label:'南厂界'},{value:'西厂界',label:'西厂界'},{value:'北厂界',label:'北厂界'},{value:'东北角',label:'东北角'},{value:'东南角',label:'东南角'},{value:'西南角',label:'西南角'},{value:'西北角',label:'西北角'}] },
    { field: 'pointCode', label: '测点编号', type: 'input', placeholder: '如 N1 / N2' },
    { field: 'noiseSource', label: '声源', type: 'input', required: true, placeholder: '如: 离心风机 / 水泵 / 破碎机 / 运输车辆' },
    { field: 'standardClass', label: '声环境功能区', type: 'select', required: true, options: [{value:'1',label:'1类 (居住)'},{value:'2',label:'2类 (商住混合)'},{value:'3',label:'3类 (工业区)'},{value:'4a',label:'4a类 (交通干线)'}] },
    { field: 'dayValue', label: '昼间等效声级 dB(A)', type: 'number' },
    { field: 'nightValue', label: '夜间等效声级 dB(A)', type: 'number' },
    { field: 'dayLimit', label: '昼间限值 dB(A)', type: 'number' },
    { field: 'nightLimit', label: '夜间限值 dB(A)', type: 'number' },
    { field: 'exceedance', label: '达标情况', type: 'select', options: [{value:'normal',label:'达标'},{value:'exceeded',label:'超标'}] },
    { field: 'monitoringDate', label: '监测日期', type: 'date', required: true },
    { field: 'monitoringUnit', label: '监测单位', type: 'input', required: true },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'treatmentMeasure', label: '降噪措施', type: 'textarea', placeholder: '如: 加装消声器 / 风机房隔声罩 / 减振基础' },
    { field: 'remark', label: '备注', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'normal',label:'正常'},{value:'exceeded',label:'超标'},{value:'improved',label:'已整改达标'}] }
  ],
  statusMap: {
    standardClass: { '1': { label: '1类', type: 'success' }, '2': { label: '2类', type: 'primary' }, '3': { label: '3类', type: 'warning' }, '4a': { label: '4a类', type: 'danger' } },
    exceedance: { normal: { label: '达标', type: 'success' }, exceeded: { label: '超标', type: 'danger' } },
    status: { normal: { label: '正常', type: 'success' }, exceeded: { label: '超标', type: 'danger' }, improved: { label: '已整改', type: 'primary' } }
  }
}
</script>
