/*
 * @Description: 活动相关接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-16 13:49:55
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-16 13:49:55
 */

export default {
  /***************  活动中心 *********************/
  getgoodsActivityId: '/activity-server/api/mkt/getMarketingByEvent', // 查询相关活动id
  getActivityBannerList: '/operation-server/api/remote/ad/get', // 活动广告位
  getActivityList: 'POST::/marketing-server/api/remote/activity/list', // 活动列表
  getActivityDetail: 'POST::/marketing-server/api/remote/activity/get', // 活动详情
  getPayInfo: 'POST::/marketing-server/api/remote/pay/getPayInfo', // 获取活动支付信息
  getOrderPay: 'POST::/marketing-server/api/remote/pay/orderPay', // 活动支付下单
  getOrderDetail: 'POST::/marketing-server/api/remote/pay/getOrderDetail', // 活动下单结果
}
