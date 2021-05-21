/*
 * @Description: 签到
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-16 13:48:24
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-16 13:48:43
 */

export default {
  /************** 签到 *************/
  getCheckInfo: 'POST::/operation-server/api/userSign/sign', // 签到
  getCheckRuleInfo: '/operation-server/api/userSign/getRule', // 获取签到规则
  getCheckRecord: '/operation-server/api/userSign/getSignRecord', // 获取签到记录
  getCheckRewardInfo: '/operation-server/api/userSign/getUserRuleBaseInfo', // 获取签到奖励信息
}
