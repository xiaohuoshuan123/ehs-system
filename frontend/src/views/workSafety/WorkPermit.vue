<template><CrudPage :config="config" /></template>
<script setup>
import CrudPage from '../../components/CrudPage.vue'
const config = {
  endpoint: '/permit',
  autoOrgId: true,
  columns: [
    { field: 'permitNo', label: '许可证号', width: 150 },
    { field: 'workType', label: '作业类型', type: 'tag', width: 120 },
    { field: 'workLevel', label: '作业等级', type: 'tag', width: 100 },
    { field: 'title', label: '作业标题', width: 250 },
    { field: 'location', label: '作业地点', width: 150 },
    { field: 'approveStatus', label: '审批状态', type: 'tag', width: 100 },
    { field: 'status', label: '作业状态', type: 'tag', width: 100 }
  ],
  formFields: [
    { field: 'permitNo', label: '许可证号', type: 'input', required: true },
    { field: 'workType', label: '作业类型', type: 'select', options: [{value:'hot_work',label:'动火作业'},{value:'confined_space',label:'受限空间'},{value:'lifting',label:'吊装作业'},{value:'road_breaking',label:'断路作业'},{value:'blind_plug',label:'盲板抽堵'},{value:'temp_electric',label:'临时用电'},{value:'high_work',label:'高处作业'},{value:'digging',label:'动土作业'}] },
    { field: 'workLevel', label: '作业等级', type: 'select', options: [{value:'一级',label:'一级'},{value:'二级',label:'二级'},{value:'三级',label:'三级'}] },
    { field: 'title', label: '作业标题', type: 'input', required: true },
    { field: 'location', label: '作业地点', type: 'input' },
    { field: 'description', label: '作业描述', type: 'textarea' },
    { field: 'workContent', label: '作业内容', type: 'textarea' },
    { field: 'workStartTime', label: '开始时间', type: 'datetime' },
    { field: 'workEndTime', label: '结束时间', type: 'datetime' },
    { field: 'applicantId', label: '申请人ID', type: 'input' },
    { field: 'supervisorId', label: '监护人ID', type: 'input' },
    { field: 'riskAssessment', label: '风险评估', type: 'textarea' },
    { field: 'measures', label: '管控措施(JSON)', type: 'textarea' },
    { field: 'approveStatus', label: '审批状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'submitted',label:'已提交'},{value:'approved',label:'已审批'},{value:'rejected',label:'已驳回'},{value:'cancelled',label:'已取消'},{value:'completed',label:'已完成'}] },
    { field: 'status', label: '作业状态', type: 'select', options: [{value:'draft',label:'草稿'},{value:'submitted',label:'已提交'},{value:'in_progress',label:'进行中'},{value:'paused',label:'暂停'},{value:'completed',label:'已完成'},{value:'cancelled',label:'已取消'}] }
  ],
  statusMap: {
    workType: { hot_work: { label: '动火', type: 'danger' }, confined_space: { label: '受限空间', type: 'warning' }, lifting: { label: '吊装', type: 'primary' }, road_breaking: { label: '断路', type: 'info' }, blind_plug: { label: '盲板', type: 'warning' }, temp_electric: { label: '临时用电', type: 'danger' }, high_work: { label: '高处', type: 'warning' }, digging: { label: '动土', type: 'info' } },
    approveStatus: { draft: { label: '草稿', type: 'info' }, submitted: { label: '已提交', type: 'warning' }, approved: { label: '已审批', type: 'success' }, rejected: { label: '已驳回', type: 'danger' }, cancelled: { label: '已取消', type: 'info' }, completed: { label: '已完成', type: 'info' } },
    status: { draft: { label: '草稿', type: 'info' }, submitted: { label: '已提交', type: 'warning' }, in_progress: { label: '进行中', type: 'primary' }, paused: { label: '暂停', type: 'warning' }, completed: { label: '已完成', type: 'success' }, cancelled: { label: '已取消', type: 'info' } }
  }
}
</script>