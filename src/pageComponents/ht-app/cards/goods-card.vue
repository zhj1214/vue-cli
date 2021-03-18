<template>
  <view class="ht-goods-card" @tap="onTap(card)">
     <image
      mode="widthFix"
      class="ht-goods-card__img"
      :src="card.mainImageUrl || card.imgUrl || '/static/images/picNotData.png'"
    >
    </image>
    <view class="ht-goods-card__title two-line">
      {{ card.title || card.goodsName || card.secondName || '--' }}
    </view>
    <view class="ht-goods-card__price">
      <view class="now">
        <text v-if="card.priceMoney">￥{{ card.priceMoney }}</text>
        <text v-if="card.priceMoney&&card.pricePoint">+</text>
        <text v-if="card.pricePoint">{{ card.pricePoint }} 积分</text>
      </view
      >
      <!-- <view class="now"> {{card.pricePoint}} 积分</view> -->
      <view class="origin" v-if="card.showWorthToMember && card.goodsType==1 && card.prePrice"> ¥{{ card.prePrice }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-goods-card',
  props: {
    card: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    onTap(item) {
      this.$emit('cardTap', item);
    },
  },
};
</script>

<style lang="less">
.ht-goods-card {
  width: 100%;
  background-color: #fff;
  border: 1px solid #EAEAEA;
  border-radius: 6px;
  &__img {
    width: 100%;
    height: 163px!important;
  }
  &__title {
    padding: 0px 16rpx;
    color: #2e2e2e;
    font-weight: bold;
    height: 84rpx;
  }
  &__price {
    display: flex;
    align-items: baseline;
    text-indent: 16rpx;
    margin-bottom: 18rpx;
    .now {
      color: #ff4c4c;
      font-weight: bold;
      padding-right: 10rpx;
      word-break: break-all;
    }
    .origin {
      text-decoration: line-through;
      font-size: 24rpx;
      color: #929497;
      word-break: break-all;
    }
  }
}
</style>
