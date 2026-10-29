<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/observation',
  autoOrgId: true,
  columns: [
    { field: 'obsType', label: '观察类型', type: 'tag', width: 100 },
    { field: 'observer', label: '观察人', width: 120 },
    { field: 'observedUser', label: '被观察人', width: 120 },
    { field: 'location', label: '观察位置', width: 200 },
    { field: 'date', label: '日期', type: 'date', width: 120 },
    { field: 'content', label: '观察内容', width: 300 },
    { field: 'followUpStatus', label: '跟踪状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'obsType', label: '观察类型', type: 'select', options: [{value:'observation',label:'安全观察'},{value:'inspection',label:'安全检查'},{value:'HP',label:'HP观察'}] },
    { field: 'observer', label: '观察人', type: 'input', required: true },
    { field: 'observedUser', label: '被观察人', type: 'input' },
    { field: 'location', label: '观察位置', type: 'input' },
    { field: 'date', label: '日期', type: 'date', required: true },
    { field: 'content', label: '观察内容', type: 'textarea', required: true },
    { field: 'issues', label: '发现问题', type: 'textarea' },
    { field: 'followUpStatus', label: '跟踪状态', type: 'select', options: [{value:'pending',label:'待跟踪'},{value:'resolved',label:'已解决'},{value:'closed',label:'已关闭'}] }
  ],
  statusMap: {
    obsType: { observation: { label: '安全观察', type: 'primary' }, inspection: { label: '安全检查', type: 'success' }, HP: { label: 'HP观察', type: 'warning' } },
    followUpStatus: { pending: { label: '待跟踪', type: 'warning' }, resolved: { label: '已解决', type: 'success' }, closed: { label: '已关闭', type: 'info' } }
  }
}
</script>