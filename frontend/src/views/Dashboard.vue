<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :g="4" :gutter="16" class="stat-cards">
      <el-col :span="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" class="stat-card" :style="{ borderTop: `3px solid ${card.color}` }">
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
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="12">
        <el-card><template #header><span>隐患分类统计</span></template><div ref="hazardChartRef" style="height:300px"></div></el-card>
      </el-col>
      <el-col :span="12">
        <el-card><template #header><span>风险等级分布</span></template><div ref="riskChartRef" style="height:300px"></div></el-card>
      </el-col>
    </el-row>

    <!-- 近期动态 -->
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="8">
        <el-card>
          <template #header><span>待办事项 ({{ todoCount }})</span></template>
          <el-empty v-if="!recentTodos.length" description="暂无待办" :image-size="60" />
          <div v-for="todo in recentTodos.slice(0,5)" :key="todo.id" class="todo-item">
            <el-tag :type="todo.priority > 2 ? 'danger' : 'warning'" size="small">{{ todo.priority > 2 ? '紧急' : '普通' }}</el-tag>
            <span class="todo-title">{{ todo.title }}</span>
            <span class="todo-date">{{ formatDate(todo.dueDate) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>最近隐患</span></template>
          <el-empty v-if="!recentHazards.length" description="暂无隐患" :image-size="60" />
          <div v-for="h in recentHazards.slice(0,5)" :key="h.id" class="hazard-item">
            <el-tag :type="h.riskLevel === 'major' ? 'danger' : 'warning'" size="small">{{ h.riskLevel === 'major' ? '重大' : '一般' }}</el-tag>
            <span>{{ h.title }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>系统公告</span></template>
          <el-empty v-if="!notifications.length" description="暂无通知" :image-size="60" />
          <div v-for="n in notifications.slice(0,5)" :key="n.id" class="noti-item">
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
import { crudApi } from '../api'
import api from '../api'
import * as echarts from 'echarts'

const hazardChartRef = ref()
const riskChartRef = ref()
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
      { title: '隐患总数', value: s.hazardTotal || 0, sub: `待整改: ${s.hazardOpen || 0}`, icon: 'Warning', color: '#e6a23c' },
      { title: '逾期未整改', value: s.hazardOverdue || 0, sub: '需要立即处理', icon: 'CircleClose', color: '#f56c6c' },
      { title: '即将到期证书', value: s.certExpiring || 0, sub: '30天内', icon: 'Document', color: '#409eff' },
      { title: '违章总数', value: s.violationCount || 0, sub: '年度累计', icon: 'CircleCloseFilled', color: '#909399' },
      { title: '事故总数', value: s.accidentCount || 0, sub: '年度累计', icon: 'Bell', color: '#f56c6c' },
      { title: '待办事项', value: s.todoPending || 0, sub: '待处理', icon: 'Tickets', color: '#409eff' },
      { title: '隐患奖励', value: s.hazardRewards || 0, sub: '已审批', icon: 'Trophy', color: '#67c23a' },
      { title: '进行中作业', value: s.activePermits || 0, sub: '作业许可', icon: 'Tools', color: '#e6a23c' },
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

  // 风险等级图表
  const riskDist = dashData?.riskDistribution || []
  if (riskChartRef.value && riskDist.length) {
    const chart = echarts.init(riskChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: ['40%','70%'], data: riskDist.map(r => ({
        name: { low: '低风险', general: '一般风险', major: '较大风险', major_above: '重大风险' }[r.riskLevel] || r.riskLevel,
        value: r._count._all,
        itemStyle: { color: { low: '#67c23a', general: '#e6a23c', major: '#f56c6c', major_above: '#f56c6c' }[r.riskLevel] || '#409eff' }
      })) }]
    })
  }
})
</script>

<style scoped>
.stat-cards { margin-bottom: 0; }
.stat-card { margin-bottom: 16px; }
.stat-card-inner { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
.stat-title { font-size: 13px; color: #909399; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: bold; margin-bottom: 4px; }
.stat-sub { font-size: 12px; color: #c0c4cc; }
.stat-icon { font-size: 40px; opacity: 0.6; }
.todo-item, .hazard-item, .noti-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
.todo-title, .hazard-item span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.todo-date { color: #c0c4cc; font-size: 12px; }
</style>
