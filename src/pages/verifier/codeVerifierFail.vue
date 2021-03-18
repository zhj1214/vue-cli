<template>
  <view>
    <view class="fail">
      <navBar
        style="position: absolute; top: 0px"
        color="black"
        background="inherit"
        backgroundColorTop="inherit"
        title="券码核销"
      ></navBar>
      <view class="flex">
        <view class="secondflex">
          <image
            style="width: 26px; height: 26px; margin-right: 10px"
            src="https://eos-wuxi-1.cmecloud.cn/crmoss/f75c5afe-2c47-41bc-98fd-7e8e12b3d2ce.png"
          ></image>
          <view>核销失败</view>
        </view>
        <view class="code">自提码：{{ code }}</view>
        <view class="txt">核销权限不匹配，请通知管理员调整权限！</view>
        <u-button @click="scanCode">重新扫描</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      code: "",
    };
  },
  onShow() {},
  onLoad(option) {
    const { code } = option;
    this.setData({
      code,
    });
  },

  methods: {
    scanCode() {
      wx.scanCode({
        onlyFromCamera: true,
        success: function(res) {
          // success
          uni.redirectTo({
            url: "/" + res.path,
          });
        },
        fail: function() {
          // fail
        },
        complete: function(res) {
          // complete
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.fail {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .secondflex {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      color: #ff4d4f;
      margin-bottom: 30px;
    }
    .code {
      font-size: 14px;
      font-weight: 500;
      color: #a7afb4;
      margin-bottom: 5px;
    }
    .txt {
      font-size: 14px;
      font-weight: 300;
      color: #929497;
      margin-bottom: 45px;
    }
  }
}
</style>
