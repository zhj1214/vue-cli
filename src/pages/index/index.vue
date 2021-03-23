<template>
  <view class="pageHome">
    你好，敲打吗
    <!-- 提示信息弹框 -->
    <alertView
      v-if="alertShow && alertContent"
      :showHeader="false"
      :content="alertContent"
      :showCancel="true"
      @ok="okAlert(1)"
      @cancel="okAlert(0)"
    >
    </alertView>
    <!-- @ok="mallAlertShowOk" -->
    <alertView
      v-if="mallAlertShow"
      :showHeader="false"
      content="您当前还未选择商场，请选择商场后再进行浏览"
      @cancel="mallAlertShowOk"
    >
    </alertView>
  </view>
</template>

<script>
// import AppGoodsCard from '@/pageComponents/ht-app/cards/goods-card.vue';
// import CouponCard from "@/pageComponents/coupon/couponCard.vue";
// // import AppCouponCard from '@/pageComponents/ht-app/cards/coupon-card-2.vue';
// import AppActivityCard from '@/pageComponents/ht-app/cards/activity-card.vue';
// import AppEmpty from '@/pageComponents/ht-app/cards/empty.vue';
// import AppGroupCard from '@/pageComponents/ht-app/cards/group-card.vue';
import alertView from "../../pageComponents/alertView/alertView";

import {
  adaptGroups,
  adaptChangeMall,
  adaptGoodsList,
  adaptCouponList,
  adaptActivityList,
} from "@/utils/adaptors/shop.js";

