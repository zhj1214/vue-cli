<template>
  <view>
    <view>
      <view class="contentView" @click="jumpDetailPage">
        <!-- hearder -->
        <view class="headerView flexStyle">
          <view class="headerText" v-if="isRefund"
            >{{ isRefund ? "退单" : "订单" }}编号：{{
              isRefund ? cell.refundNo : cell.orderNo
            }}</view
          >
          <view class="headerView flex-row" @click.stop="jumpShop" v-else>
            <image
              v-if="cell.shopLogolUrl"
              style="width: 42rpx;height: 42rpx;margin-right: 20rpx;"
              :src="cell.shopLogolUrl"
              mode=""
            ></image>
            <view class="headerText" style="margin-right: 20rpx;line-height: 22px; flex: 1;">{{
              cell.shopName
            }}</view>
            <image
              style="width: 8px; height: 13px"
              src="../../../static/images/jtr.png"
              mode=""
            ></image>
          </view>
          <view
            class="headerText"
            :style="
              'color:' +
                (currentOrderStatus == '待付款'
                  ? '#F6605E;'
                  : currentOrderStatus == '待核销'
                  ? '#01A698'
                  : currentOrderStatus == '已关闭'
                  ? '#C8C8C8;'
                  : currentOrderStatus == '已完成'
                  ? '#C8C8C8;'
                  : currentOrderStatus == '待发货'
                  ? '#7676B4;'
                  : currentOrderStatus == '待提货'
                  ? '#F9800B;'
                  : currentOrderStatus == '待收货'
                  ? '#F9800B;'
                  : currentOrderStatus == '交易完成'
                  ? '#C8C8C8;'
                  : currentOrderStatus == '退款成功'
                  ? '#C8C8C8;'
                  : '')+';min-width: 57px;'
                  
            "
            >{{ isRefund ? refundStr : currentOrderStatus
            }}{{
              currentOrderStatus == "待核销" ? "(" + notExchange + ")" : ""
            }}</view
          >
        </view>
        <!-- content -->
        <view
          v-for="(item, index) in cell.productList"
          :key="index"
          class="order-content"
        >
          <view class="contentOne">
            <image
              class="imageView"
              mode="aspectFit"
              :src="item.productImg"
              alt="商品"
            ></image>
            <view class="order-content-info">
              <view>
                <view class="contentTitle twoLinesText">{{
                  item.productName
                }}</view>
                <view class="contentDesc">规格：{{ item.productSpec }}</view>
              </view>
              <view class="order-content-info_footer">
                <view class="contentR_number">{{
                  func.handlePrice(
                    item.productPrice,
                    item.productScore,
                    ponitName
                  )
                }}</view>
                <view class="contentTwo">
                  <view class="content-desc-info" v-if="item.productRefundStatus === 1 || item.productRefundStatus === 2">{{ item.productRefundStatusStr }}</view>
                  <view class="content-num" style="text-align: right"
                    >x{{ item.productNum }}</view
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 价格和运费 -->
        <!-- 合计 -->
        <view class="footerTitlebg" style="align-items: center;">
          <span class="footerTitle">{{ isRefund ? "退款" : "总" }}金额：</span>
          <pandp
            v-if="isRefund"
            priceStyle="font-size: 14px !important;"
            pointStyle="font-size: 14px !important;"
            :price="cell.totalPrice"
            :point="cell.refundPayScore"
          ></pandp>
          <pandp
            v-else
            priceStyle="font-size: 14px !important;"
            pointStyle="font-size: 14px !important;"
            :price="cell.payMoney"
            :point="cell.payScore"
          ></pandp>
          <!-- <span class="footerPrice">{{ isRefund?cell.payScore:cell.payScore }}{{ponitName}}</span> -->
          <!-- {{cell.expressMoney}} -->
          <span class="Freight" v-if="cell.expressType === 1 && cell.expressMoney"
            >（含运费￥{{ cell.expressMoney }}）</span
          >
        </view>

        <!-- footer -->
        <view class="footerView">
          <!-- 支付 -->
          <view
            class="flexStyle"
            v-if="currentOrderStatus == '待付款' && downTime >= 0"
            style="
              justify-content: flex-end;
              border-bottom: initial;
              height: 60px;
            "
          >
            <view
              class="footerButton kongStyle mr20"
              @tap.stop="confirmReceipt"
              data-type="2"
              >取消</view
            >
            <view
              class="downBtn footerButton"
              @tap.stop="gotoPay"
              >支付(
              <u-count-down
                :timestamp="downTime"
                :show-days="false"
                :show-hours="false"
                bg-color="transparent"
                :separator-color="theme.color"
                :color="theme.color"
              ></u-count-down
              >)
            </view>
          </view>
          <!-- 评价 -->
          <!-- v-else-if="currentOrderStatus == '交易完成' && cell.commentStatus == 1" -->
          <view
            class="footerButton flexStyle"
            v-else-if="false"
            :style="theme.btn"
            @tap.stop="gotoEvaluation"
          >
            <text>评价</text>
          </view>
          <!-- 确认收货 -->
          <view
            class="flexStyleBtn pb20"
            v-else-if="currentOrderStatus == '待收货' && !cell.refundTypeStr"
          >
            <!-- <view
                    class="footerButton kongStyle mr20"
                    @tap.stop="viewLogistics"
                    >查看物流</view
                > -->
            <view
              class="footerButton confirm-receipt"
              data-type="1"
              @tap.stop="confirmReceipt"
              >确认收货</view
            >
          </view>
          <!-- <view
                  class="footerButton flexStyle"
                  wx:elif="{{currentOrderStatus == '已发货'}}"
                  style="justify-content: center"
                  catchtap="gotoPay"
              >
                  <text>查看物流</text>
              </view> -->
        </view>
      </view>
    </view>
    <!-- 弹框 -->
    <u-popup v-model="showAlert" mode="center" border-radius="12" :width="554">
      <view class="showAlertStyle">
        <view class="header headerPadding">
          <view class="header-title">确认收货</view>
          <image
            style="width: 24px; height: 24px"
            src="/static/images/clear-icon.png"
            @tap.stop="alertCall"
            data-type="0"
          ></image>
        </view>
        <view class="showAlert-content">确认已收到商品？</view>
        <view class="bottomView">
          <view
            class="cancel bottomView-title"
            style="color: #2e2e2e"
            @tap.stop="alertCall"
            data-type="0"
            >取消</view
          >
          <view
            class="ok bottomView-title"
            style="color: white"
            @tap.stop="alertCall"
            data-type="1"
            >确认</view
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script module="func" lang="wxs" src="../../../utils/utilFunc.wxs"></script>

