<template>
  <view class="ht-activity-card" @tap="onTap(card)">
    	<u-image width="100%" height="320rpx" :src="card.activityLogo" mode="aspectFill"></u-image>
    <view class="ht-activity-card__title">{{ card.title }}</view>
  </view>
</template>

<script>
export default {
  name: 'ht-activity-card',
  props: {
    card: {
      type: Object,
      default() {
        return {
         
        };
      },  
    },
  },
  methods: {
    onTap(item){
      uni.navigateTo({
        url: `/pagesA/activity/activityDetail?activityId=${item.id}`
      })
    }
  }
};
</script>

<style lang="less" scoped>
.ht-activity-card {
  border-radius: 8rpx;
  border: 1rpx solid #e1e6eb;
  overflow: hidden;
  margin-bottom: 20rpx;
  &__title {
    padding: 20rpx 28rpx;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
