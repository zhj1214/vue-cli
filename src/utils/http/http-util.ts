/*
 * @Description: 请求类的工具函数
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-01 14:36:20
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-02 13:48:36
 */

import Tool from '../tool/index.js'
import { attributesExtendedKeys } from './headerConfig'
/**
 * @description: url字段映射
 * @param {*} url 原始url
 * @param {*} data 请求参数
 * @return {*} 返回映射以后的完成url
 * @author: zhj1214
 */
export function generateUrl(url: string, data: any) {
  const keys = Object.keys(data)
  for (const key of keys) {
    url = url.replace(new RegExp('\\{' + key + '\\}', 'g'), data[key])
  }
  return url
}

/**
 * @description: 对传入的请求参数进行重组
 * @param {any} options 请求参数
 * @return {*} 重组后的结果
 * @author: zhj1214
 */
export function dataReorganization(options: any) {
  const newObj: any = {
    data: {}
  }
  if (options) {
    Tool.forEach(attributesExtendedKeys, (key: string) => {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        newObj[key] = options[key] || ''
        delete options[key]
      }
    })
    newObj.data = Tool.copyDeep(options)
  }

  return newObj
}

/**
 * @description: 设置请求网关key
 * @param {*} val
 * @param {*} domain
 */
export const setdomain = (val: any, domain: string) => {
  val['domain'] = domain
  return val
}

/**
 * @description: 自定义插件回调类
 */
class MyHook {
  hooks: any = {
    tap: [],
    tapPromise: []
  }
  onHooks(name: string, callback: any) {
    if (this.hooks[name]) {
      this.hooks[name].push(callback)
    }
  }
  call(...args: any) {
    this.hooks.tap.forEach((callback: any) => {
      callback(args)
    })
  }
  callPromise(...args: any) {
    this.hooks.tapPromise.forEach((callback: any) => {
      callback(args)
    })
  }
}
export const apiHook = new MyHook()
