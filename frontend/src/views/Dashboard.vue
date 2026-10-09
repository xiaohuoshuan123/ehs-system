<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="12" class="stat-cards">
      <el-col :xs="12" :sm="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" class="stat-card clickable" :style="{ borderTop: `3px solid ${card.color}` }" @click="card.link && router.push(card.link)">
          <div class="stat-card-inner">
            <div class="stat-info">
              <p class="stat-title">{{ card.title }}</p>
              <p class="stat-value" :style="{ color: card.color }">{{ card.value }}</p>
              <p class="stat-sub">{{ card.sub }}</p>
            </div>
            <el-icon class="stat-icon" :style="{ color: card.color }"><component :is="card.icon" /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :xs="24" :sm="8">
        <el-card><template #header><span>隐患分类统计</span></template><div ref="hazardChartRef" style="height:260px"></div></el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card><template #header><span>风险等级分布</span></template><div ref="riskChartRef" style="height:260px"></div></el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card>
          <template #header><span>安全金字塔</span></template>
          <div ref="pyramidChartRef" style="height:260px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 近期动态 -->
    <el-row :gutter="12" style="margin-top:12px">
      <el-col :xs="24" :sm="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>待办事项 ({{ todoCount }})</span>
              <el-link type="primary" :underline="false" @click="router.push({ path: '/todo', query: { status: 'pending' } })">查看全部 <el-icon><ArrowRight /></el-icon></el-link>
            </div>
          </template>
          <el-empty v-if="!recentTodos.length" description="暂无待办" :image-size="60" />
          <div v-for="todo in recentTodos.slice(0,5)" :key="todo.id" class="todo-item clickable-row" @click="router.push({ path: '/todo', query: { status: 'pending' } })">
            <el-tag :type="todo.priority > 2 ? 'danger' : 'warning'" size="small">{{ todo.priority > 2 ? '紧急' : '普通' }}</el-tag>
            <span class="todo-title">{{ todo.title }}</span>
            <span class="todo-date">{{ formatDate(todo.dueDate) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近隐患</span>
              <el-link type="primary" :underline="false" @click="router.push('/hazard')">查看全部 <el-icon><ArrowRight /></el-icon></el-link>
            </div>
          </template>
          <el-empty v-if="!recentHazards.length" description="暂无隐患" :image-size="60" />
          <div v-for="h in recentHazards.slice(0,5)" :key="h.id" class="hazard-item clickable-row" @click="router.push('/hazard')">
            <el-tag :type="h.riskLevel === 'major' ? 'danger' : 'warning'" size="small">{{ h.riskLevel === 'major' ? '重大' : '一般' }}</el-tag>
            <span>{{ h.title }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统公告</span>
              <el-link type="primary" :underline="false" @click="router.push('/notification')">查看全部 <el-icon><ArrowRight /></el-icon></el-link>
            </div>
          </template>
          <el-empty v-if="!notifications.length" description="暂无通知" :image-size="60" />
          <div v-for="n in notifications.slice(0,5)" :key="n.id" class="noti-item clickable-row" @click="router.push('/notification')">
            <el-tag :type="n.level === 'danger' ? 'danger' : n.level === 'warning' ? 'warning' : 'info'" size="small">{{ n.type }}</el-tag>
            <span>{{ n.title }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { crudApi } from '../api'
import api from '../api'
import * as echarts from 'echarts'

const router = useRouter()

const hazardChartRef = ref()
const riskChartRef = ref()
const pyramidChartRef = ref()
const statCards = ref([])
const todoCount = ref(0)
const recentTodos = ref([])
const recentHazards = ref([])
const notifications = ref([])
let dashData = { data: {} }

const todoApi = crudApi('/todo')
const hazardApi = crudApi('/hazard')
const notificationApi = crudApi('/notification')

function formatDate(d) { return d ? new Date(d).toLocaleDateString('zh-CN') : '' }

onMounted(async () => {
  // 加载仪表盘数据（axios 拦截器已解包，直接就是 { summary, monthlyHazards, ... }）
  try {
    dashData = await api.get('/dashboard')
    const s = dashData?.summary || {}
    statCards.value = [
      { title: '隐患总数', value: s.hazardTotal || 0, sub: `待整改: ${s.hazardOpen || 0}`, icon: 'Warning', color: '#e6a23c', link: '/hazard' },
      { title: '逾期未整改', value: s.hazardOverdue || 0, sub: '需要立即处理', icon: 'CircleClose', color: '#f56c6c', link: { path: '/hazard', query: { fixStatus: 'overdue' } } },
      { title: '即将到期证书', value: s.certExpiring || 0, sub: '30天内', icon: 'Document', color: '#409eff', link: { path: '/certificate', query: { alertLevel: '30d,overdue' } } },
      { title: '违章总数', value: s.violationCount || 0, sub: '年度累计', icon: 'CircleCloseFilled', color: '#909399', link: '/violation' },
      { title: '事故总数', value: s.accidentCount || 0, sub: '年度累计', icon: 'Bell', color: '#f56c6c', link: '/accident' },
      { title: '待办事项', value: s.todoPending || 0, sub: '待处理', icon: 'Tickets', color: '#409eff', link: { path: '/todo', query: { status: 'pending' } } },
      { title: '隐患奖励', value: s.hazardRewards || 0, sub: '已审批', icon: 'Trophy', color: '#67c23a', link: { path: '/hazard-reward', query: { status: 'approved' } } },
      { title: '进行中作业', value: s.activePermits || 0, sub: '作业许可', icon: 'Tools', color: '#e6a23c', link: { path: '/work-permit', query: { status: 'submitted,in_progress' } } },
    ]
  } catch(e) { console.error('dashboard error', e) }

  // 最近待办
  const todos = await todoApi.list({ pageSize: 5, status: 'pending' })
  recentTodos.value = todos.data || []
  todoCount.value = todos.total || 0

  // 最近隐患
  const hazards = await hazardApi.list({ pageSize: 5 })
  recentHazards.value = hazards.data || []

  // 通知
  const notis = await notificationApi.list({ pageSize: 5 })
  notifications.value = notis.data || []

  // 隐患分类图表
  const hazardCats = dashData?.monthlyHazards || []
  if (hazardChartRef.value && hazardCats.length) {
    const chart = echarts.init(hazardChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: ['40%','70%'], data: hazardCats.map(h => ({ name: h.category || '其他', value: h._count._all })), itemStyle: { borderRadius: 6 } }]
    })
  }

  // 风险等级图表 - AQ/T 9007-2019 风险四色图标准色
  // 重大(红) → 较大(橙) → 一般(黄) → 低(蓝)
  const riskColor = {
    major_above: '#f56c6c',  // 红色 - 重大风险
    major: '#e6a23c',         // 橙色 - 较大风险
    general: '#f2c400',       // 黄色 - 一般风险
    low: '#409eff'            // 蓝色 - 低风险
  }
  const riskName = {
    major_above: '重大风险',
    major: '较大风险',
    general: '一般风险',
    low: '低风险'
  }
  const riskDist = dashData?.riskDistribution || []
  if (riskChartRef.value && riskDist.length) {
    const chart = echarts.init(riskChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: ['40%','70%'], data: riskDist.map(r => ({
        name: riskName[r.riskLevel] || r.riskLevel,
        value: r._count._all,
        itemStyle: { color: riskColor[r.riskLevel] || '#909399' }
      })) }]
    })
  }

  // 安全金字塔 (7层 DuPont 模型) - 漏斗图，上窄下宽
  // Tier1 死亡(红) → Tier2 损失工作日(橙) → Tier3 工作受限(黄) → Tier4 可记录(浅黄)
  // → Tier5 急救箱(绿) → Tier6 无伤害(粉) → Tier7 安全观察(蓝)
  const p = dashData?.pyramid || null
  if (pyramidChartRef.value && p) {
    const tiers = [
      { name: '死亡', value: p.fatalities || 0, color: '#f56c6c' },
      { name: '损失工作日', value: p.lostWorkdays || 0, color: '#fa8c16' },
      { name: '工作受限', value: p.workRestricted || 0, color: '#fab000' },
      { name: '可记录(医疗/工伤)', value: p.recordable || 0, color: '#d4dcb5' },
      { name: '急救箱事故', value: p.firstAid || 0, color: '#67c23a' },
      { name: '无伤害事故', value: p.noInjury || 0, color: '#e91e63' },
      { name: '安全观察', value: p.safetyObs || 0, color: '#409eff' },
    ]
    const maxVal = Math.max(...tiers.map(t => t.value || 1), 1)
    const chart = echarts.init(pyramidChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      legend: { bottom: 0, type: 'scroll' },
      series: [{
        type: 'pie',
        radius: ['5%', '85%'],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: { borderRadius: 6 },
        data: tiers.reverse(), // 从底到顶排列(大→小)
        label: {
          show: true,
          formatter: (p) => {
            const pct = p.data?.value ? Math.round(p.data.value / maxVal * 100) : 0
            return `{name|${p.data?.name}}\n{val|${p.data?.value ?? 0}}`
          },
          rich: {
            name: { fontSize: 12, color: '#606266', fontWeight: 'bold' },
            val: { fontSize: 16, color: '#303133', fontWeight: 'bold' }
          }
        },
        labelLine: { length: 15, lineStyle: { width: 1 } }
      }]
    })
    // 叠加标题文字
    const titleEl = document.createElement('div')
    titleEl.style.cssText = 'text-align:center;color:#909399;font-size:12px;margin-top:4px'
    titleEl.textContent = `数据来源: ${p.source === 'manual' ? p.period : '系统推导'}`
    chart.getDom().appendChild(titleEl)
  }
})
</script>

<style scoped>
.stat-cards { margin-bottom: 0; }
.stat-card { margin-bottom: 12px; }
.stat-card-inner { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
.stat-title { font-size: 13px; color: #909399; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: bold; margin-bottom: 4px; }
.stat-sub { font-size: 12px; color: #c0c4cc; }
.stat-icon { font-size: 40px; opacity: 0.6; }
.todo-item, .hazard-item, .noti-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
.todo-title, .hazard-item span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.todo-date { color: #c0c4cc; font-size: 12px; }
.clickable { cursor: pointer; transition: transform 0.15s; }
.clickable:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
.clickable-row { cursor: pointer; }
.clickable-row:hover { background: #f5f7fa; }
.card-header { display: flex; justify-content: space-between; align-items: center; }

@media (max-width: 767px) {
  .stat-value { font-size: 22px; }
  .stat-icon { font-size: 28px; }
  .stat-card-inner { padding: 4px 0; }
}
</style>
