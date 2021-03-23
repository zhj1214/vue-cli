<!--
 * @Author: wangyan
 * @Date: 2021-01-15 13:35:49
 * @LastEditTime: 2021-02-08 13:45:03
 * @LastEditors: wangyan
 * @Description: 单个优惠券组件
 * @FilePath: \heng-weapp\src\pageComponents\coupon\couponCard.vue
-->
<template>
  <view class="ht-coupon-card">
    <view class="card__left">
      <image
        class="card__left--img"
        :src="
          card.imageUrl ||
          card.couponPicUrl ||
          card.picUrl ||
          'https://eos-wuxi-1.cmecloud.cn/crmoss/68dfe246-9df5-4a14-beae-f5878fda1b0b.png'
        "
      ></image>
    </view>
    <view class="card__middle">
      <view
        :class="['color', { compactStyle: card.couponType == 'COMBINATION' }]"
        v-if="
          card.couponType == 'EXCHANGE' ||
          card.couponType == 'COMBINATION' ||
          card.couponType == 'PARK'
        "
        >{{ card.couponContent }}
      </view>
      <view class="title" v-else>
        <text style="font-weight: 600">{{ card.amount }}</text>
        <text style="font-size: 12px; margin-left: 2px">{{
          card.couponType == "DISCOUNT" ? "折" : "元"
        }}</text>
      </view>
      <view class="couponTypeName">{{ card.couponTypeName }}</view>
      <view
        class="color couponType-style"
        v-if="card.couponType == 'REDUCTION' || card.couponType == 'DISCOUNT'"
        >消费满{{ card.useThresholdAmount }}可用</view
      >
      <view
        class="time"
        :style="{
          marginTop:
            card.couponType == 'REDUCTION' || card.couponType == 'DISCOUNT'
              ? 0
              : 10 + 'px',
        }"
      >
        {{ computedTime(card) }}
      </view>
      <view class="card__right">
        <block>
          <slot name="right"></slot>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ht-coupon-card",
  props: {
    card: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    // 根据前一步生成的使用说明内容
    computedTime(item) {
      if (item.useTimeType === 1) {
        return (
          new Date(item.startTime).Format("YYYY.MM.DD") +
          " ~ " +
          new Date(item.endTime).Format("YYYY.MM.DD")
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
  },
};
</script>

<style lang="scss" scoped>
$primary-color: #929497;
$red-color: #fe5d4d;
%text-common {
  overflow: hidden;
  text-overflow: ellipsis;
}
.ht-coupon-card {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  background-color: #fff;
  display: -webkit-box;
  -webkit-box-align: center;
  height: 180rpx;
  overflow: hidden;
  .card__left {
    width: 180rpx;
    height: 180rpx;
    flex-shrink: 0;
    &--img {
      width: 100%;
      height: 100%;
    }
  }
  .card__middle {
    -webkit-box-flex: 1;
    padding: 20rpx 150rpx 20rpx 20rpx;
    height: 90px;
    position: relative;
    .color {
      font-size: 14px;
      color: $red-color;
      font-weight: 400;
      margin-bottom: 4px;
      display: -webkit-box;
      @extend %text-common;
      word-wrap: break-word;
      white-space: normal !important;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .compactStyle {
      -webkit-line-clamp: 2;
    }
    .couponType-style {
      font-size: 9px;
      font-weight: bold;
      color: $primary-color;
    }
    .title {
      font-size: 20px;
      font-weight: 400;
      color: $red-color;
      white-space: nowrap;
      @extend %text-common;
    }
    .couponTypeName {
      position: relative;
      top: -4px;
      padding: 2px 4px;
      font-size: 8px;
      color: $primary-color;
      display: inline-block;
      border-radius: 2px;
      border: 1px solid $primary-color;
    }
    .time {
      position: absolute;
      left: 10px;
      bottom: 6px;
      font-size: 18rpx;
      color: $primary-color;
    }
    .card__right {
      position: absolute;
      right: 0;
      top: 26px;
      width: 150rpx;
    }
  }
}
</style>