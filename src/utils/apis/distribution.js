/*
 * @Description: 分销、邀请有礼
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-16 13:49:18
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-16 13:49:44
 */

export default {
  /************** 邀请有礼 *************/
  isExtendSalesMember: 'POST::/distribution-server/api/staff/isStaff', // 是否是分销员
  getInviteRegisterList: 'POST::/distribution-server/api/user/invitation/getRecord', // 邀请注册列表
  getInviteOrderedList: 'POST::/mos-webchatmall-server/api/order/hengtai/distributionOrderList', // 邀请下单列表
  getInviteRuleText: 'POST::/distribution-server/api/ruleActivity/getRule', // 获取邀请规则说明
  getInviteQRCode: 'POST::/distribution-server/api/user/invitation/codeQr', // 获取面对面邀请码
  inviteFailed: 'POST::/distribution-server/api/user/alreadyRegistered', // 邀请失败
  /************** 我的分销 *************/
  getExtendSalesRegisterList: 'POST::/distribution-server/api/staff/invitation/getRecord', // 分销注册列表
  getExtendSalesRuleText: 'POST::/distribution-server/api/ruleActivity/getRule', // 获取分销规则说明
  getExtendSalesQRCode: 'POST::/distribution-server/api/staff/invitation/codeQr', // 获取分销面对面邀请码
  joinExtendSales: 'POST::/distribution-server/api/group/join', // 加入分销团队
  getOrgNameById: '/mos-webchatmall-server/api/user/getOrgInfo', // 根据orgId获取商场名称
}
