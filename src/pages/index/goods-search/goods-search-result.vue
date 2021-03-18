<template>
  <view class="page-goods-search-result r-tabs">
    <navBar title="搜索好物" background="#fff"></navBar>
    <!-- header start-->
    <view class="page-header">
      <view class="" @tap="jumpToSearch">
        <app-search-bar
          v-model="query.keyword"
          placeholder="搜索好物"
          disabled
        />
      </view>
      <u-tabs
        :list="tabs"
        :is-scroll="false"
        active-color="#FE5D4D"
        :current="curTabIndex"
        @change="onTabChange"
      ></u-tabs>
    </view>
    <!-- header end-->
    <app-shop-bar
      :isMallFlag="matchedShop.isDirect"
      v-if="curTabIndex === 0 && matchedShop.shopId"
      :info="matchedShop"
      @barTap="onShopBarTap"
    ></app-shop-bar>
    <!-- body start -->

    <view class="page-body">
      <view class="page-body__hd">
        <u-subsection
          bg-color="#f4f4f4"
          button-color="#F53131"
          active-color="#fff"
          :list="subs"
          :current="curSubIndex"
          @change="onSortChange"
        ></u-subsection>
      </view>
      <view v-if="curTabIndex === 0" class="page-body__list">
        <view v-for="item in list" :key="item.id" class="page-body__list--item">
          <app-goods-card
            :card="item"
            @cardTap="onGoodsCardTap"
          ></app-goods-card>
        </view>
      </view>
      <view v-if="curTabIndex === 1" class="page-body__list-c">
        <view
          v-for="item in list"
          :key="item.couponId"
          class="page-body__list-c--item"
        >
          <app-coupon-card :card="item"></app-coupon-card>
        </view>
      </view>
      <view v-if="curTabIndex === 2" class="page-body__list-v">
        <view
          v-for="item in list"
          :key="item.id"
          class="page-body__list-v--item"
        >
          <app-activity-card :card="item"></app-activity-card>
        </view>
      </view>
      <app-empty v-if="!list.length && params.page === 1"></app-empty>
    </view>
    <!-- body end -->
  </view>
</template>

<script>
import AppSearchBar from '@/pageComponents/ht-app/bars/search-bar.vue';
import AppShopBar from '@/pageComponents/ht-app/bars/shop-bar.vue';
import AppGoodsCard from '@/pageComponents/ht-app/cards/goods-card.vue';
import AppCouponCard from '@/pageComponents/ht-app/cards/coupon-card-2.vue';
import AppActivityCard from '@/pageComponents/ht-app/cards/activity-card.vue';
import AppEmpty from '@/pageComponents/ht-app/cards/empty2.vue';

import { adaptGoodsList, adaptShopList, adaptCouponList, adaptActivityList } from '@/utils/adaptors/shop.js'

