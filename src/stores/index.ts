// Pinia 状态管理
import { defineStore } from 'pinia'

// 用户状态
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null
  }),
  actions: {
    // 设置用户信息
    setUserInfo(info: any) {
      this.userInfo = info
    }
  }
})

// 系统配置状态
export const useConfigStore = defineStore('config', {
  state: () => ({
    systemConfig: null
  }),
  actions: {
    // 设置系统配置
    setSystemConfig(config: any) {
      this.systemConfig = config
    }
  }
}) 