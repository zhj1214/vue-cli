import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

// 使用composition API模式定义store
export const useUserStore = defineStore('useUserStore', () => {
  // 用户信息
  const userInfo = reactive({})
  // 登录状态：这里禁止直接更改登录状态，以为遇到问题不好排查，请统一使用setLoginStatus函数进行修改状态
  const isLogin = ref(false)
  // 改变登录状态：这里禁止直接更改登录状态，以为遇到问题不好排查，请统一使用setLoginStatus函数进行修改状态
  const setLoginStatus = (val: boolean) => {
    isLogin.value = val
  }

  return { userInfo, isLogin, setLoginStatus }
})
