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

  // 隐患分类图表 - 水平条形图（避免饼图右侧标签被遮挡）
  const hazardCats = dashData?.monthlyHazards || []
  if (hazardChartRef.value && hazardCats.length) {
    const chart = echarts.init(hazardChartRef.value)
    const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb', '#13c2c2']
    chart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 4, right: 30, top: 8, bottom: 4, containLabel: true },
      xAxis: { type: 'value', show: false },
      yAxis: {
        type: 'category',
        data: hazardCats.map(h => h.category || '其他').reverse(),
        axisLabel: { fontSize: 12, color: '#606266' },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: hazardCats.map((h, idx) => ({
          value: h._count._all,
          itemStyle: { color: colors[idx % colors.length], borderRadius: [0, 4, 4, 0] }
        })).reverse(),
        barWidth: '55%',
        label: { show: true, position: 'right', fontSize: 12, fontWeight: 'bold', color: '#303133' }
      }]
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
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 4, right: 30, top: 8, bottom: 4, containLabel: true },
      xAxis: { type: 'value', show: false },
      yAxis: {
        type: 'category',
        data: riskDist.map(r => riskName[r.riskLevel] || r.riskLevel).reverse(),
        axisLabel: { fontSize: 12, color: '#606266' },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: riskDist.map(r => ({
          value: r._count._all,
          itemStyle: { color: riskColor[r.riskLevel] || '#909399', borderRadius: [0, 4, 4, 0] }
        })).reverse(),
        barWidth: '55%',
        label: { show: true, position: 'right', fontSize: 12, fontWeight: 'bold', color: '#303133' }
      }]
    })
  }

  // 安全金字塔 (7层 DuPont 模型) - 等腰三角形，塔尖在上、越往下越宽
  // 文字布局：层名在图形左侧（左对齐），引导线连到层左边缘，图形内只放数字
  const p = dashData?.pyramid || null
  if (pyramidChartRef.value && p) {
    const tiers = [
      { name: '死亡', value: p.fatalities || 0, color: '#f56c6c' },
      { name: '损失工作日', value: p.lostWorkdays || 0, color: '#fa8c16' },
      { name: '工作受限', value: p.workRestricted || 0, color: '#fab000' },
      { name: '可记录', value: p.recordable || 0, color: '#d4dcb5' },
      { name: '急救箱事故', value: p.firstAid || 0, color: '#67c23a' },
      { name: '无伤害事故', value: p.noInjury || 0, color: '#e91e63' },
      { name: '安全观察', value: p.safetyObs || 0, color: '#409eff' },
    ]
    
    const chart = echarts.init(pyramidChartRef.value)
    
    // 布局（归一化坐标系）：左侧标签区 + 间距 + 三角形底边 w
    // 等腰三角形，塔尖在上；整图 268×195 在容器 275×260 内两侧各留 3.5px、上下各 32.5px
    const w = 210, h = 195, labelW = 55, gap = 3
    const totalW = labelW + gap + w                       // 268
    const cx = labelW + gap + w / 2                       // 三角形中心 x = 165.5
    const layerH = h / 7                                  // ≈27.9
    const elements = []
    
    for (let i = 0; i < 7; i++) {
      const tier = tiers[i]
      
      // 宽度随层级递增（i=0 为塔尖顶点）
      const topWidth = w * i / 7
      const bottomWidth = w * (i + 1) / 7
      const yc = h * (i + 0.5) / 7                       // 该层垂直中点
      const yTop = yc - layerH / 2
      const yBottom = yc + layerH / 2
      
      // 四个顶点
      const x4 = cx - topWidth / 2      // 左上
      const x3 = cx + topWidth / 2      // 右上
      const x2 = cx + bottomWidth / 2   // 右下
      const x1 = cx - bottomWidth / 2   // 左下
      
      // 层填充
      elements.push({
        type: 'polygon',
        shape: { points: [[x4, yTop], [x3, yTop], [x2, yBottom], [x1, yBottom]] },
        style: { fill: tier.color, stroke: '#fff', lineWidth: 1 },
        z: 100 + i
      })
      
      // 引导线：从标签区右边界延伸到该层左斜边中点
      const xLeftEdge = (x1 + x4) / 2
      elements.push({
        type: 'line',
        shape: { x1: labelW + 1, y1: yc, x2: xLeftEdge, y2: yc },
        style: { stroke: '#c0c4cc', lineWidth: 1 },
        z: 99
      })
      // 层名：左对齐（最长 5 字 × 11px ≈ 55px < 标签区 58px）
      elements.push({
        type: 'text',
        style: { text: tier.name, x: 3, y: yc, textAlign: 'left',
                 textVerticalAlign: 'middle', fontSize: 11, fill: '#606266' },
        z: 101 + i
      })
      
      // 图形内：只放数字。字号按该层中点可用宽度自适应（窄层略小，避免溢出）
      const isLight = ['#d4dcb5', '#fab000', '#67c23a'].includes(tier.color)
      const val = tier.value >= 10000 ? (tier.value / 10000).toFixed(1) + '万' : String(tier.value)
      const availW = w * (i + 0.2) / 7                   // 该层中点宽度留边距后的可用宽
      const fs = availW > 26 ? 13 : availW > 15 ? 11 : 9
      elements.push({
        type: 'text',
        style: { text: val, x: cx, y: yc, textAlign: 'center', textVerticalAlign: 'middle',
                 fontSize: fs, fill: isLight ? '#303133' : '#fff', fontWeight: 'bold' },
        z: 102 + i
      })
    }
    
    chart.setOption({
      graphic: {
        elements: elements,
        left: 'center',
        top: 'middle'
      }
    })
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
