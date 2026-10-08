import { defineStore } from 'pinia'
import api from '../api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('ehs_token') || '',
    userInfo: JSON.parse(localStorage.getItem('ehs_user') || 'null')
  }),
  getters: {
    isLoggedIn: s => !!s.token,
    username: s => s.userInfo?.realName || '',
    orgId: s => s.userInfo?.orgId || ''
  },
  actions: {
    async login(username, password) {
      const res = await api.post('/auth/login', { username, password })
      // api拦截器已解包，res 就是 { token, user }
      this.token = res.token
      this.userInfo = res.user
      localStorage.setItem('ehs_token', res.token)
      localStorage.setItem('ehs_user', JSON.stringify(res.user))
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('ehs_token')
      localStorage.removeItem('ehs_user')
    }
  }
})
