/*
 * @Description: 初始化环境配置
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-25 15:17:49
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-08-10 11:02:09
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
    proxy_host: 'https://yhqtdev.data4truth.com',
  },
  prod: {
    rootAppId: 'wx2cbaea50336c05a3',
    appletAppId: 'wx61469e9df5790784',
    rootOgrId: '77949820',
    proxy_host: 'https://yhqttest.data4truth.com',
  },
  release: {
    rootAppId: 'wxac0ab75d3686b684',
    appletAppId: 'wx3c3abcdafb46f828',
    rootOgrId: '77949820',
    proxy_host: 'https://yhqtdev.data4truth.com',
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
    let current_ENV = TARGET.split('APPLET_ENV=')[1].split(' --CARRIER=')
    const newArr = current_ENV[1].split(' && ')
    current_ENV.pop()
    current_ENV = current_ENV.concat(newArr)
    if (current_ENV.length === 0) return console.error('envmentconfig.js 没有传入环境参数')
    let configExt
    if (current_ENV[0] === 'release') {
      configExt = ENVCONFIGURATION.release
    } else if (current_ENV[0] === 'development') {
      configExt = ENVCONFIGURATION.dev
    } else if (current_ENV[0] === 'prod') {
      configExt = ENVCONFIGURATION.prod
    } else {
      configExt = ENVCONFIGURATION.release
    }

    // CARRIER 不存在就是小程序
    if (!current_ENV[1]) {
      console.log(current_ENV, '____weixin')
      mainifest['mp-weixin'].appid = configExt.rootAppId
      tpls.extAppid = configExt.appletAppId
      tpls.ext.appId = configExt.appletAppId
      tpls.ext.orgId = configExt.rootOgrId
      tpls.applet_env = current_ENV[0]
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
    } else if (current_ENV[1] === 'H5') {
      console.log(current_ENV, '____H5')
      mainifest.name = '余杭职工竞技场'
      mainifest.h5 = {
        router: {
          mode: 'hash',
          base: '/yhqt-h5-client/',
        },
        devServer: {
          disableHostCheck: true,
          proxy: {
            '/yhqt-server': {
              target: configExt.proxy_host,
              changeOrigin: true,
              pathRewrite: {
                '^/yhqt-server': '/yhqt-server',
              },
              secure: false,
            },
          },
        },
        title: '',
      }
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
}

new envmentFile()
