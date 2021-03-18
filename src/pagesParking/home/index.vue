<!--
 * @Author: NineNan
 * @Date: 2020-12-29 14:46:00
 * @LastEditTime: 2021-01-30 14:32:14
 * @LastEditors: Please set LastEditors
 * @Description: 停车首页
 * @FilePath: /heng-weapp/src/pagesParking/home/index.vue
-->
<template>
    <view class="parking-home">
        <navBar
            background="#f6f6f6"
            ext-class="fixed-bar"
            :home-btn="true"
            title="停车管理"
        />
        <view class="content">
          <!-- 当前商场 begin -->
          <view class="current-mall mb10" @tap="jumpToSwitch">
            <view class="text">{{
              currentMall.marketName || '--'
            }}</view>
            <u-icon name="arrow-down"></u-icon>
          </view>
          <!-- 当前商场 end -->

            <!-- swiper begin -->
            <swiper
                class="swiper mb10"
                :indicator-dots="indicatorDots"
                :autoplay="autoplay"
                :interval="interval"
                :duration="duration"
                :indicator-color="'rgba(0, 0, 0, 0.5)'"
                :indicator-active-color="'#FFFFFF'"
                v-if="switchAds.length>0"
            >
                <swiper-item v-for="item in switchAds" :key="item">
                    <image class="swiper-image" :src="item.image" @click="jumpto(item)" />
                </swiper-item>
            </swiper>
            <!-- swiper end -->
            <!-- 车牌号输入 begin -->
            <view class="license-plate-number mb10">
                <car-keybord :title="'请输入车牌号'" @success="success" @fail="fail"/>
                <view :class="[btnStyle, 'btn']" @click="search">查询缴费</view>
            </view>
            <!-- 车牌号输入 end -->
            <!-- 车牌列表 begin -->
            <swiper
                class="license-plate-list mb20"
                v-if="isShowParkList"
                :indicator-dots="indicatorDots"
                :interval="carInterval"
                :duration="carDuration"
                :indicator-color="'rgba(0, 0, 0, 0.15)'"
                :indicator-active-color="'#777777'"
            >
                <swiper-item
                    class="swiper-content"
                    v-for="item in parkList"
                    :key="item"
                >
                    <license-plate @pay="pay" :isShowStatus="true" :content="item"/>
                </swiper-item>
            </swiper>
            <!-- 车牌列表 end -->
            <!-- 收费规则 begin -->
            <view class="charging-rules mb10" @click="goRules">
                <view>
                    <text>
                        收费规则
                    </text>
                    <image
                        src="@/static/images/alertR.png"
                    >
                </view>
                <view class="info">
                    {{ chargingRulesInfo }}
                </view>
            </view>
            <!-- 收费规则 end -->
            <!-- 底部选项 begin -->
            <view class="parking-home-footer">
               <view v-for="item in footerTabs" :key="item.title" @tap="goDetails(item.link)">
                   <image
                        :src="item.img"/>
                   <text>
                       {{item.title}}
                   </text>
               </view> 
            </view>
            <!-- 底部选项 end -->
        </view>
    </view>