const app = getApp(); //获取应用实例
const SCENE_PARSE_KEY = "$_scene_parsed"; // 场景析构
export default {
  components: {
    // AppGoodsCard,
    // // AppCouponCard,
    // CouponCard,
    // AppActivityCard,
    // AppGroupCard,
    // AppEmpty,
    alertView,
  },
  /**
   * 首页逻辑处理
   * 1.是否需要选择商场
   * 2.不同商场的场景模式，弹框切换商场
   * 2.场景调用下一步
   * 3.进入首页就获取用户信息，更新积分值
   * */

  data() {
    return {
      customStyle: {
        // 优惠券领取按钮样式
        width: "68px",
        height: "25px",
        fontSize: "12px",
        color: "#FE5D4D",
      },
      opacity: 0,
      statusBarHeight: 20,
      userInfo: {},
      currentMall: {}, // 当前商场信息
      swiperList: [],
      grids: [],
      column2: [],
      column1: [],
      groups: [],
      tabs: [
        {
          name: "优惠券",
          type: 4,
          sortType: 3,
        },
        {
          name: "活动",
          type: 3,
          sortType: 3,
        },
        {
          name: "商品",
          type: 1,
          sortType: 3,
        },
      ],
      curTabIndex: 0,
      options: undefined,
      alertShow: false, // 定位信息提示框
      mallAlertShow: false,
      alertContent: "",
      // 分页参数
      params: {
        page: 1,
        size: 8,
      },
      // 分页数据
      list: [], // 列表数据
      total: 0, // 总条数
    };
  },
  /**
   * 生命周期函数--监听页面显示
   * 没有options可以拿到
   */
  onShow: function() {
    // 获取积分 单位 名称
    if (uni.$localStorage.getItem("Token")) {
      this.getPointsRelus();
    }
    // 用户信息 可能随时变更
    this.getHomeMemberInfo();
    this.sceneInit();
    this.currentMallisDL();
    uni.showTabBar();
  },
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    if (options) this.options = options;
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
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
      title: "没有更多了",
      icon: "none",
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

  onPageScroll(obj) {
    this.opacity = obj.scrollTop / 100;
  },

  methods: {
    /**
     * 当前商场是否点亮
     * */

    currentMallisDL() {
      if (
        uni.$localStorage.getItem("memberId") &&
        !app.globalData.currentMallisDL
      )
        uni.$api
          .apiRequest("getMallInfo", {
            orgId: uni.$localStorage.getItem("orgId"),
            memberId: uni.$localStorage.getItem("memberId"),
          })
          .then((res) => {
            if (res.code == 10000)
              app.globalData.isCurrentClockin = res.data != undefined;
          });
    },
    /**
     * 小程序逻辑处理
     * 1.查看当前是否是携带场景进入，是的话就进行场景模式流程，反之加载逻辑
     * */
    sceneInit() {
      var self = this;
      uni.$scene.setScene(this.options || {});
      self.jumpLogic(self);
    },
    /**
     * 一:场景逻辑
     * 1.未登录
     * 		(1)跳转登录注册页面。注册完成后悔自动  调用	修改注册来源接口
     * 2.已登录
     * 		是否需要切换商场
     * 			切换：直接触发(1)修改注册来源接口 (2)并切换商场 (3)更新用户积分成长值
     * 			不切换：(1)并切换商场 (2)更新用户积分成长值
     * 二：普通进入
     * 	1.是否选择商场
     * 		有商场：获取接口数据(也包括 切换商场逻辑)
     * 		无商场：进入 切换商场页面
     *  2.
     * */
    async jumpLogic() {
      // await uni.$scene.next(); // 执行 fetchScene
      // 场景值消费完毕，删除它，否则下次onshow还是执行扫那场景逻辑
      var self = this;
      if (self.options && self.options.scene) {
        delete self.options.scene;
        // 如果是扫码场景则切换商场，加载首页数据
        let sceneObj = uni.$scene.getQueueScene()[SCENE_PARSE_KEY];
        uni.$scene.changeMall(sceneObj.orgId).then((res) => {
          if (res) {
            // 当首页数据加载完成
            uni.$api.getRequestManage().onect_key = "page_hone_data"
            uni.$api.getRequestManage().currentRequestStatus((key)=>{
              if(key == 'page_hone_data'){
                console.log('首页数据加载完成~~');
                uni.navigateTo({
                  url: uni.$scene.getQueueScene().pagePath
                })
                uni.$api.getRequestManage().onect_key = "page_hone_data_done"
              }
            })
            self.init(); // 加载首页数据
          } else {
            self.jumpLogic(); // 接着走原来的逻辑
          }
        });
        return;
      }
      // console.log(self.options)

      let mallInfo = uni.$localStorage.getItem("currentMall");
      if (!app.globalData.orgId || app.globalData.orgId != mallInfo.orgid) {
        app.globalData.orgId = mallInfo.orgid;
        uni.$localStorage.setItem("orgId", mallInfo.orgid);
      }

      if (
        !mallInfo.orgid &&
        self.refuseMallLocation == undefined &&
        self.isRefuseMallLocation == undefined
      ) {
        self.getLocation(true);
      } else if (!mallInfo.orgid) {
        console.warn("本地缓存中没有 商场信息");
        if (self.mallAlertShow) {
          self.mallAlertShowOk();
          uni.$alert.showToast("只有选择商场才能查看心仪商品呦");
        }
        self.mallAlertShow = true;
      } else {
        /************************** 获取首页数据 *************************/
        self.init();
        let mallInfo = uni.$localStorage.getItem("currentMall");
        if (
          self.currentMall.marketName &&
          self.currentMall.marketName != mallInfo.marketName
        )
          self.isSelectMall = true; // 手动切换了商场，就用在提示距离那个近了
        self.currentMall.marketName = mallInfo.marketName;
        self.getLocation();
      }
    },
    mallAlertShowOk() {
      uni.navigateTo({
        url: "/pages/index/switchMall/switchMall",
      });
    },
    /**
     * (1)并切换商场 (2)更新用户积分成长值
     * */
    solveScene(mallInfo) {
      uni.$localStorage.setItem("orgId", mallInfo.orgid);
      app.globalData.orgId = mallInfo.orgid;
      this.options = undefined;
      this.currentMall.marketName = mallInfo.marketName;
      this.getHomeMemberInfo(); // 更新用户积分成长值
      this.init();
    },
    /**
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
          let isLogin = uni.$localStorage.getItem("Token") ? true : false; // 改变登录状态
          self.$nextTick(() => {
            this.isLogin = isLogin;
            self.setData({
              userInfo: u,
            });
          });
        }
      });
    },
    /**
     * 动态获取 积分名称
     */
    getPointsRelus() {
      uni.$api.apiRequest("pointsRelus").then((res) => {
        if (res.code == 10000 && res.data) {
          app.globalData.pointName = res.data.pointsName || "积分";
        }
      });
    },

    init() {
      this.fetchCloseStatus();
      this.initSwiper();
      this.initGrids();
      this.initColumnTwo();
      this.initColumnOne();
      this.list = [];
      this.total = 0;
      this.params.page = 1;
      this.fetchList();
      this.initGroup();
    },

    async initSwiper() {
      // 初始化轮播图
      const res = await uni.$api.apiRequest("getAdvs", {
        orgId: uni.$localStorage.getItem("currentMall").orgid,
        placement: 20,
      });
      if (res.code == 10000 && res.data) {
        this.swiperList = res.data.slice(0, 10); // 限制最多10张
      }
    },

    async initGrids() {
      // 初始化宫格导航
      const res = await uni.$api.apiRequest("getAdvs", {
        orgId: uni.$localStorage.getItem("currentMall").orgid,
        placement: 21,
      });
      if (res.code == 10000 && res.data) {
        this.grids = res.data.slice(0, 8); // 限制最多8个
      }
    },

    async initColumnTwo() {
      // 初始化运营位 2栏
      const res = await uni.$api.apiRequest("getAdvs", {
        orgId: uni.$localStorage.getItem("currentMall").orgid,
        placement: 22,
      });
      if (res.code == 10000 && res.data) {
        const tmpArr = res.data.slice(0, 4);
        // 限制最多2个, 单数不显示
        this.column2 = tmpArr.length % 2 !== 1 ? tmpArr : [];
      }
    },

    async initColumnOne() {
      // 初始化运营位 1栏
      const res = await uni.$api.apiRequest("getAdvs", {
        orgId: uni.$localStorage.getItem("currentMall").orgid,
        placement: 23,
      });
      if (res.code == 10000 && res.data) {
        this.column1 = res.data.slice(0, 2); // 限制最多1个
      }
    },

    async initGroup() {
      this.groups = [];
      const rootOrgId = uni.$localStorage.getItem("orgId");
      let directOrgId = ""; // 商场下直营店铺id
      // 小程序首页：分组展示本级，即所属直营店铺分组数据
      const { data = [] } = await uni.$api.apiRequest("fetchDepartmentList", {
        orgIds: [rootOrgId],
        types: [10],
        shopTypes: [3],
        isSearch: true,
      });
      if (data && data.list.length) {
        directOrgId = data.list[0].orgId;
      } else {
        if (new Date().getTime() > 1611585900000) {
          return uni.$alert.showToast("组织查询异常");
        }
      }
      // 传入直营店铺id
      uni.$localStorage.setItem("orgId", directOrgId);
      const res = await uni.$api.apiRequest("__v2__fetchStoreGroups", {
        pageNum: 1,
        pageSize: 10,
        orgStatus: 1,
      });
      // 回传初始组织id
      uni.$localStorage.setItem("orgId", rootOrgId);
      if (res.code !== 10000 && !res.data) return;
      this.groups = adaptGroups(res.data.groupInfoList || []);
    },

    async fetchList() {
      const searchType = this.tabs[this.curTabIndex].type;
      const res = await uni.$api.apiRequest("__v2__searchGoods", {
        pageSize: this.params.size,
        pageNum: this.params.page,
        searchContent: "",
        searchType,
        sortType: this.tabs[this.curTabIndex].sortType || 1,
        orgId: uni.$localStorage.getItem("orgId"),
        // orgId: "555555",
      });
      if (res.code !== 10000 && !res.data) return;

      // 如果时搜索商品
      if (searchType === 1) {
        this.total = res.data.goodsInfo.goodsInfoPageData.count; // 保存总条数
        // 保存列表数据
        if (this.params.page === 1) {
          this.list = adaptGoodsList(
            res.data.goodsInfo.goodsInfoPageData.list || []
          );
        } else {
          this.list = this.list.concat(
            adaptGoodsList(res.data.goodsInfo.goodsInfoPageData.list || [])
          );
        }
        return;
      }

      // 如是搜索优惠券
      if (searchType === 4) {
        this.total = res.data.couponInfo.count; // 保存总条数
        // 保存列表数据
        if (this.params.page === 1) {
          this.list = adaptCouponList(res.data.couponInfo.list || []);
        } else {
          this.list = this.list.concat(
            adaptCouponList(res.data.couponInfo.list || [])
          );
        }
        return;
      }

      // 如是搜索活动
      if (searchType === 3) {
        this.total = res.data.activityInfo.count; // 保存总条数
        // 保存列表数据
        if (this.params.page === 1) {
          this.list = adaptActivityList(res.data.activityInfo.list || []);
        } else {
          this.list = this.list.concat(
            adaptActivityList(res.data.activityInfo.list || [])
          );
        }
        return;
      }
    },

    // async fetchList() {
    //   const res = await uni.$api.apiRequest('searchGoods', {
    //     ...this.params,
    //     type: this.tabs[this.curTabIndex].type,
    //     sortType: this.tabs[this.curTabIndex].sortType || 'all',
    //   });
    //   if (res.code !== 10000 && !res.data) return;
    //   this.total = res.data.count; // 保存总条数
    //   // 保存列表数据
    //   if (this.params.page === 1) {
    //     this.list = res.data.list || [];
    //   } else {
    //     this.list = this.list.concat(res.data.list || []);
    //   }
    // },
    async fetchCloseStatus() {
      const res = await uni.$api.apiRequest("__v2__fetchStoreBaseInfo", {
        id: uni.$localStorage.getItem("orgId"),
      });
      if (res.code === 10000 && res.data) {
        if (res.data.closed) {
          uni.redirectTo({
            url: "/pagesA/loading/updating?from=org",
          });
          //  return
        }
      }
    },

    /**
     * TODO
     */
    jumpToSwitch() {
      uni.navigateTo({
        url: "/pages/index/switchMall/switchMall",
      });
    },
    onTabChange(index) {
      this.params.page = 1;
      this.list = [];
      this.curTabIndex = index;
      this.fetchList();
    },

    onSwiperTap(index) {
      const url = this.swiperList[index].linkAddress;
      console.log(url);
      uni.$util.adJumpUrl(url);
      // this.navTo(url);
    },

    onGridTap(item) {
      const url = item.linkAddress;
      uni.$util.adJumpUrl(url);
    },

    onColumnTap(item) {
      const url = item.linkAddress;
      this.navTo(url);
    },

    navTo(url) {
      if (!url) return;
      if (url.toString().startsWith("http")) {
        uni.navigateTo({
          url: `/pagesA/out/out?src=${url}`,
        });
      } else {
        uni.$util.adJumpUrl(url);
      }
    },

    onTapMore(item) {
      uni.navigateTo({
        url: `/pages/group/list?id=${item.id}`,
      });
    },

    onTapSearch() {
      uni.redirectTo({
        url: "/pages/index/goods-search/goods-search",
      });
    },

    onQrcodeTap() {
      // 如果已经登录
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/my/userQrcode/userQrcode",
      });
    },

    /**
     * 获取经纬度,是否需要切换商场
     * */
    getLocation(isRefuseMallLocation) {
      if (this.isSelectMall) return;
      var self = this;
      uni.getLocation({
        type: "gcj02",
        success(res) {
          self.getmallDatas({
            isRefuseMallLocation: isRefuseMallLocation,
            longitude: res.longitude,
            latitude: res.latitude,
            uid: uni.$localStorage.getItem("memberId"),
          });
        },
        fail(err) {
          console.log(err);
          if (!uni.$localStorage.getItem("currentMall")) {
            self.refuseMallLocation = true;
            self.mallAlertShow = true;
          }
        },
      });
    },
    /**
     * 获取商场数据
     * */
    getmallDatas(param) {
      var self = this;
      let mallInfo = uni.$localStorage.getItem("currentMall");
      uni.$api
        .apiRequest("__v2__changeCityMall", {
          ...param,
          orgId: uni.$localStorage.getItem("orgId"),
        })
        .then((res) => {
          // console.log(res);
          if (res.code == 10000) {
            const data = adaptChangeMall(res.data);
            if (data.nearInfo && data.nearInfo.type == "near") {
              self.near = data.nearInfo;
            }
            if (param.isRefuseMallLocation) {
              if (self.near) {
                self.alertContent = `您当前还未选择商场，系统定位到您离 ${self.near.marketName} 更近，是否切换？`;
                this.isRefuseMallLocation = true;
                self.alertShow = true;
              } else {
                self.mallAlertShow = true;
              }
            } else {
              if (self.near && mallInfo.marketName != self.near.marketName) {
                self.alertContent = `您目前所在 ${mallInfo.marketName}，系统定位到您离 ${self.near.marketName} 更近，是否切换？`;
                self.alertShow = true;
              }
            }
          }
        });
    },
    okAlert(val) {
      this.isSelectMall = true;
      if (val && this.near) {
        uni.$localStorage.setItem("currentMall", this.near);
        this.isRefuseMallLocation = false;
        this.solveScene(this.near);
      } else if (this.isRefuseMallLocation) {
        this.mallAlertShow = true;
      } else {
        this.alertShow = false;
      }
    },
    onGoodsCardTap(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.id}`,
      });
    },
    /**
     * @description 跳转到优惠券详情页
     */
    onCouponTap(item) {
      if (item.couponType === "COMBINATION") {
        // 组合券
        uni.navigateTo({
          url: `/pages/myCardCoupon/couponCenter/couponCenterDetail?combinationId=${item.combinationId}&couponContactId=${item.couponContactId}`,
        });
      } else {
        // 普通券
        uni.navigateTo({
          url: `/pages/myCardCoupon/couponCenter/couponCenterDetail?couponContactId=${item.couponContactId}`,
        });
      }
    },
    /**
     * @description 跳转到订单页面购买优惠券 or 免费领取
     */
    toReceive(item) {
      this.onCouponTap(item);
    },
  },
  filters: {
    priceFormat(val) {
      if (!val) return "--";
      return `￥${uni.$util.decimalTwo(val, true, 2)}`;
    },
  },
};
</script>

<style lang="less">
@gutter: 20rpx;

.page-home {
  background-color: #f9f9f9;
  .swiper-wrap {
  }
  .header-fix {
    position: relative;
    min-height: 300rpx;
  }
  .bar-wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    &__bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      // background:linear-gradient(90deg, rgb(194,203,228), rgb(146,166,218));
      z-index: -1;
    }
  }

  .nav-bar {
    position: relative;
    padding: 0 40rpx;
    height: 44px;
    line-height: 44px;

    text-align: center;
    &__left {
      position: absolute;
      top: 0;
      left: 40rpx;
      display: flex;

      &--text {
        margin-right: 4rpx;
        max-width: 200rpx;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
    &__title {
      font-size: 34rpx;
      font-weight: bold;
      color: #000;
    }
  }
  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    padding: 10rpx 40rpx;
    &__field {
      flex: 1;
      display: flex;
      align-items: center;
      height: 80rpx;
      background-color: #ffffff;
      border-radius: 12rpx;

      &--icon {
        margin: 0 20rpx;
        width: 40rpx;
      }
      &--input {
        flex: 1;
        border-left: 1px solid #d8d8d8;
        padding-left: 10rpx;
        color: #c6c6c6;
      }
    }
    &__action {
      display: flex;
      align-items: center;
      margin-left: 36rpx;
      height: 80rpx;
      line-height: 80rpx;
      &--icon {
        width: 54rpx;
        height: 54rpx;
      }
    }
  }

  .nav-card {
    position: relative;
    padding: 40rpx;
    margin-top: -40rpx;
    margin-bottom: @gutter;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    border-radius: 40rpx 40rpx 0 0;
    z-index: 10;
    &__grid {
      width: 25%;
      padding: 10rpx;
      text-align: center;
    }
    &__icon {
      width: 60rpx;
      height: 60rpx;
      margin-bottom: 10rpx;
    }
    &__text {
      text-align: center;
      color: #444444;
      font-size: 24rpx;
      margin-bottom: 16rpx;
    }
  }

  .adv-card {
    padding: 20rpx 40rpx;
    background-color: #fff;
    margin-bottom: @gutter;
    &__2 {
      display: flex;
      flex-wrap: wrap;
      &--item {
        width: 50%;
        height: 200rpx;
        overflow: hidden;
        margin-bottom: @gutter;
        &:nth-child(2n) {
          padding-left: 10rpx;
        }
        &:nth-child(2n + 1) {
          padding-right: 10rpx;
        }
      }
      &--img {
        width: 100%;
      }
    }
    &__1 {
      display: flex;
      flex-wrap: wrap;
      &--item {
        width: 100%;
        height: 200rpx;
        overflow: hidden;
        margin-bottom: @gutter;
      }
      &--img {
        width: 100%;
      }
    }
  }

  .page-body {
    padding: 24rpx 40rpx;
    background-color: #fff;

    &__hd {
    }
    &__list {
      padding: 24rpx 0 0;
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
      padding: 24rpx 0 0;
      &--item {
        padding: 0;
        margin-bottom: 20rpx;
      }
    }
    &__list-v {
      padding: 24rpx 0 0;
      &--item {
        margin-bottom: 24rpx;
      }
    }
  }
}
</style>
