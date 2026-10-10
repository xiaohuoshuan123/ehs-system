<template>
  <div class="page">
    <el-card shadow="never" class="page-header">
      <div class="ph-left">
        <div class="ph-title">环境因素识别与评价</div>
        <div class="ph-sub">环境管理 — 按 GB/T 24001-2016 (ISO 14001:2015) 6.1.2 实施环境因素识别、评价与重要环境因素控制</div>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top:12px">
      <div style="margin-bottom:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <el-input v-model="filters.factorName" placeholder="环境因素名称" clearable style="width:200px" @keyup.enter="reload" />
        <el-select v-model="filters.emissionType" placeholder="排放类型" clearable style="width:140px">
          <el-option v-for="t in emissionTypes" :key="t.value" :label="t.label" :value="t.value" />
        </el-select>
        <el-select v-model="filters.grade" placeholder="重要程度" clearable style="width:140px">
          <el-option label="重要环境因素" value="major" />
          <el-option label="一般环境因素" value="general" />
        </el-select>
        <el-select v-model="filters.status" placeholder="状态" clearable style="width:120px">
          <el-option label="现行" value="active" />
          <el-option label="已消除" value="eliminated" />
          <el-option label="待评审" value="under_review" />
        </el-select>
        <el-button type="primary" @click="reload">查询</el-button>
        <el-button @click="resetFilters">重置</el-button>
        <div style="flex:1"></div>
        <el-button type="success" @click="openAdd">+ 新增</el-button>
      </div>

      <el-table :data="list" border stripe v-loading="loading" style="width:100%">
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="factorName" label="环境因素" min-width="150" show-overflow-tooltip />
        <el-table-column prop="activity" label="涉及活动/产品/服务" min-width="170" show-overflow-tooltip />
        <el-table-column prop="workUnit" label="作业单元" width="130" show-overflow-tooltip />
        <el-table-column prop="emissionType" label="排放类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ emissionTypeLabel(row.emissionType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="impact" label="环境影响描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="grade" label="重要程度" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.grade === 'major' ? 'danger' : 'info'" size="small">
              {{ row.grade === 'major' ? '重要' : '一般' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="measure" label="应对措施" min-width="180" show-overflow-tooltip />
        <el-table-column prop="responsiblePerson" label="责任人" width="100" align="center" />
        <el-table-column prop="reviewDate" label="评审日期" width="110" align="center">
          <template #default="{ row }">{{ fmtDate(row.reviewDate) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="doDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :total="total" layout="total, prev, pager, next" background @change="reload" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑环境因素' : '新增环境因素'" width="780px" destroy-on-close>
      <el-form :model="form" label-width="140px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="环境因素名称" required>
              <el-input v-model="form.factorName" placeholder="如：废水超标排放、烟尘排放" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属作业单元">
              <el-input v-model="form.workUnit" placeholder="如：熔铸车间、氧化车间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排放类型">
              <el-select v-model="form.emissionType" style="width:100%">
                <el-option v-for="t in emissionTypes" :key="t.value" :label="t.label" :value="t.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重要程度">
              <el-select v-model="form.grade" style="width:100%">
                <el-option label="重要环境因素" value="major" />
                <el-option label="一般环境因素" value="general" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="涉及活动/产品/服务" required>
              <el-input v-model="form.activity" type="textarea" :rows="2" placeholder="如：铝水熔化生产、表面处理、化学品使用" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="环境影响描述" required>
              <el-input v-model="form.impact" type="textarea" :rows="2" placeholder="如：水体污染、大气污染、土壤污染、资源消耗" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="应对措施">
              <el-input v-model="form.measure" type="textarea" :rows="2" placeholder="如：废水处理达标排放、安装除尘设备、固废委托持证单位处置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人">
              <el-input v-model="form.responsiblePerson" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评审日期">
              <el-date-picker v-model="form.reviewDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="form.status" style="width:100%">
                <el-option label="现行" value="active" />
                <el-option label="已消除" value="eliminated" />
                <el-option label="待评审" value="under_review" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { crudApi } from '../../api'

const api = crudApi('/env-factor')

const emissionTypes = [
  { value: 'waste_water', label: '废水' },
  { value: 'exhaust', label: '废气' },
  { value: 'solid_waste', label: '固废' },
  { value: 'noise', label: '噪声' },
  { value: 'soil', label: '土壤' },
  { value: 'energy', label: '能源/资源' },
  { value: 'other', label: '其他' },
]
const emissionTypeLabel = v => (emissionTypes.find(t => t.value === v) || {}).label || v || '—'
const statusLabel = v => ({ active: '现行', eliminated: '已消除', under_review: '待评审' }[v] || v || '—')
const statusType = v => ({ active: 'success', eliminated: 'info', under_review: 'warning' }[v] || '')
const fmtDate = d => d ? String(d).slice(0, 10) : '—'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const filters = reactive({ factorName: '', emissionType: '', grade: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 20 })

async function reload() {
  loading.value = true
  try {
    const res = await api.list({
      page: pagination.page, pageSize: pagination.pageSize,
      ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
    })
    const d = res.data || {}
    list.value = d.list || []
    total.value = d.total || 0
  } finally { loading.value = false }
}

function resetFilters() {
  Object.keys(filters).forEach(k => filters[k] = '')
  pagination.page = 1
  reload()
}

const dialogVisible = ref(false)
const editing = ref(null)
const emptyForm = () => ({ factorName: '', activity: '', workUnit: '', emissionType: 'waste_water', impact: '', grade: 'general', measure: '', responsiblePerson: '', reviewDate: null, status: 'active', remark: '' })
const form = reactive(emptyForm())

function openAdd() { editing.value = null; Object.assign(form, emptyForm()); dialogVisible.value = true }
function openEdit(row) {
  editing.value = row.id
  const copy = { ...form, ...row, reviewDate: row.reviewDate ? String(row.reviewDate).slice(0, 10) : null }
  Object.assign(form, emptyForm(), copy)
  dialogVisible.value = true
}

async function save() {
  if (!form.factorName?.trim() || !form.activity?.trim() || !form.impact?.trim()) {
    return ElMessage.warning('环境因素名称、涉及活动、环境影响描述为必填项')
  }
  try {
    if (editing.value) {
      await api.update(editing.value, { ...form })
      ElMessage.success('已更新')
    } else {
      await api.create({ ...form })
      ElMessage.success('已新增')
    }
    dialogVisible.value = false
    reload()
  } catch (e) {}
}

async function doDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除环境因素「${row.factorName}」？`, '确认', { type: 'warning' })
    await api.delete(row.id)
    ElMessage.success('已删除')
    reload()
  } catch (e) {}
}

onMounted(reload)
</script>

<style scoped>
.page { padding: 4px; }
.page-header { margin-bottom: 12px; }
.ph-title { font-size: 18px; font-weight: 700; }
.ph-sub { font-size: 12px; color: #909399; margin-top: 4px; }
.pagination-wrap { margin-top: 12px; display: flex; justify-content: flex-end; }
</style>
