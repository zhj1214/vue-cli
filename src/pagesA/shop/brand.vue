<template>
  <view class="page-shop-brand r-tabs">
    <app-shop-header 
      :card="detail.storeBaseInfo"
      :isMallFlag="isMallFlag"
    ></app-shop-header>
    <view class="page-body">
      <view v-for="item in list" :key="item.id" class="page-body__list">
        <app-brand-card
          :card="item"
          :seperator="true"
          @cardTap="onCardTap"
        ></app-brand-card>
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
      :value="isMallFlag ? 2 : 4"
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
import AppBrandCard from '@/pageComponents/ht-app/cards/brand-card.vue';
import AppEmpty from '@/pageComponents/ht-app/cards/empty.vue';

import { adaptStoreBaseInfo, adaptBrandList } from '@/utils/adaptors/shop.js';

export default {
  name: 'page-shop-brand',
  components: { AppShopHeader, AppBrandCard, AppEmpty },
  data() {
    return {
      tabs: tabs,
      tabsMall: tabsMall,
      params: {
        pageSize: 10,
        pageNum: 1,
      },
      isMallFlag: false,

      query: {},

      detail: {
        storeBaseInfo: {},
      },

      list: [],

      total: 0,
    };
  },
  onLoad(options) {
    this.query = options;
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
      this.initBaseInfo()
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
            source: this.query.shopId,
          }
        : {
            ...this.params,
          };
      const res = await uni.$api.apiRequest(
        '__v2__fetchStoreBrandList',
        params
      );
      if (res.code !== 10000 || !res.data) return;

      this.total = res.data.brandInfoPageData.count;

      // 保存列表数据
      if (this.params.pageNum === 1) {
        this.list = adaptBrandList(res.data.brandInfoPageData.list || []);
      } else {
        this.list = this.list.concat(adaptBrandList(res.data.brandInfoPageData.list || []));
      }
    },

    onCardTap(item) {
      const url = this.query.shopId
        ? `/pagesA/shop/brand-detail?brandId=${item.id}&shopId=${this.query.shopId}`
        : `/pagesA/shop/brand-detail?brandId=${item.id}`;
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style lang="less">
@gutter: 20rpx;
.page-shop-brand {
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
    }
  }
  .u-tabbar__content__item__text {
    font-size: 20rpx !important;
  }
  .page-body .page-body__list {
    .ht-brand-card {
      border-bottom: 1px solid #f3e7e7;
    }
  }
  .page-body .page-body__list:nth-last-child(1) {
    .ht-brand-card {
      border-bottom: 0;
    }
  }
}
</style>
