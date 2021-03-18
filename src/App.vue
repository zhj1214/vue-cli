<script>
import Vue from "vue";
import api from "./utils/api";
import local from "./utils/localStorage";
import toast from "./utils/toast";
import statistics from "./utils/sampling/statistics";
import sampling from "./utils/sampling/sampling";
import util from "./utils/util";
import date from "./utils/h5utils/date";
import theme from "./utils/theme";
import eventEmitter from "./utils/base/EventEmitter.js";
import canvas from "./utils/canvas";
import scene from "./utils/sceneManage";
// import pageR from './utils/base/routePage';

export default {
  globalData: {
    isCurrentClockin: false // 默认没有点亮（多调用一次接口也没事）
  },
  onShow: function(options) {
    console.log(options, "____onShow");
    this.globalData.onShowOptions = options; // 存储入口参
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
  onLaunch: function(options) {
    console.log(options, "____onLaunch"); // 获取本地当前环境变量value
    this.globalData.onLaunchOptions = options;
    this.globalData.pointName = "积分";
    //手动初始化 uniCloud
    // const myCloud = uniCloud.init({
    // 	provider: 'tencent',
    // 	spaceId: 'zhj1214-525887',
    // 	clientSecret: ''
    // });
    this.globalData.isEnableCloud = false;
    //  绑定全局属性
    // uni.$uniCloud = myCloud;
    uni.$api = api;
    uni.$alert = toast;
    uni.$sampling = sampling;
    uni.$statistics = statistics;
    uni.$util = util;
    uni.$theme = theme;
    uni.$localStorage = local;
    uni.$eventEmitter = eventEmitter;
    uni.$scene = scene;
    // 初始化 观察者
    eventEmitter.constructor();
    uni.$canvas = canvas;

    // 第三方平台，自定义配置
    if (uni.getExtConfig) {
      var self = this;
      uni.getExtConfig({
        success(res) {
          // console.log(res.extConfig, 'getExtConfig')
          if (res.extConfig) {
            self.globalData.configExt = res.extConfig;
            let rootOrgId = "";
            if (res.extConfig.appId) {
              self.globalData.appletId = res.extConfig.appId;
              local.setItem("appletId", res.extConfig.appId);
              // self.initCloud()
              // 配置rootOrgId
              if (res.extConfig.orgId) {
                rootOrgId = res.extConfig.orgId;
              }
            }
            self.globalData.rootOrgId = rootOrgId;
            local.setItem("rootOrgId", rootOrgId);
            // 获取设备信息
            self.getCurrentIphoneInfo();
          }
        },
      });
    }
  },
  onHide: function() {
    // console.log('App Hide')
  },
  methods: {
    /**
     * 获取手机型号、版本信息
     */
    getCurrentIphoneInfo() {
      let iphoneInfo = uni.getSystemInfoSync();
      let accountInfo = uni.getAccountInfoSync();
      iphoneInfo = {...iphoneInfo,...accountInfo}
      this.globalData.iphoneInfo = iphoneInfo;
      // #ifdef MP-WEIXIN
      //导航高度
      this.globalData.navHeight = iphoneInfo.statusBarHeight + 46;
      const version = iphoneInfo.SDKVersion;
      if (uni.$util.compareVersion(version, "2.5.2") >= 0) {
        this.iphoneInfo = iphoneInfo; // 根据 model 进行判断 手机型号
        if (iphoneInfo.model.search("iPhone X") != -1) {
          this.isIPX = true;
        }
        this.dynamicNetWorking();
        this.userLogin();
        this.appIsUptate();
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        uni.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        });
      }
      // #endif
    },
    // #ifdef MP-WEIXIN
    /**
     * 获取 code、openid
     */
    userLogin() {
      uni.login({
        success: (res) => {
          // console.log(res, '微信login成功')
          if (!uni.$localStorage.getItem("userOpenId"))
            uni.$api
              .apiRequest("getOpenId", {
                code: res.code,
              })
              .then((res) => {
                if (res.code == 10000 && res.data.openid) {
                  this.globalData.userOpenId = res.data;
                  uni.$localStorage.setItem("userOpenId", res.data.openid);
                } else {
                  res.data && uni.$alert.showToast(res.data.message);
                }
              });
        },
      });
    },
    /**
     * 动态监听 网络
     * */
    dynamicNetWorking: function() {
      var promise = new Promise((resolve, reject) => {
        uni.onNetworkStatusChange(function(res) {
          if (res.networkType == "none" || res.networkType == "unknown") {
            uni.$alert.showModal("网络异常", "请检查当前网络是否可用");
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
      return promise;
    },
    /**
     * 小程序更新操作
     */
    appIsUptate: function() {
      const updateManager = uni.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        // console.log("版本信息 是否需要更新 ：" + res.hasUpdate);
      });
      updateManager.onUpdateReady(function() {
        uni.showModal({
          title: "更新提示",
          content: "新版本已经准备好，需要重启应用？",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
      updateManager.onUpdateFailed(function() {
        // 新的版本下载失败
        uni.$alert.showModal("更新提示", "新版本下载失败");
      });
    },
    // #endif
  },
};
</script>

<style>
/*每个页面公共css */
@import "./style/style.css";
</style>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>
<style lang="less">
@import "./style/custom.less";
</style>
