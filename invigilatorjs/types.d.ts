/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2022-11-07 16:06:38
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-08 10:22:33
 */

/**
 * @description: 上报错误信息： 代码错误模型
 */
export interface JsCodeError {
  fileName: '' // 那个文件报错
  fnName: '' // 报错的函数名称
  errorType: '' // 哪种类型的
  line: '' // 错误所在的行
  col: '' // 错误所在的列
  url: '' // 错误所在的页面url，
  msg: '' // 错误的具体信息
  error: '' // 具体的error对象
}
