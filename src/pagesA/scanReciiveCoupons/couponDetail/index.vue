<!--
 * @Author: wangyan
 * @Date: 2021-01-18 16:18:23
 * @LastEditTime: 2021-01-22 16:12:32
 * @LastEditors: wangyan
 * @Description: 扫码领券优惠券详情
 * @FilePath: \heng-weapp\src\pagesA\scanReciiveCoupons\couponDetail\index.vue
-->
<template>
  <view class="coupondetail-view">
    <navBar title="优惠券详情" background="#fff" :homeBtn="true"></navBar>
    <view class="detail_top">
      <CouponCard :card="couponDetail"> </CouponCard>
    </view>
    <view class="detail_bottom">
      <template v-if="couponDetail.couponType == 'COMBINATION'">
        <view class="flex-center-row bottom_top">
          <view class="title">礼包内容</view>
          <view class="line"></view>
        </view>
        <view
          class="listItem"
          v-for="item in couponDetail.couponList"
          :key="item.couponContactId"
        >
          <CouponCard :card="item">
            <view slot="right" class="amount_style"> × {{ item.amount }} </view>
          </CouponCard>
        </view>
      </template>
      <template v-else>
        <view class="flex-center-row bottom_top">
          <view class="title">使用说明</view>
          <view class="line"></view>
        </view>
        <view class="detail_desc">
          <jyf-parser
            style="color: #7f7f7f"
            :html="couponDetail.couponDesc"
            ref="article"
          ></jyf-parser>
        </view>
      </template>
      <view class="detail_button">
        <u-button
          :custom-style="customStyle"
          :disabled="couponDetail.status == 2"
          hover-class="none"
          :throttle-time="500"
          @click="toReceive"
        >
          {{ `${couponDetail.status != 2 ? "立即领取" : "已抢光"}` }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import CouponCard from "@/pageComponents/coupon/couponCard";
import jyfParser from "@/components/jyf-parser/jyf-parser";
export default {
  name: "couponDetail",
  components: {
    CouponCard,
    jyfParser,
  },
  data() {
    return {
      couponDetail: {},
      couponContactId: "",
      customStyle: {
        width: "670rpx",
        height: "46px",
        fontSize: "14px",
        backgroundColor: "#fe5d4d",
        color: "#ffffff",
      },
    };
  },
  onLoad(option) {
    this.couponContactId = option.couponContactId || "";
    this.getCouponDetail(option.couponContactId);
  },
  methods: {
    toReceive() {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      uni.$util.currentClockin(); // 点亮

      // 免费领取
      uni.$api
        .apiRequest("recieveCoupon", {
          couponContactId: this.couponContactId,
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            uni.showToast({
              title: "领取成功",
            });
          }
        });
    },
    /**
     * @description:获取优惠券详情
     * @param {*} id
     * @return {*}
     */
    getCouponDetail(id) {
      uni.$api
        .apiRequest("couponIdDetail", { couponContactId: id })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.setData({
              couponDetail: res.data,
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>