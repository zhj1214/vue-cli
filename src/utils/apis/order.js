/*
 * @Description: 订单相关接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:47:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-13 17:32:56
 */

export const orderServiceName = '/mos-order-server/api/'

export default {
  /***************  订单 *********************/
  commitOrder: 'POST::/mos-order-server/api/order/hengtaiCServer/submitOrder', // 订单可用优惠券
  orderCouponList: 'POST::/coupon-server/internal/coupon/order/aviableHTCoupon', // 订单可用优惠券
  settlementData: '/mos-webchatmall-server/api/shopcart/hengtai/goodsSettlementInfo', //  下单接口
  getlocaltionSever: '/support-server/api/support/area/getAll', //  获取 省市区地区数据
  userAddReceipAdd: 'POST::/mos-webchatmall-server/api/address/add', // 新增 收货地址
  userAddReceipEdit: 'POST::/mos-webchatmall-server/api/address/edit', //  编辑 收货地址
  userReceipList: '/mos-webchatmall-server/api/address/list', // 收货地址列表
  userReceipdetele: 'POST::/mos-webchatmall-server/api/address/delete', // 删除地址
  getOrderHeaderData: '/mos-order-server/api/order/bserver/orderStatusList', // 订单列表header 枚举
  getOrderList: 'POST::/mos-webchatmall-server/api/order/hengtai/list', // 订单列表
  orderChargebackList: '/mos-webchatmall-server/api/order/refundList', // 退单列表
  tabNums: '/mos-order-server/api/order/cserver/getOrderCountToSort', // tab 上徽标数量
  getorderDetail: '/mos-order-server/api/order/cserver/getOrderDetailByOrderNo', // 订单详情
  getConsumerHotline: '/mos-webchatmall-server/api/goods/getCustomerSetting', // 联系客服电话
  orderDetailOperating: 'POST::/mos-order-server/api/order/cserver/operOrder', // 确认收货
  getPayInfoForPay: '/mos-order-server/api/order/cserver/payOrder', // 获取支付用支付信息
  /************** 退单接口 *************/
  getReturnsRequestInfo: '/mos-order-server/api/refund/cserver/queryRefundInfo', // 退款申请页面数据
  returnsRequest: 'POST::/mos-order-server/api/refund/cserver/refMoney', // 提交退货申请
  orderChargeback: '/mos-order-server/api/refund/cserver/getRefundOrderDetailByOrderNo', // 退单详情
  cancelReturnsRequest: '/mos-order-server/api/refund/cserver/cancelRefundMoney', // 取消退款申请
  cancelReturnsGoodsRequest: '/mos-order-server/api/refund/cserver/cancelRefundGoods', // 取消退货申请
  getRefundIntegralInfo: '/mos-order-server/api/refund/cserver/getRefundScoreDetailInfo', // 退款积分信息展示查询
  getNegotiationInfos: '/mos-order-server/api/refund/cserver/getRefundHis', // 退款协商历史接口
  /************** 物流 begin *************/
  getOrderLogisticsInformation: '/logistics-server/api/logistics/track', // 查看具体物流信息
  getwlCompanyList: '/mos-order-server/api/order/bserver/expressCompanyList', // 获取物流公司列表
  commitOrderWLinfo: 'POST::/mos-order-server/api/refund/cserver/sendExpress', // 填写物流信息
  getOrderNewJoinGroupId: `${orderServiceName}order/hengtaiCServer/getGroupIdByOrderId`,
  /************** 物流 end *************/
}
