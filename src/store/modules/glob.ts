import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
// import { STORAGE, MUTATIONS_TYPE } from '../../../public/constant';

// let configPromiseArray: any = []

export const useGlobStore = defineStore('useGlobStore', () => {
  // 网关配置
  const feConfig = ref(null)
  // 获取网关配置
  const getFeConfig = async () => {
    return new Promise((resolve, reject) => {
      if (feConfig.value) return feConfig
      if (!feConfig.value) {
        try {
          ;(uni as any).$api.getFeConfig().then((res: any) => {
            feConfig.value = res
            resolve(res)
          })

          // configPromiseArray.forEach((resolveFn: any) => {
          //   resolveFn(config)
          // })
          // configPromiseArray = []
        } catch (error) {
          console.error('网关接口报错：', error)
          // reject(error)
        }
      }
      // if (!feConfig.value) {
      //   configPromiseArray.push(resolve)
      // }
    })
  }

  return { getFeConfig }
})
