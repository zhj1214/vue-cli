<template>
  <view class="ht-coupon-card">
    <view class="ht-coupon-card__left">
      <image
        class="card__img"
        mode="widthFix"
        src="https://eos-wuxi-1.cmecloud.cn/crmoss/7b478bdc-da54-44e6-b4fb-2ec3204b71ac.png"
      ></image>
    </view>
    <view class="ht-coupon-card__middle">
      <view class="middle__hd">
        <view class="middle__hd--title">通用兑换券</view>
        <u-tag
          type="info"
          mode="plain"
          size="mini"
          text="兑换指定商品"
          color="#D8D8D8"
          border-color="#D8D8D8"
        ></u-tag>
      </view>
      <view class="middle__bd">
        <view class="middle__bd--desc">此券仅限线下商城使用</view>
        <view class="middle__bd--time">2018.11.02 ~ 2019.11.02</view>
      </view>
    </view>
    <view class="ht-coupon-card__right">
      <view class="ht-coupon-card__right--text">
        免费领取
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-coupon-card',
};
</script>

<style lang="less" scoped>
.ht-coupon-card {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin-left: -20rpx;
  width: 710rpx;
  height: 220rpx;
  background: url(https://eos-wuxi-1.cmecloud.cn/crmoss/6207cdaa-15fd-4cfa-9c8d-975868fa2dff.png) #fff;
  background-size: 100%;

  &__middle {
    flex: 1;
    .middle__hd {
      display: flex;
      align-items: center;
      margin-bottom: 28rpx;
      font-size: 28rpx;
      color: #222;
      &--title {
        margin-right: 10rpx;
      }
    }
    .middle__bd {
      font-size: 24rpx;
      &--desc {
        color: #c0c0c0;
        margin-bottom: 10rpx;
      }
      &--time {
        color: #929497;
      }
    }
  }
  &__right {
    width: 100rpx;
    &--text {
      padding: 10rpx 40rpx;
      color: #fff;
    }
  }

  .card__img {
    width: 140rpx;
    margin: 20rpx;
  }
}
</style>
