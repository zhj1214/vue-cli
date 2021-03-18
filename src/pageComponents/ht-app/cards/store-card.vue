<template>
  <view class="ht-store-card">
    <view v-if="card.title" class="ht-store-card__hd">{{ card.title }}</view>
    <view v-if="card.sub" class="ht-store-card__hd-sub">{{ card.sub }}</view>
    <view class="ht-store-card__bd">
      <view
        v-for="(item, i) in card.stores"
        :key="i"
        class="ht-store-card__bd--item"
      >
        <view class="item-card">
          <view class="item__title">
            {{ item.name }}
            <view class="item__title--tag">{{ item.tag }}</view>
          </view>
          <view class="item__distance">{{ item.distance }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-store-card',
  props: {
    card: {
      type: Object,
      default() {
        return {
          title: '推荐商场',
          sub: 'B 北京',
          stores: [
            {
              name: '恒泰象山店发的发顺丰',
              tag: '最近',
              distance: '0.4km',
            },
            {
              name: '恒泰象山店',
              tag: '最近',
              distance: '0.4km',
            },
            {
              name: '恒泰象山店',
              tag: '最近',
              distance: '0.4km',
            },
          ],
        };
      },
    },
  },
};
</script>

<style lang="less" scoped>
.ht-store-card {
  padding: 0 40rpx;
  &__hd {
    display: flex;
    margin-top: 20rpx;
    color: #9a9a9a;
  }
  &__hd-sub {
    margin-top: 20rpx;
    padding: 8rpx 20rpx;
    color: #444;
    background: #f5f5f5;
    border-radius: 4rpx;
  }
  &__bd {
    margin-top: 20rpx;
    display: flex;
    flex-wrap: wrap;
    &--item {
      margin-bottom: 20rpx;

      width: 50%;

      &:nth-child(2n) {
        padding-left: 10rpx;
      }
      &:nth-child(2n + 1) {
        padding-right: 10rpx;
      }
    }
    .item-card {
      display: flex;
      align-items: center;
      padding: 16rpx 12rpx;
      justify-content: space-between;
      font-size: 24rpx;
      border-radius: 2rpx;
      border: 1rpx solid #dbdbdb;
    }
    .item__title {
      padding-right: 10rpx;
      align-items: center;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      &--tag {
        min-width: 64rpx;
        font-size: 24rpx;
        margin-left: 4rpx;
        padding: 2rpx 6rpx;
        color: #fe5d4d;
        border: 1rpx solid #fe5d4d;
        border-radius: 4rpx;
      }
    }
  }
}
</style>
