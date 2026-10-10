<template>
  <div class="page-container">
    <!-- 汇总卡 -->
    <el-card shadow="never" class="summary-card">
      <div class="summary-grid">
        <div class="sum-item">
          <div class="sum-label">评定得分</div>
          <div class="sum-value" :class="{ warn: actual < 900 }">{{ actual }}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">标准满分</div>
          <div class="sum-value">{{ total }}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">不涉及分值</div>
          <div class="sum-value">{{ excluded }}</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">标准化得分</div>
          <div class="sum-value score" :class="{ pass: Number(score) >= 90 }">{{ score }}</div>
          <div class="sum-hint">= {{ actual }}÷({{ total }}-{{ excluded }})×100</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">评分点</div>
          <div class="sum-value">{{ scoreCount }}<span class="unit">条</span></div>
          <div class="sum-hint">另有 {{ all.length - scoreCount }} 条子项续行</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">低于80%类目</div>
          <div class="sum-value" :class="{ warn: failCats.length > 0 }">{{ failCats.length }}<span class="unit">项</span></div>
        </div>
      </div>
    </el-card>

    <!-- 类目得分明细 -->
    <el-card shadow="never" class="cat-card">
      <template #header>
        <div class="card-head">
          <span>各类目得分（内部管控线 ≥80%）</span>
          <el-tag size="small" type="info">13 类目 · 46 考评项目 · 246 评分点 · 1000 分制</el-tag>
        </div>
      </template>
      <el-table :data="catRows" size="small" border>
        <el-table-column prop="category" label="考评类目" min-width="200" show-overflow-tooltip />
        <el-table-column prop="points" label="评分点" width="80" align="center" />
        <el-table-column label="实际得分" width="100" align="center">
          <template #default="{ row }">{{ row.actual }}</template>
        </el-table-column>
        <el-table-column label="满分" width="80" align="center">
          <template #default="{ row }">{{ row.total }}</template>
        </el-table-column>
        <el-table-column label="得分率" width="100" align="center">
          <template #default="{ row }">
            <span :class="{ 'text-warn': row.rate < 80 }">{{ row.rate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="达标" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.rate >= 80 ? 'success' : 'danger'" size="small">
              {{ row.rate >= 80 ? '达标' : '不达标' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 筛选 -->
    <div class="search-bar">
      <el-input v-model="filters.content" placeholder="考评内容/编码" clearable style="width:220px" @keyup.enter="reload" />
      <el-select v-model="filters.categoryNo" placeholder="考评类目" clearable style="width:200px">
        <el-option v-for="c in categories" :key="c.value" :label="c.label" :value="c.value" />
      </el-select>
      <el-select v-model="filters.notApplicable" placeholder="不涉及" clearable style="width:130px">
        <el-option label="不涉及" value="true" />
      </el-select>
      <el-select v-model="filters.completed" placeholder="整改完成" clearable style="width:130px">
        <el-option label="已完成" value="true" />
        <el-option label="未完成" value="false" />
      </el-select>
      <el-button type="primary" @click="reload"><el-icon><Search /></el-icon>查询</el-button>
      <el-button @click="resetFilters"><el-icon><Refresh /></el-icon>重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="pageData" v-loading="loading" border stripe size="small" style="width:100%">
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column prop="contentNo" label="编号" width="80" align="center" />
      <el-table-column prop="itemCode" label="唯一编码" width="95" align="center" />
      <el-table-column prop="content" label="考评内容" min-width="280" show-overflow-tooltip>
        <template #default="{ row }">
          <span :class="{ muted: row.notApplicable }">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="满分" width="60" align="center">
        <template #default="{ row }">{{ row.score ?? '—' }}</template>
      </el-table-column>
      <el-table-column label="实得" width="70" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.notApplicable" type="info" size="small">NA</el-tag>
          <span v-else :class="{ 'text-warn': row.actual !== null && row.actual < (row.score || 0) }">{{ row.actual ?? '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deductionReason" label="扣分说明 / 不涉及原因" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="row.deductionReason">{{ row.deductionReason }}</span>
          <span v-else-if="row.notApplicable && row.remark" class="muted">{{ row.remark }}</span>
          <span v-else class="muted">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="measure" label="整改措施" min-width="160" show-overflow-tooltip>
        <template #default="{ row }"><span v-if="row.measure">{{ row.measure }}</span><span v-else class="muted">—</span></template>
      </el-table-column>
      <el-table-column label="整改" width="70" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.deductionReason" :type="row.completed ? 'success' : 'warning'" size="small">
            {{ row.completed ? '完成' : '未完成' }}
          </el-tag>
          <span v-else class="muted">—</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
          <el-button link type="primary" @click="openDialog(row)">打分</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="filtered.length" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @current-change="render" @size-change="render" />
    </div>

    <!-- 详情 -->
    <el-dialog v-model="detailVisible" title="考评内容详情" width="65%">
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="编号">{{ detail.contentNo || '—' }}</el-descriptions-item>
        <el-descriptions-item label="唯一编码">{{ detail.itemCode }}</el-descriptions-item>
        <el-descriptions-item label="考评类目" :span="2">{{ detail.category }}</el-descriptions-item>
        <el-descriptions-item label="考评项目">{{ detail.item || '—' }}</el-descriptions-item>
        <el-descriptions-item label="是否不涉及"><el-tag :type="detail.notApplicable ? 'info' : 'success'" size="small">{{ detail.notApplicable ? '不涉及' : '参与考评' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="考评内容" :span="2">{{ detail.content }}</el-descriptions-item>
        <el-descriptions-item label="标准分值">{{ detail.score ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="实际得分">{{ detail.actual ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="考评办法" :span="2">{{ detail.method || '—' }}</el-descriptions-item>
        <el-descriptions-item label="自评/评审描述" :span="2">{{ detail.assessmentDesc || '—' }}</el-descriptions-item>
        <el-descriptions-item label="扣分说明" :span="2">{{ detail.deductionReason || '—' }}</el-descriptions-item>
        <el-descriptions-item label="整改措施" :span="2">{{ detail.measure || '—' }}</el-descriptions-item>
        <el-descriptions-item label="整改状态"><el-tag v-if="detail.deductionReason" :type="detail.completed ? 'success' : 'warning'" size="small">{{ detail.completed ? '已完成' : '未完成' }}</el-tag><span v-else>—</span></el-descriptions-item>
        <el-descriptions-item label="跟踪人">{{ detail.tracker || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 打分 -->
    <el-dialog v-model="dialogVisible" title="评分打分" width="65%">
      <el-descriptions :column="2" border size="small" style="margin-bottom:14px">
        <el-descriptions-item label="编号">{{ editing?.contentNo || '—' }}</el-descriptions-item>
        <el-descriptions-item label="标准分值">{{ editing?.score ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="考评内容" :span="2">{{ editing?.content }}</el-descriptions-item>
        <el-descriptions-item label="考评办法" :span="2">{{ editing?.method || '—' }}</el-descriptions-item>
      </el-descriptions>
      <el-form :model="form" label-width="110px" size="default">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="实际得分">
              <el-input-number v-model="form.actual" :min="0" :max="editing?.score || 9999" :precision="1" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不涉及">
              <el-switch v-model="form.notApplicable" active-text="不计入考评" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="自评描述">
          <el-input v-model="form.assessmentDesc" type="textarea" :rows="2" placeholder="企业实际执行情况说明" />
        </el-form-item>
        <el-form-item label="扣分说明">
          <el-input v-model="form.deductionReason" type="textarea" :rows="2" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="整改措施">
              <el-input v-model="form.measure" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="跟踪人">
              <el-input v-model="form.tracker" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="整改完成">
              <el-switch v-model="form.completed" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { crudApi } from '../../api'

const api = crudApi('/self-assessment-item')
const BASELINE_YEAR = 2019   // 自评年度; 2019 基线来自 Arconic 标准化自评表

// ===== 数据 =====
const all = ref([])          // 全量评分点(用于本地汇总)
const loading = ref(false)
const saving = ref(false)
const detailVisible = ref(false)
const dialogVisible = ref(false)
const detail = ref({})
const editing = ref(null)
const form = reactive({ actual: 0, notApplicable: false, assessmentDesc: '', deductionReason: '', measure: '', tracker: '', completed: null })
const filters = reactive({ content: '', categoryNo: '', notApplicable: '', completed: '' })
const pagination = reactive({ page: 1, pageSize: 20 })

// 全量拉取本年度评分点(约304条), 过滤与分页都在本地完成
// 注意: 后端 exact 过滤把 query 字符串转成 Prisma `in` 数组,
//       Prisma Boolean 不接受字符串, 所以 notApplicable/completed 不做服务端过滤
async function reload() {
  loading.value = true
  try {
    const res = await api.list({ year: BASELINE_YEAR, page: 1, pageSize: 1000 })
    all.value = res.data || []
    pagination.page = 1
  } catch (e) { } finally { loading.value = false }
}

function resetFilters() {
  Object.keys(filters).forEach(k => filters[k] = '')
  reload()
}

// ===== 汇总 =====
const total = computed(() => sum(all.value.map(r => r.score)))
const actual = computed(() => sum(all.value.filter(r => !r.notApplicable).map(r => r.actual)))
const excluded = computed(() => sum(all.value.filter(r => r.notApplicable).map(r => r.score)))
const scoreCount = computed(() => all.value.filter(r => r.score != null).length)
const denom = computed(() => Math.max(total.value - excluded.value, 0))
const score = computed(() => denom.value ? (actual.value / denom.value * 100).toFixed(1) : '0.0')

const categories = computed(() => {
  const m = new Map()
  for (const r of all.value) if (!m.has(r.categoryNo)) m.set(r.categoryNo, r.category)
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([v, l]) => ({ value: v, label: l }))
})

const catRows = computed(() => {
  const g = new Map()
  for (const r of all.value) {
    if (!g.has(r.categoryNo)) g.set(r.categoryNo, { category: r.category, categoryNo: r.categoryNo, total: 0, actual: 0, points: 0 })
    const o = g.get(r.categoryNo)
    o.total += r.score || 0
    if (!r.notApplicable) o.actual += r.actual || 0
    if (r.score != null) o.points++
  }
  return [...g.values()].sort((a, b) => a.categoryNo - b.categoryNo).map(o => ({
    ...o, actual: round1(o.actual), total: round1(o.total),
    rate: o.total ? (o.actual / o.total * 100).toFixed(1) : '0.0'
  }))
})
const failCats = computed(() => catRows.value.filter(c => parseFloat(c.rate) < 80))

// 本地过滤
const filtered = computed(() => all.value.filter(r => {
  if (filters.content && !(`${r.content}${r.contentNo}${r.itemCode}`.includes(filters.content))) return false
  if (filters.categoryNo && r.categoryNo !== Number(filters.categoryNo)) return false
  if (filters.notApplicable && !r.notApplicable) return false
  if (filters.completed === 'true' && !r.deductionReason) return false
  if (filters.completed === 'false' && r.deductionReason && r.completed) return false
  return true
}))

// 分页切片（数据量小，本地切片）
const pageData = computed(() => {
  const s = (pagination.page - 1) * pagination.pageSize
  return filtered.value.slice(s, s + pagination.pageSize)
})
function render() { pagination.page = 1 }

function sum(arr) { return Math.round(arr.reduce((a, b) => a + (Number(b) || 0), 0) * 10) / 10 }
function round1(n) { return Math.round(n * 10) / 10 }

function viewDetail(row) { detail.value = row; detailVisible.value = true }

function openDialog(row) {
  editing.value = row
  Object.assign(form, {
    actual: row.actual ?? 0,
    notApplicable: !!row.notApplicable,
    assessmentDesc: row.assessmentDesc || '',
    deductionReason: row.deductionReason || '',
    measure: row.measure || '',
    tracker: row.tracker || '',
    completed: row.completed ?? null
  })
  dialogVisible.value = true
}

async function handleSave() {
  saving.value = true
  try {
    await api.update(editing.value.id, { ...form })
    ElMessage.success('评分已保存')
    dialogVisible.value = false
    reload()
  } catch (e) { } finally { saving.value = false }
}

onMounted(reload)
</script>

<style scoped>
.summary-card { margin-bottom: 14px; }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }
.sum-item { background: #f7f9fb; border-radius: 6px; padding: 12px 14px; text-align: center; }
.sum-label { font-size: 12px; color: #909399; margin-bottom: 6px; }
.sum-value { font-size: 22px; font-weight: bold; color: #303133; }
.sum-value.score { color: #1e6d3a; }
.sum-value.score.pass { color: #67c23a; }
.sum-value.warn { color: #e6a23c; }
.sum-value .unit { font-size: 12px; font-weight: normal; color: #909399; margin-left: 2px; }
.sum-hint { font-size: 11px; color: #c0c4cc; margin-top: 2px; }
.cat-card { margin-bottom: 14px; }
.card-head { display: flex; justify-content: space-between; align-items: center; }
.text-warn { color: #e6a23c; font-weight: bold; }
.muted { color: #c0c4cc; }
.search-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; align-items: center; }
.pagination-wrap { margin-top: 14px; display: flex; justify-content: flex-end; }
</style>
