<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/todo',
  canCreate: false,
  canDelete: false,
  columns: [
    { field: 'title', label: '待办标题', width: 250 },
    { field: 'module', label: '来源模块', width: 120 },
    { field: 'priority', label: '优先级', type: 'tag', width: 80 },
    { field: 'dueDate', label: '截止日期', type: 'date', width: 120 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 120 }
  ],
  searchFields: [
    { field: 'status', label: '状态', type: 'select', options: [{value:'pending',label:'待处理'},{value:'in_progress',label:'进行中'},{value:'completed',label:'已完成'},{value:'overdue',label:'已逾期'}] }
  ]
}
</script>