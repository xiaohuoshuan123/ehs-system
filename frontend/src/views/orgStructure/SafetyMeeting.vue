<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/safety-meeting',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'safety-meeting',
  searchFields: [
    { field: 'title', label: '会议标题', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '会议标题', type: 'text', width: 250 },
    { field: 'meetingDate', label: '会议日期', type: 'date', width: 180 },
    { field: 'orgId', label: '所属单位', type: 'text', width: 150 },
    { field: 'content', label: '内容', type: 'text', width: 300 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '会议标题', type: 'input', required: true },
    { field: 'meetingDate', label: '会议日期', type: 'date', required: true },
    { field: 'content', label: '会议内容', type: 'textarea' },
    { field: 'committeeId', label: '关联委员会', type: 'input' },
    { field: 'attendees', label: '参会人员JSON', type: 'textarea' },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {
    title: [{ required: true, message: '请输入会议标题', trigger: 'blur' }],
    meetingDate: [{ required: true, message: '请输入会议日期', trigger: 'change' }]
  },
  statusMap: {}
}
</script>
