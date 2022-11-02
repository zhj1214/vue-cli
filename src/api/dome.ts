/*
 * @Description: 用户、登录、个人中心页面 相关接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:39:48
 * @LastEditors: zhj1214
 * @LastEditTime: 2022-11-02 15:22:00
 */
import { get, post } from '../utils/http/headerConfig'
import { setdomain } from '../utils/http/http-util'

// import request from '../request'
const pointApi = {
  /**************登录*************/
  loginPhone: post('/yhqt-server/wechat-server/api/webchat/registerOrLoginV2'), // 手机号登录
  loginPassword: post('/yhqt-server/wechat-server/api/webchat/loginByAccount'), // 密码登录
  loginPhoneCode: get('/yhqt-server/wechat-server/api/webchat/getSmsCode'), // 获取验证码
  checkloginPhone: post('/yhqt-server/wechat-server/api/webchat/verifyPhone'), // 验证客户手机号
  setloginPassword: post('/yhqt-server/wechat-server/api/webchat/reset/password'), // 设置密码
  testapi: get('/yhqt-server/wechat-server/api/webchat/getSmsCode'),

  /**
   * @description:  测试案例
   */
  getDetil0: post('/api/map/poi/{id}'), // 连接中包含参数
  getDetil1: post('/api/map/poiTypeCount/list'), // 连接中包含参数

  /**
   * @description:  验证客户手机号是否注册 示例
   * @param {*} response 请求结果
   * @param {*} params   请求参数
   * @param {*} resolve 回调函数
   * @author: zhj1214
   */
  checkRegistPhone: get(
    '/yhqt-server/wechat-server/api/webchat/verifyIsRegister',
    (response: any, params: any, resolve: any) => {
      console.log('开始加工请求,拿到入参：', params)
      response.time = '2021-09-05'
      resolve(response)
    }
  ),
  // 回调函数
  getDetil2: get('/api/v1/common/user/oauth-application', (response: any, params: any) => {
    console.log(response, '开始加工请求数据,2222222：', params)
    response.time = '2021-09-051111'
    return response
  }),
  // 无回调函数
  getDetil3: get('/api/v1/authentication/user')
  // 兼容第三方 请求方式
  // getDetil4: params => {
  //   return request({
  //     url: `/web/point/systems/2112456677873165809/detail`,
  //     method: 'get',
  //     domain: 'point-web',
  //     params
  //   })
  // }
}
export default setdomain(pointApi, 'USER')
