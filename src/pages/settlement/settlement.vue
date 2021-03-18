<template>
  <view class="view">
    <navBar title="确认订单" background="#fff"></navBar>
    <!-- 收货地址 -->
    <view v-if="existExpressProductFlag">
      <view class="adressView flex-row" v-if="currentAdress.receiverPhone">
        <image
          style="width: 18px; height: 21px"
          src="../../static/images/settlement/adress.png"
          mode=""
        ></image>
        <view style="margin-left: 16px; width: 100%">
          <view class="adressInfo flex-row">
            <view class="flex-row">
              <view class="name">{{ currentAdress.receiver }}</view>
              <view class="phone">{{ currentAdress.receiverPhone }}</view>
            </view>
            <view class="flex-row">
              <view
                class="adrssDesc"
                style="color: #a7afb4"
                @click="changeAdress('switch')"
                >切换地址</view
              >
            </view>
          </view>
          <view class="adrssDesc" style="margin-top: 10px">{{
            currentAdress.detailed
          }}</view>
        </view>
      </view>
      <view
        class="adressView flex-row"
        style="justify-content: space-between"
        @click="changeAdress('add')"
        v-else
      >
        <view class="flex-row">
          <image
            style="width: 18px; height: 21px"
            src="../../static/images/settlement/adress.png"
            mode=""
          ></image>
          <view
            class="adressInfo flex-row"
            style="
                            margin-left: 16px;
                            color: #a8b0b5;
                            font-size: 30rpx;
                        "
            >请新增收货地址</view
          >
        </view>
        <image
          style="width: 9px; height: 9px"
          src="../../static/images/left.png"
          mode=""
        ></image>
      </view>
    </view>

    <!-- 虚拟订单 -->
    <view class="purchaseNotes" v-if="existSystemProductFlag">
      <image
        style="width: 40rpx; height: 40rpx"
        src="../../static/images/settlement/present.png"
        mode=""
      ></image>
      <view style="margin-left: 12rpx">
        <view class="purchaseNotesDesc">购买须知</view>
        <view
          class="purchaseNotesDesc"
          style="font-size: 24rpx; margin-top: 8rpx"
          >虚拟商品-优惠券购买成功后将自动发放至我的券包 ，请前往查看</view
        >
      </view>
    </view>
    <!-- 一个店铺 -->
    <view class="shopItem" v-for="(shop, idx) in shopList" :key="idx">
      <!-- 店铺 header -->
      <view class="shopHeader flex-row">
        <image
          v-if="shop.shopLogolUrl"
          style="width: 22px; height: 22px"
          :src="shop.shopLogolUrl"
          mode=""
        ></image>
        <view class="shopHeadername">{{ shop.shopName }}</view>
      </view>

      <!-- 根据配送方式进行拆单 -->
      <view class="" v-for="(element, i) in shop.goodsList" :key="i">
        <!-- 商品Item 展开更多 -->
        <u-read-more
          ref="uReadMore"
          :shadow-style="shadowStyle"
          color="#A7AFB4"
          font-size="24"
          :toggle="true"
          :textIndent="'0em'"
          show-height="450"
          close-text="展开更多"
        >
          <view
            class="commodityView"
            v-for="(item, index) in element.sameDeliverTypeGoodsList"
            :key="index"
          >
            <view class="commodityView-left">
              <image :src="item.pictureUrl" mode="aspectFill"></image>
              <view class="commodityView-left_content">
                <view>
                  <view class="commodity-title">{{ item.goodsName }}</view>
                  <view class="commodity-spec"
                    >规格：{{ strSplicing(item.spec) }}</view
                  >
                </view>
                <view class="commodity-footer">
                  <view class="commodity-price">{{
                    func.handlePrice(
                      item.priceMoney,
                      item.pricePoint,
                      ponitName
                    )
                  }}</view>
                  <view class="commodity-num">× {{ item.num }}</view>
                </view>
              </view>
            </view>
          </view>
        </u-read-more>
        <!-- 配送方式 * 0.快递寄送 * 1.到店自提 * 2.买家留言 -->
        <deliveryMethod
          v-if="element && element.deliverType != '3'"
          :cell="element"
          :idx="i"
          @change="radioGroupChange"
        ></deliveryMethod>
        <!-- 留言 -->
        <view class="leaveMessage">
          <u-field
            v-model="element.leaveMessage"
            label-width="0"
            :border-bottom="false"
            :placeholder-style="
              'color: #C1C6CB;font-size: 26rpx;font-weight: 500;'
            "
            type="textarea"
            placeholder="请输入买家备注"
          />
        </view>
      </view>
    </view>
    <!-- 优惠券 -->
    <view
      v-if="!isVoucher"
      class="couponView flex-row"
      @click="openSelectCoupon"
    >
      <view class="couponDesc">优惠</view>
      <view class="flex-row">
        <view v-if="!totalDiscountPrice" class="couponPrice"
          >请选择优惠券抵扣</view
        >
        <view v-else class="couponPrice" style="color:#F66A68;"
          >优惠￥{{ totalDiscountPrice }}</view
        >
        <image
          style="width: 18rpx; height: 18rpx; margin-left: 2px"
          src="/static/images/left.png"
          mode=""
        ></image>
      </view>
    </view>
    <!-- 优惠信息 -->
    <view class="couponPriceInfo">
      <!-- 商品金额 -->
      <view class="couponPriceInfoItem flex-row">
        <view class="title">商品金额</view>
        <view class="value">
          <!-- <span class="jqfh">￥</span>1239.00 -->
          <pandp
            :price="totalMoney"
            :point="totalpoint"
            priceStyle="color:#000010 !important;"
            pointStyle="color:#000010 !important;"
          ></pandp>
        </view>
      </view>
      <!-- 运费 -->
      <view class="couponPriceInfoItem flex-row">
        <view class="title">运费</view>
        <view class="value"
          ><span class="jqfh">￥</span
          >{{ deliveryMethodAll == "kdyq" ? totalPressFee : 0 }}</view
        >
      </view>
      <!-- 优惠 -->
      <view class="couponPriceInfoItem flex-row" v-if="false">
        <view class="title">优惠</view>
        <view class="value" style="color: #fe5959"
          ><span class="jqfh" style="color: #fe5959">-￥</span>0.00</view
        >
      </view>
    </view>
    <!-- 底部合计 -->
    <view class="bottomView flex-row">
      <view class="left" style="margin-left: 40rpx">
        <view class="total">合计：</view>
        <view class="totalPrice">
          <pandp :price="moneyTotal" :point="totalpoint"></pandp>
        </view>
      </view>
      <view
        class="right"
        style="margin-right: 40rpx"
        @click="commitOrderRequest"
        >提交订单</view
      >
    </view>
    <!-- 优惠券弹框 -->
    <selectCouponAlert
      v-if="couponShow"
      :show="couponShow"
      :list="couponList"
      :money="totalMoney"
      :pressFee="totalPressFee"
      :bestUseList="bestUseList"
      @priceChange="priceChange"
    ></selectCouponAlert>
  </view>
