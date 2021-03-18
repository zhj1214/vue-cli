<template>
  <view class="card coupon-card-3" @tap="onTap(card)">
    <view class="content">
      <view class="left">
        <view class="title one-line">
          {{ card.couponName || '--' }}
        </view>
        <view class="desc">
          <text class="text">{{
            card.couponContent ||
              '-- '
          }}</text>
          <!-- <text class="unit">元</text> -->
        </view>
        <view class="time one-line">
          {{ getDate(card.couponEndTime, card.couponStartTime) }}
        </view>
      </view>
      <!-- <view class="right">
        免费领取
      </view> -->
    </view>
  </view>
</template>

<script>
export default {
  name: 'coupon-card-3',
  props: {
    card: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  methods: {
    getDate(startTime, endTime) {
      return startTime
        ? `${new Date(startTime).Format('YYYY-MM-DD')}-${new Date(
            endTime
          ).Format('YYYY-MM-DD')}`
        : '领券当日起2日内可用';
    },

     onTap(item){
      // 优惠券跳转
      uni.navigateTo({
        url: `/pages/myCardCoupon/couponCenter/couponCenterDetail?couponContactId=${item.couponId}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.coupon-card-3 {
}
.card {
  width: 280rpx;
  height: 160rpx;
  background: url(https://eos-wuxi-1.cmecloud.cn/crmoss/3563d976-0def-4c34-828d-467c671ba66c.png);
  background-size: cover;
  .content {
    padding: 0 20rpx;
    width: 240rpx;
    height: 160rpx;
    display: flex;
    align-items: center;
    position: relative;
    .left {
      // padding: 10rpx 0;
      padding-top: 10rpx;
      width: 176rpx;
      font-size: 24rpx;
      height: 150rpx;
      position: relative;
      .title {
        color: #444444;
        font-size: 20rpx;;
      }
      .desc {
        margin-top: 4rpx;
        // font-weight: bold;
        font-size: 24rpx;
        color: #fe5d4d;
        // height: 52rpx;
        // line-height: 52px;
        .text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .unit {
          margin-left: 10rpx;
          font-size: 24rpx;
        }
      }
      .time {
        transform-origin: left;
        font-size: 22rpx;
        color: #929497;
        position: absolute;
        bottom: 10rpx;
        width: 176rpx;
      }
    }
    .right {
      width: 64rpx;
      text-align: center;
      padding: 0 12rpx;
      flex-shrink: 0;
      color: #fff;
      font-size: 24rpx;
    }
  }
}
</style>
