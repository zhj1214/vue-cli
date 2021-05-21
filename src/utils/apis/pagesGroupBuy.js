/*
 * @Description: 拼团接口
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-16 13:52:03
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-16 13:52:52
 */
const groupBuyService = `/groupbuy-server/` // 拼团服务

export default {
  /************** 拼团 begin *************/
  groupBuyList: `POST::${groupBuyService}api/groupbuy/team/page`, // 全部拼团列表
  groupBuyType: `POST::${groupBuyService}api/groupbuy/category/page`, // 全部拼团分类
  groupBuyTeamDetails: `POST::${groupBuyService}api/groupbuy/team/detail`, // 拼团详情
  startGroupBuy: `POST::${groupBuyService}api/groupbuy/team/addMember`, // 开团/新增团员
  addGroupBuyTeam: `POST::${groupBuyService}api/groupbuy/team/add`, // 新增拼团团队
  addGroupBuyMember: `POST::${groupBuyService}api/groupbuy/team/addMember`, // 新增团员
  allGroupBuyGoods: `POST::${groupBuyService}api/groupbuy/category/allListGoods`, // 所用拼团商品
  allGroupBuyList: `POST::${groupBuyService}api/groupbuy/goods/page`, // 拼团商品分页列表
  isNewUser: `/mos-order-server/api/order/cserver/checkFirstOrderByMemberId`, // 是否满足老带新资格
  groupBuyAllDetails: `POST::${groupBuyService}api/groupbuy/rule/detail`,
  /************** 拼团 end *************/
}
