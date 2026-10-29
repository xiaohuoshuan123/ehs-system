<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/exam-question',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'exam-question',
  searchFields: [
    { field: 'content', label: '题目内容', type: 'input' },
    { field: 'type', label: '题型', type: 'input' }
  ],
  columns: [
    { field: 'content', label: '题目内容', type: 'text', width: 300 },
    { field: 'type', label: '题型', type: 'tag', width: 100 },
    { field: 'category', label: '分类', type: 'text', width: 120 },
    { field: 'visibility', label: '可见性', type: 'tag', width: 100 },
    { field: 'score', label: '分值', type: 'text', width: 80 },
    { field: 'examCount', label: '考试次数', type: 'text', width: 80 }
  ],
  formFields: [
    { field: 'content', label: '题目内容', type: 'textarea', required: true },
    { field: 'type', label: '题型', type: 'select', options: [{ label: '单选', value: 'single' }, { label: '多选', value: 'multiple' }, { label: '判断', value: 'judge' }, { label: '简答', value: 'short_answer' }] },
    { field: 'category', label: '分类', type: 'input' },
    { field: 'visibility', label: '可见性', type: 'select', options: [{ label: '公开', value: 'public' }, { label: '内部', value: 'internal' }, { label: '私有', value: 'private' }] },
    { field: 'options', label: '选项JSON', type: 'textarea' },
    { field: 'answer', label: '答案', type: 'input', required: true },
    { field: 'explanation', label: '解析', type: 'textarea' },
    { field: 'score', label: '分值', type: 'number', default: 1 },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true }
  ],
  formRules: {
    content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
    answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
  },
  statusMap: {
    type: {
      single: { label: '单选', type: 'primary' },
      multiple: { label: '多选', type: 'success' },
      judge: { label: '判断', type: 'warning' },
      short_answer: { label: '简答', type: 'info' }
    },
    visibility: {
      public: { label: '公开', type: 'success' },
      internal: { label: '内部', type: 'warning' },
      private: { label: '私有', type: 'info' }
    }
  }
}
</script>
