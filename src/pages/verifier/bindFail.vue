<template>
  <view>
    <view class="fail">
      <navBar
        style="position: absolute; top: 0px"
        color="black"
        background="inherit"
        backgroundColorTop="inherit"
        title="优惠券核销"
        v-if="type === 6"
      ></navBar>
      <navBar
        style="position: absolute; top: 0px"
        color="black"
        background="inherit"
        backgroundColorTop="inherit"
        title="门票核销"
        v-else
      ></navBar>
      <view style="text-align: center">
        <p>你不是核销员，请联系管理员绑定</p>
        <p>或者在会员优惠券页面输入操作码进行核销</p>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 6,
    };
  },
  onShow() {},
  onLoad(option) {
    const { type } = option;
    this.type = type;
  },

  methods: {},
};
</script>

<style lang="less" scoped>
.fail {
  padding: 20px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  font-size: 16px;
  font-weight: 400;
  color: #4f4f4f;
}
</style>
