<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/safety-communication',
  autoOrgId: true,
  columns: [
    { field: 'title', label: '标题', width: 250 },
    { field: 'type', label: '类型', type: 'tag', width: 100 },
    { field: 'channel', label: '渠道', type: 'tag', width: 100 },
    { field: 'publisher', label: '发布人', width: 100 },
    { field: 'publishDate', label: '发布日期', type: 'date', width: 120 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'type', label: '类型', type: 'select', options: [{value:'internal',label:'内部'},{value:'external',label:'外部'},{value:'government',label:'政府'},{value:'union',label:'工会'},{value:'contractor',label:'承包商'}] },
    { field: 'channel', label: '渠道', type: 'select', options: [{value:'meeting',label:'会议'},{value:'document',label:'文件'},{value:'training',label:'培训'},{value:'newsletter',label:'简报'},{value:'wechat',label:'微信'}] },
    { field: 'publisher', label: '发布人', type: 'input', required: true },
    { field: 'publishDate', label: '发布日期', type: 'date', required: true },
    { field: 'audience', label: '受众', type: 'input' },
    { field: 'content', label: '内容', type: 'textarea', required: true }
  ],
  statusMap: {
    type: { internal: { label: '内部', type: 'primary' }, external: { label: '外部', type: 'info' }, government: { label: '政府', type: 'danger' }, union: { label: '工会', type: 'success' }, contractor: { label: '承包商', type: 'warning' } },
    channel: { meeting: { label: '会议', type: 'primary' }, document: { label: '文件', type: 'success' }, training: { label: '培训', type: 'warning' }, newsletter: { label: '简报', type: 'info' }, wechat: { label: '微信', type: 'success' } }
  }
}
</script>