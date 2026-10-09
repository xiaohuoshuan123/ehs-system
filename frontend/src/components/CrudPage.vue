<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <div class="search-bar" v-if="allSearchFields.length">
      <el-input v-for="sf in allSearchFields.filter(f => f.type !== 'select')" :key="sf.field" v-model="searchParams[sf.field]" :placeholder="sf.label" clearable style="width:200px" @keyup.enter="loadData" />
      <el-select v-for="sf in allSearchFields.filter(f => f.type === 'select')" :key="sf.field" v-model="searchParams[sf.field]" :placeholder="sf.label" clearable style="width:200px" :multiple="Array.isArray(searchParams[sf.field])" collapse-tags @change="loadData">
        <el-option v-for="opt in sf.options" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
      <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon>搜索</el-button>
      <el-button @click="resetSearch"><el-icon><Refresh /></el-icon>重置</el-button>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="openDialog()" v-if="config.canCreate !== false"><el-icon><Plus /></el-icon>新增</el-button>
      <el-button @click="loadData"><el-icon><Refresh /></el-icon>刷新</el-button>
      <el-button @click="handleExport"><el-icon><Download /></el-icon>导出</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" v-loading="loading" border stripe style="width:100%">
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column v-for="col in columns" :key="col.field" :prop="col.field" :label="col.label" :width="col.width" :min-width="col.minWidth || 120" show-overflow-tooltip>
        <template #default="{ row }" v-if="col.type">
          <!-- 状态标签 -->
          <el-tag v-if="col.type === 'tag'" :type="statusMap[col.field]?.[row[col.field]]?.type || 'info'" size="small">{{ statusMap[col.field]?.[row[col.field]]?.label || row[col.field] }}</el-tag>
          <!-- 布尔值 -->
          <el-tag v-else-if="col.type === 'boolean'" :type="row[col.field] ? 'success' : 'info'" size="small">{{ row[col.field] ? '是' : '否' }}</el-tag>
          <!-- 日期 -->
          <span v-else-if="col.type === 'date'">{{ formatDate(row[col.field]) }}</span>
          <!-- 链接 -->
          <el-link v-else-if="col.type === 'link'" type="primary" @click="viewDetail(row)">{{ row[col.field] }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="config.actionsWidth || 200" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewDetail(row)" v-if="config.canView !== false">查看</el-button>
          <el-button link type="warning" @click="openDialog(row)" v-if="config.canEdit !== false">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)" v-if="config.canDelete !== false">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="display:flex;justify-content:flex-end;margin-top:16px">
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @current-change="loadData" @size-change="loadData" />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="650px" destroy-on-close>
      <div class="dialog-form">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
          <el-row :gutter="16">
            <el-col :span="12" v-for="field in formFields" :key="field.field">
              <el-form-item :label="field.label" :prop="field.field">
                <!-- 输入框 -->
                <el-input v-if="!field.type || field.type === 'input'" v-model="formData[field.field]" :placeholder="field.placeholder || field.label" :disabled="field.disabled" />
                <!-- 数字 -->
                <el-input-number v-else-if="field.type === 'number'" v-model="formData[field.field]" style="width:100%" :disabled="field.disabled" />
                <!-- 文本域 -->
                <el-input v-else-if="field.type === 'textarea'" v-model="formData[field.field]" type="textarea" :rows="3" :placeholder="field.placeholder || field.label" />
                <!-- 选择框 -->
                <el-select v-else-if="field.type === 'select'" v-model="formData[field.field]" :placeholder="field.placeholder || '请选择'" style="width:100%">
                  <el-option v-for="opt in field.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <!-- 日期 -->
                <el-date-picker v-else-if="field.type === 'date'" v-model="formData[field.field]" type="date" value-format="YYYY-MM-DD" style="width:100%" :disabled="field.disabled" />
                <!-- 日期时间 -->
                <el-date-picker v-else-if="field.type === 'datetime'" v-model="formData[field.field]" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
                <!-- 级联选择 -->
                <el-cascader v-else-if="field.type === 'cascader'" v-model="formData[field.field]" :options="field.options" style="width:100%" />
                <!-- 开关 -->
                <el-switch v-else-if="field.type === 'switch'" v-model="formData[field.field]" />
                <!-- 上传 -->
                <el-upload v-else-if="field.type === 'upload'" action="/api/upload" :headers="{ Authorization: 'Bearer ' + token }" list-type="text" :show-file-list="false" @success="handleUpload">
                  <el-button size="small">上传文件</el-button>
                </el-upload>
                <el-tag v-if="formData[field.field] && field.type === 'upload'" closable @close="formData[field.field] = ''" size="small">{{ formData[field.field] }}</el-tag>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="详情" width="650px">
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="col in columns" :key="col.field" :label="col.label" :span="col.span || 1">
          <el-tag v-if="col.type === 'tag'" :type="statusMap[col.field]?.[detailData[col.field]]?.type || 'info'" size="small">{{ statusMap[col.field]?.[detailData[col.field]]?.label || detailData[col.field] }}</el-tag>
          <span v-else>{{ col.type === 'date' ? formatDate(detailData[col.field]) : (col.type === 'boolean' ? (detailData[col.field] ? '是' : '否') : detailData[col.field]) }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { crudApi } from '../api'

const props = defineProps({
  config: { type: Object, required: true }
})

const token = localStorage.getItem('ehs_token')
const { config } = props
const api = crudApi(config.endpoint)
const route = useRoute()
const router = useRouter()

// 数据
const loading = ref(false)
const saving = ref(false)
const tableData = ref([])
const total = ref(0)
const pagination = reactive({ page: 1, pageSize: 20 })
const searchParams = reactive({})
const searchFields = computed(() => config.searchFields || [])
const columns = computed(() => config.columns || [])
const formFields = computed(() => config.formFields || [])
// 筛选字段：优先用模块显式配置的 searchFields；未配置时从 formFields 自动派生
// （只取 select / input，日期与多行文本不适合做筛选条件）
const allSearchFields = computed(() => {
  if (searchFields.value.length) return searchFields.value
  const seen = new Set(searchFields.value.map(f => f.field))
  const derived = []
  for (const f of formFields.value) {
    if (seen.has(f.field) || f.disabled) continue
    if (f.field === 'orgId' || f.type === 'textarea' || f.type === 'date'
        || f.type === 'datetime' || f.type === 'number' || f.type === 'switch' || f.type === 'upload' || f.type === 'cascader') continue
    seen.add(f.field)
    derived.push({ field: f.field, label: f.label, type: f.type, options: f.options })
  }
  return derived
})
const formRules = computed(() => config.formRules || {})
const statusMap = computed(() => config.statusMap || {})

// 弹窗
const dialogVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref()
const formData = reactive({})
const detailData = ref({})
const editingId = ref(null)

const dialogTitle = computed(() => editingId.value ? '编辑' : '新增')

function formatDate(d) { return d ? new Date(d).toLocaleString('zh-CN') : '' }

async function loadData(resetPage) {
  loading.value = true
  if (resetPage) pagination.page = 1
  try {
    const params = { ...searchParams, page: pagination.page, pageSize: pagination.pageSize }
    Object.keys(params).forEach(k => { if (params[k] === '' || params[k] === null) delete params[k] })
    const res = await api.list(params)
    tableData.value = res.data || []
    total.value = res.total || 0
  } catch(e) {} finally { loading.value = false }
}

function resetSearch() {
  Object.keys(searchParams).forEach(k => searchParams[k] = '')
  pagination.page = 1
  // 同步清空地址栏筛选参数，避免刷新后条件复活
  router.replace({ path: route.path, query: {} })
  loadData()
}

// 从路由 query 读取预设筛选条件（仪表盘统计卡片跳转进入时带入）
function applyRouteFilters() {
  const valid = new Set(allSearchFields.value.map(f => f.field))
  for (const [k, v] of Object.entries(route.query)) {
    if (v != null && valid.has(k)) {
      // 逗号分隔的多值 → 数组（el-select multiple），其余保持字符串
      searchParams[k] = String(v).includes(',') ? String(v).split(',') : String(v)
    }
  }
}

onMounted(() => {
  applyRouteFilters()
  // URL 显式指定页码时优先（便于后续“下一页”直达场景）
  if (route.query.page) pagination.page = Math.max(1, parseInt(route.query.page) || 1)
  loadData()
})

function openDialog(row) {
  editingId.value = row?.id || null
  Object.keys(formData).forEach(k => delete formData[k])
  if (row) {
    Object.assign(formData, row)
  } else {
    // 初始化表单默认值
    formFields.value.forEach(f => {
      if (f.default !== undefined) formData[f.field] = f.default
      else formData[f.field] = f.type === 'switch' ? false : (f.type === 'number' ? 0 : '')
    })
    // 自动填充 orgId
    if (config.autoOrgId) {
      formData.orgId = JSON.parse(localStorage.getItem('ehs_user') || '{}').orgId
    }
  }
  dialogVisible.value = true
}

function viewDetail(row) {
  detailData.value = row
  detailVisible.value = true
}

async function handleSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (editingId.value) {
      await api.update(editingId.value, { ...formData })
      ElMessage.success('更新成功')
    } else {
      await api.create({ ...formData })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch(e) {} finally { saving.value = false }
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除该记录吗？', '确认删除', { type: 'warning' })
  await api.delete(row.id)
  ElMessage.success('删除成功')
  loadData()
}

function handleUpload(resp) {
  const url = resp.data?.url || resp.data?.fileUrl || ''
  if (url) ElMessage.success('上传成功: ' + url)
}

function handleExport() {
  // 简单导出当前页数据
  const data = tableData.value
  if (!data.length) return ElMessage.warning('无数据可导出')
  const headers = columns.value.map(c => c.label)
  const rows = data.map(r => columns.value.map(c => r[c.field] || ''))
  const csv = '\ufeff' + [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${config.exportName || 'export'}_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
}

</script>

<style scoped>
.page-container { padding: 20px; }
</style>
