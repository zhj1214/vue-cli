/*
 * @Description: 店铺接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:39:09
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-15 14:39:34
 */

export default {
  /**************店铺*************/
  __v2__fetchStoreGroups: 'POST::/goods-plus-server/v2/api/goods/group/listSpu', // __v2__标识第二版本
  __v2__fetchStoreGroupDetail: 'POST::/goods-plus-server/v2/api/goods/group/detail', // __v2__标识第二版本
  __v2__fetchStoreCoupon: 'POST::/mall-plus-server/api/market/ht/storeCoupon',
  __v2__fetchStoreBaseInfo: 'POST::/mall-plus-server/api/market/org/detail',
  __v2__fetchStoreBrandList: 'POST::/goods-plus-server/v2/api/goods/brand/list',
  __v2__fetchStoreBrandDetail: 'POST::/goods-plus-server/v2/api/goods/brand/detail',
  __v2__fetchStoreGoodsDetail: 'POST::/goods-plus-server/v2/api/goods/sale/detail',
  __v2__fetchStoreGoodsSkus: 'POST::/goods-plus-server/v2/api/goods/sale/skuList',
  __v2__fetchStoreGoodsList: 'POST::/goods-plus-server/v2/api/goods/sale/list',
  fetchDepartmentList: 'POST::/user-server/internal/organization/searchDepartment', // 查询商场下直营店铺数据
}
