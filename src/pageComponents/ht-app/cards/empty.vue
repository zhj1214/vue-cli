<template>
  <view class="ht-empty">
    <image mode="widthFix" class="ht-empty__img" :src="card.img"></image>
    <view class="ht-empty__text">{{ card.text }}</view>
  </view>
</template>

<script>
export default {
  name: 'ht-empty',
  props: {
    card: {
      type: Object,
      default() {
        return {
          img: 'https://eos-wuxi-1.cmecloud.cn/crmoss/69327aa1-b56e-4cac-abb4-429f6ee1506e.png',
          text: '暂无相关记录'
        };
      },
    },
  },
};
</script>

<style lang="less">
.ht-empty {
  text-align: center;
  margin-top: 100rpx;
  &__img {
    margin-top: 120rpx auto;
    width: 280rpx;
  }
  &__text {
    margin-top: 28rpx;
    font-size: 22rpx;
    color: #444444;
    text-align: center;
  }
}
</style>
