import { createApp } from 'vue'
import uView from './uni_modules/vk-uview-ui'
import { createPinia } from 'pinia'
import { registerStore } from '@store/index'
import App from './App.vue'

const watchOnerror = (app) => {
  const oldErrorHandler = window.onerror
  console.log(
    'window.onerror: 是否已经被重写了?  ',
    oldErrorHandler ? `是${oldErrorHandler}` : '没有'
  )

  // window.onerror = function (msg, url, line, column, error) {
  //   // 收集异常信息并上报
  //   console.log('msg', msg)
  //   console.log('url', url)
  //   console.log('line', line)
  //   console.log('column', column)
  //   console.log('error', error)

  //   // triggerHandlers('error', {
  //   //   column: column,
  //   //   error: error,
  //   //   line: line,
  //   //   msg: msg,
  //   //   url: url
  //   // })
  //   if (oldErrorHandler) {
  //     return oldErrorHandler.apply(this, arguments)
  //   }
  //   return false
  // }

  // const oldOnUnhandledRejectionHandler = window.onunhandledrejection
  // window.onunhandledrejection = function (e) {
  //   console.log('onunhandledrejection:', onunhandledrejection)

  //   // 收集异常信息并上报
  //   // triggerHandlers('unhandledrejection', e)
  //   if (oldOnUnhandledRejectionHandler) {
  //     return oldOnUnhandledRejectionHandler.apply(this, arguments)
  //   }
  //   return true
  // }

  app.config.errorHandler = function (err, instance, info) {
    // 处理错误，例如：报告给一个服务
    console.log('app.config.errorHandler   err:', err)
    console.log('app.config.errorHandler   instance:', instance)
    console.log('app.config.errorHandler   info:', info)
  }
  const fig = app.config
  app.config.globalProperties.$fig = fig

  console.log(' app.config.errorHandler', app.config.errorHandler)
}

const app = createApp(App)
// const fig = app.config
// app.config.globalProperties.$zhj = 1111
// 使用 uView UI
app.use(uView)
// 状态管理
app.use(createPinia())
registerStore() // 注册pinia状态管理库
watchOnerror(app)

app.mount('#app')
