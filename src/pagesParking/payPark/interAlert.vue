<template>
  <view class="view">
    <u-popup
      v-model="isShow"
      mode="bottom"
      border-radius="18"
      :closeable="true"
      @close="closePop"
    >
      <view class="selectCouponPopView">
        <view class="header">
          <view>积分抵扣减免</view>
          <view class="header-desc"
            >{{ interGralObj.discountInfo.scoreRate }}积分兑换0.5小时</view
          >
        </view>
        <view class="content">
          <!-- 计步器 -->
          <view class="jbqview flex-row">
            <view class="jbqBtn" @click="less">-</view>
            <view class="jbqText" style="min-width: 69px"
              >{{ currentNum }}小时</view
            >
            <view class="jbqBtn" @click="plus">+</view>
          </view>
          <!-- 提示 -->
          <view class="contentalert"
            >可用
            <span style="color: #fe5d4d">{{
              interGralObj.discountInfo.score
            }}</span>
            积分，预计消耗<span style="color: #fe5d4d">{{
              currentNum * interGralObj.discountInfo.scoreRate * 2
            }}</span
            >积分。</view
          >
        </view>
        <view class="couponCommitbg flex-center-row"
          ><view
            class="couponCommit flex-center-row"
            @click="commitSelectCoupon"
            >确定</view
          ></view
        >
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    show: Boolean,
    interGralObj: Object,
  },
  data() {
    return {
      isShow: this.show, // 这么写的好处是避免数据还不存在的情况下就初始化弹框
      currentNum: 0,
    };
  },
  computed: {
    gradeDiscountTime() {
      return this.interGralObj.discountInfo.gradeDiscountTime || 0;
    },
    shopDiscountTime() {
      return this.interGralObj.discountInfo.shopDiscountTime || 0;
    },
    // 积分上限
    remainingOffers() {
      return (
        this.interGralObj.parkInfo.payCountTime -
        (this.gradeDiscountTime + this.shopDiscountTime)
      );
    },
  },
  onLoad() {
    console.log("初始化积分");
  },
  watch: {},
  methods: {
    /**
     * 加、减
     * */
    less() {
      if (this.currentNum == 0) return;
      this.currentNum -= 0.5;
    },

    plus() {
      let current = this.currentNum + 0.5;
      if (this.remainingOffers < current) return;
      if(current * 2 * this.interGralObj.discountInfo.scoreRate > this.interGralObj.discountInfo.score) return uni.$alert.showToast('可用积分不足');
      this.currentNum = current;

      
      
    },
    /**
     * 弹框关闭
     * */
    closePop() {
      this.$emit("pointsConsumption");
    },
    commitSelectCoupon() {
      this.$emit("pointsConsumption", {
        scoreTime: this.currentNum,
        score: this.currentNum * this.interGralObj.discountInfo.scoreRate,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.view {
  .selectCouponPopView {
    // padding: 28rpx 0px;
    // padding: 0rpx 40rpx;

    .header {
      margin: 0px 40rpx;
      border-bottom: 1px solid #e5e5e5;
      padding: 24rpx 0px;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    .header-desc {
      margin-top: 3px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #919191;
    }
    .content {
      margin: 0px 40rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 70rpx;
      .jbqview {
        justify-content: center;
        margin-bottom: 15px;
        .jbqText {
          text-align: center;
          margin: 0px 10px;
          font-size: 16px;
          font-family: SFUIDisplay-Light, SFUIDisplay;
          font-weight: 300;
          color: #2e2e2e;
        }
        .jbqBtn {
          color: #7f7f7f;
          text-align: center;
          width: 39px;
          height: 39px;
          line-height: 39px;
          background: #ffffff;
          border: 1px solid #d8d8d8;
        }
      }
      .contentalert {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #919191;
      }
    }
    .couponCommitbg {
      box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.15);
      width: 100vw;
      padding: 20rpx 40rpx;
      padding-bottom: 20px;
      .couponCommit {
        width: 100%;
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
  }
}
</style>
