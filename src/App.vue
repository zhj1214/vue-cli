<script>
  import api from './api'
  import local from './utils/localStorage'
  import toast from './utils/toast'
  import statistics from './utils/sampling/statistics'
  import sampling from './utils/sampling/sampling'
  import util from './utils/util'
  import './utils/base/string'
  import theme from './utils/theme'
  import eventEmitter from './utils/base/EventEmitter.js'
  import canvas from './utils/canvas'
  import scene from './utils/sceneManage'
  import { STORAGE } from '@/utils/constant'
  // import navigation from './utils/base/navrefactor'

  // "fundebug-wxjs": "^1.4.1",
  // var fundebug = require('fundebug-wxjs')

  export default {
    globalData: {
      // fundebug: fundebug,
    },
    onShow: function (options) {
      // console.log(options, '____onShow')
      this.globalData.onShowOptions = options // 存储入口参
    },
    /**
     * 运行介绍
     * 1.加载使用的工具类的模块
     * 2.初始化 所需要使用的模块
     * 3.获取小程序模板配置、并配置rootOrgId
     * 4.调用小程序login、获取openID；检查小程序是否需要更新；保存手机信息
     * 5.小程序逻辑处理
     * 6.是否需要 上报错误日志（默认不需要）
     * */
    onLaunch: function () {
      // console.log(options, '____onLaunch') // 获取本地当前环境变量value
      // this.initFundebug() // 初始化 fundebug

      // this.initCloud(); // 手动初始化 uniCloud

      //  绑定全局属性
      uni.$api = api
      uni.$alert = toast
      uni.$sampling = sampling
      uni.$statistics = statistics
      uni.$util = util
      uni.$theme = theme
      uni.$localStorage = local
      uni.$eventEmitter = eventEmitter
      uni.$scene = scene
      uni.$canvas = canvas
      // 初始化 观察者
      eventEmitter.constructor()
      // 余杭的组织ID
      uni.$localStorage.setItem(STORAGE.ORG_ID, '58265426')
      this.globalData.orgId = '58265426'
      // 获取设备信息
      this.getCurrentIphoneInfo()
      // #ifdef MP-WEIXIN
      this.getThirdpartyConfig() // 小程序 第三方平台，自定义配置
      // #endif
    },
    /**
     * @description: 小程序进入后台
     * @author: zhj1214
     */
    onHide: function () {
      // console.log('App Hide')
    },
    methods: {
      /**
       * @description: 初始化 fundebug
       * @author: zhj1214
       */
      initFundebug() {
        if (process.env.NODE_ENV !== 'production') {
          fundebug.init({
            apikey: 'bc54da06260628ce66655e75364fbc0085580b61ef0fc0d0a764555126d06bb2',
            httpTimeout: 6000,
          })
        }
      },
      /**
       * @description: 初始化 云环境
       * @author: zhj1214
       */
      initCloud() {
        const myCloud = uniCloud.init({
          provider: 'tencent',
          spaceId: 'zhj1214-525887',
          clientSecret: '',
        })
        uni.$uniCloud = myCloud
        this.globalData.isEnableCloud = false
      },
      /**
       * @description: 获取 小程序 第三方授权配置
       * @author: zhj1214
       */
      getThirdpartyConfig() {
        if (uni.getExtConfig) {
          let self = this
          uni.getExtConfig({
            success(res) {
              // console.log(res.extConfig, 'getExtConfig')
              if (res.extConfig) {
                self.globalData.configExt = res.extConfig
                let rootOrgId = ''
                if (res.extConfig.appId) {
                  self.globalData.appletId = res.extConfig.appId
                  local.setItem('appletId', res.extConfig.appId)
                  // self.initCloud()
                  // 配置rootOrgId
                  if (res.extConfig.orgId) {
                    rootOrgId = res.extConfig.orgId
                  }
                }
                self.globalData.rootOrgId = rootOrgId
                local.setItem('rootOrgId', rootOrgId)
                // 获取设备信息
                self.getCurrentIphoneInfo()
              }
            },
          })
        }
      },
      /**
       * 获取手机型号、版本信息
       */
      getCurrentIphoneInfo() {
        let iphoneInfo = uni.getSystemInfoSync()
        // #ifdef MP-WEIXIN
        const accountInfo = uni.getAccountInfoSync()
        iphoneInfo = { ...iphoneInfo, ...accountInfo }
        // #endif
        this.globalData.iphoneInfo = iphoneInfo
        // #ifdef MP-WEIXIN
        //导航高度
        this.globalData.navHeight = iphoneInfo.statusBarHeight + 46
        const version = iphoneInfo.SDKVersion
        if (uni.$util.compareVersion(version, '2.5.2') >= 0) {
          this.iphoneInfo = iphoneInfo // 根据 model 进行判断 手机型号
          if (iphoneInfo.model.search('iPhone X') != -1) {
            this.isIPX = true
          }
          this.dynamicNetWorking().then(() => {
            uni.$alert.showModal('网络异常', '请检查当前网络是否可用')
          })
          this.userLogin()
          this.appIsUptate()
        } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          uni.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
          })
        }
        // #endif
      },
      /**
       * 获取 code、openid
       */
      userLogin() {
        uni.login({
          success: (res) => {
            if (!uni.$localStorage.getItem('userOpenId')) {
              uni.$api
                .apiRequest('getOpenId', {
                  code: res.code,
                })
                .then((res) => {
                  if (res.code === 10000 && res.data.openid) {
                    this.globalData.userOpenId = res.data
                    uni.$localStorage.setItem('userOpenId', res.data.openid)
                  } else {
                    res.data && uni.$alert.showToast(res.data.message)
                  }
                })
            }
          },
        })
      },
      /**
       * 动态监听 网络
       * */
      dynamicNetWorking: function () {
        return new Promise((resolve, reject) => {
          uni.onNetworkStatusChange(function (res) {
            if (res.networkType === 'none' || res.networkType === 'unknown') {
              reject(false)
            } else {
              resolve(true)
            }
          })
        })
      },
      /**
       * 小程序更新操作
       */
      appIsUptate: function () {
        const updateManager = uni.getUpdateManager()
        updateManager.onCheckForUpdate(function () {
          // console.log('版本信息 是否需要更新 ：' + res.hasUpdate) // 请求完新版本信息的回调
        })
        updateManager.onUpdateReady(function () {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，需要重启应用？',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                updateManager.applyUpdate() // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              }
            },
          })
        })
        updateManager.onUpdateFailed(function () {
          uni.$alert.showModal('更新提示', '新版本下载失败') // 新的版本下载失败
        })
      },
    },
  }
</script>

<style lang="scss">
  @import 'uview-ui/index.scss';
  @import '@/style/reset.scss';
</style>
