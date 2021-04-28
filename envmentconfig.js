/*
 * @Description: 初始化环境配置
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-25 15:17:49
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-26 15:11:12
 */
const fileManager = require('fs')
const mainifest = require('./src/manifest.json')
const tpls = require('./src/ext.json')
const TARGET = process.env.npm_lifecycle_script
const ENVCONFIGURATION = {
  dev: {
    rootAppId: 'wxb3eec682fbe094c5',
    appletAppId: 'wxc91325214d05e6e1',
    rootOgrId: '12226364',
  },
  prod: {
    rootAppId: 'wx2cbaea50336c05a3',
    appletAppId: 'wx61469e9df5790784',
    rootOgrId: '77949820',
  },
  release: {
    rootAppId: 'wxac0ab75d3686b684',
    appletAppId: 'wx3c3abcdafb46f828',
    rootOgrId: '77949820',
  },
}

class envmentFile {
  constructor() {
    this.writeFile()
  }
  /**
   * @description: 写入两个配置内容
   * @author: zhj1214
   */
  writeFile() {
    const current_ENV = TARGET.split('APPLET_ENV=')
    let configExt
    if (current_ENV[1] == 'release') {
      configExt = ENVCONFIGURATION.release
      mainifest['mp-weixin'].appid = ENVCONFIGURATION.release.rootAppId
    } else if (current_ENV[1] == 'development') {
      configExt = ENVCONFIGURATION.dev
      mainifest['mp-weixin'].appid = ENVCONFIGURATION.dev.rootAppId
    } else if (current_ENV[1] == 'prod') {
      configExt = ENVCONFIGURATION.prod
      mainifest['mp-weixin'].appid = ENVCONFIGURATION.prod.rootAppId
    } else {
      configExt = ENVCONFIGURATION.release
      mainifest['mp-weixin'].appid = ENVCONFIGURATION.release.rootAppId
    }
    tpls.extAppid = configExt.appletAppId
    tpls.ext.appId = configExt.appletAppId
    tpls.ext.orgId = configExt.rootOgrId
    tpls.applet_env = current_ENV[1]

    // 把模板信息写入templates.json
    fileManager.writeFile('./src/ext.json', JSON.stringify(tpls), 'utf-8', function (err) {
      if (err) console.error(err)
    })

    fileManager.writeFile(
      './src/manifest.json',
      JSON.stringify(mainifest),
      'utf-8',
      function (err) {
        if (err) console.error(err)
      }
    )
  }
}

new envmentFile()
