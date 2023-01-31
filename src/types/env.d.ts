/**
 * vite环境变量智能提示
 * import.meta.env.VUE_APP_ENV
 */
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VUE_APP_ENV: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * 运行平台类型
 */
type PlatformInfo = 'h5' | 'mp-weixin'

/**
 * 运行环境信息
 */
type EnvInfo = 'dev' | 'sit' | 'uat'

// import { ComponentCustomProperties } from '@vue/runtime-core'

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $utils: object // 这里填类型
//   }
// }
// // 必须导出，才能在其他文件中使用
// export default ComponentCustomProperties
