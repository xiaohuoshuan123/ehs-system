<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/hazard',
  autoOrgId: true,
  columns: [
    { field: 'hazardNo', label: '隐患编号', width: 120 },
    { field: 'title', label: '隐患标题', width: 250 },
    { field: 'type', label: '类型', type: 'tag', width: 120 },
    { field: 'category', label: '分类', width: 100 },
    { field: 'riskLevel', label: '等级', type: 'tag', width: 100 },
    { field: 'isMajor', label: '重大隐患', type: 'boolean', width: 100 },
    { field: 'foundDate', label: '发现日期', type: 'date', width: 120 },
    { field: 'fixDeadline', label: '整改期限', type: 'date', width: 120 },
    { field: 'fixStatus', label: '整改状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'hazardNo', label: '隐患编号', type: 'input', required: true },
    { field: 'title', label: '隐患标题', type: 'input', required: true },
    { field: 'content', label: '隐患内容', type: 'textarea' },
    { field: 'type', label: '类型', type: 'select', options: [{value:'人的不安全行为',label:'人的不安全行为'},{value:'物的不安全状态',label:'物的不安全状态'},{value:'管理缺陷',label:'管理缺陷'}] },
    { field: 'category', label: '分类', type: 'select', options: [{value:'火灾',label:'火灾'},{value:'爆炸',label:'爆炸'},{value:'机械伤害',label:'机械伤害'},{value:'触电',label:'触电'},{value:'坠落',label:'坠落'},{value:'中毒',label:'中毒'},{value:'其他',label:'其他'}] },
    { field: 'area', label: '隐患区域', type: 'input' },
    { field: 'riskLevel', label: '风险等级', type: 'select', options: [{value:'general',label:'一般'},{value:'major',label:'重大'}] },
    { field: 'isMajor', label: '重大隐患', type: 'switch' },
    { field: 'foundDate', label: '发现日期', type: 'date', required: true },
    { field: 'fixDeadline', label: '整改期限', type: 'date' },
    { field: 'assigneeId', label: '整改责任人', type: 'input' },
    { field: 'verifierId', label: '验证人', type: 'input' },
    { field: 'fixMeasures', label: '整改措施', type: 'textarea' },
    { field: 'fixStatus', label: '整改状态', type: 'select', options: [{value:'pending',label:'待整改'},{value:'in_progress',label:'整改中'},{value:'fixing',label:'整改中'},{value:'verifying',label:'验证中'},{value:'closed',label:'已关闭'},{value:'overdue',label:'已逾期'},{value:'deleted',label:'已删除'}] }
  ],
  statusMap: {
    riskLevel: { general: { label: '一般', type: 'warning' }, major: { label: '重大', type: 'danger' } },
    fixStatus: { pending: { label: '待整改', type: 'warning' }, in_progress: { label: '整改中', type: 'primary' }, fixing: { label: '整改中', type: 'primary' }, verifying: { label: '验证中', type: 'info' }, closed: { label: '已关闭', type: 'success' }, overdue: { label: '已逾期', type: 'danger' }, deleted: { label: '已删除', type: 'info' } }
  }
}
</script>