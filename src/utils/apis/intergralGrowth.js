/*
 * @Description: 积分、成长值、自助积分
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-16 13:44:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-16 13:47:50
 */

export default {
  /***************  积分成长值 *********************/
  gorwthRelus: '/mos-webchatmall-server/api/wechat/growth/description', // 获取成长值规则
  pointsRelus: '/mos-webchatmall-server/api/wechat/points/description', // 获取积分规则
  pointsDetail: '/mos-webchatmall-server/api/wechat/points/list', // 获取 积分明细
  gorwthDetail: '/mos-webchatmall-server/api/wechat/growth/list', // 获取	成长值 明细
  /***************  自助积分 *********************/
  integralList: 'POST::/ht-offline-order-server/api/receipt/picture/list', // 获取自助积分列表
  integralDetail: '/ht-offline-order-server/api/receipt/picture/detail', // 获取自助积分详情
  integralPhoto: 'POST::/ht-offline-order-server/api/receipt/picture/add', // 拍照积分上传

  /************** 电子小票 *************/
  getReceiptList: 'POST::/ht-offline-order-server/api/order/cServer/list', // 电子小票列表
  getReceiptDetail: '/ht-offline-order-server/api/order/getOrderDetailInfo', // 电子小票详情
}
