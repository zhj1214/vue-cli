/*
 * @Description: 请求插件
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-01 14:38:43
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-02 09:30:05
 */

import { STORAGE } from '../../../public/constant.js'

export const cacheHtttp = {
  // 读取缓存数据
  getApply(options: any, key: string) {
    if (options.cache) {
      try {
        let value = uni.getStorageSync(key)
        value = JSON.parse(value)
        return {
          localValue: value || '',
          isHas: true
        }
      } catch (e) {
        return {
          localValue: '',
          isHas: false
        }
      }
    }
    return {
      localValue: '',
      isHas: false
    }
  },
  // 缓存数据
  setApply(options: any, key: string, expireTime?: number) {
    try {
      uni.setStorageSync(key, JSON.stringify(options))
      if (expireTime) {
        let keyArr = uni.getStorageSync(STORAGE.EXPIRETIMEKEY)
        if (!keyArr) keyArr = []
        keyArr.push({
          key: key,
          expireTime: new Date().getTime() + expireTime
        })
        uni.setStorageSync(STORAGE.EXPIRETIMEKEY, JSON.stringify(keyArr))
      }
    } catch (e) {
      uni.setStorageSync(key, '')
    }
  }
}
