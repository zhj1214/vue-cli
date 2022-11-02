import { createSSRApp } from 'vue'
import uView from './uni_modules/vk-uview-ui'
import { createPinia } from 'pinia'
import { registerStore } from '@store/index'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  // 使用 uView UI
  app.use(uView)
  // 状态管理
  app.use(createPinia())
  registerStore() // 注册pinia状态管理库
  return {
    app
  }
}
