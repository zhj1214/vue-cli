/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-01 11:44:49
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-10-29 17:06:47
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import uView from 'uview-ui'
import { publicMixin } from './mixins/public'

Vue.config.productionTip = false // 阻止 vue 在启动时生成生产提示
// uView
Vue.use(uView)
uni.$u.config.unit = 'rpx'
// store
Vue.prototype.$store = store
// mixin
Vue.mixin(publicMixin)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()
