<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <h1>永杰集团智慧安全管理系统</h1>
        <p>YongJie Group EHS Management System</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" size="large" :prefix-icon="'User'" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password :prefix-icon="'Lock'" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" @click="handleLogin" style="width:100%">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips">
        <p>默认账号：admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const form = reactive({ username: 'admin', password: 'admin123' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  await formRef.value.validate()
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } finally { loading.value = false }
}
</script>

<style scoped>
.login-page { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e6d3a 0%, #17542c 50%, #0f3d1f 100%); padding: 20px; }
.login-box { width: 400px; max-width: 100%; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.login-header { text-align: center; margin-bottom: 32px; }
.login-header h1 { font-size: 22px; color: #1e6d3a; margin-bottom: 8px; }
.login-header p { font-size: 13px; color: #909399; }
.login-tips { margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; }
.login-tips p { font-size: 12px; color: #909399; margin: 4px 0; }

@media (max-width: 767px) {
  .login-box { width: 100%; padding: 24px 20px; border-radius: 8px; }
  .login-header h1 { font-size: 18px; }
  .login-header p { font-size: 11px; }
}
</style>
