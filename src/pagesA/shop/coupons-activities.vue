<template>
  <view class="page-shop-coupons-activities r-tabs">
    <app-shop-header 
      :card="detail.storeBaseInfo"
      :isMallFlag="isMallFlag"
    ></app-shop-header>
    <view class="page-body">
      <view class="page-body__hd">
        <u-subsection
          bg-color="#f4f4f4"
          button-color="#F53131"
          active-color="#fff"
          :list="subs"
          :current="curSubIndex"
          @change="onChange"
        ></u-subsection>
      </view>
      <view v-if="curSubIndex === 0" class="page-body__list">
        <app-coupon-card
          v-for="item in list"
          :key="item.id"
          :card="item"
          @cardTap="onCardTap"
        ></app-coupon-card>
      </view>
      <view v-if="curSubIndex === 1" class="page-body__list">
        <app-activity-card
          v-for="item in list"
          :key="item.id"
          :card="item"
          @cardTap="onCardTap"
        ></app-activity-card>
      </view>
      <app-empty
        v-if="!list.length && params.pageNum === 1"
        :card="{
          img:
            'https://eos-wuxi-1.cmecloud.cn/crmoss/98af2b56-7e99-409c-b422-b1ae19195a92.png',
          text: '暂无数据',
        }"
      ></app-empty>
    </view>
    <u-tabbar
      :value="isMallFlag ? 1 : 3"
       @change="onTabChange($event, isMallFlag)"
      :list="isMallFlag ? tabsMall : tabs"
      height="104rpx;"
      active-color="#FE5D4D"
      inactive-color="#7F7F7F"
    ></u-tabbar>
  </view>
</template>

<script>
import {tabsMall,  tabs, onTabChange } from './common';
import AppShopHeader from './components/shop-header';
import AppGoodsCard from '@/pageComponents/ht-app/cards/goods-card.vue';
import AppEmpty from '@/pageComponents/ht-app/cards/empty.vue';
import AppCouponCard from '@/pageComponents/ht-app/cards/coupon-card-2.vue';
import AppActivityCard from '@/pageComponents/ht-app/cards/activity-card.vue';

import { adaptStoreBaseInfo, adaptActivityList, adaptCouponList } from '@/utils/adaptors/shop.js';

export default {
  name: 'page-shop-coupons-activities',
  components: {
    AppShopHeader,
    AppGoodsCard,
    AppEmpty,
    AppCouponCard,
    AppActivityCard,
  },
  data() {
    return {
      tabs: tabs,
      tabsMall: tabsMall,
      subs: [
        {
          name: '优惠券',
          api: '__v2__fetchStoreCoupon',
          dataKey: 'couponInfo', // 取数据的key
          needCoupon: true,
          needActivity: false,
        },
        {
          name: '活动',
          api: '__v2__fetchStoreCoupon',
          dataKey: 'activityInfo', // 取数据的key
          needCoupon: false,
          needActivity: true,
        },
      ],
      curSubIndex: 0,
      isMallFlag: false,

      adapters: { // 适配器
        activityInfo: adaptActivityList,
        couponInfo: adaptCouponList,
      },
      curDataKey: 'couponInfo', // 当前取数据的key

      query: {},

      params: {
        pageSize: 10,
        pageNum: 1,
        uid: uni.$localStorage.getItem('memberId'),
        needActivity: false,
        needCoupon: true,
      },

      detail: {
        storeBaseInfo: {},
      },

      list: [],
      total: 0,
    };
  },
  onLoad(options) {
    this.query = options;
    if (options.curTabIndex) {
      this.curSubIndex = Number(options.curTabIndex)
      this.params.pageNum = 1;
      this.params.type = this.subs[this.curSubIndex].type;
      this.curDataKey = this.subs[this.curSubIndex].dataKey;
    }
    this.init();
  },
  async onReachBottom() {
    // 如果还有数据
    if (this.total > this.list.length) {
      this.params.pageNum = this.params.pageNum + 1;
      this.fetchList();
      return;
    }
    // 已经是最后一页
    uni.showToast({
      title: '没有更多了',
      icon: 'none',
    });
  },
  async onPullDownRefresh() {
    this.params.pageNum = 1; // current page = 1
    try {
      await this.fetchList();
    } catch (error) {
      console.error(error);
    } finally {
      uni.stopPullDownRefresh();
    }
  },
  methods: {
    onTabChange,
    init() {
      if(this.query.is_mall === 'true'){
        this.isMallFlag = true
      }
      this.initBaseInfo();
      this.fetchList();
    },

    async initBaseInfo(){
      const params = this.query.shopId
      ? {
          id: this.query.shopId,
          needParentInfo: true,
          needBrandCount: true,
          needSaleSpuCount: true,
        }
      : {
        needParentInfo: true,
        needBrandCount: true,
        needSaleSpuCount: true,
      };
        // TODO v2版本接口切换
      const res = await uni.$api.apiRequest('__v2__fetchStoreBaseInfo', params);

      if (res.code !== 10000 && !res.data) return;
      this.detail.storeBaseInfo = adaptStoreBaseInfo(res.data);

      this.isMallFlag = this.detail.storeBaseInfo.isDirect; // true 为直营店铺 false为普通店铺
    },

    async fetchList() {
      const params = this.query.shopId
        ? {
            ...this.params,
            shopId: this.query.shopId,

          }
        : {
            ...this.params,
          };
      const dataKey = this.curDataKey;
      const res = await uni.$api.apiRequest('__v2__fetchStoreCoupon', params);

      const adapter = this.adapters[dataKey]

      this.total = res.data[dataKey].count; // 保存总条数
      // 保存列表数据
      if (this.params.pageNum === 1) {
        this.list = adapter(res.data[dataKey].list || []);
      } else {
        this.list = this.list.concat(adapter(res.data[dataKey].list || []));
      }
    },
    onChange(index) {
      this.params.pageNum = 1;
      this.curSubIndex = index;
      this.params.needActivity = this.subs[index].needActivity;
      this.params.needCoupon = this.subs[index].needCoupon;
      this.curDataKey = this.subs[index].dataKey;
      this.fetchList();
    },

    onCardTap() {
      // TODO
    },
  },
};
</script>

<style lang="less">
@gutter: 20rpx;
.page-shop-coupons-activities {
  background-color: #f9f9f9;
  min-height: 100vh;
  padding-bottom: 50px;
  .page-body {
    margin-top: @gutter;
    padding: 24rpx 40rpx;
    background-color: #fff;

    &__hd {
    }
    &__list {
      padding: 24rpx 0;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      &--item {
        width: 50%;
        margin-bottom: 20rpx;
        &:nth-child(2n) {
          padding-left: 10rpx;
        }
        &:nth-child(2n + 1) {
          padding-right: 10rpx;
        }
      }
    }
    &__list-c {
      padding: 6rpx 0 0;
      &--item {
        padding: 0;
      }
    }
    &__list-v {
      &--item {
        padding: 24rpx 0 0;
      }
    }
  }
  .u-tabbar__content__item__text {
    font-size: 20rpx!important;
  }
}
</style>
