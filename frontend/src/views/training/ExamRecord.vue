<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/exam-record',
  columns: [
    { field: 'examId', label: '考试ID', width: 150 },
    { field: 'userId', label: '用户ID', width: 150 },
    { field: 'attempt', label: '次数', width: 80 },
    { field: 'startTime', label: '开始时间', type: 'datetime', width: 160 },
    { field: 'score', label: '分数', width: 80 },
    { field: 'isPassed', label: '通过', type: 'boolean', width: 80 }
  ],
  formFields: [
    { field: 'examId', label: '考试ID', type: 'input', required: true },
    { field: 'userId', label: '用户ID', type: 'input', required: true },
    { field: 'attempt', label: '次数', type: 'number', default: 1 },
    { field: 'startTime', label: '开始时间', type: 'datetime' },
    { field: 'endTime', label: '结束时间', type: 'datetime' },
    { field: 'score', label: '分数', type: 'number' },
    { field: 'isPassed', label: '通过', type: 'switch' },
    { field: 'answers', label: '答案(JSON)', type: 'textarea' },
    { field: 'signInTime', label: '签到时间', type: 'datetime' }
  ]
}
</script>