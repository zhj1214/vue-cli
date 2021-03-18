<template>
  <view class="ht-sku-goods-card">
    <view class="card__left">
      <image
        mode="widthFix"
        class="card__left--img"
        :src="card.imgUrlList[0] || '/static/images/picNotData.png'"
      ></image>
    </view>
    <view class="card__right">
      <view class="card__right--hd">
        <!-- <view class="hd__title">{{ price }} </view> -->
        <view class="hd__title">
          <view style="display:inline-block" v-if="current.skuId">
            <text v-if="current.price"
              >¥{{ calcPrice(current) }}
            </text>
            <text v-if="current.price && current.point"> + </text>
            <text v-if="current.point">
              {{ current.point * (this.buyNum || 1) }} 积分</text
            >
          </view>
          <view style="display:inline-block" v-if="!current.skuId">
            <text v-if="isShowPrice">
             {{priceMoney}}
            </text>
            <text
              v-if="
                isShowPrice &&
                  isShowPoint && (priceMoney!==pricePoint)
              "
              style="margin:0 3px;"
              >{{card.goodsBaseInfo.goodsType == 1?'-':'+'}}</text
            >
            <text v-if="isShowPoint && (priceMoney!==pricePoint)">
              {{pricePoint}}
              </text>
          </view>
        </view>
        <view class="hd__desc">商品编号：{{ card.goodsBaseInfo.id }}</view>
      </view>
      <view class="card__right--bd">
        <view class="bd__spec">已选择：{{ formatSku(current) }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-sku-goods-card',
  props: {
    card: {
      type: Object,
      default() {
        return {};
      },
    },
    current: {
      type: Object,
      default() {
        return {};
      },
    },
    buyNum: {
      type: Number,
      default: 1,
    },
  },
  data () {
    return {
      detail: {}
    }
  },
  computed: {
    // 最小售价+积分
    isShowPrice () {
      if (this.card.priceInfo) {
        if (this.card.priceInfo.priceNow || this.card.priceInfo.priceNowSkuMin || this.card.priceInfo.pointNowSkuMin) {
          return true
        }
        return false
      }
      return false
    },
    // 最小售价+积分
    priceMoney () {
      if (this.card.baseInfo&&this.card.baseInfo.type==2) {
        // 服务商品
        return '¥' + this.card.priceInfo&&this.card.priceInfo.priceNow || 0
      } else {
        if (this.card.priceInfo&&(this.card.priceInfo.priceNowSkuMin&&this.card.priceInfo.pointNowSkuMin)) {
            return '¥' + this.card.priceInfo.priceNowSkuMin + '+' + this.card.priceInfo.pointNowSkuMin + '积分'
        } else if (this.card.priceInfo&&(this.card.priceInfo.priceNowSkuMin&&!this.card.priceInfo.pointNowSkuMin)){
          return '¥' + this.card.priceInfo.priceNowSkuMin
        } else {
          return this.card.priceInfo&&this.card.priceInfo.pointNowSkuMin + '积分'
        }
      }
    },
    isShowPoint () {
      if (this.card.priceInfo) {
        if (this.card.priceInfo.pointNow || this.card.priceInfo.priceNowSkuMax || this.card.priceInfo.pointNowSkuMax) {
          return true
        }
        return false
      }
      return false
    },
    // 最大售价+积分
    pricePoint () {
      if (this.card.baseInfo&&this.card.baseInfo.type==2) {
        // 服务商品
        return this.card.priceInfo&&this.card.priceInfo.pointNow + '积分'
      } else {
        if (this.card.priceInfo&&(this.card.priceInfo.priceNowSkuMax&&this.card.priceInfo.pointNowSkuMax)) {
            return '¥' + this.card.priceInfo.priceNowSkuMax + '+' + this.card.priceInfo.pointNowSkuMax + '积分'
        } else if (this.card.priceInfo&&(this.card.priceInfo.priceNowSkuMax&&!this.card.priceInfo.pointNowSkuMax)){
          return '¥' + this.card.priceInfo.priceNowSkuMax
        } else {
          return this.card.priceInfo&&this.card.priceInfo.pointNowSkuMax + '积分'
        }
      }
    }
  },

  methods: {
    calcPrice(current){
      if(isNaN(current.price)){
        return current.price
      }
      return current.price * (this.buyNum || 1)
    },
    formatSku(sku) {
      if (sku.skuId) {
        if (!sku.spec || !sku.spec) return '张';
        return sku.spec.map((it) => it.detailValue).join(',');
      }
      return '请选规格';
    },
  },
};
</script>

<style lang="less" scoped>
.ht-sku-goods-card {
  display: flex;
  padding: 40rpx;
  .card__left {
    margin-right: 24rpx;
    &--img {
      width: 172rpx;
    }
  }
  .card__right {
    &--hd {
      .hd__title {
        font-size: 52rpx;
        font-weight: bold;
        color: #ff4c4c;
      }
      .hd__desc {
        font-size: 24rpx;
        color: #929497;
      }
    }
    &--bd {
      margin-top: 40rpx;
      .bd__spec {
        font-size: 28rpx;
        font-weight: bold;
        color: #2e2e2e;
      }
    }
  }
}
</style>
