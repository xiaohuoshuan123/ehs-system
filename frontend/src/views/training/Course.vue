<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/course',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'course',
  searchFields: [
    { field: 'title', label: '课程标题', type: 'input' }
  ],
  columns: [
    { field: 'title', label: '课程标题', type: 'text', width: 250 },
    { field: 'courseType', label: '类型', type: 'tag', width: 100 },
    { field: 'isRequired', label: '必修', type: 'boolean', width: 80 },
    { field: 'studyHours', label: '学时', type: 'text', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 100 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'title', label: '标题', type: 'input', required: true },
    { field: 'description', label: '描述', type: 'textarea' },
    { field: 'courseType', label: '类型', type: 'select', options: [{ label: '在线', value: 'online' }, { label: '线下', value: 'offline' }] },
    { field: 'isRequired', label: '必修', type: 'switch' },
    { field: 'studyHours', label: '学时', type: 'number' },
    { field: 'examId', label: '关联考试', type: 'input' },
    { field: 'examQuestionCount', label: '考试题数', type: 'number' },
    { field: 'examPassScore', label: '及格分数', type: 'number' },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '草稿', value: 'draft' }, { label: '已发布', value: 'published' }, { label: '已归档', value: 'archived' }] },
    { field: 'fileUrl', label: '课程文件', type: 'input' },
    { field: 'videoUrl', label: '视频', type: 'input' },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
  },
  statusMap: {
    status: {
      draft: { label: '草稿', type: 'info' },
      published: { label: '已发布', type: 'success' },
      archived: { label: '已归档', type: 'warning' }
    }
  }
}
</script>
