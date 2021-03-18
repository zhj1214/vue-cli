<template>
  <view class="page-shop-home">
    <view class="page-shop-home__header">
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
    <!-- 优惠券 -->
    <view class="scroll-card" v-if="coupons.length">
      <scroll-view scroll-x="true" style="width: 100%;">
        <view class="scroll-card__scroll">
          <view
            v-for="(item, index) in coupons"
            :key="index"
            class="scroll-card__scroll--item"
            style="width: 304rpx;"
          >
            <view class="">
              <app-coupon-card :card="item"></app-coupon-card>
            </view>
          </view>
          <view class="group-card__scroll--item" @tap="routerHandle(0)" v-if="couponsCount>10">
            <view class="coupon-more more">
              更多
              <u-icon style="position:absolute;left:4px;top: 56px;" name="https://eos-wuxi-1.cmecloud.cn/crmoss/de0c3b6f-0d7c-4710-b6a6-4cf961952592.png" size="28"></u-icon>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 活动 -->
    <view class="scroll-card" v-if="activities.length">
      <scroll-view scroll-x="true" style="width: 100%;">
        <view class="scroll-card__scroll">
          <view
            v-for="(item, index) in activities"
            :key="index"
            class="scroll-card__scroll--item"
          >
            <view class="padding: 0 10rpx;">
              <view class="card-group" @tap="onActivityTap(item)">
                <u-image mode="aspectFill" height="100px" :src="item.activityLogo"></u-image>
              </view>
            </view>
          </view>
          <view class="group-card__scroll--item" @tap="routerHandle(1)" v-if="activitiesCount>10">
            <view class="more">
              查看更多
              <u-icon style="position:absolute;left:4px;top:95px;" name="https://eos-wuxi-1.cmecloud.cn/crmoss/de0c3b6f-0d7c-4710-b6a6-4cf961952592.png" size="28"></u-icon>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 分组 -->
    <app-group-card v-if="!isMallFlag" :groups="groups" @tap-more="onTapMore" @tap-goods="onGoodsCardTap"></app-group-card>
    <u-tabbar
      :value="0"
      :isMallFlag="isMallFlag"
      @change="onTabChange"
      :list="isMallFlag ? tabsMall : tabs"
      height="104rpx;"
      active-color="#FE5D4D"
      inactive-color="#7F7F7F"
    ></u-tabbar>
  </view>
</template>

<script>
import {tabsMall, tabs, onTabChange } from './common';
import AppShopHeader from './components/shop-header';
import AppShopReadMore from './components/sunui-grand';
import AppCouponCard from '@/pageComponents/ht-app/cards/coupon-card-3';
import AppGroupCard from '@/pageComponents/ht-app/cards/group-card.vue';

import {adaptStoreBaseInfo, adaptGroups, adaptActivityList, adaptCouponList } from '@/utils/adaptors/shop.js'

export default {
  name: 'page-shop-home',
  components: { AppShopHeader, AppShopReadMore, AppCouponCard, AppGroupCard },
  data() {
    return {
      query: {}, // url带过来的参数
      tabs: tabs,
      tabsMall: tabsMall,
      detail: {
        storeBaseInfo: {}, // 基础信息
      }, // 店铺所有数据
      coupons: [],
      couponsCount: 0,
      activities: [],
      activitiesCount: 0,
      groups: [],
      isMallFlag: false,
    };
  },
  onLoad(options) {
    this.query = options;
    this.fetchCloseStatus();
    this.init();
  },
  methods: {
    onTabChange,
    async fetchCloseStatus() {
      const res = await uni.$api.apiRequest('__v2__fetchStoreBaseInfo', {
        id: this.query.shopId,
      });
      if (res.code === 10000 && res.data) {
        if (res.data.closed) {
          uni.redirectTo({
            url: '/pagesA/loading/updating',
          });
          return;
        }
      }
    },
    async init() {
      this.initBaseInfo()
      this.initCoupons()

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
      if(this.isMallFlag){
        // 重定向到全部商品
        this.onTabChange(1)
      }
    },

    async initCoupons(){

      const params = this.query.shopId
        ? {
            pageSize: 10,
            pageNum: 1,
            uid: uni.$localStorage.getItem('memberId'),
            needActivity: true,
            needCoupon: true,
            shopId: this.query.shopId,
          }
        : {
            pageSize: 10,
            pageNum: 1,
            uid: uni.$localStorage.getItem('memberId'),
            needActivity: true,
            needCoupon: true,
          };

      const res = await uni.$api.apiRequest('__v2__fetchStoreCoupon', params);
      if (res.code !== 10000 && !res.data) return;

       this.coupons =  adaptCouponList( res.data.couponInfo.list || []);
       this.couponsCount = res.data.couponInfo.count
       this.activities = adaptActivityList(res.data.activityInfo.list || []);
       this.activitiesCount = res.data.activityInfo.count

    },

    async initGroups() {
      // TODO v2版本接口切换
      const res = await uni.$api.apiRequest('__v2__fetchStoreGroups', {
        pageNum: 1,
        pageSize: -1,
        source: this.query.shopId,
        orgStatus: 1
      });

      if (res.code !== 10000 && !res.data) return;
      this.groups = adaptGroups(res.data.groupInfoList || []);
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

    onTapMore(item) {
      uni.navigateTo({
        url: `/pages/group/list?id=${item.id}`,
      });
    },
    // 跳转优惠价/活动列表
    routerHandle (type) {
      console.log('routerHandle',type)
      uni.redirectTo({
        url: `/pagesA/shop/coupons-activities?curTabIndex=${type}&shopId=${this.query.shopId}`,
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
    onGoodsCardTap(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.id}`,
      });
    },
    // onGoodsCardTap(item) {
    //   uni.navigateTo({
    //     url: `/pagesA/activity/activityDetail?activityId=${item.id}`,
    //   });
    // },
    onActivityTap(item){
       uni.navigateTo({
        url: `/pagesA/activity/activityDetail?activityId=${item.id}`
      })
    },
    // 截取活动列表，最多展示10个
    getList (list) {
      if (list&&list.length>10) {
        return list.slice(0,10)
      } else {
        return list
      }
    },
    getActiveList (list) {
      if (list&&list.length>10) {
        return list.slice(0,10)
      } else {
        return list
      }
    }
  },
};
</script>

<style lang="less">
@gutter: 20rpx;

.page-shop-home {
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

  .scroll-card {
    margin: @gutter 0;
    padding: 24rpx 40rpx;
    background-color: #fff;
    &__scroll {
      display: flex;
      flex-wrap: nowrap;
      &--item {
        flex-shrink: 0;
        overflow-x: hidden;
        .card-group {
          width: 320rpx;
          height: 200rpx;
          margin-right: 20rpx;
          background-color: #f9f9f9;
        }
      }
    }
  }
  .u-tabbar__content__item__text {
    font-size: 20rpx!important;
  }
   .more {
    text-align: center;
    width: 22px;
    padding: 25px 2px 35px;
    font-size: 12px;
    color: #929497;
    background: #F3F3F3;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
  }
  .coupon-more {
    padding: 20px 2px 32px;
  }
}
</style>
