/*
 * @Description: 游戏相关
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-16 13:50:27
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-16 13:50:49
 */

export default {
  /**************游戏模块*************/
  goodsSettlementApply: 'POST::/mos-webchatmall-server/api/shopcart/goodsSettlementApply', // 发起结算申请
  game_commitorder: 'POST::/mos-order-server/api/order/cserver/submitGameOrder', // 游戏实物礼品下单
  game_info: '/game-server/api/internal/game/detail', // 获取游戏信息
  game_member_qualification: '/game-server/api/internal/game/memberGameQualification', // 用户游戏资格信息
  game_my_award: 'POST::/game-server/api/internal/game/memberGameAwardList', // 我的奖品列表
  game_draw_result: '/game-server/api/internal/game/getGameAward', // 游戏结果（转盘小游戏）
  game_award_block: 'POST::/game-server/api/internal/game/presentOrderNotify', // 下单通知回调
}
