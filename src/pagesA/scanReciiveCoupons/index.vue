<!--
 * @Author: wangyan
 * @Date: 2021-01-14 15:47:27
 * @LastEditors: wangyan
 * @LastEditTime: 2021-01-22 16:40:18
 * @Description: 扫码领券,只有免费券，普通券（不包含券组合，收费券）
 * @FilePath: \heng-weapp\src\pagesA\scanReciiveCoupons\index.vue
-->
<template>
  <view class="couponlist-view">
    <navBar
      style="position: absolute; top: 0px"
      color="white"
      background="inherit"
      backgroundColorTop="inherit"
      title="领券中心"
      :homeBtn="true"
    />
    <view class="header">
      <view class="bgc"></view>
      <view class="list">
        <!-- 优惠券列表 -->
        <view class="listContain" v-if="currentData.length">
          <view
            class="listItem"
            v-for="item in currentData"
            :key="item.couponContactId"
            @tap="onTap(item.couponContactId)"
          >
            <CouponCard :card="item">
              <view slot="right">
                <u-button
                  shape="circle"
                  :disabled="item.status == 2"
                  :custom-style="customStyle"
                  hover-class="none"
                  plain
                  :throttle-time="500"
                  @click="toReceive(item)"
                >
                  <template>{{
                    `${item.status != 2 ? "免费领取" : "已抢光"}`
                  }}</template>
                </u-button>
              </view>
            </CouponCard>
          </view>
        </view>
        <view v-else class="nodata">
          <app-empty
            :card="{
              img:
                'https://eos-wuxi-1.cmecloud.cn/crmoss/6bb11724-c450-456c-8e3b-c5cf1d789814.png',
              text: '暂无优惠券',
            }"
          >
          </app-empty>
          <view class="nodata_button">
            <u-button type="error" @click="goHome">去逛逛吧</u-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CouponCard from "@/pageComponents/coupon/couponCard";
import AppEmpty from "@/pageComponents/ht-app/cards/empty.vue";

const app = getApp();
export default {
  name: "couponList",
  components: {
    AppEmpty,
    CouponCard,
  },
  data() {
    return {
      options: {},
      customStyle: {
        width: "68px",
        height: "25px",
        lineHeight: "25px",
        fontSize: "12px",
        color: "#FE5D4D",
      },
      // 请求参数
      currentData: [],
    };
  },
  /**
   * @description 1.未登录去登陆 2.已登录 是否需要切换组织
   */
  onShow() {
    if (!uni.$localStorage.getItem("Token")) {
      uni.navigateTo({
        url: "/pages/login/login",
      });
      return;
    } else {
      if (!uni.$localStorage.getItem("currentMall")) {
        this.currentMallInfo(
          app.globalData.orgId || uni.$localStorage.getItem("orgId")
        );
      } else {
        // 已登录 是否需要切换组织
        let orgId = this.sceneParse(this.options.scene || "").orgId;
        if (orgId && uni.$localStorage.getItem("orgId") != orgId) {
          this.currentMallInfo(
            app.globalData.orgId || uni.$localStorage.getItem("orgId"),
            true
          );
        } else {
          this.getPageList();
        }
      }
    }
  },
  onLoad(options) {
    //    * 1.没组织  2.有组织 没登录 2.有组织 已登录
    // 没组织获取当前组织信息，并保存在本地缓存中
    // 有组织则切换组织
    // 没有登录则跳转到登录页面先登录

    let orgId = app.globalData.orgId || uni.$localStorage.getItem("orgId");
    this.options = options;
    if (!orgId) {
      let list = this.sceneParse(options.scene || "");
      orgId = list.orgId;
      app.globalData.orgId = orgId;
      uni.$localStorage.setItem("orgId", orgId);

      uni.navigateTo({
        url: "/pages/login/login",
      });
      return;
    } else {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
    }
  },
  methods: {
    /**
     * 获取当前商场信息
     */
    currentMallInfo(orgId, ischange) {
      uni.$api
        .apiRequest("getMallInfo_user", {
          orgId: uni.$localStorage.getItem("orgId"),
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000) {
            uni.$localStorage.setItem("currentMall", {
              marketName: res.data.name,
              orgId: orgId,
            });
            if (ischange) this.getHomeMemberInfo();
            this.getPageList();
          }
        });
    },
    sceneParse(scene) {
      const arr = scene.split("_");
      if (arr.length == 3) {
        return {
          paramsId: arr[0],
          orgId: arr[1],
          type: arr[2],
        };
      }
      return {};
    },
    /**
     * (1)并切换商场 (2)更新用户积分成长值
     * @description 获取用户信息
     */
    getHomeMemberInfo() {
      var self = this;
      uni.$util.getMemberInfo().then((res) => {
        if (res) {
          let u = { ...self.userInfo, ...res };
          app.globalData.integral = res.integral;
          uni.$localStorage.setCurrentUser(res);
          uni.$localStorage.setItem("memberId", res.memberId);
        }
      });
    },
    /**
     * @description 跳转到优惠券详情页
     */
    onTap(couponContactId) {
      uni.navigateTo({
        url: `/pagesA/scanReciiveCoupons/couponDetail/index?couponContactId=${couponContactId}`,
      });
    },
    toReceive(item) {
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
          couponContactId: item.couponContactId,
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
    goHome() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    // 获取扫码领券列表
    getPageList() {
      uni.$api
        .apiRequest("scanReciiveList", {
          memberId: uni.$localStorage.getItem("memberId"),
          id: this.sceneParse(this.options.scene || "").paramsId || "",
        })
        .then((res) => {
          if (res.code === 10000 && res.data) {
            let arr = res.data.couponList;
            this.setData({
              currentData: arr,
            });
          }
        });
    },
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {},
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
