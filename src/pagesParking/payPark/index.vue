<!--
 * @Author: zhj
 * @Date: 2020-12-30 17:49:16
 * @LastEditTime: 2021-02-01 10:48:24
 * @Description: 缴费页面
 * @FilePath: /heng-weapp/src/pagesParking/payPark/index.vue
-->
<template>
  <view class="view">
    <navBar title="停车缴费" :homeBtn="true"></navBar>
    <!-- 缴费信息 -->
    <view class="parkInfo">
      <view class="header flex-between">
        <view class="header-title">{{ payData.parkInfo.carNumber }}</view>
        <view v-if="!isShowBindCar">
          <u-checkbox
            class="header-bind"
            v-model="isBindCar"
            active-color="#FE5D4D"
            name="isBindCar"
            >设为绑定车辆</u-checkbox
          >
        </view>
      </view>
      <view class="flex-between parkInfoLine" style="margin-top: 8px">
        <view class="item-title">商城名称</view>
        <view class="item-Desc">{{ payData.parkInfo.orgName }}</view>
      </view>
      <view class="flex-between parkInfoLine">
        <view class="item-title">车场名称</view>
        <view class="item-Desc">{{ payData.parkInfo.parkName }}</view>
      </view>
      <view class="flex-between parkInfoLine">
        <view class="item-title">入场时间</view>
        <view class="item-Desc">{{ payData.parkInfo.inTime }}</view>
      </view>
      <view class="flex-between parkInfoLine">
        <view class="item-title">停车时长</view>
        <view class="item-Desc">{{ payData.parkInfo.parkTime }}</view>
      </view>
      <view class="flex-between parkInfoLine">
        <view class="item-title">停车费用</view>
        <view class="item-Desc" style="color: #fe5d4d"
          >¥{{ payData.parkInfo.actFee }}</view
        >
      </view>
    </view>
    <!-- 优惠信息 -->
    <view
      class="parkInfo"
      style="margin-bottom: 100px; padding-bottom: 0px"
      v-if="isShowDiscountInfo"
    >
      <view class="header flex-between" style="border: none">
        <view class="header-title">优惠信息</view>
      </view>
      <view
        class="flex-between yhinfoLine"
        style="padding-top: 6px"
        v-if="payData.discountInfo.gradeDiscountTime"
      >
        <view class="item-title">会员等级减免</view>
        <view class="item-Desc"
          >-{{ payData.discountInfo.gradeDiscountTime }}小时</view
        >
      </view>

      <view
        class="flex-between yhinfoLine"
        v-if="payData.discountInfo.shopDiscountTime"
      >
        <view class="item-title">购物消费减免</view>
        <view class="item-Desc"
          >-{{ payData.discountInfo.shopDiscountTime }}小时</view
        >
      </view>
      <view
        class="flex-between yhinfoLine"
        @click="selectIntergral"
        v-if="isShowIntegral"
      >
        <view class="item-title">积分抵扣减免</view>
        <view class="item-Desc" v-if="!resetIntergral"
          >-{{ score.scoreTime }}小时</view
        >
        <view v-else class="item-Desc flex-row" style="color: #a2a2a2"
          >可用积分：<span style="color: #fe5d4d">{{
            payData.discountInfo.score
          }}</span>
          <image
            style="width: 8px; height: 13px; margin-left: 4px"
            src="../../static/images/jtr.png"
            mode=""
          ></image>
        </view>
      </view>
      <view class="flex-between yhinfoLine" @click="selectCoupons" v-if="false">
        <view class="item-title">停车券减免</view>
        <view class="item-Desc" v-if="!resetIntergral">-5小时</view>
        <view v-else class="item-Desc flex-row"
          ><span style="color: #fe5d4d">2</span>张可用
          <image
            style="width: 8px; height: 13px; margin-left: 4px"
            src="../../static/images/jtr.png"
            mode=""
          ></image>
        </view>
      </view>
      <view
        class="flex-center-column yhinfoLine"
        style="margin-bottom: 8px; align-items: flex-end; border: none"
      >
        <view class="yhinfoDesc"
          >优免金额<span style="color: #fe5d4d"
            >￥{{ concessionaryAmount }}</span
          ></view
        >
        <view
          class="yhinfoDescMin"
          v-if="
            payData.discountInfo.limitDiscountTime ||
              payData.discountInfo.limitDiscountTime == 0
          "
          >本日剩余最高可减免<span style="color: #fe5d4d">{{
            payData.discountInfo.limitDiscountTime
          }}</span
          >小时，超出无效</view
        >
      </view>
    </view>
    <!-- 立即支付 -->
    <view class="payView flex-between">
      <view class="price">
        <view class="priceDesc">应付金额：</view>
        <view class="priceNum">￥{{ amountsPayable }}</view>
      </view>
      <view class="payViewBtn" @click="payOrder">立即支付</view></view
    >
    <!-- 选择停车券 -->
    <SelectParkCoupon
      v-if="couponShow"
      :show="couponShow"
      :list="couponList"
      :alreadyList="alreadyList"
      @change="change"
    ></SelectParkCoupon>
    <InterAlert
      v-if="intergralShow"
      :show="intergralShow"
      :interGralObj="payData"
      @pointsConsumption="intergralChange"
    ></InterAlert>
  </view>
