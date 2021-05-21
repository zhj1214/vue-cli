/*
 * @Description: 用户、个人中心页面 相关接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:39:48
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-15 14:39:48
 */

export default {
  /**************会员模块*************/
  getUserQrcodeStr: 'POST::/mos-webchatmall-server/api/member/memberIdEncode', // 获取二维码加密信息
  getMallInfo: '/mos-webchatmall-server/api/member/getSubInfo', // 获取 商场信息
  getMallInfoUserServer: '/user-server/internal/organization/baseInfoDetail', // 获取 商场信息
  getOpenId: '/mos-webchatmall-server/api/platform/getOpenId', // 获取openId
  getHomeMemberInfo: '/mos-webchatmall-server/api/home/memberInfo', // 获取首页用户信息，该接口允许未登录
  getUserInfo: '/mos-webchatmall-server/api/member/info', // 获取用户信息
  userPhoneLoginCode: 'POST::/mos-webchatmall-server/api/auth/loginNoCode', // 手机号 登录
  userPhoneLogin: 'POST::/mos-webchatmall-server/api/auth/login', // 手机号登录
  getSmsCode: 'POST::/mos-webchatmall-server/api/auth/sendSmsCode', // 获取验证码
  checkSmsCode: 'POST::/mos-webchatmall-server/api/webchat/verifyCode', // 校验验证码
  checkSmsCodeUpPhone: 'POST::/mos-webchatmall-server/api/auth/verifyCode', // 校验验证码
  bindNewPhone: 'POST::/mos-webchatmall-server/api/member/bindNewPhone', // 绑定新手机号
  getUserPhone: 'POST::/mos-webchatmall-server/api/platform/tryGetMemberWechatPhone', //授权获取手机号
  userRegistKey: '/mos-webchatmall-server/api/member/getMemberCenterDetail', // 完善信息
  saveUserInfo: 'POST::/mos-webchatmall-server/api/member/modify', // 会员字段完善
  __v2__changeCityMall: 'POST::/mall-plus-server/api/market/ht/change', // 切换城市
  getMemberGradeLiist: '/mos-webchatmall-server/api/wechat/grade/list', // 会员等级列表
  getCardFaceInfo: '/mos-webchatmall-server/api/member/custom/cardFace/info', // 自定义会员卡面详情
  saveCardFaceInfo: 'POST::/mos-webchatmall-server/api/member/custom/cardFace/edit', // 编辑自定义会员卡面
  cardGradeEnable: '/mos-webchatmall-server/api/wechat/grade/isEnable', // 卡片等级启用
  getLeveName: '/mos-webchatmall-server/api/member/getLevelInfo', // 获取等级卡名称
  getCouponNums: '/mos-webchatmall-server/api/member/getDiscountCouponNum', // 获取会员优惠券 数量
  benefitDetails: '/mos-webchatmall-server/api/wechat/grade/getGradeEquityInfo', // 会员权益详情
  getProblemId: '/operation-server/api/landing/getPageIdByMallId', // 查询当前商场问题反馈ID
  /************** 落地页 *************/
  landPage: '/operation-server/api/landing/getByPageId',
}
