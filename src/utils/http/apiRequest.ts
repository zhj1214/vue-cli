/*
 * @Description: api调用模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:34:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-02 17:26:52
 */

import http from './index'
import { generateUrl, dataReorganization } from './http-util'
import { cacheHtttp } from './http-plugin'
import { get } from './headerConfig'
import { DOMAINURL } from '@utils/glob'

let api: any = {
  /************** 网关接口 *************/
  getFeConfig: get(`${DOMAINURL}/fe-hybrid-h5/fe-config.json`),
  /************** 外链 *************/
  mapSearch: 'https://apis.map.qq.com/ws/place/v1/search',
  /************** 云函数 错误日志上报 *************/
  errApi: 'errLog/errlogUpload',

  /**
   * @description api接口调用
   * @param {Strung} key 接口字段
   * @param {*} options  入参
   * */
  apiRequest(key: string, options: any = {}) {
    return new Promise((resolve, reject) => {
      // 1. options字段重组
      const params = dataReorganization(options)
      // 2. 获取请求 url
      const keyValue = this[key]
      // if()
      params.domain_http = keyValue.domain || ''
      let generatorUrl = keyValue.url
      // 2.1 赋值动态地址 例如： web/point/organizations/payment/{id}/detail =>  web/point/organizations/payment/236492372338/detail
      if (generatorUrl.includes('/{')) {
        generatorUrl = generateUrl(generatorUrl, options)
      }

      // 3. 缓存功能
      const { localValue, isHas } = cacheHtttp.getApply(params, key)
      if (isHas) return resolve(localValue)

      // 4. 进入数据加工逻辑
      const resolveGenerator = (response: any, config: any) => {
        // 是否有缓存逻辑
        if (config.cache) uni.$local.setItem(key, response, config.setExpireTime)
        // 加工数据
        if (keyValue.callBack) {
          keyValue.callBack(response, params.data, resolve)
        } else {
          resolve(response)
        }
      }
      // 5. 请求重试 逻辑
      const reject_try = (config: any) => {
        if (config.retry === 0) {
          reject(90000)
        } else {
          options.retry = config.retry - 1
          http.request(generatorUrl, resolveGenerator, reject_try, options)
        }
      }
      // 6. 开始调用请求方法 console.log('url :>> ', generatorUrl )
      http.request(generatorUrl, resolveGenerator, reject_try, params)
    })
  }
  /**
   * @description 云函数调用
   * @param {Strung} key 接口字段
   * @param {Object} data  入参
   * @param {String} loadingText  loading提示语
   */
  // cloudRequest(key, data = {}, loadingText = '请稍等') {
  //   const apis = this[key].split('/')
  //   let cloudBase = wx.cloud
  //   if (!key.includes('WX_')) cloudBase = uni.$uniCloud
  //   data.createTime = new Date().getTime()
  //   data.createTimeStr = new Date().Format('YYYY-MM-DD HH:mm:ss')
  //   return http.cloud(cloudBase, apis, data, loadingText)
  // }
}

/**
 * @description: 合并api文件下的所有接口，如有重名字段则会提示
 * @author: zhj1214
 */

const initApi = () => {
  const files = (import.meta as any).globEager('../../api/*.ts')
  const apiKeys = Object.keys(api)
  Object.keys(files).forEach((fileName) => {
    const obj = files[fileName].default
    // 1. 校验是否存在同名请求定义
    Object.keys(obj).forEach((key) => {
      // 1.1 给每一个配置都增加 domain字段
      if (key !== 'domain' && typeof obj[key] === 'object') {
        obj[key]['domain'] = obj.domain
      }
      // 2. 检测是否有同名字段
      let isHas = false
      apiKeys.forEach((oldKey) => {
        if (oldKey === key) {
          isHas = true
          console.error(`接口api，发现重复字段：${oldKey} 请检查文件后修改。`)
        }
      })
      if (!isHas) apiKeys.push(key)
    })
    api = { ...api, ...obj }
  })
}
initApi()
console.log('暴露出去的api对象:', api)

/**
 * @description: 劫持当前类的get方法
 * @author: zhj1214
 */
export default new Proxy(api, {
  get: function (taget, propkey, receiver) {
    return (options: any) => {
      // 目前接口有两种形式的封装为了兼容函数的封装
      if (Object.prototype.toString.call(propkey) === '[object Function]') {
        return taget.propkey(options)
      } else {
        return taget.apiRequest(propkey, options)
      }
    }
  }
})
