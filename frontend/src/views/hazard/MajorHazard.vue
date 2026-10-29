<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/major-hazard',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '标题', width: 250 },
    { field: 'location', label: '位置', width: 150 },
    { field: 'category', label: '类别', type: 'tag', width: 100 },
    { field: 'riskLevel', label: '等级', type: 'tag', width: 100 },
    { field: 'discoveredAt', label: '发现日期', type: 'date', width: 120 },
    { field: 'deadline', label: '整改期限', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'reportStatus', label: '报告状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'location', label: '位置', type: 'input', required: true },
    { field: 'category', label: '类别', type: 'select', options: [{value:'chemical',label:'化学品'},{value:'equipment',label:'设备'},{value:'environment',label:'环境'},{value:'process',label:'工艺'},{value:'construction',label:'施工'}] },
    { field: 'riskLevel', label: '风险等级', type: 'select', options: [{value:'major',label:'重大'},{value:'critical',label:'特大'}] },
    { field: 'description', label: '描述', type: 'textarea', required: true },
    { field: 'discoveredBy', label: '发现人', type: 'input', required: true },
    { field: 'discoveredAt', label: '发现日期', type: 'date', required: true },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'remediationPlan', label: '整改方案', type: 'textarea' },
    { field: 'deadline', label: '整改期限', type: 'date' },
    { field: 'verificationResult', label: '验收结果', type: 'textarea' },
    { field: 'verifiedBy', label: '验收人', type: 'input' },
    { field: 'verifiedAt', label: '验收日期', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待整改'},{value:'remediating',label:'整改中'},{value:'verified',label:'已验收'},{value:'closed',label:'已关闭'}] },
    { field: 'reportStatus', label: '报告状态', type: 'select', options: [{value:'not_reported',label:'未报告'},{value:'reported',label:'已报告'},{value:'reported_verified',label:'已报告验收'}] }
  ],
  statusMap: {
    category: { chemical: { label: '化学品', type: 'danger' }, equipment: { label: '设备', type: 'warning' }, environment: { label: '环境', type: 'success' }, process: { label: '工艺', type: 'primary' }, construction: { label: '施工', type: 'info' } },
    riskLevel: { major: { label: '重大', type: 'warning' }, critical: { label: '特大', type: 'danger' } },
    status: { pending: { label: '待整改', type: 'danger' }, remediating: { label: '整改中', type: 'warning' }, verified: { label: '已验收', type: 'success' }, closed: { label: '已关闭', type: 'info' } },
    reportStatus: { not_reported: { label: '未报告', type: 'danger' }, reported: { label: '已报告', type: 'primary' }, reported_verified: { label: '已报告验收', type: 'success' } }
  }
}
</script>