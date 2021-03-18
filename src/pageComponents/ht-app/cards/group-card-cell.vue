<template>
  <view class="view">
    <view
      v-for="(item, index) in group.goodsInfoList"
      :key="index"
      class="scrollitem"
      @tap="onGoodsCardTap(item)"
    >
      <image class="cardimg" mode="widthFix" :src="item.mainImageUrl"></image>
      <view class="cardtitle oneLine" style="-webkit-line-clamp: 2;">{{ item.goodsName || "--" }}</view>
      <view class="cardprice">
        <text v-if="item.priceMoney">¥{{ item.priceMoney }}</text>
        <text v-if="item.priceMoney && item.pricePoint">+</text>
        <text v-if="item.pricePoint">{{ item.pricePoint }} 积分</text>
        <text v-if="!item.priceMoney && !item.pricePoint">--</text>
        <view
          class="origin"
          v-if="item.showWorthToMember && item.goodsType == 1 && item.prePrice"
        >
          ¥{{ item.prePrice }}
        </view>
      </view>
      <!-- <view class="card__price">￥{{ item.priceMoney }} +{{ item.pricePoint }} 积分</view> -->
    </view>
    <view
      class="group-card__scroll--item"
      @tap="onTapMore(group)"
      v-if="group.goodsInfoList.length >= 10"
    >
      <view class="more">
        查看更多
        <u-icon
          style="position:absolute;left:4px;top:120px;"
          name="https://eos-wuxi-1.cmecloud.cn/crmoss/de0c3b6f-0d7c-4710-b6a6-4cf961952592.png"
          size="28"
        ></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ht-group-card-cell",
  props: {
    group: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  methods: {
    onTapMore(group) {
      this.$emit("tap-more", group);
    },
    onGoodsCardTap(item) {
      console.log(item);
      this.$emit("tap-goods", item);
    },
  },
};
</script>
<style lang="less" scoped>
.view {
  display: flex;
  flex-wrap: nowrap;
  width: 30%;
  .scrollitem {
    margin-right: 36rpx;
    flex-shrink: 0;
    overflow-x: hidden;
    .cardimg {
      width: 180rpx !important;
      height: 180rpx !important;
      line-height: 180rpx;
      text-align: center;
      background-color: #f7f7f7;
      color: #999;
    }
    .cardtitle {
      max-width: 210rpx;
      margin-top: 16rpx;
      color: #2e2e2e;
      line-height: 1.6;
    }
    .cardprice {
        
      max-width: 210rpx;
      margin-top: 16rpx;
      font-weight: bold;
      color: #ff4c4c;
    }
  }
  .origin {
      text-decoration: line-through;
      font-size: 24rpx;
      color: #929497;
      word-break: break-all;
    }
    .more {
    text-align: center;
    width: 22px;
    padding: 50px 2px 105px;
    font-size: 12px;
    color: #929497;
    background: #f3f3f3;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
  }
}
</style>
