<template>
  <view class="app-shop-header">
    <navBar :title="card.shopName" background="#fff"></navBar>
    <view class="shop-bar">
      <image class="shop-bar__logo" :src="card.logoUrl"></image>
      <view class="shop-bar__bd">
        <view class="shop-bar__bd--title">
          <view class="text">{{ card.shopName }}</view>
          <view class="tag">{{ tagflag }}</view>
        </view>
        <view class="shop-bar__bd--desc">
          {{ card.marketName || '--' }} | 商品数：{{
            card.goodsCount || 0
          }}
          品牌数：{{ card.brandCount || 0 }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'app-shop-header',
  props: {
    card: {
      type: Object,
      default() {
        return {
          logoUrl: '/static/images/shop/logo.png',
          shopName: '--',
        };
      },
    },
    isMallFlag: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tagflag() {
      if (this.isMallFlag) {
        return '商场';
      }
      return '店铺';
    },
  },
};
</script>

<style lang="less" scoped>
.app-shop-header {
  background-color: #fff;
  .shop-bar {
    display: flex;
    padding: 24rpx 40rpx;
    &__logo {
      margin-right: 16rpx;
      width: 80rpx;
      height: 80rpx;
      border-radius: 4rpx;
    }
    &__bd {
      flex: 1;
      &--title {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        font-size: 32rpx;
        color: #2e2e2e;
        .tag {
          margin-left: 20rpx;
          padding: 4rpx 10rpx;
          font-size: 24rpx;
          color: #fe5d4d;
          background-color: #ffd7d4;
          border-radius: 4rpx;
        }
      }
      &--desc {
        color: #9a9a9a;
        font-size: 24rpx;
      }
    }
  }
}
</style>
