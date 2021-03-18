<template>
  <view class="page-loading-updating">
    <navBar title="无法访问" background="#fff"></navBar>
    <view class="text">维护建设中...</view>
    <view class="btn" @tap="toHome">看看其他内容</view>
  </view>
</template>

<script>
export default {
  name: 'page-loading-updating',
  data() {
    return {
      query: {},
    };
  },
  onLoad(options) {
    this.query = options;

  },
  methods: {
    toHome() {
      if(this.query.from === 'org'){
        uni.reLaunch({
          url: '/pages/index/switchMall/switchMall',
        });
        return
      }
      uni.reLaunch({
        url: '/pages/index/index',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-loading-updating {
  text-align: center;
  .text {
    margin-top: 400rpx;
    text-align: center;
  }
  .btn {
    display: inline-block;
    margin-top: 60rpx;
    padding: 0 10px;
    height: 40px;
    background: #fe5d4d;
    border-radius: 4px;
    text-align: center;
    font-size: 16px;
    font-family: PingFang-SC-Light, PingFang-SC;
    font-weight: 300;
    color: #ffffff;
    line-height: 40px;
  }
}
</style>
