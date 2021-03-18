<template>
  <view class="ht-empty2">
    <image mode="widthFix" class="ht-empty2__img" :src="card.img"></image>
    <view class="ht-empty2__text">{{ card.text }}</view>
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
          img: 'https://eos-wuxi-1.cmecloud.cn/crmoss/25abd4d5-dd07-45db-abea-d58de4a0719d.png',
          text: '暂无搜索结果~'
        };
      },
    },
  },
};
</script>

<style lang="less">
.ht-empty2 {
  text-align: center;
  margin-top: 100rpx;
  &__img {
    margin-top: 120rpx auto;
    width: 280rpx;
  }
  &__text {
    margin-top: 28rpx;
    font-size: 36rpx;
    color: #7F7F7F;
    text-align: center;
  }
}
</style>
