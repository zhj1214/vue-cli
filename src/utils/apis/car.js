/*
 * @Description: 购物车、下单接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:40:55
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-15 14:46:17
 */

export default {
  /***************  购物车 *********************/
  carGoodsNum: 'POST::/mos-webchatmall-server/api/shopcart/hengtai/adjust', // 购物车 商品数量调整 除了商品详情页面其他地方加入购物车都调用这个接口
  carList: '/mos-webchatmall-server/api/shopcart/hengtai/list', // 购物车列表
  cartSettlementApply: 'POST::/mos-webchatmall-server/api/shopcart/hengtai/goodsSettlementApply', // 结算申请
  carSettlement: 'POST::/mos-webchatmall-server/api/shopcart/hengtai/goodsSettlementInfo', // 结算页数据
  cartDelete: 'POST::/mos-webchatmall-server/api/shopcart/delete', // 购物车商品删除
  getCartGoddsCount: '/mos-webchatmall-server/api/shopcart/hengtai/cartItemCount', // 获取购物车商品数量
  /***************  下单 *********************/
  shipping: 'POST::/mos-webchatmall-server/api/shopcart/hengtai/calculateExpressFee', // 计算运费接口
}
