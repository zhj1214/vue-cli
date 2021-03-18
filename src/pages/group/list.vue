<template>
  <view class="page-group-list r-tabs">
    <navBar :title="groups.main[0].groupName" background="#fff"></navBar>
    <view v-if="groups.main.length && groups.main[0].image" class="group-card__swiper-wrap">
      <u-swiper
        height="300"
        border-radius="0"
        :list="groups.main"
        mode="none"
        :autoplay="false"
        :title="!!groups.main[0].title"
        :title-style="{ 'text-align': 'center' }"
      ></u-swiper>
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

import { adaptGroupDetail, adaptGoodsList } from '@/utils/adaptors/shop.js';

export default {
  name: 'page-group-list',
  components: {
    AppGoodsCard,
    AppEmpty,
  },
  data() {
    return {
      subs: [
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
      ],
      curSubIndex: 0,

      params: {
        pageSize: 10,
        pageNum: 1,
        sortType: 1,
        // type: 1, // 商品类型 1实体商品 2服务商品
        needPrice: true, // 返回价格
        needImg: true, // 返回图片
        status: 2, // 上架商品状态
      },

      list: [],
      total: 0,

      groups: {
        main: [],
      },
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
    init() {
      this.fetchDetail();
      this.fetchList();
    },

    async fetchDetail() {
      const res = await uni.$api.apiRequest('__v2__fetchStoreGroupDetail', {
        id: this.query.id, // 分组id
      });
      if (res.code !== 10000 || !res.data) return;

      this.groups.main = [adaptGroupDetail(res.data)];
    },

    async fetchList() {
      const parmas = this.query.orgId
        ? {
            ...this.params,
            groupId: this.query.id, // 分组id
            sourceId: this.query.orgId, // 店铺id
          }
        : {
            ...this.params,
            groupId: this.query.id, // 分组id
            type: ''
          };
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
        this.list = this.list.concat(adaptGoodsList(res.data.goodsInfoPageData.list || []));
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
.page-group-list {
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
