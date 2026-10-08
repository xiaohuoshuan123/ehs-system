<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/user-course',
  columns: [
    { field: 'courseId', label: '课程ID', width: 150 },
    { field: 'userId', label: '用户ID', width: 150 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'studyHours', label: '学时', width: 80 },
    { field: 'examScore', label: '考试分数', width: 100 },
    { field: 'isPassed', label: '通过', type: 'boolean', width: 80 }
  ],
  formFields: [
    { field: 'courseId', label: '课程ID', type: 'input', required: true },
    { field: 'userId', label: '用户ID', type: 'input', required: true },
    { field: 'status', label: '状态', type: 'select', options: [{value:'not_started',label:'未开始'},{value:'in_progress',label:'学习中'},{value:'completed',label:'已完成'},{value:'passed',label:'已通过'}] },
    { field: 'studyHours', label: '学时', type: 'number' },
    { field: 'startTime', label: '开始时间', type: 'datetime' },
    { field: 'endTime', label: '结束时间', type: 'datetime' },
    { field: 'examScore', label: '考试分数', type: 'number' },
    { field: 'isPassed', label: '通过', type: 'switch' }
  ],
  statusMap: { status: { not_started: { label: '未开始', type: 'info' }, in_progress: { label: '学习中', type: 'primary' }, completed: { label: '已完成', type: 'warning' }, passed: { label: '已通过', type: 'success' } } }
}
</script>