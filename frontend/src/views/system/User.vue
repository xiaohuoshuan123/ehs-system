<template>
  <CrudPage :config="config" />
</template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'

const config = {
  endpoint: '/user',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  autoOrgId: true,
  exportName: 'user',
  searchFields: [
    { field: 'username', label: '用户名', type: 'input' },
    { field: 'realName', label: '姓名', type: 'input' }
  ],
  columns: [
    { field: 'username', label: '用户名', type: 'text', width: 120 },
    { field: 'realName', label: '姓名', type: 'text', width: 120 },
    { field: 'employeeNo', label: '工号', type: 'text', width: 120 },
    { field: 'email', label: '邮箱', type: 'text', width: 200 },
    { field: 'phone', label: '手机号', type: 'text', width: 130 },
    { field: 'orgId', label: '所属单位', type: 'text', width: 150 },
    { field: 'isActive', label: '启用', type: 'boolean', width: 80 },
    { field: 'createdAt', label: '创建时间', type: 'date', width: 180 }
  ],
  formFields: [
    { field: 'username', label: '用户名', type: 'input', required: true },
    { field: 'password', label: '密码', type: 'input', required: true, createOnly: true },
    { field: 'realName', label: '姓名', type: 'input', required: true },
    { field: 'employeeNo', label: '工号', type: 'input' },
    { field: 'email', label: '邮箱', type: 'input' },
    { field: 'phone', label: '手机号', type: 'input' },
    { field: 'gender', label: '性别', type: 'select', options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] },
    { field: 'orgId', label: '所属单位', type: 'input', autoOrgId: true },
    { field: 'roleId', label: '角色', type: 'input' },
    { field: 'isActive', label: '启用', type: 'switch', default: true }
  ],
  formRules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
  },
  statusMap: {}
}
</script>
