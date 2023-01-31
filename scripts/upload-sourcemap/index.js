const { calculateHash, splicingUploadParams, startUpload } = require('./uploadMaxFile')
const { http } = require('./request')

const path = require('path')
const fse = require('fs-extra')
const fs = require('fs')
// 切片大小
const CHUNK_SIZE = 1 * 1024 * 1024

const SOURCEMAP_DIR = path.resolve(__dirname, '../../dist/build/h5/assets')
console.log('sourcemap文件存放路径: ', SOURCEMAP_DIR)

const isHas = fse.existsSync(SOURCEMAP_DIR)
console.log('是否存在该目录：', isHas ? '存在' : '不存在')

// sourcemap文件列表路径数组
let sourcemapFilePathList = []
/**
 * @description: 获取目录下文件,过滤掉隐藏文件
 * @param {*} dirPath
 */
async function getDirFileList(dirPath) {
  return fse.existsSync(dirPath)
    ? (await fse.readdir(dirPath)).filter((name) => name[0] !== '.')
    : []
}

const createFileChunk = (file, size = CHUNK_SIZE) => {
  const chunks = []
  let cur = 0
  const fileSize = file.length //总大小
  const maxLen = Math.ceil(fileSize / size)

  while (cur < maxLen) {
    const start = cur * size
    const end = start + size >= fileSize ? fileSize : start + size
    chunks.push({ index: cur, file: file.slice(start, end) })
    cur++
  }
  return chunks
}

// 1. 判断是否存在该文件目录
// 2. 读取目录下所有后缀.map文件
// 3. 上传文件到服务器
let fileHash = ''
let fileChunks = []
/**
 * @description: 开始切片上传
 */
const upload = async (fileName, filePath) => {
  // 根据文件大小计算切片长度
  let distFile = fs.readFileSync(filePath)
  let largrFile = Buffer.from(distFile)
  const chunksTemp = createFileChunk(largrFile)
  console.log('② 切片长度计算完成：', chunksTemp)

  // 根据切片长度进行切片 、 对整个文件进行hash
  const hash = await calculateHash(chunksTemp)
  fileHash = hash
  console.log('③ 要上传文件hash映射值：', hash)
  // 查询是否上传,或者是否继续断点上传
  http
    .post('/checkfile', {
      hash,
      ext: fileName.split('.').pop()
    })
    .then((res) => {
      if (!res || !res.data) {
        return
      }
      const { uploaded, uploadedList } = res.data
      if (uploaded) {
        console.log('④ 文件已存在，无需上传')
      }
      // 组装上传数据
      const { chunks, requests } = splicingUploadParams(chunksTemp, fileHash, uploadedList)
      // 将拼接后的切片数据赋值给原始数据
      fileChunks = chunks
      // 上传需要上传的切片信息
      uploadChunks(fileName, requests)
    })
}

/**
 * @description: 上传需要上传的切片信息
 * @param {*} requests
 */
const uploadChunks = async (fileName, requests) => {
  console.log('需要上传的切片：', requests)
  // 并发，发送切片请求 3 代表一次并发3个请求上传
  startUpload('/uploadfile', fileChunks, requests, 3).then(() => {
    console.log('所有切片上传完成✅')
    mergeFile(fileName)
  })
}
/**
 * @description: 发送合并请求
 */
const mergeFile = (fileName) => {
  http
    .post('/mergeFile', {
      ext: fileName.split('.').pop(),
      size: CHUNK_SIZE,
      hash: fileHash
    })
    .then((res) => {
      if (res && res.data) {
        console.log(res.data)
      }
    })
}

if (isHas) {
  getDirFileList(SOURCEMAP_DIR).then((res) => {
    res.forEach((name) => {
      if (name.includes('.map') && name.endsWith('.map')) {
        sourcemapFilePathList.push(path.resolve(SOURCEMAP_DIR, name))
        if (sourcemapFilePathList.length === 1) {
          upload(name, path.resolve(SOURCEMAP_DIR, name))
        }
      }
    })
    console.log('sourcemapFilePathList：', sourcemapFilePathList)
  })
}
