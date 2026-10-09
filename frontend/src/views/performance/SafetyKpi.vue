<template>
  <div class="page-container">
    <!-- KPI 录入表单 -->
    <el-card shadow="hover" style="margin-bottom:16px">
      <template #header>
        <span style="font-weight:bold">安全金字塔 KPI 录入</span>
        <el-tag :type="form.year === 2026 ? 'primary' : 'info'" size="small" style="margin-left:12px">
          {{ form.year }}年
        </el-tag>
        <el-button size="small" type="primary" @click="submitForm" :loading="submitting" style="margin-left:auto" class="hidden-mobile">保存</el-button>
      </template>
      <el-form :model="form" label-width="120px" :class="{ 'mobile-form': isMobile }">
        <!-- 基础信息 -->
        <el-row :gutter="16">
          <el-col :xs="24" :sm="8">
            <el-form-item label="年度">
              <el-input-number v-model="form.year" :min="2020" :max="2030" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="月份">
              <el-select v-model="form.month" placeholder="0=年度累计" clearable style="width:100%">
                <el-option label="月度数据" :value="0" />
                <el-option v-for="m in 12" :key="m" :label="m + '月'" :value="m" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="备注">
              <el-input v-model="form.remark" placeholder="备注信息" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">事故层级（上→下递减）</el-divider>

        <!-- Tier 1-4 -->
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="死亡">
              <el-input-number v-model="form.fatalities" :min="0" :max="99" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="损失工作日">
              <el-input-number v-model="form.lostWorkdays" :min="0" :max="999" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="工作受限">
              <el-input-number v-model="form.workRestricted" :min="0" :max="999" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="可记录(医疗/工伤)">
              <el-input-number v-model="form.recordable" :min="0" :max="9999" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Tier 5-8 -->
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="急救箱事故">
              <el-input-number v-model="form.firstAid" :min="0" :max="9999" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="无伤害事故">
              <el-input-number v-model="form.noInjury" :min="0" :max="99999" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="安全观察">
              <el-input-number v-model="form.safetyObs" :min="0" :max="999999" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="STOP">
              <el-input-number v-model="form.stopCount" :min="0" :max="999999" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting" class="hidden-desktop">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 最近记录 -->
    <el-card shadow="hover">
      <template #header>最近录入记录</template>
      <el-table :data="records" stripe style="width:100%" class="kpi-table">
        <el-table-column prop="year" label="年度" width="80" align="center" />
        <el-table-column prop="month" label="月份" width="80" align="center">
          <template #default="{ row }">{{ row.month === 0 ? '年度' : row.month + '月' }}</template>
        </el-table-column>
        <el-table-column prop="fatalities" label="死亡" width="70" align="center" />
        <el-table-column prop="lostWorkdays" label="损失工作日" width="100" align="center" />
        <el-table-column prop="workRestricted" label="工作受限" width="90" align="center" />
        <el-table-column prop="recordable" label="可记录" width="90" align="center" />
        <el-table-column prop="firstAid" label="急救箱" width="80" align="center" />
        <el-table-column prop="noInjury" label="无伤害" width="80" align="center" />
        <el-table-column prop="safetyObs" label="安全观察" width="90" align="center" />
        <el-table-column prop="stopCount" label="STOP" width="80" align="center" />
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="deleteRecord(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../../api'

const isMobile = computed(() => window.innerWidth < 768)
const submitting = ref(false)
const records = ref([])

const form = ref({
  year: new Date().getFullYear(),
  month: 0,
  fatalities: 0,
  lostWorkdays: 0,
  workRestricted: 0,
  recordable: 0,
  firstAid: 0,
  noInjury: 0,
  safetyObs: 0,
  stopCount: 0,
  remark: ''
})

async function submitForm() {
  submitting.value = true
  try {
    await api.post('/safety-kpi', {
      ...form.value,
      year: Number(form.value.year),
      month: Number(form.value.month || 0)
    })
    ElMessage.success('保存成功')
    resetForm()
    loadRecords()
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.value = {
    year: new Date().getFullYear(),
    month: 0,
    fatalities: 0,
    lostWorkdays: 0,
    workRestricted: 0,
    recordable: 0,
    firstAid: 0,
    noInjury: 0,
    safetyObs: 0,
    stopCount: 0,
    remark: ''
  }
}

async function loadRecords() {
  try {
    const res = await api.get('/safety-kpi?page=1&pageSize=20&orderBy=createdAt:desc')
    records.value = res?.data || []
  } catch (e) {
    console.error('load records error', e)
  }
}

async function deleteRecord(row) {
  try {
    await ElMessageBox.confirm('确定删除此条记录？', '提示', { type: 'warning' })
    await api.delete(`/safety-kpi/${row.id}`)
    ElMessage.success('删除成功')
    loadRecords()
  } catch (e) {
    if (e !== 'cancel') console.error('delete error', e)
  }
}

onMounted(loadRecords)
</script>

<style scoped>
.page-container { padding: 16px; }
.mobile-form .el-form-item { margin-bottom: 12px; }
.el-divider { margin: 16px 0; }
.kpi-table :deep(.el-table__body-wrapper) { overflow-x: auto; }
</style>
