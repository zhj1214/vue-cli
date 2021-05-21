/*
 * @Description: 停车接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-16 13:50:58
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-16 13:51:14
 */

export default {
  /************** 停车 begin *************/
  parkList: '/park-server/api/park/pay/bindCar/list', // 我的停车列表数据
  parkCheckPlate: '/park-server/api/park/pay/info', // 查询车牌
  parkBindPlate: 'POST::/park-server/api/park/pay/bindCar', // 绑定车牌
  parkPay: 'POST::/park-server/api/park/pay/fee', // 缴费数据
  parkPayResult: '/park-server/api/park/pay/result', // 支付结果
  chargingRules: '/park-server/api/park/rule/content', // 收费规则
  parkingRecord: 'POST::/park-server/api/park/record/list', // 停车记录
  getParkingCouponList: `POST::/coupon-server/internal/coupon/optimalParkCoupon`, // 获取最优停车优惠卷/
  /************** 停车 end *************/
}
