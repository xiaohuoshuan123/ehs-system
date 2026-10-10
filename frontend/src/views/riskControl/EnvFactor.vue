<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/env-factor',
  autoOrgId: true,
  columns: [
    { field: 'factorName', label: '环境因素', width: 170 },
    { field: 'activity', label: '活动/产品/服务', width: 160 },
    { field: 'workUnit', label: '作业单元', width: 120 },
    { field: 'emissionType', label: '排放类型', type: 'tag', width: 100 },
    { field: 'impact', label: '环境影响', width: 170 },
    { field: 'grade', label: '等级', type: 'tag', width: 90 },
    { field: 'measure', label: '应对措施', width: 170 },
    { field: 'responsiblePerson', label: '责任人', width: 100 },
    { field: 'reviewDate', label: '评审日期', type: 'date', width: 115 },
    { field: 'status', label: '状态', type: 'tag', width: 90 }
  ],
  formFields: [
    { field: 'factorName', label: '环境因素名称', type: 'input', required: true },
    { field: 'activity', label: '活动/产品/服务', type: 'input', required: true, placeholder: '如: 酸洗 / 阳极氧化 / 熔炼' },
    { field: 'workUnit', label: '所属作业单元', type: 'input' },
    { field: 'emissionType', label: '排放类型', type: 'select', required: true, options: [
      { value: 'waste_water', label: '废水' },
      { value: 'exhaust', label: '废气' },
      { value: 'solid_waste', label: '固废/危废' },
      { value: 'noise', label: '噪声' },
      { value: 'soil', label: '土壤污染' },
      { value: 'energy', label: '能源资源消耗' },
      { value: 'other', label: '其他' }
    ] },
    { field: 'impact', label: '环境影响', type: 'textarea', required: true, placeholder: '如: 水体污染(含氟/重金属) / 大气污染 / 生态影响' },
    { field: 'grade', label: '等级', type: 'select', options: [
      { value: 'general', label: '一般环境因素' },
      { value: 'major', label: '重要环境因素' }
    ] },
    { field: 'measure', label: '应对措施', type: 'textarea', placeholder: '如: 污水处理站处理达标排放 / 加盖密闭 / 降噪改造' },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'reviewDate', label: '评审日期', type: 'date' },
    { field: 'remark', label: '备注', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [
      { value: 'active', label: '有效' },
      { value: 'under_review', label: '评审中' },
      { value: 'eliminated', label: '已消除' }
    ] }
  ],
  searchFields: [
    { field: 'workUnit', label: '作业单元' },
    { field: 'emissionType', label: '排放类型', type: 'select', options: [
      { value: 'waste_water', label: '废水' }, { value: 'exhaust', label: '废气' },
      { value: 'solid_waste', label: '固废/危废' }, { value: 'noise', label: '噪声' },
      { value: 'soil', label: '土壤污染' }, { value: 'energy', label: '能源资源' },
      { value: 'other', label: '其他' }
    ] },
    { field: 'grade', label: '等级', type: 'select', options: [
      { value: 'general', label: '一般' }, { value: 'major', label: '重要' }
    ] }
  ],
  statusMap: {
    emissionType: { waste_water: { label: '废水', type: 'warning' }, exhaust: { label: '废气', type: 'danger' }, solid_waste: { label: '固废', type: 'info' }, noise: { label: '噪声', type: 'warning' }, soil: { label: '土壤', type: 'danger' }, energy: { label: '能源', type: 'primary' }, other: { label: '其他', type: 'info' } },
    grade: { general: { label: '一般', type: 'info' }, major: { label: '重要', type: 'danger' } },
    status: { active: { label: '有效', type: 'success' }, under_review: { label: '评审中', type: 'warning' }, eliminated: { label: '已消除', type: 'info' } }
  }
}
</script>
