<template>
  <view class="view">
    <navBar title="我的卡券包" background="#fff" :homeBtn="true"></navBar>
    <!-- 我的优惠券 -->
    <view class="container">
      <view class="myCoupon" @click="toCoupon">
        <view class="title">我的优惠券</view>
        <view class="numbers">{{ couponCount }}张</view>
      </view>
      <!-- 我的门票 -->
      <view class="myTick" @click="tomyCard">
        <view class="title">我的门票</view>
        <view class="numbers">{{ ticketCount }}张</view>
      </view>
    </view>
    <view style="padding: 0 20px; position: fixed; bottom: 30px; width: 100%">
      <u-button hover-class="none" :custom-style="customStyle" @click="toMore"
        >更多好券</u-button
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      couponCount: 0,
      ticketCount: 0,
      customStyle: {
        color: "#FE5D4D",
        borderColor: "#FE5D4D",
      },
    };
  },
  onShow() {
    this.getCountAvailable();
    this.getTicketCount();
  },
  methods: {
    toCoupon() {
      uni.navigateTo({
        url: "/pages/myCardCoupon/myCoupon/myCoupon",
      });
    },
    tomyCard() {
      uni.navigateTo({
        url: "/pages/myCardCoupon/myCard/myCard",
      });
    },
    toMore() {
      uni.navigateTo({
        url: "/pages/myCardCoupon/couponCenter/couponCenter",
      });
    },
    /**
     * 获取我的优惠券数量
     */
    getCountAvailable() {
      uni.$api
        .apiRequest("countAvailable", {
          memberId: uni.$localStorage.getItem("memberId"),
          orgId: uni.$localStorage.getItem("orgId"),
        })
        .then((res) => {
          if (res.code == 10000) {
            this.setData({
              couponCount: res.data.canUseCount,
            });
          }
        });
    },
    /**
     * 获取我的门票数量
     */
    getTicketCount() {
      uni.$api
        .apiRequest("ticketCount", {
          uid: uni.$localStorage.getItem("memberId"),
          orgId: uni.$localStorage.getItem("orgId"),
        })
        .then((res) => {
          if (res.code == 10000) {
            this.setData({
              ticketCount: res.data,
            });
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.view {
  display: flex;
  justify-content: center;
  flex-direction: column;
  .container {
    padding: 0 20px;
    background-color: #fff;
    height: calc(100vh - 88px);
  }

  .myCoupon {
    width: 100%;
    height: 90px;
    background-image: url(https://eos-wuxi-1.cmecloud.cn/crmoss/5dea085e-359c-4ba9-9d11-1d28c37d5ce8.png);
    background-size: cover;
    background-repeat: no-repeat;
    padding: 30px 26px;
  }

  .myTick {
    padding: 30px 26px;
    background-image: url(https://eos-wuxi-1.cmecloud.cn/crmoss/fac5a147-8061-433e-a616-e933e0e7ca3c.png);
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 90px;
  }

  .title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 6px;
  }

  .numbers {
    font-size: 12px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: #ffffff;
  }
}
</style>
