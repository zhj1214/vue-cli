<template>
  <view class="ht-shop-bar-full" @tap="onTap(info)">
    <view class="ht-shop-bar-full__left">
      <image class="logo" :src="info.logoUrl"></image>
    </view>
    <view class="ht-shop-bar-full__middle">
      <view class="title">
        <view class="text">{{ info.shopName || '--' }}</view>
        <view class="tag">{{ tagflag }}</view>
      </view>
      <view class="desc"
        >{{ info.marketName || '--' }} | 商品数{{
          info.goodsCount || '--'
        }}
        品牌数{{ info.brandCount || '--' }}</view
      >
    </view>
    <view class="ht-shop-bar-full__right">
      <view class="btn">进店</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-shop-bar-full',
  props: {
    info: {
      type: Object,
      default() {
        return {};
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

  methods: {
    onTap(item) {
      this.$emit('barTap', item);
    },
  },
};
</script>

<style lang="less" scoped>
.ht-shop-bar-full {
  margin-bottom: 20rpx;
  display: flex;
  padding: 24rpx 28rpx;
  align-items: center;
  background-color: #fff;

  &__left {
    .logo {
      width: 76rpx;
      height: 76rpx;
      border-radius: 4rpx;
    }
  }
  &__middle {
    padding: 0 20rpx;
    flex: 1;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      font-size: 32rpx;
      color: #2e2e2e;
      .text {
         overflow:hidden;
         white-space:nowrap;
         max-width: 208px;
      }
      .tag {
        margin-left: 20rpx;
        padding: 4rpx 10rpx;
        font-size: 24rpx;
        color: #fe5d4d;
        background-color: #ffd7d4;
        border-radius: 4rpx;
      }
    }
    .desc {
      font-size: 20rpx;
      color: #9a9a9a;
    }
  }
  &__right {
    .btn {
      color: #fe5d4d;
      font-size: 24rpx;
      padding: 8rpx 20rpx;
      border-radius: 50rpx;
      border: 1px solid #fe5d4d;
    }
  }
}
</style>