</template>
<script>
import SelectParkCoupon from "./selectParkCoupon";
import InterAlert from "./interAlert";
const APP = getApp()
export default {
  components: {
    SelectParkCoupon,
    InterAlert,
  },
  data() {
    return {
      isShowBindCar: true, // 是否显示设为绑定车辆 true-不显示 false-显示
      isBindCar: true, // 绑定车牌
      // 停车券
      couponShow: false,
      couponList: [],
      alreadyList: [],
      // 积分减免
      intergralShow: false,
      payData: {
        discountInfo: {},
        parkInfo: {},
      }, // 停车数据源
      resetIntergral: true, // 是否重置积分
      score: {},
      isShowIntergral: false,
    };
  },

  computed: {
    concessionaryAmount() {
      return this.totalDiscount * 2 * this.payData.discountInfo.price || 0;
    },
    amountsPayable() {
      let a = this.payData.parkInfo.actFee - this.concessionaryAmount;
      return a >= 0 ? a : 0;
    },
    gradeDiscountTime() {
      return this.payData.discountInfo.gradeDiscountTime || 0;
    },
    shopDiscountTime() {
      return this.payData.discountInfo.shopDiscountTime || 0;
    },
    /**
     * @description: 实际总优惠
     * 1、如果有上限最大就是上限优惠
     */
    totalDiscount() {
      return (
        this.totalMerberDiscount +
        (this.score.scoreTime || 0)
      );
    },
    totalMerberDiscount(){
      let total = this.gradeDiscountTime + this.shopDiscountTime;
      if(total >= this.payData.discountInfo.limitDiscountTime)
      total = this.payData.discountInfo.limitDiscountTime
      return total
    },
    /**
     * @default 是否显示优惠信息
     */
    isShowDiscountInfo() {
      return (
        this.payData.discountInfo.gradeDiscountTime ||
        this.payData.discountInfo.shopDiscountTime ||
        this.payData.discountInfo.scoreRate
      );
    },

    /**
     * @description 是否显示积分优惠
     */
    isShowIntegral() {
      // return true;
      if (!this.payData.discountInfo.score) {
        return false;
      } else {
        if (
          this.payData.parkInfo.payCountTime >
            (this.payData.discountInfo.gradeDiscountTime || 0) +
              this.payData.discountInfo.shopDiscountTime ||
          0
        ) {
          // 当等级优惠与消费优惠时长 大于停车时长则积分和停车券不展示
          return true;
        } else {
          return false;
        }
      }
    },
  },
  onLoad(options) {
    let obj = JSON.parse(options.json);
    this.payData = obj;
    this.isShowBindCar = obj.parkInfo.isBind;
    // this.isBindCar = obj.parkInfo.isBind;
    this.userInfo = uni.$localStorage.getCurrentUser();
    // 当等级优惠与消费优惠时长 大于停车时长则积分和停车券不展示
    // if (
    //   obj.parkInfo.payCountTime >
    //   (obj.discountInfo.gradeDiscountTime || 0) +
    //     (obj.discountInfo.shopDiscountTime || 0)
    // ) {
    //   this.isShowIntergral = true;
    // }
    console.log("payData:", this.payData);

    if (obj.parkInfo.orderNo)
      uni.$localStorage.setItem("parkInfoOrderNo", obj.parkInfo.orderNo);
  },
  methods: {
    /**
     * 选择停车券
     * */
    selectCoupons() {
      this.couponShow = true;
    },
    change() {
      this.couponShow = false;
    },
    /**
     * @description 积分改变
     */
    intergralChange(val) {
      if (val) {
        this.score = val;
        this.resetIntergral = false;
        console.log(val, "积分 时长");
      }
      this.intergralShow = false;
    },
    selectIntergral() {
      this.intergralShow = true;
    },
    /**
     * @description: 支付四种场景：1.工行微信支付 2.网页支付 3.跳转到另一个小程序 4.不需要支付
     */
    payOrder() {
      // let discountTime = 0; // 总减免时长
      let realFee = 0; // 实付金额
      let discountFee = 0; // 优惠金额
      const discountInfo = this.payData.discountInfo; // 优惠信息
      const arr = ["gradeDiscountTime", "shopDiscountTime"];
      arr.forEach((item) => {
        discountInfo[item] = discountInfo[item] || 0;
      });
      this.score.scoreTime = this.score.scoreTime || 0;
      const timeObj = {
        gradeDiscountTime: discountInfo.gradeDiscountTime,
        couponDiscountTime: 0, // 优惠券减免时长
        scoreDiscountTime: this.score.scoreTime,
        shopDiscountTime: discountInfo.shopDiscountTime,
      };

      // Object.keys(timeObj).forEach((item) => {
      //   discountTime += timeObj[item];
      // });

      discountFee =
        discountInfo.price * 2 *
        (discountInfo.gradeDiscountTime +
          discountInfo.shopDiscountTime +
          this.score.scoreTime);
      if (this.payData.parkInfo.actFee - discountFee >= 0) {
        realFee = this.payData.parkInfo.actFee - discountFee;
      } else {
        realFee = 0;
      }

      const params = {
        appId:APP.globalData.iphoneInfo.miniProgram.appId,
        parkOrderId: this.payData.parkInfo.parkOrderId,
        carNumber: this.payData.parkInfo.carNumber,
        unionId: this.payData.parkInfo.unionId,
        ...timeObj,
        orderNo: this.payData.parkInfo.orderNo,
        gradeId: this.userInfo.levelName,
        discountTime: this.totalDiscount, // 总减免时长
        memberId: uni.$localStorage.getItem("memberId"),
        isBind: this.isBindCar,
        carType: this.payData.parkInfo.carType,
        actFee: this.payData.parkInfo.actFee, // 应收金额
        realFee: realFee, // 实付金额
        discountFee: discountFee,
        score: this.score.score * 2,
        couponList: undefined,
        openId: uni.$localStorage.getItem("userOpenId"),
        shopExchangeAmount: this.payData.discountInfo.shopExchangeAmount,
      };
      uni.$api.apiRequest("parkPay", params).then((res) => {
        if (res.code === 10000) {
          if (res.data.isPayZero) {
            // 4
            uni.reLaunch({
              url: "/pagesParking/paymentResult/index?isSuccess=1",
            });
          } else if (res.data.jumpType == "WEB") {
            // 2
            uni.navigateTo({
              url: "/pagesA/out/out?src=" + res.data.jumpUrl,
            });
          } else if (res.data.jumpType == "MINI_APPS") {
            // 3
            uni.navigateToMiniProgram({
              appId: res.data.jumpAppId,
              path: res.data.jumpUrl,
              // extraData: {
              //   data1: "test",
              // },
              success(res) {
                // 打开成功
                console.log("跳转成功", res.data.jumpAppId);
              },
            });
          } else if (res.data.jumpType == "NO") {
            // 1 微信支付
            uni.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.packageInfo,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success() {
                uni.reLaunch({
                  url: "/pagesParking/paymentResult/index",
                });
              },
              fail(err) {
                console.log(err);
                uni.reLaunch({
                  url: "/pagesParking/paymentResult/index?isSuccess=0",
                });
              },
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.view {
  background-color: #f6f6f6;
  min-height: 100vh;
  .parkInfo {
    margin: 10px 15px;
    background: #ffffff;
    box-shadow: 0px 0px 15px -2px rgba(186, 186, 186, 0.04);
    border-radius: 5px;
    padding-bottom: 8px;
    .header {
      align-items: center;
      padding: 14px 0px;
      margin: 0px 14px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      .header-title {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #262626;
      }
      .header-bind {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #444444;
      }
    }
    .item-title {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a2a2a2;
    }
    .item-Desc {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #444444;
    }
  }
  .parkInfoLine {
    padding: 7px 14px;
    align-items: center;
  }
  .yhinfoLine {
    padding: 16px 0px;
    margin: 0px 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    align-items: center;
  }
  .yhinfoDesc {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #444444;
  }
  .yhinfoDescMin {
    margin-top: 4px;
    font-size: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #919191;
  }
  .payView {
    bottom: 0;
    align-items: center;
    width: 100vw;
    justify-content: space-between;
    position: fixed;
    padding: 8px 30px;
    height: 84px;
    background: #ffffff;
    box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.15);
    .priceDesc {
      font-size: 12px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: #000000;
    }
    .priceNum {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fe5d4d;
    }
    .payViewBtn {
      padding: 10px 22px;
      background-color: #fe5d4d;
      border-radius: 4px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;

      text-align: center;
    }
  }
}
</style>
