/*
 * @Description: 优惠券相关接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:48:32
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-23 10:03:01
 */

export default {
  /************** 优惠券模块 *************/
  countAvailable: 'POST::/coupon-server/internal/coupon/member/countAvailable', // 优惠券数量
  ticketCount: 'POST::/marketing-server/api/remote/activityTicket/count', // 门票数量
  scanReciiveList: '/coupon-server/internal/coupon/scanCodeCouponPage', // 扫码领券列表
  combCouponDetail: '/coupon-server/api/coupon/combination/infoByC', // 组合券详情
  pageList: 'POST::/coupon-server/internal/coupon/member/pageList', // 优惠券列表
  couponDetail: 'POST::/coupon-server/internal/coupon/member/detail', // 优惠券详情
  couponIdDetail: 'POST::/coupon-server/internal/coupon/center/detail', // 优惠券详情
  couponCenterList: 'POST::/coupon-server/internal/coupon/center/list', // 领券中心列表
  recieveCoupon: 'POST::/coupon-server/internal/coupon/center/recieve', // 领券
  writeOffInShop: 'POST::/coupon-server/internal/coupon/writeOffInShop', // 到店核销
  ticketList: 'POST::/marketing-server/api/remote/activityTicket/list', // 门票列表
  ticketDetail: 'POST::/marketing-server/api/remote/activityTicket/get', // 门票详情
  /***************  券码核销 *********************/
  getSubCompany: '/marketing-server/api/remote/writer/writeoff/getSubCompany', //  绑定核销员时获取所属公司
  getWriteOffInfo: 'POST::/coupon-server/internal/coupon/getWriteOffInfo', // 获取核销信息
  writeOffCouponC: 'POST::/coupon-server/internal/coupon/writeOffCouponC', // 扫码核销
  codeSign: 'POST::/coupon-server/internal/coupon/member/codeSign', // 获取codeSign
  ticketInfo: '/marketing-server/api/remote/writer/writeoff/ticket/detail', // 获取门票核销信息
  writeoff: 'POST::/marketing-server/api/remote/writer/writeoff', // 扫码门票核销
  getSignData: '/marketing-server/api/remote/writer/getSignData', // 获取门票codeSign
  saveVerifier: 'POST::/marketing-server/manage/api/writer/save', // 绑定核销员
  queryData: '/mos-order-server/api/exchange/cServer/query', // 根据核销码查询商品
  submitWriteOff: 'POST::/mos-order-server/api/exchange/cServer/submitWriteOff', // 确认核销
}
