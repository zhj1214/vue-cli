/*
 * @Description: api调用模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:34:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-05-21 15:34:15
 */
import http from './http'
import activity from './apis/activity'
import car from './apis/car'
import coupons from './apis/coupons'
import distribution from './apis/distribution' // 分销
import game from './apis/game' // 游戏
import goods from './apis/goods' // 商品详情
import goodsCic from './apis/goodsCic' // 商品分类
import home from './apis/home' // 首页
import intergralGrowth from './apis/intergralGrowth' // 积分成长值、自助积分
import order from './apis/order' // 订单、支付、物流相关
import pagesGroupBuy from './apis/pagesGroupBuy' // 拼团
import park from './apis/park' // 停车
import shop from './apis/shop' // 店铺相关接口
import sign from './apis/sign' // 签到
import userCenter from './apis/userCenter' // 个人中心

const api = {
  ...activity,
  ...car,
  ...coupons,
  ...distribution,
  ...game,
  ...goods,
  ...goodsCic,
  ...home,
  ...intergralGrowth,
  ...order,
  ...pagesGroupBuy,
  ...park,
  ...shop,
  ...sign,
  ...userCenter,
  /************** 错误日志上报 *************/
  errApi: 'errLog/errlogUpload',

  /**
   * 当前请求域名
   * */
  getApiHost() {
    return http.baseURL
  },
  /**
   * api析构
   * */
  destructorApi(key) {
    const apis = this[key].split('::')
    if (apis.length === 1) apis.unshift('GET')
    return {
      url: apis[1],
      method: apis[0],
    }
  },
  /**
   * @description api接口调用
   * @param {Strung} key 接口字段
   * @param {*} options  入参
   * */
  apiRequest(key, options) {
    // console.log(key);
    const { url, method } = this.destructorApi(key)
    return new Promise((resolve, reject) => {
      http.request(url, resolve, reject, options, method, true)
    })
  },
  /**
   * @description 云函数调用
   * @param {Strung} key 接口字段
   * @param {Object} data  入参
   * @param {String} loadingText  loading提示语
   */
  cloudRequest(key, data, loadingText = '请稍等') {
    const apis = this[key].split('/')
    data.createTime = new Date().getTime()
    data.createTimeStr = new Date().Format('YYYY-MM-DD HH:mm:ss')
    return http.cloud(apis, data, loadingText)
  },

  /**
   * @description  获取小程序二维码
   * @param {*} options
   * 老街口 /api/platform/miniQrCodeGenerate
   * 新街口 /api/platform/component/miniQrCodeGenerate
   */
  getWXQrcodeData() {
    return http.baseURL + '/mos-webchatmall-server/api/platform/component/miniQrCodeGenerate'
  },
}
export default api
