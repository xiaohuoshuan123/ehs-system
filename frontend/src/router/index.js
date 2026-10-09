import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },
  {
    path: '/', component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '仪表盘', icon: 'Odometer' } },
      // 目标管理
      { path: 'safety-plan', component: () => import('../views/target/SafetyPlan.vue'), meta: { title: '安全规划', group: '目标管理' } },
      { path: 'annual-objective', component: () => import('../views/target/AnnualObjective.vue'), meta: { title: '年度目标', group: '目标管理' } },
      { path: 'annual-plan', component: () => import('../views/target/AnnualPlan.vue'), meta: { title: '年度计划', group: '目标管理' } },
      // 组织构架
      { path: 'committee', component: () => import('../views/orgStructure/Committee.vue'), meta: { title: '安委会管理', group: '组织构架' } },
      { path: 'safety-meeting', component: () => import('../views/orgStructure/SafetyMeeting.vue'), meta: { title: '安全会议', group: '组织构架' } },
      { path: 'responsibility', component: () => import('../views/orgStructure/Responsibility.vue'), meta: { title: '责任制', group: '组织构架' } },
      // 安全生产投入
      { path: 'expenditure', component: () => import('../views/expenditure/Expenditure.vue'), meta: { title: '安全投入', group: '安全投入' } },
      // 制度化管理
      { path: 'regulation', component: () => import('../views/regulation/Regulation.vue'), meta: { title: '法律法规', group: '制度化管理' } },
      { path: 'internal-regulation', component: () => import('../views/regulation/InternalRegulation.vue'), meta: { title: '规章制度', group: '制度化管理' } },
      { path: 'compliance', component: () => import('../views/regulation/Compliance.vue'), meta: { title: '合规评估', group: '制度化管理' } },
      // 教育培训
      { path: 'certificate', component: () => import('../views/training/Certificate.vue'), meta: { title: '安全证书', group: '教育培训' } },
      { path: 'course', component: () => import('../views/training/Course.vue'), meta: { title: '安全课程', group: '教育培训' } },
      { path: 'exam-question', component: () => import('../views/training/ExamQuestion.vue'), meta: { title: '题库管理', group: '教育培训' } },
      { path: 'exam', component: () => import('../views/training/Exam.vue'), meta: { title: '考试管理', group: '教育培训' } },
      { path: 'exam-record', component: () => import('../views/training/ExamRecord.vue'), meta: { title: '考试记录', group: '教育培训' } },
      { path: 'training-record', component: () => import('../views/training/TrainingRecord.vue'), meta: { title: '培训记录', group: '教育培训' } },
      { path: 'user-course', component: () => import('../views/training/UserCourse.vue'), meta: { title: '课程进度', group: '教育培训' } },
      { path: 'mentor', component: () => import('../views/training/Mentor.vue'), meta: { title: '师带徒', group: '教育培训' } },
      // 生产设备设施
      { path: 'equipment', component: () => import('../views/equipment/Equipment.vue'), meta: { title: '设备管理', group: '设备设施' } },
      { path: 'equipment-maintenance', component: () => import('../views/equipment/EquipmentMaintenance.vue'), meta: { title: '设备检修', group: '设备设施' } },
      { path: 'equipment-inspection', component: () => import('../views/equipment/EquipmentInspection.vue'), meta: { title: '设备点检', group: '设备设施' } },
      { path: 'chemical', component: () => import('../views/equipment/Chemical.vue'), meta: { title: '化学品', group: '设备设施' } },
      { path: 'special-eq', component: () => import('../views/equipment/SpecialEquipment.vue'), meta: { title: '特种设备', group: '设备设施' } },
      { path: 'fire-zone', component: () => import('../views/equipment/FireZone.vue'), meta: { title: '消防区域', group: '设备设施' } },
      { path: 'fire-equipment', component: () => import('../views/equipment/FireEquipment.vue'), meta: { title: '消防器材', group: '设备设施' } },
      { path: 'fire-patrol-plan', component: () => import('../views/equipment/FirePatrolPlan.vue'), meta: { title: '防火巡查计划', group: '设备设施' } },
      { path: 'fire-patrol', component: () => import('../views/equipment/FirePatrol.vue'), meta: { title: '防火巡查', group: '设备设施' } },
      // 作业安全
      { path: 'risk-factor', component: () => import('../views/workSafety/RiskFactor.vue'), meta: { title: '风险因素', group: '作业安全' } },
      { path: 'observation', component: () => import('../views/workSafety/Observation.vue'), meta: { title: '安全观察', group: '作业安全' } },
      { path: 'work-safety-check', component: () => import('../views/workSafety/WorkSafetyCheck.vue'), meta: { title: '安全检查', group: '作业安全' } },
      { path: 'work-permit', component: () => import('../views/workSafety/WorkPermit.vue'), meta: { title: '作业许可', group: '作业安全' } },
      { path: 'change-request', component: () => import('../views/workSafety/ChangeRequest.vue'), meta: { title: '变更管理', group: '作业安全' } },
      { path: 'contractor', component: () => import('../views/workSafety/Contractor.vue'), meta: { title: '承包商', group: '作业安全' } },
      { path: 'contractor-approval', component: () => import('../views/workSafety/ContractorApproval.vue'), meta: { title: '承包商审批', group: '作业安全' } },
      { path: 'contractor-blacklist', component: () => import('../views/workSafety/ContractorBlacklist.vue'), meta: { title: '承包商黑名单', group: '作业安全' } },
      { path: 'deep-cast-monitor', component: () => import('../views/workSafety/DeepCastMonitor.vue'), meta: { title: '深井灌注监测', group: '作业安全' } },
      // 危险源管理
      { path: 'risk-control', component: () => import('../views/riskControl/RiskControl.vue'), meta: { title: '危险源识别', group: '危险源' } },
      { path: 'risk-inspection-config', component: () => import('../views/riskControl/RiskInspectionConfig.vue'), meta: { title: '风险排查项', group: '危险源' } },
      { path: 'work-unit', component: () => import('../views/riskControl/WorkUnit.vue'), meta: { title: '作业单元', group: '危险源' } },
      { path: 'risk-review', component: () => import('../views/riskControl/RiskReview.vue'), meta: { title: '危险源评审', group: '危险源' } },
      { path: 'risk-change', component: () => import('../views/riskControl/RiskChange.vue'), meta: { title: '危险源变更', group: '危险源' } },
      { path: 'risk-inspection', component: () => import('../views/riskControl/RiskInspection.vue'), meta: { title: '风险排查', group: '危险源' } },
      { path: 'risk-map', component: () => import('../views/riskControl/RiskMap.vue'), meta: { title: '危险源地图', group: '危险源' } },
      // 隐患排查治理
      { path: 'hazard', component: () => import('../views/hazard/Hazard.vue'), meta: { title: '隐患排查', group: '隐患治理' } },
      { path: 'inspection-plan', component: () => import('../views/hazard/InspectionPlan.vue'), meta: { title: '排查计划', group: '隐患治理' } },
      { path: 'hazard-reward', component: () => import('../views/hazard/HazardReward.vue'), meta: { title: '隐患奖励', group: '隐患治理' } },
      { path: 'violation', component: () => import('../views/hazard/Violation.vue'), meta: { title: '违章管理', group: '隐患治理' } },
      { path: 'safety-score', component: () => import('../views/hazard/SafetyScore.vue'), meta: { title: '安全积分', group: '隐患治理' } },
      // 职业健康
      { path: 'ppe', component: () => import('../views/health/PPEItem.vue'), meta: { title: 'PPE物品', group: '职业健康' } },
      { path: 'ppe-issue', component: () => import('../views/health/PPEIssue.vue'), meta: { title: 'PPE发放', group: '职业健康' } },
      { path: 'dosimeter', component: () => import('../views/health/Dosimeter.vue'), meta: { title: '剂量计', group: '职业健康' } },
      { path: 'warning-sign', component: () => import('../views/health/WarningSign.vue'), meta: { title: '警示标识', group: '职业健康' } },
      { path: 'protective-facility', component: () => import('../views/health/ProtectiveFacility.vue'), meta: { title: '防护设施', group: '职业健康' } },
      { path: 'occupational', component: () => import('../views/health/Occupational.vue'), meta: { title: '职业健康档案', group: '职业健康' } },
      // 应急管理
      { path: 'emergency-plan', component: () => import('../views/emergency/EmergencyPlan.vue'), meta: { title: '应急预案', group: '应急管理' } },
      { path: 'emergency-team', component: () => import('../views/emergency/EmergencyTeam.vue'), meta: { title: '应急队伍', group: '应急管理' } },
      { path: 'emergency-supplies', component: () => import('../views/emergency/EmergencySupplies.vue'), meta: { title: '应急物资', group: '应急管理' } },
      { path: 'drill-plan', component: () => import('../views/emergency/DrillPlan.vue'), meta: { title: '应急演练计划', group: '应急管理' } },
      // 事故管理
      { path: 'accident', component: () => import('../views/accident/Accident.vue'), meta: { title: '事故报告', group: '事故管理' } },
      { path: 'accident-investigation', component: () => import('../views/accident/AccidentInvestigation.vue'), meta: { title: '事故调查', group: '事故管理' } },
      { path: 'accident-communication', component: () => import('../views/accident/AccidentCommunication.vue'), meta: { title: '事故沟通', group: '事故管理' } },
      { path: 'accident-responsibility', component: () => import('../views/accident/AccidentResponsibility.vue'), meta: { title: '责任认定', group: '事故管理' } },
      { path: 'accident-action', component: () => import('../views/accident/AccidentAction.vue'), meta: { title: '整改措施', group: '事故管理' } },
      { path: 'accident-archive', component: () => import('../views/accident/AccidentArchive.vue'), meta: { title: '事故档案', group: '事故管理' } },
      // 绩效改进
      { path: 'performance', component: () => import('../views/performance/Performance.vue'), meta: { title: '绩效评定', group: '绩效改进' } },
      { path: 'improvement', component: () => import('../views/performance/Improvement.vue'), meta: { title: '持续改进', group: '绩效改进' } },
      { path: 'safety-kpi', component: () => import('../views/performance/SafetyKpi.vue'), meta: { title: '安全金字塔KPI', group: '绩效改进' } },

      // ==================== GB/T 33000-2025 新增模块 ====================

      // 领导作用 (第4章)
      { path: 'leadership', component: () => import('../views/orgStructure/Leadership.vue'), meta: { title: '安全领导力', group: '领导作用' } },
      { path: 'leadership-evaluation', component: () => import('../views/orgStructure/LeadershipEvaluation.vue'), meta: { title: '安全履职评价', group: '领导作用' } },

      // 基础保障 - 科技保障 (第5章)
      { path: 'technology-protection', component: () => import('../views/regulation/TechnologyProtection.vue'), meta: { title: '科技保障', group: '基础保障' } },

      // 策划 - 安全理念 & 信息沟通 (第6章)
      { path: 'safety-philosophy', component: () => import('../views/regulation/SafetyPhilosophy.vue'), meta: { title: '安全理念', group: '策划' } },
      { path: 'safety-communication', component: () => import('../views/regulation/SafetyCommunication.vue'), meta: { title: '信息沟通', group: '策划' } },

      // 隐患排查治理 - 重大事故隐患 (第8章)
      { path: 'major-hazard', component: () => import('../views/hazard/MajorHazard.vue'), meta: { title: '重大事故隐患', group: '隐患治理' } },

      // 人员管理 - 人员准入 & 不安全行为 (第9章)
      { path: 'personnel-entry', component: () => import('../views/training/PersonnelEntry.vue'), meta: { title: '人员准入', group: '人员管理' } },
      { path: 'unsafe-behavior', component: () => import('../views/training/UnsafeBehavior.vue'), meta: { title: '不安全行为管控', group: '人员管理' } },

      // 现场管理 - 异常处置 (第10章)
      { path: 'abnormal-handling', component: () => import('../views/workSafety/AbnormalHandling.vue'), meta: { title: '异常处置', group: '现场管理' } },

      // 检查评价 (第12章)
      { path: 'safety-inspection', component: () => import('../views/performance/SafetyInspection.vue'), meta: { title: '安全检查', group: '检查评价' } },
      { path: 'performance-assessment', component: () => import('../views/performance/PerformanceAssessment.vue'), meta: { title: '绩效评价', group: '检查评价' } },

      // 持续改进 - 未遂事故 (第13章)
      { path: 'near-miss', component: () => import('../views/accident/NearMiss.vue'), meta: { title: '未遂事故', group: '持续改进' } },

      // ==================== GB/T 46884.1-2025 新增模块 ====================

      // 作业行为管理 (AI视频监控)
      { path: 'work-behavior', component: () => import('../views/workSafety/WorkBehavior.vue'), meta: { title: '作业行为管理', group: '作业安全' } },

      // 隐患治理成效评估
      { path: 'hazard-evaluation', component: () => import('../views/hazard/HazardEvaluation.vue'), meta: { title: '隐患治理评估', group: '隐患治理' } },

      // 系统管理
      { path: 'org', component: () => import('../views/system/Organization.vue'), meta: { title: '组织机构', group: '系统管理' } },
      { path: 'user', component: () => import('../views/system/User.vue'), meta: { title: '用户管理', group: '系统管理' } },
      { path: 'role', component: () => import('../views/system/Role.vue'), meta: { title: '角色管理', group: '系统管理' } },
      { path: 'parameter', component: () => import('../views/system/Parameter.vue'), meta: { title: '系统参数', group: '系统管理' } },
      // 个人工作台
      { path: 'todo', component: () => import('../views/profile/Todo.vue'), meta: { title: '我的待办', group: '个人工作台' } },
      { path: 'notification', component: () => import('../views/profile/Notification.vue'), meta: { title: '消息通知', group: '个人工作台' } },
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
