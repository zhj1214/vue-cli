<template>
  <view class="page-shop-all-goods r-tabs">
    <view v-if="isMallFlag" class="page-shop-all-goods__header">
      <app-shop-header :card="detail.storeBaseInfo" :isMallFlag="isMallFlag"></app-shop-header>
      <view style="padding:20rpx 40rpx;">
        <app-shop-read-more
          :content="detail.storeBaseInfo.brief"
        ></app-shop-read-more>
      </view>
      <view class="location-bar">
        <view class="location-bar__left">
          {{ detail.storeBaseInfo.addressObj.addressDetail || '--' }}
        </view>
        <view class="location-bar__right">
          <image
            class="location-bar__right--icon"
            style="margin-right: 28rpx;"
            mode="widthFix"
            src="/static/images/shop/address.png"
            @tap="openLocation"
          ></image>
          <image
            class="location-bar__right--icon"
            mode="widthFix"
            src="/static/images/shop/phone.png"
            @tap="onCall"
          ></image>
        </view>
      </view>
    </view>
    <app-shop-header 
       v-if="!isMallFlag"
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
    <!-- 分组 -->
    <!-- <app-group-card :groups="groups" @tap-more="onTapMore" @tap-goods="onGoodsCardTap"></app-group-card> -->
    <u-tabbar
      :value="isMallFlag ? 0 : 1"
       @change="onTabChange($event, isMallFlag)"
      :list="isMallFlag ? tabsMall : tabs"
      height="104rpx;"
      active-color="#FE5D4D"
      inactive-color="#7F7F7F"
    ></u-tabbar>
  </view>
</template>

<script>
import { tabsMall, tabs, onTabChange } from './common';
import AppShopHeader from './components/shop-header';
import AppShopReadMore from './components/sunui-grand';
import AppGoodsCard from '@/pageComponents/ht-app/cards/goods-card.vue';
import AppEmpty from '@/pageComponents/ht-app/cards/empty.vue';
// import AppGroupCard from '@/pageComponents/ht-app/cards/group-card.vue';

import { adaptGoodsList, adaptStoreBaseInfo, adaptGroups } from '@/utils/adaptors/shop.js'

export default {
  name: 'page-shop-all-goods',
  components: { AppShopHeader, AppShopReadMore, AppGoodsCard, AppEmpty },
  data() {
    return {
      tabs: tabs,
      tabsMall: tabsMall, 
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
      isMallFlag: false,

      query: {},
      params: {
        pageSize: 10,
        pageNum: 1,
        sortType: 2,
        // type: 1,
        needPrice: true,
        needImg: true,
        status: 2, // 上架商品状态
      },

      detail: {
        storeBaseInfo: {},
      },

      list: [],

      groups: [],

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
      this.initBaseInfo();
      this.fetchList();
      this.initGroups()
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
            sourceId: this.query.shopId,
          }
        : {
            ...this.params,
          };
      const res = await uni.$api.apiRequest(
        '__v2__fetchStoreGoodsList',
        params
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

    async initGroups() {
       const rootOrgId = uni.$localStorage.getItem('orgId');
      let directOrgId = ''; // 商场下直营店铺id
      // 小程序首页：分组展示本级，即所属直营店铺分组数据
      const {data=[]} = await uni.$api.apiRequest('fetchDepartmentList',
            {
              orgIds: [rootOrgId],
              types: [10],
              shopTypes: [3],
              isSearch: true
            });
            if (data&&data.list.length) {
              directOrgId = data.list[0].orgId
            } else {
              if(new Date().getTime() > 1611585900000){
                return uni.$alert.showToast('组织查询异常')
              }

            }
      // 传入直营店铺id
      uni.$localStorage.setItem("orgId",directOrgId)
      // TODO v2版本接口切换
      const res = await uni.$api.apiRequest('__v2__fetchStoreGroups', {
        pageNum: 1,
        pageSize: -1,
        orgStatus: 1
      });

      // 回传初始组织id
      uni.$localStorage.setItem("orgId",rootOrgId)

      if (res.code !== 10000 && !res.data) return;
      this.groups = adaptGroups(res.data.groupInfoList || []);
    },

    onGoodsCardTap(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.id}`,
      });
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
     openLocation() {
      // TODO 取值字段待后端提供
      const lat = this.detail.storeBaseInfo.addressObj.lat;
      const lng = this.detail.storeBaseInfo.addressObj.lng;
      console.log('openLocation',lat,lng)
      // 如果有经纬度，则打开内置地图
      if (lat && lng) {
        uni.openLocation({
          latitude: lat,
          longitude: lng,
        });
      } else {
        uni.showToast({
          title: '店铺经纬度信息不全',
          icon: 'none',
        });
      }
    },
    onCall() {
      if (!this.detail.storeBaseInfo.tel) {
        uni.showToast({
          title: '暂无联系电话',
          icon: 'none',
        });
        return;
      }
      uni.makePhoneCall({
        phoneNumber: this.detail.storeBaseInfo.tel,
      });
    },
  },
};
</script>

<style lang="less">
@gutter: 20rpx;
.page-shop-all-goods {
  background-color: #f9f9f9;
  min-height: 100vh;
  padding-bottom: 50px;
  
  &__header {
    background-color: #fff;
    .location-bar {
      margin: 0 40rpx;
      padding: 16rpx 0;
      display: flex;
      align-items: center;
      border-top: 1px solid #dadada;
      &__left {
        flex: 1;
        padding-right: 10rpx;
        color: #2e2e2e;
        font-size: 24rpx;
      }
      &__right {
        &--icon {
          width: 24px;
          position: relative;
          top: 2px;
        }
      }
    }
  }
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
