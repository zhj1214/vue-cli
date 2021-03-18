<template>
  <view class="ht-coupon-card-2" @tap="onTap(card)">
    <view class="card__left">
      <image class="card__left--img" style="width:90px;height:90px;" mode="" :src="card.couponUrl || 'https://eos-wuxi-1.cmecloud.cn/crmoss/68dfe246-9df5-4a14-beae-f5878fda1b0b.png'"></image>
    </view>
    <view class="card__middle">
      <!-- <view class="title">{{card.couponName || '--'}}</view>
      <view class="desc">
        <text class="text">{{card.couponContent || '--'}}</text>
      </view> -->
      <view class="color" v-if="card.couponType=='EXCHANGE'" style="font-size:14px;color:#fe5d4d;font-weight: 400;">{{ card.couponContent }}</view>
      <view class="title" v-if="card.couponType!=='EXCHANGE'"><text style="font-weight: 600;">{{ card.amount }}</text><text style="font-size:12px;margin-left: 2px;">{{card.couponType=='DISCOUNT'?'折':'元'}}</text></view>
      <view class="couponTypeName">{{card.couponTypeName}}</view>
      <view class="color couponType-style" v-if="card.couponType=='REDUCTION' || card.couponType=='DISCOUNT'">消费满{{ card.useThresholdAmount }}可用</view>
      <view class="time" :style="{marginTop: card.couponType=='REDUCTION' || card.couponType=='DISCOUNT'?0:10 + 'px'}">{{ computedTime(card) }}</view>
      <view class="card__right">
        <view class="btn">
          免费领取
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-coupon-card-2',
  props:{
    card: {
      type: Object,
      default(){
        return {
        }
      }
    }
  },
  data () {
    return {
      couponCard: {
        DISCOUNT: '折扣券',
        REDUCTION: '满减券',
        EXCHANGE: '兑换券',
        CARRIAGE: '运费券',
        CASH: '现金券',
        PARK: '停车券'
      }
    }
  },
  methods: {
    onTap(item){
      // 优惠券跳转
      uni.navigateTo({
        url: `/pages/myCardCoupon/couponCenter/couponCenterDetail?couponContactId=${item.couponId}`,
      });
    },
    getCoupon(item){
      // TODO 优惠券获取
    },
    getContent (content) {
      if (!content) return
      console.log('getContent',content.split(','),content.split(',').slice(-1)[0],content.split(',').pop())
      return content.split(',').slice(-1)[0]
    },
     // 根据前一步生成的使用说明内容
    computedTime(item) {
      if (item.useTimeType === 1) {
        return (
          new Date(item.couponStartTime).Format("YYYY.MM.DD") +
          " ~ " +
          new Date(item.couponEndTime).Format("YYYY.MM.DD")
        );
      }
      if (item.useTimeType === 2) {
        return "领券当日起" + (item.useDays || 1) + "天内可用";
      }
      if (item.useTimeType === 3) {
        return "领券次日起" + (item.useDays || 1) + "天内可用";
      }
      return "";
    },
  }
};
</script>

<style lang="less" scoped>
.ht-coupon-card-2 {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  .card__left{
    width: 180rpx;
    flex-shrink: 0;
    &--img{
      width: 100%;
    }
  }
  .card__middle{
    flex: 1;
    padding: 0 20rpx;
    height: 90px;
    position: relative;
    // .title{
    //   font-size: 24rpx;
    //   color: #222222;
    //   margin-top: 8px;
    //   width: 156px;
    // }
    .color {
          font-size: 9px;
          font-weight: bold;
          color: #929497;
          margin-bottom: 4px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .couponType-style {
          width: 186px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .title {
          font-size: 20px;
          font-weight: 400;
          color: #fe5d4d;
          // margin-bottom: 4px;
          overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
        }
        .couponTypeName {
          padding: 2px 4px;
          font-size: 8px;
          color: #929497;
          border: 1px solid #929497;
          display: inline-block;
          border-radius: 2px;
          position: relative;
          top: -4px;
        }
    .desc{
      font-size:14px;
      font-weight: normal;
      color: #FE5D4D;
      line-height: 18px;
       width: 156px;
      .text{
         display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
      }
      &--unit{
        margin-left: 10rpx;
        font-size: 24rpx;
      }
    }
    .time{
      font-size: 22rpx;
      color: #929497;
      position: absolute;
      left:10px;
      bottom: 6px;
    }
     .card__right{
       position: absolute;
       right: 0;
       top: 26px;
      .btn{
        width: 68px;
        text-align: center;
        height: 26px;
        line-height: 26px;
        color: #FE5D4D;
        border-radius: 26rpx;
        border: 1px solid #FE5D4D;
        font-size: 24rpx;;
        position: relative;
        // top: -8rpx;
      }
    }
  }
}
</style>
