const fs = require('fs')
const path = require('path')
const colors = require('colors-console')
const appIdMap = require('./appid.json')
const SEPARATOR = ' ---> '

// 解析manifest文件
function getManifestJson(jsonFilePath, jsonFileName) {
  if (!fs.existsSync(jsonFilePath)) {
    throw new Error(jsonFilePath + ' 不存在')
  }
  try {
    return JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
  } catch (e) {
    console.error(jsonFileName + ' 解析失败')
  }
}

// 修改manifest文件
function modifyManifest(platform, env) {
  // 微信appid
  if (!appIdMap[platform]) {
    console.log(colors('red', 'Error') + SEPARATOR + colors('blue', 'appid.json') + '中不存在平台' + colors('red', platform))
    return
  }
  const appid = appIdMap[platform][env]
  const mapKey = appIdMap['map'][env]
  const jsonFileName = 'manifest.json'
  const jsonFilePath = path.resolve(process.env.INIT_CWD, 'src' + path.sep + jsonFileName)
  let json = getManifestJson(jsonFilePath, jsonFileName)

  // 微信不同环境的appid
  json[platform].appid = appid
  // 微信不同环境的腾讯位置服务KEY
  json[platform].tencentMapKey = mapKey

  const jsonStr = JSON.stringify(json, '', 2) + '\r\n'
  try {
    fs.writeFileSync(jsonFilePath, jsonStr)
    console.log(colors('green', `${jsonFileName} modified success \r\n`))
  } catch (e) {
    console.log(colors('red', `${jsonFileName} modified failed \r\n`))
  }

  // 更改友盟的appKey
  const umaName = 'env.json'
  const umaNamePath = path.resolve(process.env.INIT_CWD, 'src/lib/uma/' + umaName)
  const umaJson = getManifestJson(umaNamePath, umaName)
  umaJson['currentEnv'] = env
  const umaJsonStr = JSON.stringify(umaJson, '', 2) + '\r\n'
  try {
    fs.writeFileSync(umaNamePath, umaJsonStr)
    console.log(colors('green', `${umaName} modified success \r\n`))
  } catch (e) {
    console.log(colors('red', `${umaName} modified failed \r\n`))
  }
}

module.exports = modifyManifest
