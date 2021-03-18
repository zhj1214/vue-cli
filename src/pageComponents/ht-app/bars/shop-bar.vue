<template>
  <view class="ht-shop-bar" @tap="onTap(info)">
    <view class="ht-shop-bar__left">
      <image class="logo" :src="info.logo || '/static/images/picNotData.png'"></image>
    </view>
    <view class="ht-shop-bar__middle">
      <view class="title">
        <view class="text">{{ info.shopName }}</view>
        <view class="tag">{{ tagflag }}</view>
      </view>
      <view class="desc">
        {{ info.marketName || '--' }} | 商品数{{
          info.saleSpuCount || '--'
        }}
        品牌数{{ info.brandCount || '--' }}
      </view>
    </view>
    <view class="ht-shop-bar__right">
      <view class="btn">进店</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-shop-bar',
  props: {
    info: {
      type: Object,
      default() {
        return {
          logo:
            'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=612537270,4229148240&fm=111&gp=0.jpg',
          shopName: '滴哦专柜',
          marketName: '滴哦专柜 滴哦专柜 滴哦专柜 滴哦专柜',
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

  methods: {
    onTap(item){
    
      this.$emit('barTap', item)
    }
  }
};
</script>

<style lang="less" scoped>
.ht-shop-bar {
  display: flex;
  margin: 22rpx 42rpx;
  padding: 24rpx 28rpx;
  align-items: center;
  background-color: #fff;

  border-radius: 8rpx;
  border: 1px solid #eaeaea;
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
      font-size: 26rpx;
      color: #2e2e2e;
      .text{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .tag {
        margin-left: 20rpx;
        min-width: 70rpx;
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
    flex-shrink: 0;
    width: 100rpx;
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
