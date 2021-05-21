/*
 * @Description: 商品分类页面接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:44:51
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-15 14:46:38
 */

export default {
  /***************  商品分类 *********************/
  goodsErClassification: '/mos-webchatmall-server/api/sort/details', // 商品分类 二级列表
  __v2__goodsClassification: 'POST::/goods-plus-server/v2/api/goods/category/list', // 商城分类接口
  __v2__goodsReconmendList: 'POST::/goods-plus-server/v2/api/goods/category/recommend/list', // 分类推荐
}
