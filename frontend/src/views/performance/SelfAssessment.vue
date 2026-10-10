<template>
  <div class="page-container">
    <!-- ===== 头部: 年度 + 状态 + 自评人/时间 ===== -->
    <el-card shadow="never" class="head-card">
      <div class="head-row">
        <div class="head-left">
          <span class="head-title">标准化自评打分</span>
          <el-tag size="small" type="info">13 类目 · 1000 分制</el-tag>
          <el-divider direction="vertical" />
          <span class="head-label">自评年度</span>
          <el-select v-model="year" style="width:110px" @change="onYearChange">
            <el-option v-for="y in yearOptions" :key="y" :label="y + ' 年'" :value="y" />
          </el-select>
          <el-divider direction="vertical" />
          <span class="head-label">状态</span>
          <el-tag v-if="!items.length" type="info">未初始化</el-tag>
          <el-tag v-else-if="record?.status === 'approved'" type="success">已归档</el-tag>
          <el-tag v-else-if="record?.status === 'submitted'" type="warning">已提交</el-tag>
          <el-tag v-else-if="record" type="primary">暂存中</el-tag>
          <el-tag v-else type="info">未提交</el-tag>
        </div>
        <div class="head-right" v-if="record">
          <span class="meta-item">自评人：{{ record.assessorName || '—' }}</span>
          <span class="meta-item">自评时间：{{ fmt(record.createdAt) }}</span>
          <span class="meta-item" v-if="record.submittedAt">提交时间：{{ fmt(record.submittedAt) }}</span>
          <span class="meta-item" v-if="record.approvedAt">审批：{{ record.approvedByName }} {{ fmt(record.approvedAt) }}</span>
        </div>
      </div>
    </el-card>

    <!-- ===== 汇总卡 (随打分实时计算) ===== -->
    <el-card shadow="never" class="summary-card">
      <div class="summary-grid">
        <div class="sum-item">
          <div class="sum-label">评定得分</div>
          <div class="sum-value">{{ s.actualScore }}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">标准满分</div>
          <div class="sum-value">{{ s.totalScore }}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">不涉及分值</div>
          <div class="sum-value">{{ s.excludedScore }}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">标准化得分</div>
          <div class="sum-value score" :class="{ pass: s.score >= 90, warn: s.score < 80 }">{{ s.score }}</div>
          <div class="sum-hint">= {{ s.actualScore }}÷({{ s.totalScore }}-{{ s.excludedScore }})×100</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">评分点</div>
          <div class="sum-value">{{ s.itemTotal }}<span class="unit">条</span></div>
          <div class="sum-hint">另有 {{ items.length - s.itemTotal }} 条子项续行</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">已打分</div>
          <div class="sum-value" :class="{ warn: unscored > 0 }">{{ s.itemTotal - unscored }}<span class="unit">/{{ s.itemTotal }}</span></div>
          <div class="sum-hint">待打分 {{ unscored }} 条</div>
        </div>
      </div>
    </el-card>

    <!-- ===== 操作条 ===== -->
    <div class="action-bar">
      <div class="action-left">
        <span class="dirty-tip" v-if="dirty">有 {{ dirty }} 项改动未保存</span>
        <span v-else-if="items.length" class="dirty-tip saved">已全部保存</span>
      </div>
      <div class="action-right">
        <el-button :icon="Refresh" @click="reload">刷新</el-button>
        <el-button v-if="isAdmin && record?.status === 'submitted'" type="success" :loading="saving" @click="handleApprove">审批归档</el-button>
        <el-button :loading="saving" @click="handleSave(false)">暂存</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave(true)">提交自评</el-button>
      </div>
    </div>

    <!-- ===== 打分表格: 内联编辑 ===== -->
    <el-table :data="pageData" v-loading="loading" border stripe size="small" style="width:100%"
      :row-class-name="rowClass" row-key="id">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="expand-body">
            <div><b>考评类目：</b>{{ row.category }}</div>
            <div><b>考评项目：</b>{{ row.item || '—' }}</div>
            <div><b>考评办法：</b>{{ row.method || '—' }}</div>
            <div><b>考评内容：</b>{{ row.content }}</div>
            <div><b>自评描述：</b>{{ row.assessmentDesc || '—' }}</div>
            <div v-if="!row.notApplicable"><b>扣分说明：</b>{{ row.deductionReason || '—' }}</div>
            <div v-else><b>不涉及原因：</b>{{ row.deductionReason || row.remark || '—' }}</div>
            <div v-if="row.deductionReason">
              <b>整改措施：</b>{{ row.measure || '—' }}
              <span class="eb"><b>跟踪人：</b>{{ row.tracker || '—' }}</span>
              <span class="eb"><b>整改：</b>{{ row.completed ? '已完成' : '未完成' }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类目 / 考评内容" min-width="300" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="cell-cat">{{ row.item || row.category }}</div>
          <div class="cell-no">{{ row.contentNo || row.itemCode }}</div>
        </template>
      </el-table-column>
      <el-table-column label="满分" width="60" align="center">
        <template #default="{ row }">{{ row.score ?? '—' }}</template>
      </el-table-column>
      <el-table-column label="实得" width="118" align="center">
        <template #default="{ row }">
          <el-input-number v-if="!locked && row.score != null && !row.notApplicable"
            v-model="row.actual" :min="0" :max="row.score" :precision="1" :step="1"
            controls-position="right" size="small" style="width:100%" @change="onEdit" />
          <el-tag v-else-if="row.notApplicable" type="info" size="small">NA</el-tag>
          <span v-else :class="{ 'text-warn': row.actual !== null && row.actual < (row.score || 0) }">{{ row.actual ?? '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="不涉及" width="82" align="center">
        <template #default="{ row }">
          <el-switch v-if="!locked && row.score != null" v-model="row.notApplicable" size="small" @change="onEdit" />
          <span v-else class="muted">—</span>
        </template>
      </el-table-column>
      <el-table-column label="考评内容" min-width="240" show-overflow-tooltip>
        <template #default="{ row }">
          <span :class="{ muted: row.notApplicable }">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扣分说明 / 不涉及原因" min-width="220">
        <template #default="{ row }">
          <el-input v-if="!locked && row.score != null && !row.notApplicable && row.actual < (row.score || 0)"
            v-model="row.deductionReason" placeholder="必填：扣分原因" size="small" clearable @input="onEdit" />
          <el-input v-else-if="!locked && row.score != null && row.notApplicable"
            v-model="row.deductionReason" :placeholder="row.remark ? row.remark : '不涉及原因'" size="small" clearable @input="onEdit" />
          <span v-else :class="{ muted: !(row.deductionReason || row.remark) }">{{ row.deductionReason || row.remark || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="整改措施" min-width="180">
        <template #default="{ row }">
          <el-input v-if="!locked && row.score != null && !row.notApplicable && row.actual < (row.score || 0)"
            v-model="row.measure" placeholder="整改措施" size="small" clearable @input="onEdit" />
          <span v-else :class="{ muted: !row.measure }">{{ row.measure || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="整改" width="78" align="center">
        <template #default="{ row }">
          <el-switch v-if="!locked && row.deductionReason" v-model="row.completed" size="small" @change="onEdit" />
          <el-tag v-else-if="row.deductionReason" :type="row.completed ? 'success' : 'warning'" size="small">
            {{ row.completed ? '完成' : '未完成' }}
          </el-tag>
          <span v-else class="muted">—</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="items.length"
        :page-sizes="[20, 50, 100, 200, 304]" layout="total, sizes, prev, pager, next, jumper" />
    </div>

    <!-- ===== 年度无数据提示 ===== -->
    <el-empty v-if="!loading && !items.length" description="该年度自评表尚未初始化">
      <el-button type="primary" :loading="saving" @click="handleInit">从 {{ BASELINE_YEAR }} 年基线初始化</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import api from '../../api'
import { useUserStore } from '../../stores/user'

const user = useUserStore()
const BASELINE_YEAR = 2019                       // 历史基线年度 (Arconic 2019.8 自评表)
const yearOptions = ref([])                      // 已有数据的年度
const currentYear = new Date().getFullYear()     // 当前自评年度

const loading = ref(false)
const saving = ref(false)
const year = ref(currentYear)
const record = ref(null)                          // 提交记录 (自评人/时间/状态)
const items = ref([])                             // 本年度全部评分点 (内联编辑)
const page = ref(1)
const pageSize = ref(50)
const pageData = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return items.value.slice(s, s + pageSize.value)
})
const locked = computed(() => record.value?.status === 'approved')

// ===== 实时汇总 (口径与后端 computeScore 一致: 不涉及分值从分母排除) =====
const r1 = n => Math.round(n * 10) / 10
const s = reactive({ itemTotal: 0, totalScore: 0, excludedScore: 0, actualScore: 0, score: 0 })
const scoreRows = computed(() => items.value.filter(i => i.score != null))
// 待打分: 参与考评但未填实得
const unscored = computed(() => scoreRows.value.filter(i => !i.notApplicable && i.actual == null).length)
// 扣分但未填说明 (提交时校验)
const blankReason = computed(() =>
  scoreRows.value.filter(i => !i.notApplicable && i.actual != null && i.actual < (i.score || 0) && !(i.deductionReason || '').trim()).length)

function recalc() {
  let total = 0, ex = 0, actual = 0
  for (const i of scoreRows.value) {
    total += i.score
    if (i.notApplicable) ex += i.score
    else if (i.actual != null) actual += i.actual
  }
  const denom = Math.max(total - ex, 0)
  s.itemTotal = scoreRows.value.length
  s.totalScore = r1(total); s.excludedScore = r1(ex); s.actualScore = r1(actual)
  s.score = denom ? r1(actual / denom * 100) : 0
}

// ===== 未保存改动检测: 按行快照对比 (整表 JSON 太慢且易误报) =====
const snap = ref(new Map())                       // id -> pick(row) 的快照
const EDIT_FIELDS = ['actual', 'notApplicable', 'deductionReason', 'measure', 'completed', 'tracker']
const EDIT_KEY = EDIT_FIELDS.join(',')
function pick(i) {
  return {
    id: i.id, itemCode: i.itemCode, year: i.year,
    actual: i.notApplicable ? null : i.actual,
    notApplicable: !!i.notApplicable,
    deductionReason: i.deductionReason || '',
    measure: i.measure || '',
    completed: i.completed ?? null,
    tracker: i.tracker || ''
  }
}
function keyOf(i) { return EDIT_FIELDS.map(f => String(i[f])).join('|') }
function takeSnapshot() {
  const m = new Map()
  for (const i of items.value) m.set(i.id, keyOf(i))
  snap.value = m
}
const dirty = computed(() => {
  let n = 0
  for (const i of items.value) {
    const old = snap.value.get(i.id)
    if (old === undefined || old !== keyOf(i)) n++
  }
  return n
})

function onEdit() { recalc() }

// 行高亮: 不涉及灰、扣分橙、子项续行淡化
function rowClass({ row }) {
  if (row.score == null) return 'row-sub'
  if (row.notApplicable) return 'row-na'
  if (row.actual != null && row.actual < (row.score || 0)) return 'row-deduct'
  return ''
}

const fmt = t => t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '—'

// ===== 数据加载 =====
async function reload() {
  loading.value = true
  try {
    const [rec, its] = await Promise.all([
      api.get('/self-assessment', { params: { year: year.value } }),
      api.get('/self-assessment-item', { params: { year: year.value, pageSize: 400 } })
    ])
    record.value = rec
    items.value = (its && its.data) || its || []
    recalc()
    takeSnapshot()
    page.value = 1
    // 年度下拉: 当前年 + 有数据的年度
    const ys = new Set([currentYear])
    items.value.forEach(i => ys.add(i.year))
    if (rec && rec.year) ys.add(rec.year)
    yearOptions.value = [...ys].sort((a, b) => b - a)
  } catch (e) { } finally { loading.value = false }
}

// ===== 初始化年度自评表 (从基线复制考评模板) =====
async function handleInit() {
  try {
    await ElMessageBox.confirm(
      `从 ${BASELINE_YEAR} 年基线复制考评模板到 ${year.value} 年（分数、不涉及、扣分说明全部清空，需重新打分）。`,
      '初始化自评表', { type: 'warning', confirmButtonText: '初始化', cancelButtonText: '取消' })
  } catch { return }
  saving.value = true
  try {
    await api.post('/self-assessment/init', { year: year.value, fromYear: BASELINE_YEAR })
    ElMessage.success(`${year.value} 年自评表已初始化`)
    await reload()
  } catch (e) { } finally { saving.value = false }
}

// ===== 暂存 / 提交 =====
async function handleSave(submit) {
  if (!items.value.length) return ElMessage.warning('该年度尚未初始化评分点')
  if (locked.value) return ElMessage.warning('已归档的自评表不可修改')
  if (submit && unscored.value > 0) return ElMessage.warning(`还有 ${unscored.value} 个评分点未打分`)
  if (submit && blankReason.value > 0) return ElMessage.warning(`${blankReason.value} 个扣分点未填写扣分说明`)

  saving.value = true
  try {
    const res = await api.post('/self-assessment', {
      year: year.value,
      submit,
      note: record.value?.note || '',
      items: items.value.map(i => pick(i))
    })
    ElMessage.success((res && res.message) || (submit ? '已提交' : '已暂存'))
    await reload()
  } catch (e) { } finally { saving.value = false }
}

// ===== 审批归档 (管理员) =====
const isAdmin = computed(() => user.userInfo?.username === 'admin')
async function handleApprove() {
  try {
    const { value } = await ElMessageBox.prompt('审批意见（可选）', '审批归档', {
      confirmButtonText: '归档', cancelButtonText: '取消', inputPlaceholder: '同意，符合自评要求'
    })
    await api.put(`/self-assessment/${record.value.id}/approve`, { note: value || '' })
    ElMessage.success('已审批归档')
    await reload()
  } catch (e) { }
}

onMounted(reload)
</script>

<style scoped>
.head-card { margin-bottom: 14px; }
.head-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
.head-left { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
.head-title { font-size: 16px; font-weight: bold; color: #303133; margin-right: 6px; }
.head-label { font-size: 13px; color: #909399; }
.head-right { display: flex; gap: 14px; font-size: 12px; color: #606266; flex-wrap: wrap; }
.meta-item { white-space: nowrap; }

.summary-card { margin-bottom: 14px; }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(125px, 1fr)); gap: 12px; }
.sum-item { background: #f7f9fb; border-radius: 6px; padding: 12px 14px; text-align: center; }
.sum-label { font-size: 12px; color: #909399; margin-bottom: 6px; }
.sum-value { font-size: 22px; font-weight: bold; color: #303133; }
.sum-value.score { color: #1e6d3a; }
.sum-value.score.pass { color: #67c23a; }
.sum-value.warn { color: #e6a23c; }
.sum-value .unit { font-size: 12px; font-weight: normal; color: #909399; margin-left: 2px; }
.sum-hint { font-size: 11px; color: #c0c4cc; margin-top: 2px; }

.action-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
.action-left { font-size: 13px; }
.dirty-tip { color: #e6a23c; font-weight: bold; }
.dirty-tip.saved { color: #67c23a; font-weight: normal; }
.action-right { display: flex; gap: 8px; }

.cell-cat { font-size: 12px; color: #909399; margin-bottom: 2px; }
.cell-no { font-weight: 600; color: #303133; }

.expand-body { padding: 6px 18px; line-height: 2; font-size: 13px; color: #606266; }
.expand-body .eb { margin-left: 16px; }

.pagination-wrap { margin-top: 14px; display: flex; justify-content: flex-end; }
.text-warn { color: #e6a23c; font-weight: bold; }
.muted { color: #c0c4cc; }
</style>