export default {
  name: 'app-goods-search-result',
  components: {
    AppSearchBar,
    AppShopBar,
    AppGoodsCard,
    AppCouponCard,
    AppActivityCard,
    AppEmpty,
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [
          {
            name: '商品',
            type: 1,
          },

          {
            name: '优惠券',
            type: 4,
          },
          {
            name: '活动',
            type: 3,
          },
        ];
      },
    },
    subs: {
      type: Array,
      default() {
        return [
          {
            name: '全部',
            sortType: 1,
          },
          {
            name: '最新',
            sortType: 2,
          },
          {
            name: '最热',
            sortType: 3,
          },
        ];
      },
    },
  },
  data() {
    return {
      query: {}, // 从url带过来的参数
      curTabIndex: 0,
      curSubIndex: 0,

      params: {
        page: 1,
        size: 20,
      },

      list: [],
      total: 0,

      matchedShop: {}, // 匹配到的店铺
    };
  },
  onLoad(options) {
    this.query = options;
    this.init();
  },
  async onReachBottom() {
    // 如果还有数据
    if (this.total > this.list.length) {
      this.params.page = this.params.page + 1;
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
    this.params.page = 1; // current page = 1
    try {
      await this.fetchList();
    } catch (error) {
      console.error(error);
    } finally {
      uni.stopPullDownRefresh();
    }
  },
  methods: {
    init() {
      this.fetchList();
      this.fetchShop();
      this.addSearchLog();
    },
    async addSearchLog() {
      const memberId = uni.$localStorage.getItem('memberId');
      
      if (this.query.flag === 'history') {
        return;
      }
      const searchLogs = uni.$localStorage.getItem('search_logs') || [];
      let keyword = this.query.keyword?this.query.keyword.trim():'';
      // 如果已登录，则搜索历史记录在服务端
      if (memberId && this.query.keyword) {
        if (searchLogs&&searchLogs.length) {
          if (searchLogs.some(item=>item.content==keyword)) {
            return
          }
        }
        await uni.$api.apiRequest('__v2__addSearchLog', {
          uid: memberId,
          content: this.query.keyword,
        });
      }
      // 如果未登录，则本地缓存
      if (!memberId && this.query.keyword) {
        // 保证数据不重复
        // for (let i = 0; i < searchLogs.length; i++) {
        //   if (searchLogs[i].content === keyword) {
        //     return;
        //   }
        // }
        if (searchLogs&&searchLogs.length) {
          if (searchLogs.some(item=>item.content==keyword)) {
            let index = searchLogs.findIndex(item=>item.content==keyword)
            searchLogs.splice(index,1)
          }
        }
        console.log('searchLogs',searchLogs)
        searchLogs.unshift({ content: keyword });
        searchLogs.slice(0, 10);
        uni.$localStorage.setItem('search_logs', searchLogs);
      }
    },

    async fetchList() {
      const searchType = this.tabs[this.curTabIndex].type
      const res = await uni.$api.apiRequest('__v2__searchGoods', {
        pageSize: this.params.size,
        pageNum: this.params.page,
        searchContent: this.query.keyword,
        searchType,
        sortType: this.subs[this.curSubIndex].sortType,
        orgId: uni.$localStorage.getItem("orgId"),
        // orgId: "555555",
      });
      if (res.code !== 10000 && !res.data) return;

      // 如果时搜索商品
      if(searchType === 1){
        this.total = res.data.goodsInfo.goodsInfoPageData.count; // 保存总条数
        // 保存列表数据
        if (this.params.page === 1) {
          this.list = adaptGoodsList(res.data.goodsInfo.goodsInfoPageData.list || []);
        } else {
          this.list = this.list.concat(adaptGoodsList(res.data.goodsInfo.goodsInfoPageData.list || []));
        }
        return;
      }

      // 如是搜索优惠券
      if(searchType === 4){
        this.total = res.data.couponInfo.count; // 保存总条数
        // 保存列表数据
        if (this.params.page === 1) {
          this.list = adaptCouponList(res.data.couponInfo.list || []);
        } else {
          this.list = this.list.concat(adaptCouponList(res.data.couponInfo.list || []));
        }
        return;
      }

      // 如是搜索活动
      if(searchType === 3){
        this.total = res.data.activityInfo.count; // 保存总条数
        // 保存列表数据
        if (this.params.page === 1) {
          this.list = adaptActivityList(res.data.activityInfo.list || []);
        } else {
          this.list = this.list.concat(adaptActivityList(res.data.activityInfo.list || []));
        }
        return;
      }

    },
    async fetchShop() {
      const res = await uni.$api.apiRequest('__v2__searchGoods', {
        pageSize: 1,
        pageNum: this.params.page,
        searchContent: this.query.keyword,
        searchType: 2,
        sortType: 1,
        orgId: uni.$localStorage.getItem("orgId"),
      });
      if (res.code !== 10000 && !res.data) return;
      this.matchedShop = adaptShopList(res.data.orgInfo.list)[0] || {};
    },
    jumpToSearch() {
      uni.redirectTo({
        url: `/pages/index/goods-search/goods-search?keyword=${this.query.keyword}`,
      });
    },
    onTabChange(index) {
      this.params.page = 1;
      this.curTabIndex = index;
      this.curSubIndex = 0;
      this.fetchList();
    },
    onSortChange(index) {
      this.curSubIndex = index;
      this.fetchList();
    },
    onGoodsCardTap(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.id}`,
      });
    },

    onShopBarTap(item) {
      if(item.isDirect){
         uni.navigateTo({
          url: `/pagesA/shop/all-goods?shopId=${item.shopId}`,
        });
        return
      }
      uni.navigateTo({
        url: `/pagesA/shop/home?shopId=${item.shopId}`,
      });
    },
  },
};
</script>

<style lang="less">
.page-goods-search-result {
  background-color: #f9f9f9;
  .page-header {
    background-color: #fff;
    margin-bottom: 20rpx;
  }
  .page-body {
    padding: 24rpx 40rpx;
    background-color: #fff;

    &__hd {
    }
    &__list {
      padding: 24rpx 0;
      display: flex;
      flex-wrap: wrap;
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
}
</style>
