<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/env-permit',
  autoOrgId: true,
  columns: [
    { field: 'permitType', label: '许可类型', type: 'tag', width: 110 },
    { field: 'permitName', label: '批文/证书名称', width: 220 },
    { field: 'permitNo', label: '编号', width: 170 },
    { field: 'issuingAuthority', label: '发证机关', width: 160 },
    { field: 'managementCategory', label: '管理类别', type: 'tag', width: 100 },
    { field: 'expiryDate', label: '有效期至', type: 'date', width: 120 },
    { field: 'annualReport', label: '年度报告', type: 'tag', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 90 }
  ],
  formFields: [
    { field: 'permitType', label: '许可类型', type: 'select', required: true, options: [{value:'env_assessment',label:'环境影响评价批复'},{value:'discharging_permit',label:'排污许可证'},{value:'filing',label:'环评备案'},{value:'annual_report',label:'排污许可年度执行报告'},{value:'emergency_permit',label:'突发环境事件应急预案备案'}] },
    { field: 'permitName', label: '批文/证书名称', type: 'input', required: true },
    { field: 'permitNo', label: '编号', type: 'input', required: true, placeholder: '排污许可证编号 12位, 如 91320583XXXXXXXXXX001P' },
    { field: 'issuingAuthority', label: '发证机关', type: 'input', required: true, placeholder: '如: 昆山市生态环境局' },
    { field: 'managementCategory', label: '排污许可管理类别', type: 'select', required: true, options: [{value:'key',label:'重点管理'},{value:'simplified',label:'简化管理'},{value:'general',label:'登记管理/不需要'}] },
    { field: 'approvalDate', label: '批准/发证日期', type: 'date', required: true },
    { field: 'expiryDate', label: '有效期至', type: 'date', required: true },
    { field: 'permitScope', label: '许可范围/排污种类与限值', type: 'textarea', required: true },
    { field: 'annualReport', label: '年度执行报告', type: 'select', options: [{value:'not_required',label:'不适用'},{value:'required',label:'需提交未提交'},{value:'done',label:'已提交'}] },
    { field: 'renewalPlan', label: '续证计划', type: 'select', options: [{value:'none',label:'无需续证'},{value:'planned',label:'已计划'},{value:'submitted',label:'已提交申请'}] },
    { field: 'responsiblePerson', label: '责任人', type: 'input' },
    { field: 'remark', label: '备注', type: 'textarea' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'valid',label:'有效'},{value:'near_expiry',label:'即将到期'},{value:'expired',label:'已过期'},{value:'renewed',label:'已续证'}] }
  ],
  statusMap: {
    permitType: { env_assessment: { label: '环评批复', type: 'primary' }, discharging_permit: { label: '排污许可证', type: 'danger' }, filing: { label: '环评备案', type: 'info' }, annual_report: { label: '年度报告', type: 'warning' }, emergency_permit: { label: '应急预案备案', type: 'warning' } },
    managementCategory: { key: { label: '重点管理', type: 'danger' }, simplified: { label: '简化管理', type: 'primary' }, general: { label: '登记/不需要', type: 'info' } },
    annualReport: { not_required: { label: '不适用', type: 'info' }, required: { label: '需提交', type: 'danger' }, done: { label: '已提交', type: 'success' } },
    renewalPlan: { none: { label: '无需', type: 'info' }, planned: { label: '已计划', type: 'warning' }, submitted: { label: '已申请', type: 'primary' } },
    status: { valid: { label: '有效', type: 'success' }, near_expiry: { label: '即将到期', type: 'warning' }, expired: { label: '已过期', type: 'danger' }, renewed: { label: '已续证', type: 'primary' } }
  }
}
</script>
