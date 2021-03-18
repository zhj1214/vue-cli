<template>
  <view class="page-shop-brand-detail r-tabs">
    <navBar :title="query.name" :homeBtn="true" background="#fff"></navBar>
    <view style="margin-bottom: 20rpx;">
      <!-- <app-brand-card
        :card="detail.brandInfo"
        isDetail
        :total="total"
      ></app-brand-card> -->
    </view>

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
      <view class="page-body__list">
        <view v-for="item in list" :key="item.id" class="page-body__list--item">
          <app-goods-card :card="item" @cardTap="onCardTap"></app-goods-card>
        </view>
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
  </view>
</template>

<script>
import AppGoodsCard from '@/pageComponents/ht-app/cards/goods-card.vue';
import AppEmpty from '@/pageComponents/ht-app/cards/empty.vue';

import { adaptGoodsList } from '@/utils/adaptors/shop.js';

export default {
  name: 'category-detail',
  components: {
    AppGoodsCard,
    AppEmpty,
  },
  data() {
    return {
      subs: [
        {
          name: '最新',
          sortType: 2,
        },
        {
          name: '最热',
          sortType: 3,
        },
      ],
      curSubIndex: 0,

      params: {
        pageSize: 5,
        pageNum: 1,
        sortType: 1,
        // type: 1,
        needPrice: true,
        needImg: true,
        status: 2, // 上架商品状态
      },
      query: {},

      list: [],
      total: 0,
    };
  },

  onLoad(options) {
    console.log('options',options)
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
    init() {
      this.fetchList();
    },
    async fetchList() {
      const parmas = this.query.shopId
        ? {
            ...this.params,
            categoryId: this.query.categoryId, // 分类id
            sourceId: this.query.shopId, // 店铺id
          }
        : {
            ...this.params,
            categoryId: this.query.categoryId, // 分类id
            sourceId: uni.$localStorage.getItem("orgId")
          };
      // const parmas   = {
      //       ...this.params,
      //       sourceId: this.query.shopId || '', // 店铺id
      //       categoryId: this.query.categoryId, // 分类id
      //       uid: uni.$localStorage.getItem("memberId"),
      //       orgId: uni.$localStorage.getItem("orgId") || ''
      // }
      const res = await uni.$api.apiRequest(
        '__v2__fetchStoreGoodsList',
        parmas
      );
      if (res.code !== 10000 || !res.data) return;

      this.total = res.data.goodsInfoPageData.count;
      // 保存列表数据
      if (this.params.pageNum === 1) {
        this.list = adaptGoodsList(res.data.goodsInfoPageData.list || []);
      } else {
        this.list = this.list.concat(
          adaptGoodsList(res.data.goodsInfoPageData.list || [])
        );
      }
    },
    onChange(index) {
      this.params.pageNum = 1;
      this.curSubIndex = index;
      this.params.sortType = this.subs[index].sortType;
      this.fetchList();
    },

    onCardTap(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.id}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-shop-brand-detail {
  min-height: 100vh;
  .group-card__swiper-wrap {
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