</template>
<script module="func" lang="wxs" src="../../utils/utilFunc.wxs"></script>
<script>
import pandp from "../../pageComponents/priceAndPoint/priceAndPoint.vue";
import deliveryMethod from "../../pageComponents/deliveryMethod/deliveryMethod.vue";
import selectCouponAlert from "./selectCouponAlert";

const app = getApp();
export default {
  components: {
    pandp,
    deliveryMethod,
    selectCouponAlert,
  },
  data() {
    return {
      dhasdhsadan: "kdyq",
      ponitName: app.globalData.pointName,
      couponShow: false,
      // 留言
      leaveMessage: "",
      // 展开更多 样式
      shadowStyle: {
        backgroundImage: "none",
        paddingTop: "0",
        marginTop: "20rpx",
        color: "#A7AFB4",
      },
      shopList: [], // 店铺列表
      existExchangeProductFlag: false,
      existExpressProductFlag: false,
      existSystemProductFlag: false,
      totalDiscount: 0, // 总优惠金额
      totalMoney: 0, // 总现金
      totalpoint: 0, // 总积分
      totalPressFee: 0, // 总运费
      currentAdress: undefined,
      couponList: [],
      bestUseList: [], // 最优推荐
      adressId: 0,
      /************* 游戏逻辑变量 ************/
      gameGoodsId: "",
      /************* 兑换券识别 ************/
      isVoucher: false,
      // deliveryMethod: "kdyq",
      coupons: [],
    };
  },
  /**
   * 生命周期函数--监听页面显示
   * 1.更换地址、新增地址返回当前页面进行赋值
   */
  onShow: function(options) {
    console.log(options, "_____onShow____", this.currentAdress);
    this.adressId = (this.currentAdress && this.currentAdress.adressId) || 0;

    if (this.adressId) {
      this.totalPressFee = 0;
      this.existExpressProductFlag = true;
      this.getSettlementData(this.options, true);
      // this.shippingRequest(this.shopList);
      // this.getOrderCouponList();
    }
  },
  computed: {
    // 查看所有订单中，是否有快递订单，有的话就返回 kdyq，用于显示运费
    deliveryMethodAll() {
      let hasDelivery = false;
      this.shopList.forEach((shop) => {
        shop.goodsList.forEach((element) => {
          if (element.deliveryMethod == "kdyq") hasDelivery = true;
        });
      });
      return hasDelivery ? "kdyq" : "ddzt";
    },
    /**
     * @description: 商品合计 = 商品总价 + 运费价格 - 优惠总价
     */
    moneyTotal() {
      let totalMoney = this.totalMoney || 0;
      let a = totalMoney + this.yfValue - this.totalDiscountPrice;
      return a > 0 ? a : 0;
    },
    // 备注样式
    fieldStyle() {
      return {
        backgroundColor: "#F6F7F8",
        // backgroundColor: 'red',
        height: "102rpx",
        borderRadius: "12rpx",
        font: "500 26rpx/38rpx 'PingFangSC-Medium, PingFang SC'",
        color: "red",
        width: "100%",
      };
    },
    /**
     * @description: 计算最大优惠
     */
    totalDiscountPrice() {
      return Number(this.totalDiscount) + Number(this.maxDiscountPressFee);
    },
    /**
     * @description: 最大优惠 运费
     */
    maxDiscountPressFee() {
      let pressFee = 0;
      if (this.coupons && this.coupons.length > 0)
        this.coupons.forEach((y) => {
          if (y.couponType == "CARRIAGE") {
            pressFee += y.couponDiscountAmount;
          }
        });
      if (pressFee > 0) {
        return pressFee > this.totalPressFee ? this.totalPressFee : pressFee;
      } else {
        return 0;
      }
    },
    /**
     * @description:  计算时 运费
     */
    yfValue() {
      return this.totalPressFee;
    },
  },
  onLoad(options) {
    console.log(options, "__结算页参数___");
    if (options) this.options = options;
    if (options.gameGoodsId != undefined)
      options.settlementId = `[{"settlementId":"${options.id}"}]`;  
    if (options.isVoucher != undefined) {
      this.isVoucher = true;
      this.getDHInfo(options.isVoucher);
    }
    if(options.gameGoodsId) {
      this.isVoucher = true;
    }

    this.getSettlementData(options);
  },
  methods: {
    /**
     * 获取结算页面数据
     * */
    getSettlementData(options, val) {
      var self = this;
      self.shopList = [];
      uni.$api
        .apiRequest("carSettlement", JSON.parse(options.settlementId))
        .then((res) => {
          if (res.code == 10000) {
            // 计算价格
            let totalMoney = 0;
            let totalpoint = 0;
            // 是否需要重新赋值 地址
            if (!val) {
              self.currentAdress = res.data.address;
            }

            // 组装数据
            self.existExchangeProductFlag = res.data.existExchangeProductFlag;
            self.existExpressProductFlag = res.data.existExpressProductFlag;
            self.existSystemProductFlag = res.data.existSystemProductFlag;
            self.shopList = res.data.shopList.map((shop) => {
              shop.goodsList = shop.goodsList.map((element) => {
                element.sameDeliverTypeGoodsList.forEach((e) => {
                  totalMoney += e.priceMoney * e.num;
                  totalpoint += e.pricePoint * e.num;
                });

                let ddd =
                  element.deliverType.indexOf("1") != -1
                    ? "kdyq"
                    : element.deliverType.indexOf("2") != -1
                    ? "ddzt"
                    : "";
                return {
                  ...element,
                  ...{
                    leaveMessage: "",
                    deliveryMethod: ddd,
                  },
                };
              });
              return shop;
            });

            // 赋值价格
            self.totalpoint = totalpoint;
            self.totalMoney = totalMoney;
            // 计算运费
            setTimeout(() => {
              self.shippingRequest(res.data.shopList);
            }, 1000);
            if (!this.isVoucher) {
              // 获取优惠券
              self.getOrderCouponList();
            }

            // 请注意上方已在组件中添加ref-uReadMore
            self.$nextTick(() => {
              // 	self.$refs.uReadMore.init();
              self.shopList = res.data.shopList.map((shop) => {
                shop.goodsList = shop.goodsList.map((element) => {
                  return {
                    ...element,
                    ...{
                      deliveryMethod:
                        element.deliverType.indexOf("1") != -1
                          ? "kdyq"
                          : element.deliverType.indexOf("2") != -1
                          ? "ddzt"
                          : "",
                    },
                  };
                });
                return shop;
              });
            });

            // 处理游戏逻辑
            if (self.options.gameGoodsId != undefined || this.isVoucher) {
              self.totalpoint = 0;
              self.totalMoney = 0;
            }
            console.log("totalMoney", self.totalMoney);
          }
        });
    },
    /**
     * 初始计算运费
     * */
    shippingRequest(shops, ischange) {
      console.log(this.currentAdress, "this.currentAdress");
      if (!this.currentAdress) return;
      var shopListArr = [];
      if (!shops) shops = this.shopList;
      var isok = false;
      shops.forEach((shop) => {
        shop.goodsList.forEach((element) => {
          var obj = {
            shopId: shop.shopId,
          };
          var goodsArr = [];
          if (element.deliverType.indexOf("1") != -1) {
            console.log(ischange, "____", element.deliveryMethod);

            if (!ischange || element.deliveryMethod == "kdyq") {
              element.sameDeliverTypeGoodsList.forEach((item) => {
                goodsArr.push({
                  goodsSkuId: item.goodsSkuId,
                  goodsNum: item.num,
                });
              });
            }
            if (goodsArr.length > 0) {
              isok = true;
              obj["goodsList"] = goodsArr;
            }
          }
          if (goodsArr.length > 0) {
            shopListArr.push(obj);
          }
        });
      });
      if (shopListArr.length > 0 && isok) {
        this.totalPressFee = 0;
        uni.$api
          .apiRequest("shipping", {
            shopList: shopListArr,
            address: {
              provinceCode: this.currentAdress.provinceCode,
              cityCode: this.currentAdress.cityCode,
              countyCode: this.currentAdress.countyCode,
            },
          })
          .then((res) => {
            if (res.code == 10000) {
              this.pressFeeData = res.data;
              res.data.forEach((item) => {
                this.totalPressFee += item.expressFee;
              });

              let onleYf = true;
              this.couponList.map((item) => {
                if (item.couponType != "CARRIAGE") onleYf = false;
              });
              // console.log('1111111111',onleYf,'____',this.totalPressFee)
              if (onleYf && this.totalPressFee != 0) {
                this.bestUseList = [this.couponList[0].uniqueCode]; // 当可用优惠券只有运费券的时候，默认推荐第一个运费券
                this.coupons = [this.couponList[0]];
              }
            }
          });
      }
    },
    /**
     * 获取 兑换券信息
     * */

    getDHInfo(uniqueCode) {
      uni.$api
        .apiRequest("couponDetail", {
          uniqueCode: uniqueCode,
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.dhqInfo = res.data;
          }
        });
    },
    /**
     * 获取订单可用优惠券
     * */
    getOrderCouponList() {
      let arr = [];
      var isPickBySelf = false; // ture 到店自提
      this.shopList.forEach((shop) => {
        shop.goodsList.forEach((element) => {
          if (element.deliverType.indexOf("1") != -1) {
            isPickBySelf = true;
          }
          element.sameDeliverTypeGoodsList.forEach((item) => {
            var obj = {
              orgId: shop.shopId,
            };
            if (item.goodType == 1) {
              obj["isCoupon"] = 0;
            }
            obj["spuCode"] = item.sourceGoodsId;
            obj["totalAmount"] = item.priceMoney * item.num;
            // console.log(obj,'___',item.sourceGoodsId)
            arr.push(obj);
          });
        });
      });
      uni.$api
        .apiRequest("orderCouponList", {
          memberId: uni.$localStorage.getItem("memberId"),
          orderType: 0,
          pickBySelf: isPickBySelf ? 0 : 1,
          goodsList: arr,
        })
        .then((res) => {
          if (res.code == 10000 && res.data && res.data.canUseList) {
            let onleYf = true;
            this.couponList = res.data.canUseList.map((item) => {
              if (item.couponType != "CARRIAGE") onleYf = false;
              if (res.data.bestUseList && res.data.bestUseList.length > 0) {
                res.data.bestUseList.forEach((c) => {
                  if (item.uniqueCode == c) {
                    if (this.coupons) {
                      this.coupons.push(item);
                    } else {
                      this.coupons = [item];
                    }
                  }
                });
              }

              return {
                ...item,
                ...{
                  checked: false,
                },
              };
            });
            if (res.data.bestUseDiscount && !onleYf) {
              // 总优惠 金额
              this.totalDiscount = res.data.bestUseDiscount;
            }

            // console.log('2222222222',onleYf,'____',this.totalPressFee)
            if (onleYf && this.totalPressFee != 0) {
              this.bestUseList = [res.data.canUseList[0].uniqueCode]; // 当可用优惠券只有运费券的时候，默认推荐第一个运费券
              this.coupons = [res.data.canUseList[0]];
            } else if (
              res.data.bestUseList &&
              res.data.bestUseList.length > 0
            ) {
              // 最优推荐
              this.bestUseList = res.data.bestUseList;
            }
          }
        });
    },

    /************************* 非游戏订单   提交订单 ********************/
    commitOrderRequest() {
      if (this.options.gameGoodsId) {
        this.gameCommitOrder();
        return;
      }
      let isExpressDeliveryOrder = false;
      this.shopList.forEach((shop) => {
        shop.goodsList.forEach((element) => {
          if (element.deliveryMethod == "kdyq") isExpressDeliveryOrder = true;
        });
      });

      if (
        !this.currentAdress &&
        this.existExpressProductFlag &&
        isExpressDeliveryOrder
      ) {
        return uni.$alert.showToast("请选择收货地址");
      }
      let adressParam;
      if (isExpressDeliveryOrder) {
        adressParam = {
          receiveName: this.currentAdress.receiver,
          receivePhone: this.currentAdress.receiverPhone,
          provinceName: this.currentAdress.province,
          provinceId: this.currentAdress.provinceCode,
          cityName: this.currentAdress.city,
          cityId: this.currentAdress.cityCode,
          districtName: this.currentAdress.county,
          districtId: this.currentAdress.countyCode,
          detailedAddress: this.currentAdress.detailed,
        };
      }
      // 组装优惠券
      var couponListvalue = [];
      // 1.兑换券
      if (this.dhqInfo) {
        var endTime = new Date(this.dhqInfo.endTime);
        var beginTime = new Date(this.dhqInfo.startTime);
        couponListvalue.push({
          createCouponShopType: 2,
          couponType: this.dhqInfo.couponType,
          couponCode: this.dhqInfo.uniqueCode,
          couponAmount: 0,
          couponValidTime:
            beginTime.Format("YYYY-MM-DD HH:mm:ss") +
            ";" +
            endTime.Format("YYYY-MM-DD HH:mm:ss"),
          couponThreshold: 0,
          orgIdOfCoupon: uni.$localStorage.getItem("orgId"),
        });
      }
      // 2.非兑换券
      if (this.coupons) {
        this.coupons.forEach((item) => {
          if (item.couponAmount) {
            let selectItem = item;
            var endTime = new Date(selectItem.endTime);
            var beginTime = new Date(selectItem.startTime);
            // 门槛
            var couponThreshold = 0;
            if (selectItem.couponType == "REDUCTION") {
              couponThreshold = selectItem.useThresholdAmount;
            }
            // 组装 couponSourceGoodsSpuIdList
            var couponSourceGoodsSpuIdList = [];
            if (selectItem.goodsList) {
              couponSourceGoodsSpuIdList = selectItem.goodsList.map((d) => {
                if (d.spuCode) return d.spuCode;
              });
            } else {
              couponSourceGoodsSpuIdList = selectItem.spuCode
                ? [selectItem.spuCode]
                : [];
            }
            couponListvalue.push({
              createCouponShopType: selectItem.orgType,
              couponType: selectItem.couponType,
              couponCode: selectItem.uniqueCode,
              couponAmount: selectItem.couponAmount,
              couponValidTime:
                beginTime.Format("YYYY-MM-DD HH:mm:ss") +
                ";" +
                endTime.Format("YYYY-MM-DD HH:mm:ss"),
              couponSourceGoodsSpuIdList: couponSourceGoodsSpuIdList,
              couponThreshold: couponThreshold,
              orgIdOfCoupon: uni.$localStorage.getItem("orgId"),
            });
          }
        });
      }

      uni.$util.currentClockin(); // 点亮
      uni.$api
        .apiRequest("commitOrder", {
          memberId: uni.$localStorage.getItem("memberId"),
          shareMemberId: "", // 分享会员ID
          openId: uni.$localStorage.getItem("userOpenId"),
          address: adressParam,
          orderSource: "01",
          shopList: this.getShopListParam(),
          couponList: couponListvalue,
          goodsTotalAmt: this.totalMoney,
          totalAmt:
            this.totalMoney + this.deliveryMethodAll == "kdyq"
              ? this.totalPressFee
              : 0,
          actualAmt: this.moneyTotal,
          totalPayScore: this.totalpoint,
        })
        .then((res) => {
          if (res.code == 10000) {
            console.log(res);
            // 先判断是否去支付列表支付，如果为否的话，再看是否拉取支付窗口，如果无需拉取支付窗口，说明订单不需要付钱，那么页面跳转就按照支付成功处理
            // "accountScoreBalance":9940,"pullWechatPayFlag":false,"waitPayListToPay":false
            if (res.data.waitPayListToPay) {
              // 去订单列表
              uni.reLaunch({
                url: "../../pagesA/order/order?isShowHome=true",
              });
            } else if (res.data.pullWechatPayFlag) {
              // 微信支付
              uni.requestPayment({
                timeStamp: res.data.payParamInfo.timeStamp,
                nonceStr: res.data.payParamInfo.nonceStr,
                package: res.data.payParamInfo.packageInfo,
                signType: res.data.payParamInfo.signType,
                paySign: res.data.payParamInfo.paySign,
                success() {
                  // 埋点 传入埋点类型  商品ids  页面路径 ADD_SHOPCART GOODS_EXCHANGE
                  // wx.$sampling.sampling('GOODS_EXCHANGE', self.data.goodsIds, self.route)
                  uni.reLaunch({
                    url: "./settlementSuccess?isok=1",
                  });
                },
                fail(err) {
                  console.log(err);
                  uni.reLaunch({
                    url: "./settlementSuccess",
                  });
                },
              });
            } else {
              // 支付成功
              uni.reLaunch({
                url: "./settlementSuccess?isok=1",
              });
            }
          }
        });
    },
    getShopListParam() {
      var arr = [];

      this.shopList.forEach((shop) => {
        var obj = {
          shopId: shop.shopId,
        };
        var remarks = [];
        var goodsListParam = [];
        shop.goodsList.forEach((element) => {
          remarks.push({
            expressType:
              element.deliveryMethod == "ddzt"
                ? "2"
                : element.deliveryMethod == "kdyq"
                ? "1"
                : "3",
            userRemark: element.leaveMessage,
          });
          element.sameDeliverTypeGoodsList.forEach((item) => {
            goodsListParam.push({
              ...item,
              ...{
                deliverType: Number(
                  element.deliveryMethod == "ddzt"
                    ? "2"
                    : element.deliveryMethod == "kdyq"
                    ? "1"
                    : "3"
                ),
                extractGoodsAddress: item.pickUpAddress,

                extractGoodsValidTime:
                  item.pickUpExpireRule == "FIXED_TIME"
                    ? item.pickUpExpireTime
                    : undefined,
                validTimeEffectTerm:
                  item.pickUpExpireRule == "FIXED_TERM"
                    ? item.pickUpExpireValue
                    : undefined,

                goodsImg: item.pictureUrl,
                goodsSpec: this.strSplicing(item.spec),

                goodsType: item.goodType,

                productCharge: item.priceMoney,
                singleProductScore: item.pricePoint,
                goodsScore: item.pricePoint * item.num,
                charge: item.priceMoney * item.num,
                sourceGoodsSkuId: String(item.sourceSkuId),
                goodsSpuId: String(item.goodsId),
                sourceGoodsSpuId: item.sourceGoodsId,
              },
            });
          });
        });
        obj["remarkList"] = remarks;

        obj["goodsList"] = goodsListParam;
        if (this.pressFeeData && this.pressFeeData.length > 0) {
          this.pressFeeData.forEach((pressFee) => {
            if (pressFee.shopId == obj.shopId) {
              obj["expressFee"] = this.totalPressFee;
            }
          });
        } else {
          obj["expressFee"] = 0;
        }

        arr.push(obj);
      });
      return arr;
    },
    /**
     * 更换、新增收货地址
     */
    changeAdress(e) {
      this.coupons = [];
      if (e == "add") {
        uni.navigateTo({
          url: "/pages/my/receiptAdress/receiptAdressAdd?adressId=1",
        });
      } else {
        uni.navigateTo({
          url: "/pages/my/receiptAdress/receiptAdress?type=switch&adressId=1",
        });
      }
    },
    /**
     * 优惠券选择
     * @description money 不包含运费券价格
     * */
    priceChange(val) {
      this.couponShow = false;
      console.log(val, "我选中的优惠券 结果");
      if (val.money != undefined) {
        this.totalDiscount = val.money;
        this.coupons = val.coupons;
        this.bestUseList = val.coupons.map((item) => {
          return item.uniqueCode;
        });
      }
    },
    openSelectCoupon() {
      this.couponShow = true;
    },
    commitSelectCoupon() {
      this.couponShow = false;
    },
    closePop() {
      this.couponShow = false;
    },
    /**
     * 快递、自提
     * @description 1.若从快递寄送切换到到店自提则重新选择运费券 2.重新计算运费
     * */
    radioGroupChange(val) {
      // 1
      // let hasDelivery = false; // 是否包含快递订单
      this.shopList.forEach((e) => {
        e.goodsList.forEach((j, index) => {
          if (index == val.idx) {
            j.deliveryMethod = val.type;
          }
        });
      });
      // if (val.type == "kdyq") hasDelivery = true;
      // console.log("varadioGroupChangel", val);

      if (val.type == "ddzt") {
        this.totalPressFee = 0;
        this.coupons = this.coupons.filter((itm) => {
          return itm.couponType != "CARRIAGE";
        });
        this.bestUseList = this.coupons.map((item) => {
          return item.uniqueCode;
        });
      }
      // 2
      this.shippingRequest(this.shopList, true);
    },
    // 拼接规格
    strSplicing(arr) {
      if (!arr) return "张";
      var str = "";
      arr.forEach((item) => {
        str += item.specContent + ",";
      });
      str = str.substring(0, str.length - 1);
      return str;
    },
    /************************* 游戏 ********************/
    gameCommitOrder() {
      var self = this; // 参数校验
      var noAdress = false;
      // 开始请求
      uni.$api
        .apiRequest("game_commitorder", this.gameOrderParam())
        .then((res) => {
          if (res.code == 10000) {
            console.log(res.data);
            this.noticeSuccess(res.data);
          }
        });
    },
    // 订单参数组装
    gameOrderParam() {
      function zuzhuang(list) {
        return list.map((item) => {
          var spec = "";
          if (item.goodType == 3) {
            spec = "张";
          }
          if (item.spec && item.spec.length > 0 && spec != "张") {
            item.spec.forEach((s) => {
              spec += s.specContent + ",";
            });
            spec = spec.substring(0, spec.length - 1);
          }
          return {
            extractGoodsValidTime:
              item.pickUpExpireRule == "FIXED_TIME"
                ? item.pickUpExpireTime
                : undefined,
            validTimeEffectTerm:
              item.pickUpExpireRule == "FIXED_TERM"
                ? item.pickUpExpireValue
                : undefined,
            extractGoodsAddress: item.pickUpAddress,
            sourceGoodsSpuId: item.sourceGoodsId,
            sourceGoodsSkuId: item.sourceSkuId,
            goodsSpec: spec,
            goodsType: item.goodType,
            goodsImg: item.pictureUrl,
            productCharge: 0,
            charge: 0,
            goodsScore: item.priceMoney * item.num, // 购买商品所需积分
            goodsSpuId: item.goodsId,
            goodsItemNo: item.productId || undefined,
            singleProductScore: item.priceMoney, //单个商品所需积分
            ...item,
          };
        });
      }

      var param = {
        luckyId: this.options.gameGoodsId, // 游戏中将商品 ID
        memberId: uni.$localStorage.getItem("memberId"),
        shareMemberId: "", // 分享人id
        orderSource: "03",
        totalAmt: this.deliveryMethodAll == "kdyq" ? this.totalPressFee : 0, // 商品价格是0 订单总价就等于运费价格
        orderPayScore: 0, // 订单所需积分
      };
      if (this.currentAdress && this.currentAdress.receiver) {
        param = {
          ...param,
          ...{
            receiveName: this.currentAdress.receiver,
            receivePhone: this.currentAdress.receiverPhone,
            provinceName: this.currentAdress.province,
            cityName: this.currentAdress.city,
            districtName: this.currentAdress.county,
            provinceId: this.currentAdress.provinceCode,
            cityId: this.currentAdress.cityCode,
            districtId: this.currentAdress.countyCode,
            detailedAddress: this.currentAdress.detailed,
          },
        };
      }
      if (this.pressFeeData && this.pressFeeData.length > 0) {
        this.pressFeeData.forEach((pressFee) => {
          param["expressFee"] = pressFee.expressFee;
        });
      } else {
        param["expressFee"] = 0;
      }

      this.shopList.forEach((shop) => {
        shop.goodsList.forEach((element) => {
          param["goodsInfo"] = zuzhuang(element.sameDeliverTypeGoodsList)[0];

          param.userRemark = element.leaveMessage;
          param.expressType =
            element.deliveryMethod == "ddzt"
              ? "2"
              : element.deliveryMethod == "kdyq"
              ? "1"
              : "3";
          element.sameDeliverTypeGoodsList.forEach((ite) => {
            param.orgId = ite.orgId;
          });
        });
      });
      return param;
    },
    noticeSuccess(data) {
      console.log("开始通知			", data);
      uni.$api
        .apiRequest("game_award_block", {
          orgId: uni.$localStorage.getItem("orgId"),
          orderNum: data.orderId,
          winId: this.options.gameGoodsId,
        })
        .then((res) => {
          if (res.code == 10000) {
            uni.navigateTo({
              url: `/pagesA/order/order-detail/order-detail?orderId=${data.orderId}&orgId=${data.orgId}&isGame=1`,
            });
          }
        });
    },
  },
};
</script>
<style scoped lang="less">
.view {
  padding-bottom: 150rpx;

  .selectCouponPopView {
    padding: 28rpx 0px;
    padding: 0rpx 40rpx;

    .header {
      border-bottom: 1px solid #e5e5e5;
      padding: 28rpx 0px;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #fe5d4d;
    }

    .couponList {
      max-height: 60vh;
      overflow: auto;
    }

    .couponCommit {
      width: 100%;
      margin: 20rpx 0px;
      margin-top: 40rpx;
      line-height: 80rpx;
      background: #fe5d4d;
      border-radius: 8rpx;
      text-align: center;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      height: 80rpx;
    }
  }

  .adressView {
    height: 95px;
    background: #ffffff;
    padding: 20px;
    border-bottom: 10px solid #f9f9f9;

    .adressInfo {
      justify-content: space-between;

      .name {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #313131;
      }

      .phone {
        margin-left: 10px;
        font-size: 17px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #313131;
      }
    }

    .adrssDesc {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808794;
    }
  }

  .shopItem {
    border-bottom: 10px solid #f9f9f9;

    .shopHeader {
      height: 50px;
      background: #ffffff;
      margin: 0px 20px;
      border-bottom: 1px solid #e5e5e5;

      .shopHeadername {
        margin: 14px;
        margin-left: 10px;
        font-size: 14px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #000000;
      }
    }

    .commodityView {
      padding: 28rpx 40rpx;
      display: flex;
      justify-content: space-between;
      background: #ffffff;
      &-left {
        display: flex;
        width: 100%;
        image {
          width: 148rpx;
          height: 148rpx;
          background: #f3f3f3;
        }
        &_content {
          flex: 1;
          margin-left: 24rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .commodity-title {
            font: 500 26rpx "PingFangSC-Medium, PingFang SC";
            color: #475774;
          }
          .commodity-spec {
            margin-top: 10rpx;
            font-size: 22rpx "PingFangSC-Regular, PingFang SC";
            color: #808794;
          }
          .commodity-footer {
            display: flex;
            justify-content: space-between;
          }
          .commodity-price {
            font-size: 26rpx;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: 500;
            color: #ff4c4c;
          }
          .commodity-num {
            font-size: 24rpx;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #475774;
          }
        }
      }
    }

    .leaveMessage {
      padding: 0rpx 40rpx;
      background: #ffffff;
      /deep/ .u-field {
        background: #f6f7f8;
        margin-bottom: 32rpx;
        border-radius: 12rpx;
        font: 500 26rpx/38rpx "PingFangSC-Medium, PingFang SC";
        color: #c1c6cb;
      }
    }
  }

  .couponView {
    padding: 28rpx 40rpx;
    justify-content: space-between;
    border-bottom: 10px solid #f9f9f9;

    .couponDesc {
      font-size: 26rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ababab;
    }

    .couponPrice {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #f66a68;
    }
  }

  .couponPriceInfo {
    padding: 28rpx 40rpx;

    .couponPriceInfoItem {
      justify-content: space-between;
      padding: 14rpx 0px;

      .jqfh {
        font-weight: 500;
        font-size: 16px;
      }

      .title {
        font-size: 26rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ababab;
      }

      .value {
        font-size: 28rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #000010;
      }
    }
  }

  .purchaseNotes {
    display: flex;
    padding: 25rpx 40rpx;
    border-bottom: 10px solid #f9f9f9;

    .purchaseNotesDesc {
      font-size: 28rpx;
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-weight: 300;
      color: #7f7f7f;
    }
  }

  .bottomView {
    position: fixed;
    bottom: 0;
    justify-content: space-between;
    padding: 28rpx 0rpx;
    background-color: white;
    width: 100vw;
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);

    .total {
      font-size: 24rpx;
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-weight: 300;
      color: #000000;
    }

    .totalPrice {
      font-size: 32rpx;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #ff4c4c;
    }

    .right {
      background: #fe5d4d;
      border-radius: 8rpx;
      color: white;
      text-align: center;
      padding: 0px 24rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
