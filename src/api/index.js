/*
 * @Description: api调用模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:34:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-27 16:58:18
 */
import http from '../utils/http'
import userCenter from './user' // 个人中心

const api = {
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
    let apis = ''
    if (this[key] && typeof this[key] === 'string') {
      apis = this[key].split('::')
    } else if (this[key] && typeof this[key] === 'function') {
      apis = this[key]().split('::')
    }

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
    const { url, method } = this.destructorApi(key)
    return new Promise((resolve, reject) => {
      http.request(
        url,
        (data) =>
          typeof this[key] === 'function' ? this[key](data, options, resolve) : resolve(data),
        reject,
        options,
        method,
        true
      )
    })
  },
  /**
   * test
   * @param {*} param0
   * @returns
   */
  apiRequestFun({ url, options, method }) {
    return new Promise((resolve, reject) => {
      http.request(url, (data) => resolve(data), reject, options, method, true)
    })
  },
  /**
   * @description 云函数调用
   * @param {Strung} key 接口字段
   * @param {Object} data  入参
   * @param {String} loadingText  loading提示语
   */
  cloudRequest(key, data = {}, loadingText = '请稍等') {
    const apis = this[key].split('/')
    var cloudBase = wx.cloud
    if (!key.includes('WX_')) cloudBase = uni.$uniCloud
    data.createTime = new Date().getTime()
    data.createTimeStr = new Date().Format('YYYY-MM-DD HH:mm:ss')
    return http.cloud(cloudBase, apis, data, loadingText)
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
