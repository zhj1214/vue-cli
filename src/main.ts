import { createApp } from 'vue'
import uView from './uni_modules/vk-uview-ui'
import { createPinia } from 'pinia'
import { registerStore } from '@store/index'
import App from './App.vue'
import { initOnerror, setOnunhandledrejection } from '../invigilatorjs/window-error'
import { setVueErrorHandler } from '../invigilatorjs/vue-error'

import TraceKit from 'tracekit'

TraceKit.report.subscribe((errorReport) => {
  const { message, stack } = errorReport || {}
  const img = new Image()
  const obj = {
    message,
    stack: {
      column: stack[0].column,
      line: stack[0].line,
      func: stack[0].func,
      url: stack[0].url
    }
  }
  console.log('2222', stack)

  img.src = 'http://localhost:3000/sourcemap/img?c=' + JSON.stringify(obj)
})

const watchOnerror = (app) => {
  initOnerror(app, TraceKit.report)
  setOnunhandledrejection()
  setVueErrorHandler(app, TraceKit.report)
}

// 初始化实例
const app = createApp(App)
// 绑定全局组件
app.config.globalProperties.$zhj = 1111
// 使用 uView UI
app.use(uView)
// 状态管理
app.use(createPinia())
registerStore() // 注册pinia状态管理库
// 初始化错误捕获
watchOnerror(app)
// 挂载实例
app.mount('#app')
