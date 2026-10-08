import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 开发环境用相对路径（Vite proxy 转发到 3001）
// 生产环境用 VITE_API_BASE_URL（Render 部署时后端和前端不同域名）
const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({ baseURL: apiBase, timeout: 30000 })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ehs_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => {
    const { code, message, data } = res.data
    if (code === 200) return data
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ehs_token')
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(err.response?.data?.message || err.message || '网络错误')
    }
    return Promise.reject(err)
  }
)

export default api

// 通用CRUD helper
export function crudApi(endpoint) {
  return {
    list: (params={}) => api.get(endpoint, { params }),
    get: (id) => api.get(`${endpoint}/${id}`),
    create: (data) => api.post(endpoint, data),
    update: (id, data) => api.put(`${endpoint}/${id}`, data),
    delete: (id) => api.delete(`${endpoint}/${id}`),
  }
}
