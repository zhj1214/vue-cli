<template>
  <view :class="seperator ? 'ht-brand-card card seperator': 'ht-brand-card card'" @tap="onTap(card)">
    <view class="card__left">
      <image class="card__left--img" mode="aspectFix" :src="card.logo || '/static/images/picNotData.png'"></image>
    </view>
    <view class="card__right">
      <view class="title">{{ card.name || '--' }}</view>
      <view class="desc">{{ card.profile || '--' }}</view>
      <view v-if="!isDetail" class="more">
        <text class="more--text">查看全部商品</text>
        <u-icon name="arrow-right" color="#FE5D4D" size="28"></u-icon>
      </view>
      <view v-if="isDetail" class="more" style="color: #2E2E2E;">
        <text class="more--text">共{{total}}件商品</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-brand-card',
  props: {
    card: {
      type: Object,
      default() {
        return {
        };
      },
    },
    seperator: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      detault: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onTap(item){
      this.$emit('cardTap', item)
    }
  }
};
</script>

<style lang="less" scoped>
// .ht-brand-card {
//   border-bottom: 1px solid #f3e7e7;
// }
// .ht-brand-card:nth-last-child(1) {
//   border-bottom: 0;
// }
.seperator{
  position: relative;

 &:after {
    position: absolute;
    content: ' ';
    bottom: 0;
    left: 40rpx;
    right: 40rpx;
    height: 1px;
    background-color: #dadada;
  }
}
.seperator:nth-last-child(1) {
  &:after {display: none;}
}
.card {
  display: flex;
  padding: 40rpx;
  background-color: #fff;

  &__left {
    width: 200rpx;
    height: 200rpx;
    margin-right: 28rpx;
    &--img {
      width: 100%;
      height: 100%;
    }
  }
  &__right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .title{
      color: #2E2E2E;
      font-size: 32rpx;
    }
    .desc{
      flex: 1;
      margin-top: 8rpx;
      color: #9A9A9A;
      font-size: 24rpx;
    }
    .more {
      color: #fe5d4d;
      &--text {
        margin-right: 10rpx;
      }
    }
  }
}
</style>