<script>
const app = getApp();
import pandp from "../../../pageComponents/priceAndPoint/priceAndPoint";
export default {
  components: {
    pandp,
  },
  data() {
    return {
      theme: uni.$theme,
      ponitName: app.globalData.pointName,
      buttonTime: "",
      currentOrderStatus: "",
      orderGoodsTotals: 0,
      notExchange: 0,
      // 倒计时
      downTime: 0,
      timeData: {},
      // 是不是退单cell
      isRefund: false,
      // 确认弹框
      showAlert: false,
      refundStr: "",
    };
  },
  props: {
    cell: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [],
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  beforeMount: function() {
    // 在组件实例进入页面节点树时执行
    // console.log('attached')
  },
  moved: function() {
    // console.log('moved')
  },
  // 在组件实例被移动到节点树另一个位置时执行
  destroyed: function() {
    // console.log('detached')
  }, //在组件实例被从页面节点树移除时执行
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  beforeMount: function() {
    // console.log('旧attached')
    // 在组件实例进入页面节点树时执行
  },
  destroyed: function() {
    // console.log('旧detached')
    // 在组件实例被从页面节点树移除时执行
  },
  // 布局完成
  mounted: function() {
    // 订单状态
    this.setData({
      currentOrderStatus: this.getOrderStatus() || "",
    }); // 订单退单状态
    // 5：退款成功；6：退款失败；7：退款关闭

    let zt = this.cell.refundStatus;
    this.setData({
      isRefund: this.cell.refundTypeStr ? true : false,
      refundStr:
        zt == 5
          ? "退款成功"
          : zt == 6
          ? "退款失败"
          : zt == 7
          ? "退款关闭"
          : "退款中",
    }); // 订单总数量、待核销数量

    this.getOrderGoodsNumbers(); // 倒计时

    if (this.currentOrderStatus == "待付款") {
      let tjg = new Date().getTime() - this.cell.orderCreateTime;
      this.setData({
        downTime: tjg >= 1800000 ? 0 : (1800000 - tjg) / 1000,
      });
    }
  },
  // 组件所在页面的生命周期函数
  onPageShow: function() {
    // console.log('show')
  },
  onPageHide: function() {
    // console.log('hide')
  },
  onPageResize: function() {
    // console.log('resize')
  },
  methods: {
    /**
     * 倒计时结束
     * */
    timeFinish() {
      if (this.downTime < 0) {
        const countDown = this.selectComponent(".control-count-down");
        countDown.pause();
      } else {
        this.setData({
          currentOrderStatus: "已关闭",
        });
      }
    },

    onChange(e) {
      e.detail.minutes = this.timeFormat(e.detail.minutes);
      e.detail.seconds = this.timeFormat(e.detail.seconds);
      this.setData({
        timeData: e.detail,
      });
    },

    timeFormat(param) {
      //小于10的格式化函数
      return param < 10 ? "0" + param : param;
    },

    /**
     * 计算 订单状态
     * */
    getOrderStatus() {
      let t = "";
      app.globalData.orderHeader.forEach((item) => {
        if (item.code == this.cell.orderStatus) {
          t = item.title;
        }
      });
      return t;
    },

    /**
     * 计算 共多少件
     * */
    getOrderGoodsNumbers() {
      var totals = 0;
      var exchange = 0;

      if (this.cell.productList) {
        for (var i = 0; i < this.cell.productList.length; i++) {
          let item = this.cell.productList[i];
          totals = totals + item.productNum;

          if (item.orderStatus == "3") {
            exchange = exchange + item.productNum;
          }
        }
      }

      this.setData({
        orderGoodsTotals: totals,
        notExchange: exchange,
      });
    },

    /**
     * 吊起微信支付
     * */
    gotoPay() {
      var samplingGoods = [];
      this.cell.productList.forEach((item) => {
        if (item.goodsSpuId) {
          samplingGoods.push(item.goodsSpuId);
        }
      });
      this.$emit("gotoPay", {
        detail: {
          orderId: this.cell.orderNo,
          orgId: this.cell.orgId,
          openId: uni.$localStorage.getItem("userOpenId"),
          samplingGoods: samplingGoods,
        },
      });
    },

    /**
     * 操作按钮 1确认收货2取消订单3删除订单
     * */
    confirmReceipt(e) {
      console.log(e.currentTarget.dataset.type);

      if (e.currentTarget.dataset.type == 1) {
        this.setData({
          showAlert: true,
        });
      } else if (e.currentTarget.dataset.type == 2) {
        this.$emit("cancelOrder", {
          detail: e.currentTarget.dataset.item,
        });
      }
    },

    alertCall(e) {
      console.log(e.currentTarget.dataset.type);
      if (e.currentTarget.dataset.type == 1) {
        uni.$api
          .apiRequest("orderDetailOperating", {
            orderId: this.cell.orderNo,
            orgId: this.cell.orgId,
            memberId: uni.$localStorage.getItem("memberId"),
            operType: e.currentTarget.dataset.type,
          })
          .then((res) => {
            if (res.code == 10000) {
              this.setData({
                showAlert: false,
              });
              uni.$alert.showToast("收货成功");
              var self = this;
              setTimeout(() => {
                self.reloadListData();
                // self.gotoEvaluation();
              }, 1500);
            }
          });
      } else {
        this.setData({
          showAlert: false,
        });
      }
    },

    /**
     * 收货成功切换至全部订单
     * */
    reloadListData() {
      this.$emit("reloadListData", {
        type: 0,
      });
    },
    /**
     * 去评价
     * */
    gotoEvaluation() {
      // uni.navigateTo({
      // 	url: '/pages/order/Evaluation/evaluation?orderId=' + this.cell.orderNo
      // });
    },

    /**
     * 查看物流
     * */
    viewLogistics() {
      if (this.cell.orderSplitFlag) {
        uni.navigateTo({
          url:
            "/pages/my/Logistics/openLogistics?expressListJson=" +
            JSON.stringify(this.cell.expressList),
        });
      } else {
        uni.navigateTo({
          url:
            "/pages/my/Logistics/Logistics?logisticCode=" +
            this.cell.expressList[0].expressNo +
            "&shipperCode=" +
            this.cell.expressList[0].expressCode +
            "&logisticsName=" +
            this.cell.expressList[0].expressName,
        });
      }
    },
    /**
     * 跳转 详情
     * */
    jumpDetailPage() {
      if (this.isRefund) {
        uni.navigateTo({
          url:
            "./orderRefund/orderRefund?orderId=" +
            this.cell.refundNo +
            "&orgId=" +
            this.cell.orgId,
        });
      } else {
        uni.navigateTo({
          url:
            "./order-detail/order-detail?orderId=" +
            this.cell.orderNo +
            "&orgId=" +
            this.cell.orgId,
        });
      }
    },
    /**
     * @description: 跳转到店铺首页
     */
    jumpShop(e) {
      e.stopPropagation();
      console.log("onShopBarTap", this.cell);
      const url = "pagesA/shop/home";
      uni.navigateTo({
        url: `/${url}?shopId=${this.cell.orgId}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./order_cell.scss";

.showAlertStyle {
  height: 364rpx;
  // width: 554rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 40rpx;
}
</style>
