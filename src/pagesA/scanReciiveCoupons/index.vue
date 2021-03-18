<template>
  <view class="view">
    <navBar
      :homeBtn="true"
      style="position: absolute; top: 0px"
      color="white"
      background="inherit"
      backgroundColorTop="inherit"
      title="领券中心"
    ></navBar>
    <view class="header">
      <image
        style="width: 100vw; height: 160px"
        src="https://eos-wuxi-1.cmecloud.cn/crmoss/e59e1fc2-2067-425a-a743-5209123b8e84.png"
        mode=""
      ></image>
    </view>
  </view>
</template>

<script>
const app = getApp();
export default {
  name: "scanReciiveCoupons",
  data() {
    return {};
  },
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
        if (
          uni.$localStorage.getItem("orgId") !=
          this.sceneParse(options.scene).orgId
        ) {
          this.currentMallInfo(
            app.globalData.orgId || uni.$localStorage.getItem("orgId"),
            true
          );
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
    if (!orgId) {
      orgId = this.sceneParse(options.scene).orgId;
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
     * */
    currentMallInfo(orgId, ischange) {
      uni.$api
        .apiRequest("getMallInfo", {
          orgId: uni.$localStorage.getItem("orgId"),
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000) {
            uni.$localStorage.setItem("currentMall", {
              marketName: res.data.registrationSource,
              orgId: orgId,
              orgid: orgId,
            });
            if (ischange) this.getHomeMemberInfo();
          }
        });
    },
    sceneParse(scene) {
      const arr = scene.split("_");
      if (arr.length == 3) {
        return {
          paramsId: arr[2],
          orgId: arr[1],
          type: arr[0],
        };
      }
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
  },
};
</script>

<style lang="less" scoped>
.view {
}
</style>
