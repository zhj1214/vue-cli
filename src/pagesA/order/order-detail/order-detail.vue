<template>
  <view>
    <navBar title="订单详情" background="#fff" back="true"></navBar>
    <view class="view">
      <!-- 快递 拆包提示 -->
      <view class="alertView" v-if="detialData.orderSplitFlag">
        <view>
          <view class="alertView-tool">
            <view class="alertView-tool-title">温馨提醒</view>
          </view>
          <view
            v-if="
              detialData.orderStatusStr == '待收货' ||
                detialData.orderStatusStr == '交易完成'
            "
            class="alertView-tool-desc"
            >该订单已被拆成{{
              detialData.expressList.length
            }}个包裹发出，点击查看详情
          </view>
          <view v-else class="alertView-tool-desc"
            >该订单已部分发货，点击查看详情。</view
          >
        </view>
        <view class="right" @tap.stop="viewLogistics">
          <view style="margin-right: 4rpx">详情</view>
          <image
            style="width: 24rpx; height: 24rpx"
            src="/static/images/rightArrowsDetail.png"
          ></image>
        </view>
      </view>
      <!-- 快递地址信息 -->
      <view v-if="detialData.expressType == 1" class="expressDelivery">
        <view class="expressDelivery-user" style="margin-bottom: 6px">
          <view class="expressDelivery-user-name">
            <image
              class="expressDelivery-user-name-img"
              src="/static/images/mapbz.png"
            ></image>
            <view
              class="expressDelivery-user-name-text"
              style="font-weight: 400"
              >{{ detialData.receiveName }}</view
            >
          </view>
          <view
            class="expressDelivery-user-name-text"
            style="margin-left: 20px"
            >{{ phonexh(detialData.receivePhone) }}</view
          >
        </view>
        <view class="expressDelivery-desc">{{
          detialData.receiveAddress
        }}</view>
      </view>
      <!-- 兑换须知 -->
      <view class="expressDelivery" v-else-if="detialData.expressType == 3">
        <view class="expressDelivery-user">
          <view class="expressDelivery-user-name">
            <image
              class="expressDelivery-user-name-img"
              src="/static/images/settlement/present.png"
            ></image>
            <view class="expressDelivery-user-name-text">购买须知</view>
          </view>
        </view>
        <view class="expressDelivery-desc">{{
          detialData.orderType != 0
            ? "虚拟商品-会员权益购买成功后将自动生效，请前往会员中心页面查看。"
            : "虚拟商品-优惠券购买成功后将自动发放至用户卡券包，请前往查看。"
        }}</view>
      </view>
      <!-- 分割线 -->
      <view
        style="background-color: white; margin-bottom: 20rpx"
        v-if="detialData.expressType != 2"
      >
        <image
          style="height: 10rpx; width: 100vw"
          src="/static/images/order/letter.png"
        ></image>
      </view>
      <!-- 二维码 -->
      <view
        v-if="qrCodeData.length > 0 && detialData.orderStatusStr != '已关闭'"
      >
        <view>
          <swiper
            indicator-dots="true"
            style="
                            height: 345px;
                            background-color: white;
                            margin-bottom: 10px;
                        "
            @animationfinish="changeCode"
          >
            <block v-for="(item, index) in qrCodeData" :key="index">
              <swiper-item>
                <view class="qrcodeView">
                  <view class="qrcodeBg">
                    <!-- 不存在二维码的时候 提供一个占位图操作 -->
                    <tki-qrcode
                      v-if="false"
                      style="padding: 18px"
                      ref="qrcode"
                      :cid="item.cid"
                      :val="item.code"
                      unit="px"
                      :size="150"
                      :usingComponents="false"
                      @result="qrResult"
                    >
                    </tki-qrcode>
                    <image
                      v-else
                      style="
                                                width: 288rpx;
                                                height: 288rpx;
                                                padding: 23rpx;
                                            "
                      :src="item.exchangeCodeUrl"
                      mode=""
                    ></image>
                    <!-- <cover-view class="montmorillonite" v-if="item.sendStatusStr == '已提货' || item.sendStatusStr == '已过期' || item.sendStatusStr == '已失效'">
											<cover-view class="montmorilloniteText">{{item.sendStatusStr}}</cover-view>
										</cover-view> -->
                    <view
                      class="montmorillonite"
                      v-if="
                        item.sendStatusStr === '已提货' ||
                          item.sendStatusStr === '已过期' ||
                          item.sendStatusStr === '已失效'
                      "
                    >
                      <view class="montmorilloniteText">{{
                        item.sendStatusStr
                      }}</view>
                    </view>
                  </view>

                  <!-- 二维码信息 -->
                  <view class="qrcodeInfo">
                    <view class="qrcodeInfoCode">{{ item.code }}</view>
                    <view class="qrcodeInfoCodeDesc"
                      >{{ item.title }} × {{ item.number }}</view
                    >
                    <view class="qrcodeInfoDesc">
                      <view
                        >请前往
                        <span class="redTextStyle">{{ item.address }}</span
                        >进行核销兑换</view
                      >
                      <view v-if="item.pickExpireTime"
                        >有效期至
                        <span class="redTextStyle">{{
                          item.pickExpireTime
                        }}</span>
                      </view>
                    </view>
                  </view>
                </view>
              </swiper-item>
            </block>
          </swiper>
        </view>
      </view>
      <!-- 订单列表 -->
      <view class="orderView">
        <view class="orderHeader">
          <view class="flex-row" @click.stop="jumpShop">
            <image
              v-if="detialData.shopLogolUrl"
              style="width: 42rpx;height: 42rpx;margin-right: 20rpx;"
              :src="detialData.shopLogolUrl"
              mode=""
            ></image>
            <view class="headerText" style="margin-right: 20rpx">{{
              detialData.orgName
            }}</view>
            <image
              style="width: 8px; height: 13px"
              src="../../../static/images/jtr.png"
              mode=""
            ></image>
          </view>
          <view
            v-if="detialData.orderStatus !== 5"
            :style="
              'font-weight: 300;color:' +
                (detialData.orderStatusStr == '待付款'
                  ? '#F6605E;'
                  : detialData.orderStatusStr == '待提货'
                  ? '#F9800B'
                  : detialData.orderStatusStr == '已关闭'
                  ? '#C8C8C8;'
                  : detialData.orderStatusStr == '交易完成'
                  ? '#C8C8C8;'
                  : detialData.orderStatusStr == '待发货'
                  ? '#7676B4'
                  : '')
            "
            >{{ detialData.orderStatusStr }}</view
          >
          <view
            v-else
            :style="
              'font-weight: 300;color:' +
                (detialData.orderStatusStr == '待付款'
                  ? '#F6605E;'
                  : detialData.orderStatusStr == '待提货'
                  ? '#F9800B'
                  : detialData.orderStatusStr == '已关闭'
                  ? '#C8C8C8;'
                  : detialData.orderStatusStr == '交易完成'
                  ? '#C8C8C8;'
                  : detialData.orderStatusStr == '待发货'
                  ? '#7676B4'
                  : '')
            "
            >{{ detialData.closeTypeStr }}</view
          >
        </view>
        <!-- 订单 内容 -->
        <view
          v-for="(item, index) in detialData.productList"
          :key="index"
          class="orderContent orderContent-one"
          @tap.stop="jumpGoodsDetial(item)"
        >
          <view class="orderContent" style="padding: 20rpx 0rpx">
            <view class="orderDescStyle">
              <image
                class="imageView"
                mode="aspectFit"
                :src="item.productImg"
                @click="onGoodsCardTap(item)"
              ></image>
              <view style="margin-left: 10px; flex: 1">
                <view
                  class="orderTitle"
                  style="font-size: 26rpx; color: #475774"
                  >{{ item.productName }}</view
                >
                <view
                  class="orderTextDesc twoLinesText"
                  style="font-size: 22rpx;  color:#808794"
                  >规格：{{ item.productSpec }}</view
                >
                <view
                  class="orderTitle"
                  style="font-weight: bold; color:#1E273F"
                  >{{
                    func.handlePrice(
                      item.productPrice,
                      item.productScore,
                      ponitName
                    )
                  }}</view
                >
              </view>
            </view>
            <view class="info-r">
              <view
                style="font-size: 24rpx; color: #ff595f"
                v-if="
                  item.productRefundStatus === 1 ||
                    item.productRefundStatus === 2
                "
                @click="jumpTDDtial(item.returnBackOrderId)"
                >{{ item.productRefundStatusStr }}</view
              >
              <view style="margin-top: 10rpx">x{{ item.productNum }}</view>
            </view>
          </view>
          <!-- 退款按钮 游戏订单-按钮不显示 begin -->
          <view v-if="!isGame" style="width: 100%">
            <view
              class="refundbg"
              v-if="
                detialData.expressType != 3 &&
                  !detialData.exchangeCouponOrderFlag &&
                  (detialData.orderStatusStr == '待发货' ||
                    detialData.orderStatusStr == '待收货' ||
                    detialData.orderStatusStr == '待提货' ||
                    detialData.orderStatusStr == '交易完成')
              "
            >
              <view
                class="refundbgBtn"
                :data-goods="item"
                @tap.stop="requestRefund"
                v-if="item.productRefundStatus == 0"
                >{{
                  item.sendStatusStr == "已提货" ||
                  detialData.orderStatusStr == "交易完成"
                    ? "申请售后"
                    : "申请退款"
                }}</view
              >
            </view>
          </view>
          <!-- 退款按钮 游戏订单-按钮不显示 end -->
        </view>
      </view>
      <!-- 信息展示 -->
      <view class="orderInfo">
        <!-- 快递 -->
        <view
          class="order-info-content"
          v-if="
            detialData.expressType == 1 &&
              detialData.expressList.length == 1 &&
              detialData.expressList[0].expressName
          "
        >
          <view class="flex-row">
            <span class="orderDesc">物流公司：</span>
            <span class="orderTitle">{{
              detialData.expressList[0].expressName
            }}</span>
          </view>
          <view class="flex-row">
            <span class="orderDesc">物流单号：</span>
            <span class="orderTitle">{{
              detialData.expressList[0].expressNo
            }}</span>
          </view>
        </view>
        <!-- 订单信息 -->
        <view class="order-info-content">
          <view class="flex-row">
            <span class="orderDesc">订单编号：</span>
            <span class="orderTitle">{{ detialData.orderId }}</span>
          </view>
          <view class="flex-row">
            <span class="orderDesc">下单时间：</span>
            <span class="orderTitle">{{ detialData.createTime_str }}</span>
          </view>
          <view class="flex-row">
            <span class="orderDesc">买家留言：</span>
            <span class="orderTitle">{{ detialData.userRemark }}</span>
          </view>
        </view>
        <!-- 商品信息 -->
        <view
          class="order-info-content"
          v-if="
            detialData.expressType != 3 && detialData.actualAmt != undefined
          "
        >
          <view style="display: flex; justify-content: space-between">
            <span class="orderDesc">商品金额：</span>
            <span
              class="orderTitle"
              style="font-weight: bold; color: #000010"
              >{{
                func.handlePrice(
                  detialData.goodsTotalAmt,
                  detialData.orderPayScore,
                  ponitName
                )
              }}</span
            >
          </view>
          <view
            style="display: flex; justify-content: space-between"
            v-if="detialData.discountedPrice"
          >
            <span class="orderDesc">优惠券：</span>
            <span class="orderTitle" style="color: #f6605e"
              >-￥{{ detialData.discountedPrice }}</span
            >
          </view>
          <view style="display: flex; justify-content: space-between" v-if="detialData.expressType == 1">
            <span class="orderDesc">运费：</span>
            <span class="orderTitle" style="font-weight: bold; color: #000010"
              >￥{{ detialData.expressFee }}</span
            >
          </view>
          <!-- <view style="display:flex;justify-content: space-between;" v-if="false">
						<span class="orderDesc">运费优惠：</span>
						<span class="orderTitle">￥{{detialData.payTime}}</span>
					</view> -->
          <view
            style="display: flex; justify-content: space-between"
            v-if="false"
          >
            <span class="orderDesc">订单总金额：</span>
            <span class="orderTitle">{{ detialData.totalAmt }}积分</span>
          </view>
          <!-- 支付信息 -->
          <view v-if="detialData.actualAmt != undefined">
            <view
              style="display: flex; justify-content: space-between"
              v-if="false"
            >
              <span class="orderDesc">储值卡抵扣：</span>
              <span class="orderTitle">{{ detialData.payId }}</span>
            </view>
            <view
              style="display: flex; justify-content: space-between"
              v-if="false"
            >
              <span class="orderDesc">积分抵扣：</span>
              <span class="orderTitle">{{ detialData.payTime }}</span>
            </view>
            <view style="display: flex; justify-content: space-between">
              <span class="orderDesc">实付款：</span>
              <span
                class="orderTitle"
                style="font-weight: bold; color: #000010"
                >{{
                  func.handlePrice(
                    detialData.actualAmt,
                    detialData.orderPayScore,
                    ponitName
                  )
                }}</span
              >
            </view>
            <!-- <view
              style="display: flex; justify-content: space-between"
              v-if="detialData.payType"
            >
              <span class="orderDesc">支付方式：</span>
              <span
                class="orderTitle"
                style="font-weight: bold; color: #000010"
                >{{ detialData.payType }}</span
              >
            </view> -->
          </view>
        </view>
      </view>
    </view>

    <!-- 底部菜单栏 -->
    <view
      class="bottom-tool"
      v-if="
        detialData.orderStatusStr &&
          !(detialData.orderStatusStr == '待付款' && downTime <= 0)
      "
    >
      <!-- 按钮 -->
      <!-- detialData.commentStatus == 1?bottomBtnList['待评价'].btns: -->
      <view
        v-for="(item, index) in detialData.expressType == 2 &&
        detialData.orderStatusStr == '交易完成'
          ? bottomBtnList[detialData.orderStatusStr].ztbtns
          : bottomBtnList[detialData.orderStatusStr].btns"
        :key="index"
        :class="
          'bottom-tool-btn ' +
            (index + 1 == bottomBtnList[detialData.orderStatusStr].btns.length
              ? 'bottom-tool-h'
              : 'bottom-tool-k')
        "
        @tap.stop="bottomToolBtnClick"
        :style="
          index + 1 == bottomBtnList[detialData.orderStatusStr].btns.length
            ? theme.btn
            : ''
        "
        :data-type="item"
        v-if="item != '支付'"
        >{{ item }}
        <view class="btnMore" v-if="item == '更多' && isShowMore">
          <view
            class="btnMore-btn"
            @tap.stop="bottomToolBtnClick"
            :data-type="'删除订单'"
            >删除订单</view
          >
          <view
            class="btnMore-btn"
            style="border-top: 1rpx solid #bfbfbf"
            @tap.stop="bottomToolBtnClick"
            :data-type="'联系客服'"
            >联系客服</view
          >
        </view>
      </view>
      <!-- 支付 -->
      <view
        class="bottom-tool-btn downBtn"
        style="background: #fe5d4d; color: white"
        v-if="detialData.orderStatusStr == '待付款' && downTime >= 0"
        @tap.stop="gotoPay"
        >支付(
        <u-count-down
          :timestamp="downTime"
          :show-days="false"
          :show-hours="false"
          :bg-color="theme.borderColor"
          :separator-color="theme.color"
          :color="theme.color"
        ></u-count-down
        >)</view
      >
    </view>

    <!-- 弹框 -->
    <u-popup v-model="show" mode="center" border-radius="12">
      <view style="padding: 20rpx 32rpx">
        <view class="header headerPadding">
          <view class="header-title">{{
            showConfirmReceiptType == 1 ? "确认收货" : "删除订单"
          }}</view>
          <image
            @click="delate"
            style="width: 24px; height: 24px"
            src="/static/images/clear-icon.png"
          ></image>
        </view>
        <view class="content">{{
          showConfirmReceiptType == 1 ? "确认已收到商品？" : "确认删除该订单？"
        }}</view>
        <view class="bottomView">
          <view
            class="canle bottomView-title"
            style="color: #2e2e2e"
            @tap.stop="delate"
            data-type="0"
            >取消</view
          >
          <view
            class="ok bottomView-title"
            style="color: white"
            @tap.stop="delate"
            data-type="1"
            >确认</view
          >
        </view>
      </view>
    </u-popup>
    <!-- 合并支付弹框  取消订单-->
    <mergePay
      v-if="samplingGoods"
      :payShow="payShow"
      :payObj="mergePayInfo"
      :goodsId="samplingGoods"
    ></mergePay>
    <!-- 取消订单 -->
    <!-- :custom-style="{ height: '820rpx', 'border-radius': '18rpx' }" -->
    <u-popup
      v-model="cancelOrderShow"
      mode="bottom"
      border-radius="18"
      @close="
        () => {
          this.cancelOrderShow = false;
        }
      "
    >
      <view class="cancelOrder-header">
        <view class="cancelOrder-header-title" style="color:#FE5D4D;"
          >取消订单</view
        >
        <view class="cancelOrder-header-desc"
          >取消后，优惠券等将退回，有效期内可继续使用</view
        >
      </view>
      <!-- 取消原因 -->
      <view class="cancelView">
        <view class="cancelInfo">请选择取消订单原因</view>
        <u-radio-group v-model="cancelOrderRadio" @change="onChange">
          <view class="cancelItem">
            <view class="cancelItem-title">我不想买了</view>
            <u-radio :name="0"></u-radio>
          </view>
          <view class="cancelItem">
            <view class="cancelItem-title">信息填写错误，重新拍</view>
            <u-radio :name="1"></u-radio>
          </view>
          <view class="cancelItem">
            <view class="cancelItem-title">商家缺货</view>
            <u-radio :name="2"></u-radio>
          </view>
          <view class="cancelItem">
            <view class="cancelItem-title">其他原因</view>
            <u-radio :name="3"></u-radio>
          </view>
        </u-radio-group>
      </view>
      <!-- 取消按钮 -->
      <view class="cancelBottomView">
        <view class="cancelBottomView-r">
          <view
            class="cancelBottomView-btn"
            style="background: #f2f2f2; color: #717171"
            @tap.stop="onCancelOrder"
            data-type="0"
            >暂不取消</view
          >
          <view
            class="cancelBottomView-btn"
            style="background: #fe5d4d; color: #ffffff"
            @tap.stop="onCancelOrder"
            data-type="1"
            >确认取消</view
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script module="func" lang="wxs" src="../../../utils/utilFunc.wxs"></script>

