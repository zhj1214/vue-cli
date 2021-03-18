import http from "./axios";
import { request, cloud } from "./http";
const api = {
  /**************首页*************/
  getAdvs: "/operation-server/api/remote/ad/get",
  /**************搜索好物*************/
  __v2__searchGoods: "POST::/mall-plus-server/api/market/ht/searchFine",
  __v2__addSearchLog: "POST::/mall-plus-server/api/market/log/addSearchLog",
  __v2__fetchSearchLog:
    "POST::/mall-plus-server/api/market/log/getSearchLogList",
  __v2__removeSearchLog:
    "POST::/mall-plus-server/api/market/log/deleteSearchLog",
  /**************店铺*************/
  __v2__fetchStoreGroups: "POST::/goods-plus-server/v2/api/goods/group/listSpu", // __v2__标识第二版本
  __v2__fetchStoreGroupDetail:
    "POST::/goods-plus-server/v2/api/goods/group/detail", // __v2__标识第二版本
  __v2__fetchStoreCoupon: "POST::/mall-plus-server/api/market/ht/storeCoupon",
  __v2__fetchStoreBaseInfo: "POST::/mall-plus-server/api/market/org/detail",
  __v2__fetchStoreBrandList: "POST::/goods-plus-server/v2/api/goods/brand/list",
  __v2__fetchStoreBrandDetail:
    "POST::/goods-plus-server/v2/api/goods/brand/detail",
  __v2__fetchStoreGoodsDetail:
    "POST::/goods-plus-server/v2/api/goods/sale/detail",
  __v2__fetchStoreGoodsSkus:
    "POST::/goods-plus-server/v2/api/goods/sale/skuList",
  __v2__fetchStoreGoodsList: "POST::/goods-plus-server/v2/api/goods/sale/list",
  fetchDepartmentList:
    "POST::/user-server/internal/organization/searchDepartment", // 查询商场下直营店铺数据
  /********* 分享商品的二维码 ********/
  addGoodsSharePram: "/mos-webchatmall-server/api/goods/share/add",
  __v2__addGoodsSharePram: "/goods-plus-server/v2/api/goods/share/add",
  getGoodsSharePram: "/mos-webchatmall-server/api/goods/share/get",
  __v2__getGoodsSharePram: "/goods-plus-server/v2/api/goods/share/detail",
  /**************会员模块*************/
  getUserQrcodeStr: "POST::/mos-webchatmall-server/api/member/memberIdEncode", // 获取二维码加密信息
  getMallInfo: "/mos-webchatmall-server/api/member/getSubInfo", // 获取 商场信息
  getMallInfoUserServer: "/user-server/internal/organization/baseInfoDetail", // 获取 商场信息
  getOpenId: "/mos-webchatmall-server/api/platform/getOpenId", // 获取openId
  getHomeMemberInfo: "/mos-webchatmall-server/api/home/memberInfo", // 获取首页用户信息，该接口允许未登录
  getUserInfo: "/mos-webchatmall-server/api/member/info", // 获取用户信息
  userPhoneLoginCode: "POST::/mos-webchatmall-server/api/auth/loginNoCode", // 手机号 登录
  userPhoneLogin: "POST::/mos-webchatmall-server/api/auth/login", // 手机号登录
  getSmsCode: "POST::/mos-webchatmall-server/api/auth/sendSmsCode", // 获取验证码
  checkSmsCode: "POST::/mos-webchatmall-server/api/webchat/verifyCode", // 校验验证码
  checkSmsCodeUpPhone: "POST::/mos-webchatmall-server/api/auth/verifyCode", // 校验验证码
  bindNewPhone: "POST::/mos-webchatmall-server/api/member/bindNewPhone", // 绑定新手机号
  getUserPhone:
    "POST::/mos-webchatmall-server/api/platform/tryGetMemberWechatPhone", //授权获取手机号
  userRegistKey: "/mos-webchatmall-server/api/member/getMemberCenterDetail", // 完善信息
  saveUserInfo: "POST::/mos-webchatmall-server/api/member/modify", // 会员字段完善
  __v2__changeCityMall: "POST::/mall-plus-server/api/market/ht/change", // 切换城市
  getMemberGradeLiist: "/mos-webchatmall-server/api/wechat/grade/list", // 会员等级列表
  getCardFaceInfo: "/mos-webchatmall-server/api/member/custom/cardFace/info", // 自定义会员卡面详情
  saveCardFaceInfo:
    "POST::/mos-webchatmall-server/api/member/custom/cardFace/edit", // 编辑自定义会员卡面
  cardGradeEnable: "/mos-webchatmall-server/api/wechat/grade/isEnable", // 卡片等级启用
  getLeveName: "/mos-webchatmall-server/api/member/getLevelInfo", // 获取等级卡名称
  getCouponNums: "/mos-webchatmall-server/api/member/getDiscountCouponNum", // 获取会员优惠券 数量
  benefitDetails: "/mos-webchatmall-server/api/wechat/grade/getGradeEquityInfo", // 会员权益详情
  getProblemId: "/operation-server/api/landing/getPageIdByMallId", // 查询当前商场问题反馈ID
  /***************  商城接口 *********************/
  goodsErClassification: "/mos-webchatmall-server/api/sort/details", // 商品分类 二级列表
  __v2__goodsClassification:
    "POST::/goods-plus-server/v2/api/goods/category/list", // 商城分类接口
  __v2__goodsReconmendList:
    "POST::/goods-plus-server/v2/api/goods/category/recommend/list", // 分类推荐
  carGoodsNum: "POST::/mos-webchatmall-server/api/shopcart/hengtai/adjust", // 购物车 商品数量调整 除了商品详情页面其他地方加入购物车都调用这个接口
  shipping:
    "POST::/mos-webchatmall-server/api/shopcart/hengtai/calculateExpressFee", // 计算运费接口
  commitOrder: "POST::/mos-order-server/api/order/hengtaiCServer/submitOrder", // 订单可用优惠券
  orderCouponList: "POST::/coupon-server/internal/coupon/order/aviableHTCoupon", // 订单可用优惠券
  /***************  注册渠道 *********************/
  channelApi: "/mos-webchatmall-server/api/member/getChannelInfoByUuid", // 从二维码中获取参数
  channelUpdate: "POST::/mos-webchatmall-server/api/auth/modifyMemberOrgId", // 修改注册渠道
  /***************  积分成长值 *********************/
  gorwthRelus: "/mos-webchatmall-server/api/wechat/growth/description", // 获取成长值规则
  pointsRelus: "/mos-webchatmall-server/api/wechat/points/description", // 获取积分规则
  pointsDetail: "/mos-webchatmall-server/api/wechat/points/list", // 获取 积分明细
  gorwthDetail: "/mos-webchatmall-server/api/wechat/growth/list", // 获取	成长值 明细
  /***************  自助积分 *********************/
  integralList: "POST::/ht-offline-order-server/api/receipt/picture/list", // 获取自助积分列表
  integralDetail: "/ht-offline-order-server/api/receipt/picture/detail", // 获取自助积分详情
  integralPhoto: "POST::/ht-offline-order-server/api/receipt/picture/add", // 拍照积分上传
  /***************  购物车 *********************/
  carList: "/mos-webchatmall-server/api/shopcart/hengtai/list", // 购物车列表
  cartSettlementApply:
    "POST::/mos-webchatmall-server/api/shopcart/hengtai/goodsSettlementApply", // 结算申请
  carSettlement:
    "POST::/mos-webchatmall-server/api/shopcart/hengtai/goodsSettlementInfo", // 结算页数据
  cartDelete: "POST::/mos-webchatmall-server/api/shopcart/delete", // 购物车商品删除
  getCartGoddsCount:
    "/mos-webchatmall-server/api/shopcart/hengtai/cartItemCount", // 获取购物车商品数量
  /***************  订单 *********************/
  settlementData:
    "/mos-webchatmall-server/api/shopcart/hengtai/goodsSettlementInfo", //  下单接口
  getlocaltionSever: "/support-server/api/support/area/getAll", //  获取 省市区地区数据
  userAddReceipAdd: "POST::/mos-webchatmall-server/api/address/add", // 新增 收货地址
  userAddReceipEdit: "POST::/mos-webchatmall-server/api/address/edit", //  编辑 收货地址
  userReceipList: "/mos-webchatmall-server/api/address/list", // 收货地址列表
  userReceipdetele: "POST::/mos-webchatmall-server/api/address/delete", // 删除地址
  getOrderHeaderData: "/mos-order-server/api/order/bserver/orderStatusList", // 订单列表header 枚举
  getOrderList: "POST::/mos-webchatmall-server/api/order/hengtai/list", // 订单列表
  orderChargebackList: "/mos-webchatmall-server/api/order/refundList", // 退单列表
  tabNums: "/mos-order-server/api/order/cserver/getOrderCountToSort", // tab 上徽标数量
  getorderDetail: "/mos-order-server/api/order/cserver/getOrderDetailByOrderNo", // 订单详情
  getConsumerHotline: "/mos-webchatmall-server/api/goods/getCustomerSetting", // 联系客服电话
  orderDetailOperating: "POST::/mos-order-server/api/order/cserver/operOrder", // 确认收货
  getNegotiationInfos: "/mos-order-server/api/refund/cserver/getRefundHis", // 获取协商历史信息
  getPayInfoForPay: "/mos-order-server/api/order/cserver/payOrder", // 获取支付用支付信息
  /************** 物流 *************/
  getOrderLogisticsInformation: "/logistics-server/api/logistics/track", // 查看具体物流信息
  /************** 电子小票 *************/
  getReceiptList: "POST::/ht-offline-order-server/api/order/cServer/list", // 电子小票列表
  getReceiptDetail: "/ht-offline-order-server/api/order/getOrderDetailInfo", // 电子小票详情
  /************** 签到 *************/
  getCheckInfo: "POST::/operation-server/api/userSign/sign", // 签到
  getCheckRuleInfo: "/operation-server/api/userSign/getRule", // 获取签到规则
  getCheckRecord: "/operation-server/api/userSign/getSignRecord", // 获取签到记录
  getCheckRewardInfo: "/operation-server/api/userSign/getUserRuleBaseInfo", // 获取签到奖励信息
  /************** 退单接口 *************/
  getReturnsRequestInfo: "/mos-order-server/api/refund/cserver/queryRefundInfo", // 退款申请页面数据
  returnsRequest: "POST::/mos-order-server/api/refund/cserver/refMoney", // 提交退货申请
  orderChargeback:
    "/mos-order-server/api/refund/cserver/getRefundOrderDetailByOrderNo", // 退单详情
  cancelReturnsRequest:
    "/mos-order-server/api/refund/cserver/cancelRefundMoney", // 取消退款申请
  cancelReturnsGoodsRequest:
    "/mos-order-server/api/refund/cserver/cancelRefundGoods", // 取消退货申请
  getRefundIntegralInfo:
    "/mos-order-server/api/refund/cserver/getRefundScoreDetailInfo", // 退款积分信息展示查询
  getNegotiationInfos: "/mos-order-server/api/refund/cserver/getRefundHis", // 退款协商历史接口
  /************** 优惠券模块 *************/
  countAvailable: "POST::/coupon-server/internal/coupon/member/countAvailable", // 优惠券数量
  ticketCount: "POST::/marketing-server/api/remote/activityTicket/count", // 门票数量
  pageList: "POST::/coupon-server/internal/coupon/member/pageList", // 优惠券列表
  couponDetail: "POST::/coupon-server/internal/coupon/member/detail", // 优惠券详情
  couponIdDetail: "POST::/coupon-server/internal/coupon/center/detail", // 优惠券详情
  couponCenterList: "POST::/coupon-server/internal/coupon/center/list", // 领券中心列表
  recieveCoupon: "POST::/coupon-server/internal/coupon/center/recieve", // 领券
  writeOffInShop: "POST::/coupon-server/internal/coupon/writeOffInShop", // 到店核销
  ticketList: "POST::/marketing-server/api/remote/activityTicket/list", // 门票列表
  ticketDetail: "POST::/marketing-server/api/remote/activityTicket/get", // 门票详情
  saveVerifier: "POST::/marketing-server/manage/api/writer/save", // 绑定核销员
  getSubCompany: "/marketing-server/api/remote/writer/writeoff/getSubCompany", //  绑定核销员时获取所属公司
  getWriteOffInfo: "POST::/coupon-server/internal/coupon/getWriteOffInfo", // 获取核销信息
  writeOffCouponC: "POST::/coupon-server/internal/coupon/writeOffCouponC", // 扫码核销
  codeSign: "POST::/coupon-server/internal/coupon/member/codeSign", // 获取codeSign
  ticketInfo: "/marketing-server/api/remote/writer/writeoff/ticket/detail", // 获取门票核销信息
  writeoff: "POST::/marketing-server/api/remote/writer/writeoff", // 扫码门票核销
  getSignData: "/marketing-server/api/remote/writer/getSignData", // 获取门票codeSign
  /************** 券码核销 *************/
  queryData: "/mos-order-server/api/exchange/cServer/query", // 根据核销码查询商品
  submitWriteOff: "mos-order-server/api/exchange/cServer/submitWriteOff", // 确认核销
  /***************  活动中心 *********************/
  getActivityBannerList: "/operation-server/api/remote/ad/get", // 活动广告位
  getActivityList: "POST::/marketing-server/api/remote/activity/list", // 活动列表
  getActivityDetail: "POST::/marketing-server/api/remote/activity/get", // 活动详情
  getPayInfo: "POST::/marketing-server/api/remote/pay/getPayInfo", // 获取活动支付信息
  getOrderPay: "POST::/marketing-server/api/remote/pay/orderPay", // 活动支付下单
  getOrderDetail: "POST::/marketing-server/api/remote/pay/getOrderDetail", // 活动下单结果
  queryData: "/mos-order-server/api/exchange/cServer/query", // 根据核销码查询商品
  submitWriteOff: "POST::/mos-order-server/api/exchange/cServer/submitWriteOff", // 确认核销
  /**************游戏模块*************/
  goodsSettlementApply:
    "POST::/mos-webchatmall-server/api/shopcart/goodsSettlementApply", // 发起结算申请
  game_commitorder: "POST::/mos-order-server/api/order/cserver/submitGameOrder", // 游戏实物礼品下单
  game_info: "/game-server/api/internal/game/detail", // 获取游戏信息
  game_member_qualification:
    "/game-server/api/internal/game/memberGameQualification", // 用户游戏资格信息
  game_my_award: "POST::/game-server/api/internal/game/memberGameAwardList", // 我的奖品列表
  game_draw_result: "/game-server/api/internal/game/getGameAward", // 游戏结果（转盘小游戏）
  game_award_block: "POST::/game-server/api/internal/game/presentOrderNotify", // 下单通知回调
  /************** 落地页 *************/
  landPage: "/operation-server/api/landing/getByPageId",
  /************** 错误日志上报 *************/
  cctvApi: "cctv-errLog/errlogUpload", // 意见收集
  /************** 物流 begin *************/
  getwlCompanyList: "/mos-order-server/api/order/bserver/expressCompanyList", // 获取物流公司列表
  commitOrderWLinfo: "POST::/mos-order-server/api/refund/cserver/sendExpress", // 填写物流信息
  /************** 物流 end *************/
  /************** 停车 begin *************/
  parkList: "/park-server/api/park/pay/bindCar/list", // 我的停车列表数据
  parkCheckPlate: "/park-server/api/park/pay/info", // 查询车牌
  parkBindPlate: "POST::/park-server/api/park/pay/bindCar", // 绑定车牌
  parkPay: "POST::/park-server/api/park/pay/fee", // 缴费数据
  parkPayResult: "/park-server/api/park/pay/result", // 支付结果
  chargingRules: "/park-server/api/park/rule/content", // 收费规则
  parkingRecord: "POST::/park-server/api/park/record/list", // 停车记录
  /************** 停车 end *************/

  /**
   * api析构
   * */
  destructorApi(key) {
    let apis = this[key].split("::");
    if (apis.length == 1) apis.unshift("GET");
    return {
      url: apis[1],
      method: apis[0],
    };
  },
  /**
   * @description api接口调用
   * @param {Strung} key 接口字段
   * @param {*} options  入参
   * */
  apiRequest(key, options) {
    let { url, method } = this.destructorApi(key);
    return new Promise((resolve, reject) => {
      http.request(url, resolve, reject, options, method, true);
      // request(host + url, resolve, reject, options, method, true);
    });
  },
  /**
   * @description 云函数调用
   * @param {Strung} key 接口字段
   * @param {Object} data  入参
   * @param {String} loadingText  loading提示语
   */
  cloudRequest(key, data, loadingText = "请稍等") {
    let apis = this[key].split("/");
    data.createTime = new Date().getTime();
    data.createTimeStr = new Date().Format("YYYY-MM-DD HH:mm:ss");
    return http.cloud(apis, data, loadingText);
  },

  /**
   * 关闭 线上 所有log日志
   * */
  closeLog(env) {
    if (env == "release") console.log = () => {};
  },

  /**
   * @description  获取小程序二维码
   * @param {*} options
   * 老街口 /api/platform/miniQrCodeGenerate
   * 新街口 /api/platform/component/miniQrCodeGenerate
   */
  getWXQrcodeData() {
    return (
      http.baseURL +
      "/mos-webchatmall-server/api/platform/component/miniQrCodeGenerate"
    );
  },
};
export default api;
