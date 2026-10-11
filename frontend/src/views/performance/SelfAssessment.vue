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
          <div class="sum-hint">子项续行 {{ subCount }} 条已并入父项</div>
        </div>
        <div class="sum-item">
          <div class="sum-label">已打分</div>
          <div class="sum-value" :class="{ warn: unscored > 0 }">{{ s.itemTotal - unscored }}<span class="unit">/{{ s.itemTotal }}</span></div>
          <div class="sum-hint">待打分 {{ unscored }} 条</div>
        </div>
      </div>
    </el-card>

    <!-- ===== 安全绩效指标 (等级判定条件, 申请评审之日前一年内) ===== -->
    <el-card shadow="never" class="perf-card">
      <div class="perf-head">
        <div class="perf-title">
          <span class="head-title">安全绩效指标</span>
          <el-tag size="small" type="warning">定级条件 · 前一年内</el-tag>
          <span class="perf-tip">等级须「标准化得分」与「安全绩效」同时满足；千分率 = 例数 ÷ 职工人数 × 1000</span>
        </div>
        <div class="perf-grade">
          <el-button v-if="!perfLocked && items.length" size="small" :loading="perfSaving" @click="savePerf">保存安全绩效</el-button>
          <el-tag v-if="grade" :type="gradeType" size="large" effect="dark">
            评定等级：{{ grade.level }}
          </el-tag>
        </div>
      </div>

      <el-row :gutter="14" class="perf-row">
        <el-col :span="4">
          <span class="pf-label">职工平均人数</span>
          <el-input-number v-model="perf.perfEmployees" :min="0" :max="100000" :precision="0"
            :disabled="perfLocked" size="small" controls-position="right" style="width:100%" />
          <span class="pf-unit">人</span>
        </el-col>
        <el-col :span="3">
          <span class="pf-label">死亡人数</span>
          <el-input-number v-model="perf.perfDeaths" :min="0" :max="10000" :precision="0"
            :disabled="perfLocked" size="small" controls-position="right" style="width:100%" />
          <span class="pf-unit">人</span>
        </el-col>
        <el-col :span="3">
          <span class="pf-label">重伤人数</span>
          <el-input-number v-model="perf.perfSeriousInjuries" :min="0" :max="10000" :precision="0"
            :disabled="perfLocked" size="small" controls-position="right" style="width:100%" />
          <span class="pf-unit">人</span>
        </el-col>
        <el-col :span="4">
          <span class="pf-label">职业病发病/新增</span>
          <el-input-number v-model="perf.perfOdCases" :min="0" :max="10000" :precision="0"
            :disabled="perfLocked" size="small" controls-position="right" style="width:100%" />
          <span class="pf-unit">例</span>
        </el-col>
        <el-col :span="4">
          <span class="pf-label">最大事故直接经济损失</span>
          <el-input-number v-model="perf.perfEconLossMax" :min="0" :precision="2"
            :disabled="perfLocked" size="small" controls-position="right" style="width:100%" />
          <span class="pf-unit">万元</span>
        </el-col>
        <el-col :span="6">
          <span class="pf-label">较大及以上事故</span>
          <el-switch v-model="perf.perfMajorAbove" :disabled="perfLocked"
            active-text="有" inactive-text="无" inline-prompt
            style="--el-switch-on-color:#f56c6c" />
          <span class="pf-label" style="margin-left:14px">核对人</span>
          <el-input v-model="perf.perfChecker" :disabled="perfLocked" size="small"
            placeholder="核对人" style="width:100px" />
        </el-col>
      </el-row>

      <!-- 实时算出的千分率 + 各档判定 -->
      <div class="perf-rates">
        <div class="rate-box">
          <span class="pf-label">千人死亡率</span>
          <b>{{ rates.deathRate }}</b>‰
          <span class="rate-lim">一级— · 二级≤0.1 · 三级≤0.3</span>
        </div>
        <div class="rate-box">
          <span class="pf-label">千人重伤率</span>
          <b>{{ rates.injuryRate }}</b>‰
          <span class="rate-lim">一级≤1 · 二级≤3 · 三级≤5</span>
        </div>
        <div class="rate-box">
          <span class="pf-label">职业病发病率</span>
          <b>{{ rates.odIncidence }}</b>‰
          <span class="rate-lim">一级0 · 二级≤1 · 三级≤2</span>
        </div>
        <div class="rate-box">
          <span class="pf-label">经济损失</span>
          <b>{{ perf.perfEconLossMax }}</b>万元
          <span class="rate-lim">一级≤100 · 二级≤300 · 三级≤500</span>
        </div>
      </div>

      <el-alert v-if="grade" :title="grade.reason" :type="gradeType" :closable="false" show-icon class="perf-alert" />
    </el-card>

    <!-- ===== 操作条 ===== -->
    <div class="action-bar">
      <div class="action-left">
        <span class="dirty-tip" v-if="dirty">有 {{ dirty }} 项改动未保存</span>
        <span v-else-if="items.length" class="dirty-tip saved">已全部保存</span>
      </div>
      <div class="action-right">
        <el-button :icon="Download" :loading="exporting" @click="handleExport">导出年度自评报告</el-button>
        <el-button :icon="Refresh" @click="reload">刷新</el-button>
        <el-button v-if="isAdmin && record?.status === 'submitted'" type="success" :loading="saving" @click="handleApprove">审批归档</el-button>
        <el-button :loading="saving" @click="handleSave(false)">暂存</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave(true)">提交自评</el-button>
      </div>
    </div>

    <!-- ===== 打分表格: 内联编辑 =====
         行 = 有分值的评分点; 考评内容里 "(1)~(n)" 列举项已按小节合并进同一条目,
         不再单独成行 (原表里它们是 score 为空的续行, 本身不评分, 只是长句的分支)。 -->
    <el-table :data="pageData" v-loading="loading" border stripe size="small" style="width:100%"
      :row-class-name="rowClass" row-key="id">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="expand-body">
            <div><b>考评类目：</b>{{ row.category }}</div>
            <div><b>考评项目：</b>{{ row.item || '—' }}</div>
            <div><b>考评办法：</b>{{ row.method || '—' }}</div>
            <div v-if="!row.notApplicable"><b>扣分说明：</b>{{ row.deductionReason || '—' }}</div>
            <div v-else><b>不涉及原因：</b>{{ row.deductionReason || row.remark || '—' }}</div>
            <div v-if="row.deductionReason">
              <b>自评/评审描述：</b>{{ row.measure || '—' }}
              <span class="eb"><b>跟踪人：</b>{{ row.tracker || '—' }}</span>
              <span class="eb"><b>整改：</b>{{ row.completed ? '已整改' : '未整改' }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="类目 / 考评项目" width="180">
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

      <!-- 考评内容: 父项标题加粗, 续行合并成的小节段落缩进显示 -->
      <el-table-column label="考评内容" min-width="340">
        <template #default="{ row }">
          <div class="cell-content" :class="{ muted: row.notApplicable }">
            <div v-for="(line, i) in splitLines(row.content)" :key="i"
              :class="{ subline: i > 0 }">{{ line }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 自评/评审描述: 绑定 assessmentDesc (企业实际执行情况说明)。
           注意: measure 是"后续整改措施", 属扣分后的整改跟踪, 不在这里填。
           展开行里仍可查看整改措施全文。 -->
      <el-table-column label="自评/评审描述" min-width="210">
        <template #default="{ row }">
          <el-input v-if="!locked && row.score != null"
            v-model="row.assessmentDesc" placeholder="自评/评审情况说明" type="textarea"
            :rows="2" resize="none" size="small" @input="onEdit" />
          <span v-else :class="{ muted: !row.assessmentDesc }">{{ row.assessmentDesc || '—' }}</span>
        </template>
      </el-table-column>

      <!-- 扣分说明 / 不涉及原因: 放最后一列。
           整改状态与跟踪人内联在下方 —— 它们只在"已扣分/不涉及"时才有意义,
           独立成列的话整列几乎全是空值, 内联更紧凑也更贴近填写顺序。 -->
      <el-table-column label="扣分说明 / 不涉及原因" min-width="230">
        <template #default="{ row }">
          <div class="cell-reason">
            <el-input v-if="!locked && row.score != null && !row.notApplicable && row.actual < (row.score || 0)"
              v-model="row.deductionReason" placeholder="必填：扣分原因" size="small" clearable @input="onEdit" />
            <el-input v-else-if="!locked && row.score != null && row.notApplicable"
              v-model="row.deductionReason" :placeholder="row.remark ? row.remark : '不涉及原因'" size="small" clearable @input="onEdit" />
            <span v-else :class="{ muted: !(row.deductionReason || row.remark) }">{{ row.deductionReason || row.remark || '—' }}</span>

            <!-- 只有已填扣分/不涉及原因的行才需要跟踪整改 -->
            <div v-if="row.deductionReason" class="reason-extra">
              <el-button v-if="!locked" size="small" :type="row.completed ? 'success' : 'warning'"
                @click="row.completed = !row.completed; onEdit()">
                {{ row.completed ? '已整改' : '未整改' }}
              </el-button>
              <el-tag v-else :type="row.completed ? 'success' : 'warning'" size="small">
                {{ row.completed ? '已整改' : '未整改' }}
              </el-tag>
              <el-input v-if="!locked" v-model="row.tracker" placeholder="跟踪人" size="small"
                style="width:86px" @input="onEdit" />
              <span v-else-if="row.tracker" class="tracker">跟踪：{{ row.tracker }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="mergeRows.length"
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
import { Refresh, Download } from '@element-plus/icons-vue'
import api from '../../api'
import { useUserStore } from '../../stores/user'

// 评定等级条件 —— 与后端 backend/src/utils/gradeJudge.js 严格一致。
// 本地复刻的目的: 输入时即时刷新等级, 不必等后端往返。
// 修改口径时必须两边同步, 这是最容易漏掉的坑。
const GRADES = [
  { level: '一级', min: 90, test: p => p.deaths === 0 && p.injuryRate <= 1 && p.econLossMax <= 100 && p.odIncidence === 0 },
  { level: '二级', min: 75, test: p => p.deathRate <= 0.1 && p.injuryRate <= 3 && p.econLossMax <= 300 && p.odIncidence <= 1 },
  { level: '三级', min: 60, test: p => p.deathRate <= 0.3 && p.majorOrAbove === false && p.injuryRate <= 5 && p.econLossMax <= 500 && p.odIncidence <= 2 }
]
// GRADES 按门槛降序, 不达某档门槛只跳过本档(continue), 低门槛档仍要检查。
function judgeLevel(score, perf) {
  const byScore = GRADES.find(g => score >= g.min)
  if (!byScore) return { level: '未达三级', reason: `标准化得分 ${score} 分，未达三级要求（≥60 分）`, perfFilled: false }
  if (!perf) return { level: `得分对应${byScore.level}`, reason: `标准化得分达${byScore.level}门槛；安全绩效未填报，等级须核对安全绩效后确认`, perfFilled: false }
  for (const g of GRADES) {
    if (score < g.min) continue
    if (g.test(perf)) return { level: g.level, reason: `标准化得分 ${score} 分（达${byScore.level}门槛），安全绩效满足${g.level}全部条件`, perfFilled: true }
  }
  return { level: '绩效降级至三级以下', reason: `标准化得分 ${score} 分（达${byScore.level}门槛），但安全绩效不满足任何一档条件；等级须得分与绩效同时满足，需整改后重新自评`, perfFilled: true }
}

const user = useUserStore()
const BASELINE_YEAR = 2019                       // 历史基线年度 (Arconic 2019.8 自评表)
const yearOptions = ref([])                      // 已有数据的年度
const currentYear = new Date().getFullYear()     // 当前自评年度

const loading = ref(false)
const saving = ref(false)
const year = ref(currentYear)
const record = ref(null)                          // 提交记录 (自评人/时间/状态)
const items = ref([])                             // 本年度全部原始评分点 (含续行, 提交用)
const mergeRows = ref([])                         // 合并续行后的评分点 (渲染用)
const page = ref(1)
const pageSize = ref(50)
const pageData = computed(() => {
  const s = (page.value - 1) * pageSize.value
  return mergeRows.value.slice(s, s + pageSize.value)
})
const locked = computed(() => record.value?.status === 'approved')
const subCount = computed(() => items.value.filter(i => i.score == null).length)

// ===== 实时汇总 (口径与后端 computeScore 一致: 不涉及分值从分母排除) =====
const r1 = n => Math.round(n * 10) / 10
const s = reactive({ itemTotal: 0, totalScore: 0, excludedScore: 0, actualScore: 0, score: 0 })
// 只有带分值的行参与计分 (续行 score 为空, 已并入父项展示)
const mainRows = computed(() => items.value.filter(i => i.score != null))
const unscored = computed(() => mainRows.value.filter(i => !i.notApplicable && i.actual == null).length)
// 扣分但未填说明 (提交时校验)
const blankReason = computed(() =>
  mainRows.value.filter(i => !i.notApplicable && i.actual != null && i.actual < (i.score || 0) && !(i.deductionReason || '').trim()).length)

function recalc() {
  let total = 0, ex = 0, actual = 0
  for (const i of mainRows.value) {
    total += i.score
    if (i.notApplicable) ex += i.score
    else if (i.actual != null) actual += i.actual
  }
  const denom = Math.max(total - ex, 0)
  s.itemTotal = mainRows.value.length
  s.totalScore = r1(total); s.excludedScore = r1(ex); s.actualScore = r1(actual)
  s.score = denom ? r1(actual / denom * 100) : 0
}

// ===== 安全绩效 (等级判定条件, 申请评审之日前一年内) =====
// 独立于打分保存: 这些指标常先于打分填报, 走单独端点不被"未打分"校验拦住。
const perfSaving = ref(false)
const perf = reactive({
  perfEmployees: 0, perfDeaths: 0, perfSeriousInjuries: 0,
  perfMajorAbove: false, perfEconLossMax: 0, perfOdCases: 0,
  perfChecker: '', perfCheckDate: null
})
// 锁定条件: 归档后普通用户不可改, 但管理员仍需补填安全绩效(它是定级前提,
// 实际填报常晚于打分); 审批归档只应锁住打分结果本身。
const isAdmin = computed(() => user.userInfo?.username === 'admin')
const perfLocked = computed(() => record.value?.status === 'approved' && !isAdmin)

const r2 = n => Math.round(n * 100) / 100
// 千分率: 职工人数为 0 时不能除零, 视为未填报
const rates = computed(() => {
  const n = Number(perf.perfEmployees) || 0
  if (n <= 0) return { deathRate: '—', injuryRate: '—', odIncidence: '—' }
  return {
    deathRate: r2(Number(perf.perfDeaths || 0) / n * 1000),
    injuryRate: r2(Number(perf.perfSeriousInjuries || 0) / n * 1000),
    odIncidence: r2(Number(perf.perfOdCases || 0) / n * 1000)
  }
})
const perfRaw = computed(() => {
  const n = Number(perf.perfEmployees) || 0
  if (n <= 0) return null
  // 必须带上算好的千分率: GRADES.test 读的是 injuryRate/odIncidence/deathRate
  // (与后端 perfIndicators 的输出字段一致)。若只给原始量, test 里读到的
  // undefined <= 1 恒为 false, 每档都不通过, 等级会被误判成"绩效降级至三级以下"。
  // 同时与上方 rates 用同一份 r2 值, 保证显示与判定口径完全一致
  // (避免看到"4.17 ≤5 通过"但判定用 4.1667 的错觉)。
  const deathRate = r2(Number(perf.perfDeaths || 0) / n * 1000)
  const injuryRate = r2(Number(perf.perfSeriousInjuries || 0) / n * 1000)
  const odIncidence = r2(Number(perf.perfOdCases || 0) / n * 1000)
  return {
    employees: n, deaths: Number(perf.perfDeaths || 0),
    seriousInjuries: Number(perf.perfSeriousInjuries || 0),
    odCases: Number(perf.perfOdCases || 0),
    econLossMax: Number(perf.perfEconLossMax || 0),
    majorOrAbove: !!perf.perfMajorAbove,
    deathRate, injuryRate, odIncidence
  }
})
// 实时判定: 打分变化(recalc 改 s.score)或绩效输入变化都会触发重算
const grade = computed(() => judgeLevel(s.score, perfRaw.value))
const gradeType = computed(() => {
  const g = grade.value.level
  if (g === '一级') return 'success'
  if (g === '二级') return 'primary'
  if (g === '三级') return 'warning'
  return 'info'
})

async function loadPerf() {
  const data = await api.get(`/self-assessment/${year.value}/performance`)
  if (!data) return
  for (const k of ['perfEmployees', 'perfDeaths', 'perfSeriousInjuries', 'perfMajorAbove', 'perfEconLossMax', 'perfOdCases', 'perfChecker', 'perfCheckDate']) {
    perf[k] = data[k] ?? perf[k]
  }
}

async function savePerf() {
  if (perfLocked.value) return ElMessage.warning('已归档的自评表不可修改')
  perfSaving.value = true
  try {
    await api.put(`/self-assessment/${year.value}/performance`, { ...perf })
    ElMessage.success('安全绩效已保存')
  } catch (e) { } finally { perfSaving.value = false }
}

// ===== 未保存改动检测: 按行快照对比 (整表 JSON 太慢且易误报) =====
const snap = ref(new Map())                       // id -> keyOf(row) 的快照
// assessmentDesc = 自评/评审描述(主填写项); measure = 后续整改措施(展开行查看, 不在主表编辑)
const EDIT_FIELDS = ['actual', 'notApplicable', 'deductionReason', 'assessmentDesc', 'completed', 'tracker']
function pick(i) {
  return {
    id: i.id, itemCode: i.itemCode, year: i.year,
    actual: i.notApplicable ? null : i.actual,
    notApplicable: !!i.notApplicable,
    deductionReason: i.deductionReason || '',
    assessmentDesc: i.assessmentDesc || '',
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

// ===== 续行合并 =====
// 原表里 "(1)~(n)" 这类列举项是独立行, score 为空, 本身不评分, 只是父项内容的分支。
// 单独成行时用户既看不出归属又读不顺。这里按"小节"把它们合并回父项内容:
//   新评分点编号 / 类目切换 / 考评项目切换 -> 结束当前小节, 新起一段
// 合并后父项 content 变为多行字符串 (原标题一行, 各小节后续行拼成的段落一行),
// 渲染时按行拆分展示, 视觉与原文一致 (标题 + 缩进的小节列举)。
// 关键: 只改展示层, items.value 原始行一字不动, 提交仍逐行原样回传。
function norm(str) { return String(str || '').replace(/\s+/g, '') }

function mergeItems(rows) {
  const out = []
  let cur = null, curBuf = []
  for (const it of rows) {
    if (it.score != null) {
      // 评分点: 新起一条, 收尾上一条的合并缓冲区
      if (cur) {
        cur.content = joinContent(cur, curBuf)
        out.push(cur)
      }
      cur = it
      curBuf = []
    } else {
      // 续行: 并入最近的父项 (后端已按原表行序返回, 续行一定紧跟父项)
      if (!cur) continue
      // 类目或考评项目切换 -> 说明当前小节已结束, 该续行另起一段
      const newSection = (cur.categoryNo != null && it.categoryNo != null && cur.categoryNo !== it.categoryNo)
        || (norm(cur.item) && norm(it.item) && norm(cur.item) !== norm(it.item))
      if (newSection) curBuf.push({ split: true })
      curBuf.push({ text: it.content })
    }
  }
  if (cur) { cur.content = joinContent(cur, curBuf); out.push(cur) }
  return out
}

// 把续行缓冲区拼成父项的多行 content: 第 1 行是父项原标题, 之后每小节一行
// 缓冲区元素: { split: true } 表示"小节断开, 另起一行"; { text: '...' } 表示续行文字。
// 注意: 不能用 break 作键名 —— break 是 JS 保留字。
function joinContent(parent, buf) {
  const lines = [parent.content]
  let seg = ''
  for (const p of buf) {
    if (p.split) { if (seg) lines.push(seg); seg = '' }
    else seg += p.text
  }
  if (seg) lines.push(seg)
  return lines.join('\n')
}

// 渲染用: 把合并后的 content 拆回行, 首行标题、其余行小节 (视觉区分用样式)
function splitLines(text) {
  return String(text || '').split('\n').filter(l => l.trim() !== '')
}

function buildMerged() {
  mergeRows.value = mergeItems(items.value)
}

function onEdit() { recalc() }

// 切换年度: 重新拉取该年度的记录与评分点
function onYearChange() { reload() }

// 行高亮: 不涉及灰、扣分橙
function rowClass({ row }) {
  if (row.notApplicable) return 'row-na'
  if (row.actual != null && row.actual < (row.score || 0)) return 'row-deduct'
  return ''
}

const fmt = t => t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '—'

// ===== 数据加载 =====
async function reload() {
  loading.value = true
  try {
    const [rec, its, perfData] = await Promise.all([
      api.get('/self-assessment', { params: { year: year.value } }),
      api.get('/self-assessment-item', { params: { year: year.value, pageSize: 400 } }),
      api.get(`/self-assessment/${year.value}/performance`).catch(() => null)
    ])
    record.value = rec
    items.value = (its && its.data) || its || []
    buildMerged()     // 续行并入父项 (依赖后端已按 categoryNo + seq 原表行序返回)
    recalc()
    takeSnapshot()
    page.value = 1
    if (perfData) await loadPerf()
    // 年度下拉: 当前年 + 有数据的年度
    const ys = new Set([currentYear])
    items.value.forEach(i => ys.add(i.year))
    if (rec && rec.year) ys.add(rec.year)
    yearOptions.value = [...ys].sort((a, b) => b - a)
  } catch (e) { } finally { loading.value = false }
}

// ===== 导出年度自评报告 (xlsx) =====
// 用原生 fetch 而非 axios: axios 拦截器会对响应做 JSON 解包(读 res.data.code),
// 对 Blob 会直接抛错, 且 Blob 拿不到 Content-Disposition 的文件名。
const exporting = ref(false)
async function handleExport() {
  if (!items.value.length) return ElMessage.warning('该年度尚未初始化评分点')
  exporting.value = true
  const a = document.createElement('a')
  try {
    const token = localStorage.getItem('ehs_token')
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/self-assessment/export?year=${year.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(txt || `导出失败 (HTTP ${res.status})`)
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    a.href = url
    a.download = `永杰集团${year.value}年度安全生产标准化自评报告.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success('已导出年度自评报告')
  } catch (e) {
    ElMessage.error(e.message || '导出失败，请确认安全绩效已保存后重试')
  } finally { exporting.value = false }
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
    // 提交原始行 (含续行), 续行 score 为空, 后端 computeScore 自动忽略, 不改变计分口径
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
async function handleApprove() {
  // 归档后普通用户不能再改安全绩效, 归档前提醒一次
  if (!perfRaw.value) {
    try {
      await ElMessageBox.confirm(
        '安全绩效指标尚未填报。归档后普通用户不可再改（管理员仍可补填）。等级须「标准化得分」与「安全绩效」同时满足。',
        '归档前提醒', { type: 'warning', confirmButtonText: '仍要归档', cancelButtonText: '先填安全绩效' })
    } catch { return }
  }
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

/* 安全绩效卡 */
.perf-card { margin-bottom: 14px; }
.perf-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.perf-title { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.perf-tip { font-size: 12px; color: #909399; }
.perf-grade { display: flex; align-items: center; gap: 10px; }
.perf-row { margin-bottom: 12px; }
.perf-row .el-col { margin-bottom: 8px; }
.pf-label { display: block; font-size: 12px; color: #909399; margin-bottom: 4px; }
.pf-unit { font-size: 11px; color: #c0c4cc; margin-left: 4px; }
.perf-rates { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.rate-box { background: #f7f9fb; border: 1px solid #ebeef5; border-radius: 6px; padding: 8px 12px; display: flex; align-items: center; gap: 6px; flex: 1; min-width: 190px; }
.rate-box .pf-label { margin: 0; white-space: nowrap; }
.rate-box b { font-size: 15px; color: #303133; }
.rate-lim { font-size: 11px; color: #c0c4cc; margin-left: auto; }
.perf-alert { margin-bottom: 0; }

.action-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
.action-left { font-size: 13px; }
.dirty-tip { color: #e6a23c; font-weight: bold; }
.dirty-tip.saved { color: #67c23a; font-weight: normal; }
.action-right { display: flex; gap: 8px; }

.cell-cat { font-size: 12px; color: #909399; margin-bottom: 2px; }
.cell-no { font-weight: 600; color: #303133; font-size: 12px; line-height: 1.5; }

/* 考评内容列: 必须自动换行。
   关键覆盖 —— Element Plus 的 .el-table .cell 默认 overflow:hidden,
   且单元格内联样式会把 white-space 固定为 nowrap, 导致长内容被裁掉看不全。
   这里解除裁剪 + 允许换行 + 中英混排按词断行, 行高随内容自然撑开。 */
.cell-content { white-space: normal !important; word-break: break-word; overflow: visible; line-height: 1.55; font-size: 12px; }
/* 第 1 行是父项标题 (加粗), 之后各行是合并进来的小节列举段落 */
.cell-content > div:first-child { font-weight: 600; color: #303133; }
.cell-content .subline { color: #606266; padding-left: 8px; border-left: 2px solid #e4e7ed; }

.expand-body { padding: 6px 18px; line-height: 2; font-size: 13px; color: #606266; }
.expand-body .eb { margin-left: 16px; }

.pagination-wrap { margin-top: 14px; display: flex; justify-content: flex-end; }
.text-warn { color: #e6a23c; font-weight: bold; }
.muted { color: #c0c4cc; }
.row-na .cell-content { color: #c0c4cc; }

/* 扣分说明列: 原因输入框 + 下方整改状态/跟踪人 */
.cell-reason .reason-extra {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  margin-top: 4px; padding-left: 8px; border-left: 2px solid #e4e7ed;
}
.cell-reason .tracker { font-size: 12px; color: #909399; }
</style>
