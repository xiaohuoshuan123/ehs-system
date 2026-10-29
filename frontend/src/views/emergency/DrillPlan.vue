<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/drill-plan',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '演练标题', width: 250 },
    { field: 'planType', label: '类型', type: 'tag', width: 80 },
    { field: 'year', label: '年度', width: 80 },
    { field: 'month', label: '月份', width: 80 },
    { field: 'drillDate', label: '演练日期', type: 'date', width: 120 },
    { field: 'form', label: '形式', width: 100 },
    { field: 'status', label: '状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'title', label: '演练标题', type: 'input', required: true },
    { field: 'planType', label: '类型', type: 'select', options: [{value:'annual',label:'年度'},{value:'monthly',label:'月度'}] },
    { field: 'year', label: '年度', type: 'number', default: 2024 },
    { field: 'month', label: '月份', type: 'number' },
    { field: 'drillDate', label: '演练日期', type: 'date' },
    { field: 'location', label: '演练地点', type: 'input' },
    { field: 'form', label: '演练形式', type: 'select', options: [{value:'桌面演练',label:'桌面演练'},{value:'实战演练',label:'实战演练'}] },
    { field: 'organizerId', label: '组织人ID', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'approved',label:'已审批'},{value:'in_progress',label:'进行中'},{value:'completed',label:'已完成'},{value:'delayed',label:'已延期'},{value:'cancelled',label:'已取消'}] }
  ],
  statusMap: { planType: { annual: { label: '年度', type: 'primary' }, monthly: { label: '月度', type: 'success' } }, status: { draft: { label: '草稿', type: 'info' }, approved: { label: '已审批', type: 'success' }, in_progress: { label: '进行中', type: 'primary' }, completed: { label: '已完成', type: 'warning' }, delayed: { label: '已延期', type: 'warning' }, cancelled: { label: '已取消', type: 'danger' } } }
}
</script>