<template>
  <el-container class="layout-container">
    <!-- 侧边栏 - 桌面端固定,移动端抽屉 -->
    <el-aside :width="collapse ? '64px' : '220px'" class="sidebar hidden-mobile" :class="{ 'sidebar-collapsed': collapse }">
      <div class="logo">
        <span v-if="!collapse">EHS 安全系统</span>
        <span v-else>E</span>
      </div>
      <el-scrollbar>
        <el-menu :collapse="collapse" :collapse-transition="false" background-color="#1e6d3a" text-color="#ffffffa6" active-text-color="#fff" router>
          <template v-for="group in menuGroups">
            <el-sub-menu v-if="group.children.length > 1" :index="group.title">
              <template #title><el-icon><component :is="group.icon" /></el-icon><span>{{ group.title }}</span></template>
              <el-menu-item v-for="item in group.children" :key="item.path" :index="item.path">
                <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="group.children[0].path">
              <el-icon><component :is="group.icon" /></el-icon>
              <span>{{ group.title.includes('、') ? group.title : group.children[0].title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 移动端抽屉遮罩 -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>

    <!-- 移动端侧边栏 -->
    <transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-sidebar">
        <div class="logo">
          <span>EHS 安全系统</span>
          <el-icon class="close-btn" @click="mobileMenuOpen = false"><Close /></el-icon>
        </div>
        <el-scrollbar style="height: calc(100vh - 56px)">
          <el-menu :collapse="false" :collapse-transition="false" background-color="#1e6d3a" text-color="#ffffffa6" active-text-color="#fff" router @select="mobileMenuOpen = false">
            <template v-for="group in menuGroups">
              <el-sub-menu v-if="group.children.length > 1" :index="group.title">
                <template #title><el-icon><component :is="group.icon" /></el-icon><span>{{ group.title }}</span></template>
                <el-menu-item v-for="item in group.children" :key="item.path" :index="item.path">
                  <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
                  <span>{{ item.title }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="group.children[0].path">
                <el-icon><component :is="group.icon" /></el-icon>
                <span>{{ group.title.includes('、') ? group.title : group.children[0].title }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </div>
    </transition>

    <!-- 主区域 -->
    <el-container direction="vertical">
      <el-header class="header">
        <div class="header-left">
          <!-- 桌面端折叠按钮 -->
          <el-icon class="collapse-btn hidden-mobile" @click="collapse = !collapse"><component :is="collapse ? 'Expand' : 'Fold'" /></el-icon>
          <!-- 移动端菜单按钮 -->
          <el-icon class="collapse-btn hidden-desktop" @click="mobileMenuOpen = true"><Menu /></el-icon>
          <el-breadcrumb separator="/" class="hidden-mobile">
            <el-breadcrumb-item>{{ $route.meta.group || '工作台' }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><UserFilled /></el-icon>
              <span class="hidden-mobile">{{ userStore.username }}</span>
              <el-icon class="hidden-mobile"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const router = useRouter()
const collapse = ref(false)
const mobileMenuOpen = ref(false)

// 菜单配置 - 对标《有色金属压力加工企业安全生产标准化评定标准》13要素
const menuGroups = [
  { title: '工作台', icon: 'Odometer', children: [{ path: '/dashboard', title: '仪表盘', icon: 'Odometer' }] },
  { title: '一、目标管理', icon: 'Aim', children: [
    { path: '/safety-plan', title: '安全规划' }, { path: '/annual-objective', title: '年度目标' }, { path: '/annual-plan', title: '年度计划' }
  ]},
  { title: '二、组织构架', icon: 'OfficeBuilding', children: [
    { path: '/committee', title: '安委会管理' }, { path: '/safety-meeting', title: '安全会议' }, { path: '/responsibility', title: '责任制' },
    { path: '/leadership', title: '安全领导力' }, { path: '/leadership-evaluation', title: '安全履职评价' }
  ]},
  { title: '三、安全投入', icon: 'Money', children: [{ path: '/expenditure', title: '安全投入', icon: 'Money' }] },
  { title: '四、制度化管理', icon: 'Document', children: [
    { path: '/regulation', title: '法律法规' }, { path: '/internal-regulation', title: '规章制度' }, { path: '/compliance', title: '合规评估' },
    { path: '/safety-philosophy', title: '安全理念' }
  ]},
  { title: '五、教育培训', icon: 'Reading', children: [
    { path: '/certificate', title: '安全证书' }, { path: '/course', title: '安全课程' }, { path: '/exam-question', title: '题库管理' },
    { path: '/exam', title: '考试管理' }, { path: '/exam-record', title: '考试记录' }, { path: '/training-record', title: '培训记录' },
    { path: '/user-course', title: '课程进度' }, { path: '/mentor', title: '师带徒' },
    { path: '/personnel-entry', title: '人员准入' }, { path: '/safety-communication', title: '信息沟通' }
  ]},
  { title: '六、设备设施', icon: 'Tools', children: [
    { path: '/equipment', title: '设备管理' }, { path: '/equipment-maintenance', title: '设备检修' }, { path: '/equipment-inspection', title: '设备点检' },
    { path: '/chemical', title: '化学品' }, { path: '/special-eq', title: '特种设备' }, { path: '/fire-zone', title: '消防区域' },
    { path: '/fire-equipment', title: '消防器材' }, { path: '/fire-patrol-plan', title: '防火巡查计划' }, { path: '/fire-patrol', title: '防火巡查' },
    { path: '/technology-protection', title: '科技保障' }
  ]},
  { title: '七、作业安全', icon: 'Warning', children: [
    { path: '/risk-factor', title: '风险因素' }, { path: '/observation', title: '安全观察' }, { path: '/work-safety-check', title: '安全检查' },
    { path: '/work-permit', title: '作业许可' }, { path: '/change-request', title: '变更管理' }, { path: '/contractor', title: '承包商' },
    { path: '/contractor-approval', title: '承包商审批' }, { path: '/contractor-blacklist', title: '承包商黑名单' },
    { path: '/deep-cast-monitor', title: '深井灌注监测' },
    { path: '/unsafe-behavior', title: '不安全行为管控' }, { path: '/abnormal-handling', title: '异常处置' }, { path: '/work-behavior', title: '作业行为管理' }
  ]},
  { title: '八、危险源', icon: 'MapLocation', children: [
    { path: '/work-unit', title: '作业单元' }, { path: '/risk-control', title: '危险源识别' }, { path: '/risk-inspection-config', title: '风险排查项' },
    { path: '/risk-inspection', title: '风险排查' }, { path: '/risk-review', title: '危险源评审' }, { path: '/risk-change', title: '危险源变更' },
    { path: '/risk-map', title: '危险源地图' }
  ]},
  { title: '九、隐患治理', icon: 'Search', children: [
    { path: '/inspection-plan', title: '排查计划' }, { path: '/hazard', title: '隐患排查' }, { path: '/hazard-reward', title: '隐患奖励' },
    { path: '/violation', title: '违章管理' }, { path: '/safety-score', title: '安全积分' },
    { path: '/major-hazard', title: '重大事故隐患' }, { path: '/safety-inspection', title: '隐患排查检查' },
    { path: '/hazard-evaluation', title: '隐患治理评估' }
  ]},
  { title: '十、职业健康', icon: 'FirstAidKit', children: [
    { path: '/occupational', title: '职业健康档案' }, { path: '/ppe', title: 'PPE物品' }, { path: '/ppe-issue', title: 'PPE发放' },
    { path: '/dosimeter', title: '剂量计' }, { path: '/warning-sign', title: '警示标识' }, { path: '/protective-facility', title: '防护设施' }
  ]},
  { title: '十一、应急管理', icon: 'AlarmClock', children: [
    { path: '/emergency-plan', title: '应急预案' }, { path: '/drill-plan', title: '演练计划' }, { path: '/emergency-team', title: '应急队伍' }, { path: '/emergency-supplies', title: '应急物资' }
  ]},
  { title: '十二、事故管理', icon: 'CircleClose', children: [
    { path: '/accident', title: '事故报告' }, { path: '/accident-investigation', title: '事故调查' }, { path: '/accident-communication', title: '事故沟通' },
    { path: '/accident-responsibility', title: '责任认定' }, { path: '/accident-action', title: '整改措施' }, { path: '/accident-archive', title: '事故档案' },
    { path: '/near-miss', title: '未遂事故' }
  ]},
  { title: '十三、绩效改进', icon: 'TrendCharts', children: [
    { path: '/performance', title: '绩效评定' }, { path: '/improvement', title: '持续改进' }, { path: '/safety-kpi', title: '安全金字塔KPI' },
    { path: '/performance-assessment', title: '绩效评价' }
  ]},
  { title: '个人工作台', icon: 'Tickets', children: [
    { path: '/todo', title: '我的待办' }, { path: '/notification', title: '消息通知' }
  ]},
  { title: '系统管理', icon: 'Setting', children: [
    { path: '/org', title: '组织机构' }, { path: '/user', title: '用户管理' }, { path: '/role', title: '角色管理' }, { path: '/parameter', title: '系统参数' }
  ]},
]

function handleCommand(cmd) {
  if (cmd === 'logout') {
    ElMessageBox.confirm('确定退出登录吗?', '提示', { type: 'warning' }).then(() => {
      userStore.logout()
      router.push('/login')
    })
  }
}
</script>

<style scoped>
.layout-container { height: 100vh; }
.sidebar { background: #1e6d3a; transition: width 0.3s; overflow: hidden; }
.logo { height: 56px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: bold; border-bottom: 1px solid #ffffff20; gap: 12px; }
.header { background: #fff; border-bottom: 1px solid #e4e7ed; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; height: 56px; }
.header-left { display: flex; align-items: center; gap: 16px; }
.collapse-btn { font-size: 20px; cursor: pointer; color: #606266; }
.header-right { display: flex; align-items: center; }
.user-info { display: flex; align-items: center; gap: 4px; cursor: pointer; color: #303133; font-size: 14px; }
:deep(.el-menu) { border-right: none !important; }
:deep(.el-menu-item) { height: 40px; line-height: 40px; }
:deep(.el-menu-item.is-active) { background-color: #17542c !important; }
:deep(.el-menu-item:hover) { background-color: #2a8048 !important; }
:deep(.el-sub-menu .el-menu) { background-color: #17542c !important; }

/* 移动端侧边栏抽屉 */
.mobile-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); z-index: 2000;
}
.mobile-sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: 260px; background: #1e6d3a; z-index: 2001;
  display: flex; flex-direction: column;
}
.close-btn { cursor: pointer; color: #fff; font-size: 20px; }

/* 抽屉滑入动画 */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}

/* 移动端 header 紧凑 */
@media (max-width: 767px) {
  .header { padding: 0 12px; }
}
</style>