<script>
import tkiQrcode from "tki-qrcode";
const app = getApp();
import mergePay from "pageComponents/mergePay/mergePay";

export default {
  data() {
    return {
      ponitName: app.globalData.pointName,
      theme: uni.$theme,
      // 临时字段 用于解决前后端倒计时结束 状态不改变问题
      hiddenPay: false,
      //
      options: {},
      // 订单详情
      detialData: {},
      // 二维码数组
      qrCodeData: [],
      swiperIdx: 0,
      // 是否展示弹框
      show: false,
      // 倒计时
      downTime: 0,
      // 是否展示取消订单
      cancelOrderShow: false,
      cancelOrderRadio: "1",
      // 底部按钮展示
      bottomBtnList: {
        待付款: {
          orderStatus: "待付款",
          btns: ["取消订单", "支付"],
        },
        待发货: {
          orderStatus: "待发货",
          btns: ["联系客服"],
        },
        待收货: {
          orderStatus: "待收货",
          // '查看物流',
          btns: ["联系客服", "确认收货"],
        },
        待提货: {
          orderStatus: "待提货",
          btns: ["联系客服"],
        },
        // '待评价': {
        // 	orderStatus: '交易完成',
        // 	btns: ['更多', '评价', '查看物流']
        // },
        交易完成: {
          orderStatus: "交易完成",
          // , '查看物流'
          btns: ["联系客服", "删除订单"],
          ztbtns: ["联系客服", "删除订单"],
        },
        已关闭: {
          orderStatus: "已关闭",
          btns: ["联系客服", "删除订单"],
        },
      },
      isShowMore: false,
      payShow: false,
      showConfirmReceiptType: "",
      mergePayInfo: "",
      samplingGoods: "",
      isGame: false, // 是游戏订单页面跳转过来的
    };
  },

  components: {
    tkiQrcode,
    mergePay,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options,
      isGame: options.isGame + "" === "1",
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getOrderDetailData(this.options.orderId);
  },
  methods: {
    phonexh(val) {
      return uni.$util.phoneEncryption(val);
    },
    /**
     * @description 跳转商品详情
     */
    onGoodsCardTap(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.goodsSpuId}`,
      });
    },
    qrResult(val) {
      console.log("二维码base64 数据");
    },
    /**
     * 获取订单数据
     * expressType： 1快递 、2自提 3 系统发货
     */
    getOrderDetailData(id) {
      var self = this;
      uni.$api
        .apiRequest("getorderDetail", {
          orgId: this.options.orgId,
          orderId: id,
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000) {
            res.data.orderStatusStr = self.getOrderStatus(res.data.orderStatus);

            if (res.data.orderStatusStr == "待付款") {
              let tjg = new Date().getTime() - res.data.createTime;
              self.setData({
                downTime: tjg >= 1800000 ? 0 : (1800000 - tjg) / 1000,
              });

              if (tjg <= 0) {
                self.timeFinish();
              }
            } //  confirmReceiveGoodsTime 商品确认收货的时间（Date格式。当订单未确认收货时，该值为null）

            if (res.data.productList) {
              self.qrCodeData = []; // 1.二维码

              if (res.data.expressType == 2) {
                res.data.productList.forEach((item, index) => {
                  let code = {};

                  if (item.exchangeCode) {
                    code.code = item.exchangeCode;
                    code.title = item.productName;
                    code.exchangeCodeUrl = item.exchangeCodeUrl;
                    code.number = item.productNum;
                    code.address = item.pickAddr || "指定地点";

                    if (item.pickExpireTime) {
                      var times = new Date(item.pickExpireTime);
                      let time = times.Format("YYYY年MMM月DD日");
                      code.pickExpireTime = time;
                    }

                    code.sendStatusStr = item.sendStatusStr;
                    code.cid = "resultCanvas" + index;
                    self.qrCodeData.push(code);
                  }
                });
                self.setData({
                  qrCodeData: self.qrCodeData,
                });
                // 显示第一张 二维码
                // if (self.qrCodeData.length > 0) {
                // 	//   console.log("res: ", res);
                // 	self.$nextTick(() => {
                // 		if (self.$refs.qrcode.length > 0) {
                // 			self.$refs.qrcode[0]._makeCode();
                // 		}
                // 	});
                // }
              }
            } // 兑换地址
            // let adress = '杭州大厦（杭州大厦购物城D座1楼总服务台）'
            // if (res.data.orgName == '杭州大厦') {
            //   adress = '杭州大厦（杭州大厦购物城D座1楼总服务台）'
            // } else if (res.data.orgName == '解百奥莱') {
            //   adress = '（解放路251号杭州解百城市奥莱）'
            // } else if (res.data.orgName == '全程医疗') {
            //   adress = '（全程医疗22楼会员中心（联系方式：4008018195））'
            // }
            // self.setData({
            //   exchange: adress
            // })
            // 时间处理

            var create = new Date(res.data.createTime);
            res.data.createTime_str = create.Format("YYYY-MM-DD HH:mm:ss");

            if (res.data.payTime) {
              var pay = new Date(res.data.payTime);
              res.data.payTime = pay.Format("YYYY-MM-DD HH:mm:ss");
            } 
            // 计算优惠总额
            
            if(res.data.couponInfoList && res.data.couponInfoList.length> 0){
              res.data.couponInfoList = res.data.couponInfoList.map(item=>{
              if(item.couponType == '折扣券'){
                item.amount = (1 - item.amount/10) * res.data.goodsTotalAmt
              } else if(item.couponType == '现金券'){
                let orderDiscountCASH = 0;
                res.data.couponInfoList.forEach(e=>{
                  orderDiscountCASH += e.amount
                })
                item.amount = orderDiscountCASH
              }
              item.amount = uni.$util.decimalTwo(item.amount)
              return item
            })
            }
            
            // 订单列表
            self.setData({
              detialData: res.data,
            });
            console.log("detialData:", this.detialData);
            this.detialData.discountedPrice = 0
            if (this.detialData.orderDiscountInfoList.length) {
              this.detialData.orderDiscountInfoList.forEach(item => {
                if (item.payId !== 'ScorePay') {
                  this.detialData.discountedPrice += item.payCharge
                }
              })
            }
          }
        });
    },

    /**
     * 计算 订单状态
     */
    getOrderStatus(status) {
      let t = "";
      if (!app.globalData.orderHeader)
        app.globalData.orderHeader = uni.$localStorage.getItem("orderHeader");
      app.globalData.orderHeader.forEach((item) => {
        if (item.code == status) {
          t = item.title;
        }
      });
      return t;
    },

    /**
     * 待支付状态 倒计时
     */
    timeFinish() {
      if (this.downTime < 0) {
        const countDown = this.selectComponent(".control-count-down");

        if (countDown) {
          countDown.pause();
          this.setData({
            hiddenPay: true,
          });
        }
      } else {
        this.getOrderDetailData(this.detialData.orderId);
      }
    },

    /**
     * 切换 二维码
     */
    changeCode(e) {
      console.log(e.detail.current);
      if (this.swiperIdx < e.detail.current) {
        this.setData({
          swiperIdx: e.detail.current,
        });
        // this.$nextTick(() => {
        // 	if (this.$refs.qrcode.length > 0) {
        // 		this.$refs.qrcode[e.detail.current]._makeCode();
        // 	}
        // });
      }
    },
    /**
     * 退款/售后
     * */
    requestRefund(e) {
      console.log(e.currentTarget.dataset.goods);
      var info = {
        id: this.detialData.orderId,
        status: this.detialData.orderStatus,
        goodsStatus: e.currentTarget.dataset.goods.sendStatusStr,
        type: this.detialData.expressType,
        goodsSkuId: e.currentTarget.dataset.goods.goodsSkuId,
        orderOrgId: this.detialData.orgId,
      };
      uni.navigateTo({
        url: "/pagesA/order/Chargeback/chargeback?json=" + JSON.stringify(info),
      });
    },

    /**
     * 关闭 pop
     * */
    onClose() {
      this.setData({
        show: false,
        payShow: false,
        cancelOrderShow: false,
      });
    },
    /**
     * @description: 跳转到店铺首页
     */
    jumpShop(e) {
      e.stopPropagation();
      console.log("onShopBarTap", this.detialData);
      const url = "pagesA/shop/home";
      uni.navigateTo({
        url: `/${url}?shopId=${this.detialData.orgId}`,
      });
    },
    /**
     * 跳转商品详情
     * */
    jumpGoodsDetial(e) {
      let id = e.goodsSpuId;
      uni.navigateTo({
        url: `/pages/goodsDetail/goodsDetail?goodsid=${id}`,
      });
    },

    /**
     * 取消订单
     * */
    onChange(event) {
      this.cancelOrderRadio = event;
    },

    onCancelOrder(e) {
      console.log(e.currentTarget.dataset.type);

      if (e.currentTarget.dataset.type == "1") {
        e.currentTarget.dataset.type = "2";
        this.confirmReceipt(e);
      }

      this.onClose();
    },

    /*******************************************底部按钮***********************************************/

    /**
     * 底部操作事件
     * */
    bottomToolBtnClick(e) {
      let status = e.currentTarget.dataset.type;
      console.log(status);

      if (status == "联系客服") {
        this.contactCustomerService();
        this.setData({
          isShowMore: false,
        });
      } else if (status == "查看物流") {
        this.viewLogistics();
      } else if (status == "确认收货") {
        this.showConfirmReceipt(1);
      } else if (status == "评价") {
        this.evaluation();
      } else if (status == "取消订单") {
        this.showConfirmReceipt(2);
      } else if (status == "删除订单") {
        this.showConfirmReceipt(3);
        this.setData({
          isShowMore: false,
        });
      } else if (status == "更多") {
        this.setData({
          isShowMore: !this.isShowMore,
        });
      }
    },

    /**
     * 操作按钮 1确认收货2取消订单3删除订单
     * 评价：确认收货，进入评价页面
     * */
    showConfirmReceipt(type) {
      if (type == "2" && !this.cancelOrderShow) {
        this.setData({
          showConfirmReceiptType: type,
          cancelOrderShow: true,
        });
      } else {
        this.setData({
          showConfirmReceiptType: type,
          show: true,
        });
      }
    },

    delate(e) {
      if (e.currentTarget.dataset.type == 1) {
        this.confirmReceipt(e);
      } else {
        this.setData({
          cancelOrderShow: false,
          show: false,
        });
      }
    },

    confirmReceipt(e) {
      let tkry = ["我不想买了", "信息填写错误，重新拍", "商家缺货", "其他原因"];
      uni.$api
        .apiRequest("orderDetailOperating", {
          orderId: this.detialData.orderId,
          orgId: this.detialData.orgId,
          memberId: uni.$localStorage.getItem("memberId"),
          cancelReason: tkry[this.cancelOrderRadio],
          operType: this.showConfirmReceiptType,
        })
        .then((res) => {
          if (res.code == 10000) {
            if (this.showConfirmReceiptType == 1) {
              uni.$alert.showToast("收货成功");
              setTimeout(() => {
                // uni.navigateTo({
                // 	url: '/pages/order/Evaluation/evaluation?orderId=' + this.options.orderId
                // });
                uni.navigateBack({});
              }, 1500);
            } else {
              uni.navigateBack({
                success: () => {
                  uni.$alert.showToast(
                    this.showConfirmReceiptType == 2 ? "订单已取消" : "删除成功"
                  );
                },
              });
            }
            // 关闭弹框
            this.setData({
              cancelOrderShow: false,
              show: false,
            });
          }
        });
    },

    /**
     * 查看物流
     **/
    viewLogistics() {
      if (this.detialData.orderSplitFlag) {
        uni.navigateTo({
          url:
            "/pages/my/Logistics/openLogistics?expressListJson=" +
            JSON.stringify(this.detialData.expressList),
          complete: (res) => {
            console.log(res);
          },
        });
      } else {
        // uni.navigateTo({
        // 	url: '/pages/my/Logistics/Logistics?logisticCode=' + this.detialData.expressList[0].expressNo + '&shipperCode=' +
        // 		this.detialData.expressList[0].expressCode + '&logisticsName=' + this.detialData.expressList[0].expressName
        // });
      }
    },

    /**
     * 联系客服
     **/
    contactCustomerService() {
      // getShopHotline  新接口
      uni.$api
        .apiRequest("__v2__fetchStoreBaseInfo", { id: this.detialData.orgId })
        .then((res) => {
          if (res.code == 10000) {
            if (!res.data || !res.data.contact) {
              uni.$alert.showToast("未设置客服电话");
            } else {
              uni.makePhoneCall({
                phoneNumber: String(res.data.contact),
                complete: (res) => {
                  console.log(res);
                },
              });
            }
          } else {
            uni.$alert.showToast("获取客服电话失败");
          }
        });
    },
    /**
     * 跳转到退单详情
     * */

    jumpTDDtial(id) {
      uni.navigateTo({
        url:
          "../orderRefund/orderRefund?orderId=" +
          id +
          "&orgId=" +
          this.detialData.orgId,
      });
    },
    /**
     * 去评价
     */
    evaluation() {
      uni.navigateTo({
        url:
          "/pages/order/Evaluation/evaluation?orderId=" + this.options.orderId,
      });
    },

    /**
     * 去支付
     * 1.弹框隐藏状态 清空支付信息。先获取支付信息，看是否是合并支付。
     * 2.如果是合并支付，弹起支付信息弹框，保存支付信息
     * 3.再次点击支付，如果弹框显示状态则进行支付
     */
    gotoPay() {
      if (!this.payShow) {
        this.setData({
          mergePayInfo: undefined,
        });
        var samplingGoods = [];
        this.detialData.productList.forEach((item) => {
          if (item.goodsSpuId) {
            samplingGoods.push(item.goodsSpuId);
          }
        });
        uni.$api
          .apiRequest("getPayInfoForPay", {
            orderId: this.detialData.orderId,
            orgId: this.detialData.orgId,
            openId: uni.$localStorage.getItem("userOpenId"),
          })
          .then((res) => {
            if (res.code == 10000 && res.data) {
              if (res.data.orderInfoList) {
                this.setData({
                  samplingGoods: samplingGoods,
                  mergePayInfo: res.data,
                  payShow: true,
                });
              } else {
                uni.$util.weChatPay({
                  ...res.data.payParamInfo,
                  route: this.route,
                  goodsIds: samplingGoods,
                });
              }
            }
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import './order-detail.scss';
.qrcode {
  padding: 50upx 0 20upx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  text-align: center;
}
</style>
<style lang="less">
.cancelView {
  .u-radio__icon-wrap--checked {
    background: #fe5d4d !important;
    border-color: #fe5d4d !important;
  }
}
</style>
