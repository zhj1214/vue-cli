<template>
  <view>
    <view class="view">
      <navBar
        style="position: absolute; top: 0px"
        color="white"
        background="inherit"
        backgroundColorTop="inherit"
        :title="title"
      ></navBar>
      <view> {{ text }} </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "核销员绑定",
      text: "恭喜您，核销员绑定成功！",
    };
  },
  onShow() {},
  onLoad(option) {
    const { type } = option;
    if (Number(type) === 6) {
      this.title = "优惠券核销";
      this.text = "恭喜您，核销成功！";
    }
    if (Number(type) === 7) {
      this.title = "门票核销";
      this.text = "恭喜您，核销成功！";
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {},
  methods: {},
};
</script>

<style lang="less" scoped>
.view {
  height: 100vh;
  background: url(https://eos-wuxi-1.cmecloud.cn/crmoss/c286662b-9dc7-4434-9d9b-09bab9edae71.png);
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  color: #4f4f4f;
}
</style>
