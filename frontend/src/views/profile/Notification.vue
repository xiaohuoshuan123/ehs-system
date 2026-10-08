<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/notification',
  canCreate: false,
  canDelete: false,
  columns: [
    { field: 'title', label: '通知标题', width: 250 },
    { field: 'type', label: '类型', type: 'tag', width: 100 },
    { field: 'level', label: '级别', type: 'tag', width: 80 },
    { field: 'module', label: '来源模块', width: 120 },
    { field: 'isRead', label: '已读', type: 'boolean', width: 80 },
    { field: 'createdAt', label: '时间', type: 'date', width: 120 }
  ],
  searchFields: [
    { field: 'type', label: '类型', type: 'select', options: [{value:'todo',label:'待办'},{value:'alert',label:'预警'},{value:'warning',label:'警告'},{value:'system',label:'系统'}] }
  ]
}
</script>