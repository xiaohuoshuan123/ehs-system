<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/personnel-entry',
  autoOrgId: true,
  columns: [
    { field: 'employeeName', label: '姓名', width: 100 },
    { field: 'employeeNo', label: '工号', width: 100 },
    { field: 'department', label: '部门', width: 120 },
    { field: 'position', label: '岗位', width: 120 },
    { field: 'entryDate', label: '准入日期', type: 'date', width: 120 },
    { field: 'education', label: '学历', type: 'tag', width: 80 },
    { field: 'healthCheck', label: '体检', type: 'tag', width: 80 },
    { field: 'status', label: '状态', type: 'tag', width: 80 }
  ],
  formFields: [
    { field: 'employeeName', label: '姓名', type: 'input', required: true },
    { field: 'employeeNo', label: '工号', type: 'input' },
    { field: 'department', label: '部门', type: 'input', required: true },
    { field: 'position', label: '岗位', type: 'input', required: true },
    { field: 'entryDate', label: '准入日期', type: 'date', required: true },
    { field: 'education', label: '学历', type: 'select', options: [{value:'primary',label:'小学'},{value:'junior_high',label:'初中'},{value:'high_school',label:'高中'},{value:'college',label:'大专/本科'},{value:'graduate',label:'研究生'}] },
    { field: 'trainingRecord', label: '培训记录', type: 'textarea' },
    { field: 'skills', label: '技能等级', type: 'textarea' },
    { field: 'healthCheck', label: '体检', type: 'select', options: [{value:'passed',label:'通过'},{value:'pending',label:'待检'},{value:'failed',label:'不合格'}] },
    { field: 'physicalCondition', label: '身体条件', type: 'select', options: [{value:'normal',label:'正常'},{value:'restricted',label:'受限'}] },
    { field: 'psychological', label: '心理状况', type: 'select', options: [{value:'normal',label:'正常'},{value:'attention',label:'需关注'}] },
    { field: 'qualificationNo', label: '资格证编号', type: 'input' },
    { field: 'qualificationExpire', label: '资格到期日', type: 'date' },
    { field: 'status', label: '状态', type: 'select', options: [{value:'active',label:'在职'},{value:'suspended',label:'暂停'},{value:'terminated',label:'离职'}] }
  ],
  statusMap: {
    education: { primary: { label: '小学', type: 'info' }, junior_high: { label: '初中', type: 'info' }, high_school: { label: '高中', type: 'primary' }, college: { label: '本科', type: 'success' }, graduate: { label: '研究生', type: 'warning' } },
    healthCheck: { passed: { label: '通过', type: 'success' }, pending: { label: '待检', type: 'warning' }, failed: { label: '不合格', type: 'danger' } },
    status: { active: { label: '在职', type: 'success' }, suspended: { label: '暂停', type: 'warning' }, terminated: { label: '离职', type: 'info' } }
  }
}
</script>