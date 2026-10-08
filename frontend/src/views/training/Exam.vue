<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/exam',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '考试标题', width: 250 },
    { field: 'templateType', label: '出题方式', type: 'tag', width: 100 },
    { field: 'totalScore', label: '总分', width: 80 },
    { field: 'passScore', label: '及格分', width: 80 },
    { field: 'startTime', label: '开始时间', type: 'datetime', width: 180 },
    { field: 'endTime', label: '截止时间', type: 'datetime', width: 180 },
    { field: 'isPractice', label: '练习', type: 'boolean', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '考试标题', type: 'input', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'templateType', label: '出题方式', type: 'select', options: [{value:'fixed',label:'固定'},{value:'random',label:'随机'}] },
    { field: 'questionIds', label: '题目IDs(JSON)', type: 'textarea' },
    { field: 'totalScore', label: '总分', type: 'number', default: 100 },
    { field: 'passScore', label: '及格分', type: 'number', default: 60 },
    { field: 'examTimeLimit', label: '时间限制(分钟)', type: 'number' },
    { field: 'startTime', label: '开始时间', type: 'datetime' },
    { field: 'endTime', label: '截止时间', type: 'datetime' },
    { field: 'maxAttempts', label: '最大次数', type: 'number', default: 1 },
    { field: 'targetUsers', label: '目标人员JSON', type: 'textarea' },
    { field: 'isPractice', label: '练习考试', type: 'switch' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'scheduled',label:'已排期'},{value:'active',label:'进行中'},{value:'completed',label:'已完成'},{value:'cancelled',label:'已取消'}] }
  ],
  formRules: { title: [{ required: true, message: '请输入考试标题', trigger: 'blur' }] },
  statusMap: {
    templateType: { fixed: { label: '固定', type: 'primary' }, random: { label: '随机', type: 'success' } },
    status: { draft: { label: '草稿', type: 'info' }, scheduled: { label: '已排期', type: 'primary' }, active: { label: '进行中', type: 'success' }, completed: { label: '已完成', type: 'warning' }, cancelled: { label: '已取消', type: 'info' } }
  }
}
</script>