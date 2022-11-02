/*
 * @Description: 请求配置
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-11-01 17:10:16
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-02 15:35:12
 */

// const tpls = require('../../ext.json')
import tool from '../tool/index.js'
import appStore from '@store/index'

/**
 * @description: 根据网关获取请求域名
 * @return {*}
 * @author: zhj1214
 */
// 获取租户key
let domainKey = uni.getStorageSync('currentTenant').tenantId || 'JETOUR'

const getBaseUrl = async (options: any) => {
  // 0. 获取请求参数
  if (!options[3]) return ''
  const params = options[3]
  // 1.
  if (!params.domain_http) return ''
  // 2. 根据-租户key-获取-请求域名网关-数组
  const globFig = await appStore.useGlobStore.getFeConfig()
  !globFig && console.log('getFeConfig请求失败：', globFig)
  if (globFig) {
    const domainConfig = globFig[domainKey]
    // 2.1 未获取到domainConfig数据报错提示
    if (!domainConfig) return console.error('无法获取到联调配置domainConfig')
    // 3. domainHttp转大写
    const domain = params.domain_http.toUpperCase()
    // 4. 返回对应的网关域名
    return domainConfig[domain] || ''
  } else {
    return ''
  }
}

/**
 * @description: 请求扩展属性
 */
const attributesExtended = {
  domain_http: '', // 网关域名
  timeout: 120000, // 超时时间
  loading: true, // 是否显示遮罩层
  retry: 0, // 请求重试次数
  retryDelay: 2000, // 请求重试间隔
  cache: false, // 是否缓存该请求，再次请求时也必须是true
  setExpireTime: 1000 * 60 * 60 * 24 * 30 // 单位毫秒，缓存有效时间1个月
}

export const attributesExtendedKeys = Object.keys(attributesExtended)

/**
 * @description: 默认请求头配置
 * @param {*} config 传入的配置
 */
export const defaultHeaderConfig = async function (config: any, params: any) {
  const header = {
    'content-type': 'application/json'
  }
  // getBaseUrl(params).then((host) => {
  //   console.log('1111111111111111111111111111', host)
  //   return {
  //     baseURL: host || '', // 是否配置请求域名
  //     ...attributesExtended,
  //     header: { ...header, ...config.header }, // 合并 自定义配置
  //     ...config.fig
  //   }
  // })
  const host = await getBaseUrl(params)
  return {
    baseURL: host || '', // 是否配置请求域名
    ...attributesExtended,
    header: { ...header, ...config.header }, // 合并 自定义配置
    ...config.fig
  }
}

/**
 * @description: 支持的请求方式
 */
const method_fn: any = {} // 支持的请求方式
tool.forEach(['get', 'post', 'put'], (method: string) => {
  method_fn[method] = (url: string, callBack: any) => {
    urls[url] = method.toUpperCase() // 全局存key、value形式存储请求地址和请求方式
    return {
      url: url,
      method: method.toUpperCase(),
      callBack: callBack
    }
  }
})

export const urls: any = {} // url与method映射关系
export const get = method_fn.get
export const post = method_fn.post
export const put = method_fn.put
