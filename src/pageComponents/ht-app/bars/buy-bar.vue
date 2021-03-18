<template>
  <view class="ht-buy-bar">
    <view class="fill"></view>
    <view class="bar">
      <view class="bar__left">
        <view class="bar__left--item" @tap="onTapShop">
          <image
            class="icon"
            mode="widthFix"
            src="/static/images/store/goods/shop.png"
          ></image>
          <view class="text">店铺</view>
        </view>
        <view class="bar__left--item" @tap="onTapCart">
          <view class="cart">
            <image
              class="icon"
              mode="widthFix"
              src="/static/images/store/goods/cart.png"
            ></image>
            <view v-if="num" class="dot">{{num}}</view>
          </view>
          <view class="text">购物车</view>
        </view>
      </view>
      <view class="bar__right">
        <button class="btn btn-add" hover-class="hover" @tap="onTapCartAdd">加入购物车</button>
        <button class="btn btn-buy" hover-class="hover" @tap="onTapBuy">立即购买</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-buy-bar',
  props: {
    num: {
      type: Number,
      default: 0
    }
  },
  methods: {
    
    onTapCart(){
      this.$emit('cart')
    },
    onTapShop(){
      this.$emit('shop')
    },
    onTapCartAdd(){
      this.$emit('cart-add')
    },
    onTapBuy(){
      this.$emit('buy')
    },
  }
};
</script>

<style lang="less" scoped>
.ht-buy-bar {
  .fill {
    height: 132rpx;
  }
  .bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 26rpx 20rpx;
    background-color: #fff;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    z-index: 100;
    &__left {
      flex: 1;
      display: flex;
      &--item {
        flex: 1;
        height: 80rpx;
        text-align: center;
        margin-right: 20rpx;
        color: #404040;
        .cart{
          position: relative;
          width: 40rpx;
          display: inline-block;
          .dot{
            position: absolute;
            top: -10rpx;
            left: 25rpx;
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            font-size: 24rpx;
            color: #fff;
            border-radius: 50%;
            background-color: #FF595F;
          }
        }
        .icon {
          width: 40rpx;
          height: 40rpx;
        }
        .text {
          font-size: 24rpx;
        }
      }
    }
    &__right {
      flex-shrink: 0;
      display: flex;
      .btn {
        font-size: 28rpx;
        color: #000;
        line-height: 80rpx;
      }
      .btn-add {
        width: 200rpx;
        margin-right: 20rpx;
        background-color: #fff;
      }
      .btn-buy {
        width: 200rpx;
        background-color: #fe5d4d;
        color: #fff;
      }
      .hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
