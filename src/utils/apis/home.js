/*
 * @Description: 首页功能接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-15 14:35:49
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-15 14:35:49
 */

export default {
  /**************首页*************/
  getAdvs: '/operation-server/api/remote/ad/get',
  /**************搜索好物*************/
  __v2__searchGoods: 'POST::/mall-plus-server/api/market/ht/searchFine',
  __v2__addSearchLog: 'POST::/mall-plus-server/api/market/log/addSearchLog',
  __v2__fetchSearchLog: 'POST::/mall-plus-server/api/market/log/getSearchLogList',
  __v2__removeSearchLog: 'POST::/mall-plus-server/api/market/log/deleteSearchLog',
  /***************  注册渠道 *********************/
  channelApi: '/mos-webchatmall-server/api/member/getChannelInfoByUuid', // 从二维码中获取参数
  channelUpdate: 'POST::/mos-webchatmall-server/api/auth/modifyMemberOrgId', // 修改注册渠道
}
