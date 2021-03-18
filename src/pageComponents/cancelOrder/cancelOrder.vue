<template>
  <!--components/cancelOrder/cancelOrder.wxml-->
  <view class="view">
    <!-- 取消订单 -->
    <u-popup v-model="show" mode="bottom" border-radius="18" @close="onClose">
      <view class="cancelOrder-header">
        <view class="cancelOrder-header-title">取消订单</view>
        <view class="cancelOrder-header-desc"
          >取消后，优惠券等将退回，有效期内可继续使用</view
        >
      </view>
      <!-- 取消原因 -->
      <view class="cancelView">
        <view class="cancelInfo">请选择取消订单原因</view>
        <u-radio-group v-model="cancelOrderRadio" active-color="#fe5d4d" @change="onChange">
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
            style="background: #F2F2F2;color: #717171;"
            @tap.stop="onCancelOrder"
            data-type="0"
            >暂不取消</view
          >
          <view
            class="cancelBottomView-btn"
            style="background: #FE5D4D;color: #FFFFFF;"
            @tap.stop="onCancelOrder"
            data-type="1"
            >确认取消</view
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // isShow: true,
      // 是否展示取消订单
      cancelOrderRadio: "1",
    };
  },
  props: {
    item: Object,
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show(newVal, oldVal) {
      // console.log(newVal,'_______',oldVal)
      // this.isShow = newVal;
    },
  },
  methods: {
    /**
     * 取消订单
     * */
    onChange(event) {
      console.log(event);
      this.setData({
        cancelOrderRadio: event,
      });
    },

    /**
     * 关闭 pop
     * */
    onClose() {
      // this.isShow = false;
      // this.show = false
      this.$emit("onClose");
    },

    onCancelOrder(e) {
      if (e.currentTarget.dataset.type == "1") {
        this.confirmReceipt();
      } else {
        this.onClose();
      }
    },

    confirmReceipt() {
      let tkry = ["我不想买了", "信息填写错误，重新拍", "商家缺货", "其他原因"];
      uni.$api
        .apiRequest("orderDetailOperating", {
          orderId: this.item.orderNo,
          orgId: this.item.orgId,
          memberId: uni.$localStorage.getItem("memberId"),
          cancelReason: tkry[this.cancelOrderRadio],
          operType: 2,
        })
        .then((res) => {
          if (res.code == 10000) {
            this.$emit("onCancelOrder");
          }
        });
    },
  },
};
</script>
<style scoped>
@import "./cancelOrder.css";
</style>
<style lang="less">
// .view {
//   .cancelView {
//     .u-radio__icon-wrap--checked {
//       background: #fe5d4d !important;
//       border-color: #fe5d4d !important;
//     }
//   }
// }
</style>
