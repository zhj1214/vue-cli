const fs = require('fs')
const path = require('path')
const colors = require('colors-console')
const appIdMap = require('./appid.json')

// 分隔符
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
  // 1. 校验appid配置的环境参数
  if (!appIdMap[platform])
    return console.log(colors('red', 'Error') + SEPARATOR + colors('blue', 'appid.json') + '中不存在平台' + colors('red', platform))
  // 2. 根据环境获取微信小程序appid
  const appid = appIdMap[platform][env]
  // 2.1 根据环境获取地图key
  const mapKey = appIdMap['map'][env]
  // 3. 解析文件manifest
  const jsonFileName = 'manifest.json'
  const jsonFilePath = path.resolve(process.env.INIT_CWD, 'src' + path.sep + jsonFileName)
  let json = getManifestJson(jsonFilePath, jsonFileName)
  // 4. 配置文件参数
  // 4.1 微信不同环境的appid
  json[platform].appid = appid
  // 4.2 微信不同环境的腾讯位置服务KEY
  json[platform].tencentMapKey = mapKey
  // 5. manifest.json写入参数
  const jsonStr = JSON.stringify(json, '', 2) + '\r\n'
  try {
    fs.writeFileSync(jsonFilePath, jsonStr)
    console.log(colors('green', `${jsonFileName} modified success \r\n`))
  } catch (e) {
    console.log(colors('red', `${jsonFileName} modified failed \r\n`))
  }
}

module.exports = modifyManifest
