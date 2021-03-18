<!--
 * @Author: NineNan
 * @Date: 2020-12-30 17:49:16
 * @LastEditTime: 2021-01-22 20:10:38
 * @LastEditors: Please set LastEditors
 * @Description: 支付结果页面
 * @FilePath: /heng-weapp/src/pagesParking/paymentResult/index.vue
-->
<template>
  <view :class="['payment-result', viewClassName]">
    <navBar
      :background="navBarBc"
      ext-class="fixed-bar"
      :home-btn="true"
      color="white"
      title="缴费"
    />
    <!-- pending begin -->
    <pending class="content" v-if="isPending" />
    <!-- pending end -->

    <!-- success begin -->
    <view class="success-content" v-if="isSuccess">
      <view class="success-title">恭喜您，缴费成功！</view>
      
      <u-button class="success-back" @click="back">返 回</u-button>
    </view>
    <!-- success end -->

    <!-- fail begin -->
    <view class="fail-content" v-if="isFail">
      <view class="fail-title"> 抱歉，缴费失败 </view>
      <view class="fail-info">
        很抱歉，缴费失败，原因如下：<br />
        1.已缴费或支付失败，请重新查询停车进行缴费<br />
        2.网络延迟，如已扣款请联系客服人员
      </view>
      <u-button class="success-back" @click="back">返 回</u-button>
    </view>
    <!-- fail end -->
  </view>
</template>
<script>
import pending from "./components/pending"; // 支付中
export default {
  components: {
    pending,
  },
  data() {
    return {
      navBarBc: "transparent",
      isSuccess: false,
      isPending: false,
      isFail: false,
    };
  },
  computed: {
    viewClassName() {
      if (this.isSuccess) return "success";
      if (this.isPending) return "";
      if (this.isFail) return "fail";
    },
  },
  /**
   * @description: 初始化支付状态
   * @param {*} options  isSuccess=0、1
   */

  onLoad(options) {
    if (options.isSuccess == "1") {
      this.isSuccess = true;
    } else if (options.isSuccess == "0") {
      this.isFail = true;
    } else {
      this.isPending = true;
    }
  },
  methods: {
    back() {
      console.log('咋回事不返回')
      uni.reLaunch({
        url: "/pagesParking/home/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