</template>
<script>
import carKeybord from "../components/carKeybord"; // 车牌号键盘模块
import licensePlate from "../components/licensePlate"; // 车牌列表
export default {
  components: {
    "car-keybord": carKeybord,
    "license-plate": licensePlate,
  },
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      carDuration: 500,
      carInterval: 3000,
      switchAds: [],
      swiperImg: [
        "https://eos-wuxi-1.cmecloud.cn/crmoss/0f8dd658-cc1d-46dc-82ea-fc24d4c97f43.jpg",
        "https://eos-wuxi-1.cmecloud.cn/crmoss/f1fbb355-5889-4847-a06a-7c8f44d20e8e.jpg",
      ],
      isShowCarKeyboard: false, // 车牌号键盘显示
      footerTabs: [
        {
          img: require("@/static/images/parking/car.png"),
          title: "车牌管理",
          link: "/pagesParking/licensePlateManagement/index",
        },
        {
          img: require("@/static/images/parking/recording.png"),
          title: "停车记录",
          link: "/pagesParking/parkingRecord/index",
        },
        {
          img: require("@/static/images/parking/discount.png"),
          title: "领停车券",
          link: "/pages/myCardCoupon/couponCenter/couponCenter?tabCurrent=1",
        },
      ], // 底部选项
      licensePlate: "", // 车牌 皖K3U205
      parkList: [], // 我的停车列表
      gradeId: "", // 会员id
      chargingRulesInfo: "", // 收费规则简介
      userInfo: {},
      currentMall: uni.$localStorage.getItem("currentMall"), // 当前商场
    };
  },
  computed: {
    btnStyle() {
      return this.licensePlate ? "btn-success" : "btn-disabled";
    },
    isShowParkList() {
      return this.parkList.length;
    },
  },
  created() {
    this.init();
  },
  onShow() {
    // 切换完商城 重新获取数据
    if(this.currentMall.orgid && uni.$localStorage.getItem("orgId") != this.currentMall.orgid){
      this.currentMall= uni.$localStorage.getItem("currentMall");
      this.initGrids();
      this.getChargingRules();
    }
    this.getParkListData();
  },
  methods: {
    /**
     * @description 选择地址
     */
    jumpToSwitch() {
      uni.navigateTo({
        url: "/pages/index/switchMall/switchMall?type=1",
      });
    },
    /**
     * @description 初始化
     */
    init() {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      // this.getMemberGradeList();
      this.userInfo = uni.$localStorage.getCurrentUser() || {};
      this.initGrids();
      this.getChargingRules();
    },

    /**
     * @description 获取头部广告位
     */
    async initGrids() {
      // 初始化宫格导航
      const res = await uni.$api.apiRequest("getAdvs", {
        orgId: uni.$localStorage.getItem("currentMall").orgid,
        placement: 26,
      });
      if (res.code == 10000 && res.data) {
        this.switchAds = res.data;
      }
    },
    /**
     * @description 获取停车列表数据
     */
    getParkListData() {
      this.parkList = []
      uni.$api
        .apiRequest("parkList", {
          memberId: uni.$localStorage.getItem("memberId"),
          gradeId: this.userInfo.levelName,
        })
        .then((res) => {
          console.log(123123);
          if (res.code === 10000 && res.data) {
            const { data } = res;
            data.list.forEach((item) => {
              if (item.isPark) {
                this.parkList.push(item);
              }
            });
            console.log("parkList:", this.parkList);
          }
        });
    },
    /**
     * @description 立即缴费
     * @param {Object} content 当前的车牌
     */
    async pay(content) {
      const params = {
        carNumber: content.carNumber,
        memberId: uni.$localStorage.getItem("memberId"),
        gradeId: uni.$localStorage.getItem("wxUserInfo").levelName,
        carType: content.carNumber.length === 8 ? 2 : 1,
      };
      const res = await uni.$api.apiRequest("parkCheckPlate", params);
      if (res && res.code === 10000) {
        if (!res.data.isPark) {
          uni.$alert.showToast("当前车辆未入场");
        } else {
          uni.navigateTo({
            url: `/pagesParking/payPark/index?json=${JSON.stringify(res.data)}`,
          });
        }
      }
    },
    /**
     * @description 跳转详情
     */
    goDetails(link) {
      uni.navigateTo({
        url: link,
      });
    },
    /**
     * @description 跳转收费规则页面
     */
    goRules() {
      uni.navigateTo({
        url: `/pagesA/out/parsePage?title=收费规则&url=chargingRules`,
      });
    },
    /**
     * @description 符合规范的车牌号
     */
    success(val) {
      this.licensePlate = val;
    },
    /**
     * @description 不符合规范的车牌号
     */
    fail() {
      this.licensePlate = "";
    },
    /**
     * @description 查询缴费
     */
    async search() {
      if (!this.licensePlate) {
        return false;
      }
      const params = {
        carNumber: this.licensePlate,
        memberId: uni.$localStorage.getItem("memberId"),
        gradeId: uni.$localStorage.getItem("wxUserInfo").levelName,
        carType: this.licensePlate.length === 8 ? 2 : 1,
      };
      const res = await uni.$api.apiRequest("parkCheckPlate", params);
      if (res && res.code === 10000) {
        if (!res.data.isPark) {
          uni.$alert.showToast("当前车辆未入场");
        } else {
          uni.navigateTo({
            url: `/pagesParking/payPark/index?json=${JSON.stringify(res.data)}`,
          });
        }
      }
    },
    /**
     * @description 收费规则及内容
     */
    async getChargingRules() {
      const res = await uni.$api.apiRequest("chargingRules");
      console.log(res);
      const { data } = res;
      this.chargingRulesInfo = data && data.brief || "";
    },
    /**
     * @description: 广告位跳转
     * @param {*} val 广告位对象
     */
    jumpto(val){
      uni.$util.adJumpUrl(val.linkAddress)
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>