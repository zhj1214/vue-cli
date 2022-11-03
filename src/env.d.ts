// / <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'uview-ui'

/* eslint-disable @typescript-eslint/no-explicit-any */
import Jsbridge from './util/flutterBridge'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $flutter: typeof Jsbridge
    _aMap: any
    spBridge: any
    NoCaptcha: any
    [key: string]: any
  }
  // 类型融合,解决对uni的扩展
  interface Uni {
    $api: any
    $util: any
    $local: any
  }
}

export {}
