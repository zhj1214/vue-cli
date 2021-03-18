<!--
 * @Author: NineNan
 * @Date: 2020-12-30 17:54:35
 * @LastEditTime: 2021-01-28 19:55:24
 * @LastEditors: Please set LastEditors
 * @Description: 支付中...
 * @FilePath: /heng-weapp/src/pagesParking/paymentResult/components/pending.vue
-->
<template>
  <view class="pending">
    <view class="title">
      <image src="@/static/images/parking/clock.png" />
      <text>支付中...</text>
    </view>
    <view class="info">
      <view>已提交申请，等待银行处理</view>
      <view>若长时间没有响应，请点击刷新</view>
    </view>
    <button @click="getparkPayResult">刷 新</button>
  </view>
</template>
<script>
export default {
  methods: {
    getparkPayResult() {
      uni.$api
        .apiRequest("parkPayResult", {
          orderNo: uni.$localStorage.getItem("parkInfoOrderNo"),
        })
        .then((res) => {
          if (res.code == 10000) {
            if (res.data == 2) {
              uni.navigateTo({
                url: "/pagesParking/paymentResult/index?isSuccess=1",
              });
            } else if (res.data == 3) {
              uni.navigateTo({
                url: "/pagesParking/paymentResult/index?isSuccess=0",
              });
            }
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.pending {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  flex: 1;
  .title {
    text-align: center;
    margin-bottom: 20px;
    text {
      font-size: 600 20px/28px "PingFangSC-Semibold, PingFang SC";
      color: #f7b500;
    }
    image {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
  .info {
    font: 300 14px/22px "PingFangSC-Light, PingFang SC";
    color: #929497;
    view {
      text-align: center;
    }
  }
  button {
    width: 136px;
    height: 42px;
    background: #ffffff;
    border-radius: 4px;
    font: 300 16px/42px "PingFangSC-Light, PingFang SC";
    color: #2e2e2e;
    margin-top: 30px;
  }
}
</style>
