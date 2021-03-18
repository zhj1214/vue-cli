<template>
  <view class="view">
    <navBar title="优惠券核销" background="#fff"></navBar>
    <view class="icon flex-center-row" style="width: 100vw; height: 320rpx">
      <image
        style="width: 200rpx; height: 200rpx"
        src="../../static/images/myCardCoupon/hxicon.png"
        mode=""
      ></image>
    </view>
    <view class="content">
      <view class="desc">请让店铺人员输入操作码</view>
      <u-field
        v-model="hxCode"
        label-width="0"
        placeholder="请输入操作码"
        :field-style="fieldStyle"
        :clearable="false"
      ></u-field>
      <view class="okhx" @click="confrimVer">确认核销</view>
      <view class="okhx canle" @click="jump(1)">取消</view>
    </view>
    <alertView
      v-if="alertShow"
      title="核销成功"
      content="优惠券已核销成功"
      :showCancel="false"
      @ok="scanCode"
    >
    </alertView>
  </view>
</template>

<script>
import alertView from "../../pageComponents/alertView/alertView.vue";
export default {
  components: {
    alertView,
  },
  data() {
    return {
      alertShow: false,
      uniqueCode: "",
      hxCode: "",
      fieldStyle: {
        "margin-top": "40rpx",
        height: "88rpx",
        "border-radius": "8rpx",
        border: "1px solid #BFBFBF",
        padding: 0,
      },
    };
  },
  onLoad(option) {
    this.uniqueCode = option.uniqueCode;
  },
  methods: {
    confrimVer() {
      uni.$api
        .apiRequest("writeOffInShop", {
          uniqueCode: this.uniqueCode,
          writeoffSecret: this.hxCode,
        })
        .then((res) => {
          if (res.code == 10000) {
            this.setData({
              alertShow: true,
            });
          }
        });
    },
    jump(val) {
      if (val) {
        uni.navigateBack({});
      }
    },
    scanCode() {
      this.jump(1);
    },
  },
};
</script>
<style lang="less">
.content {
  .u-field {
    padding: 0px !important;
  }
}
</style>
<style lang="less" scoped>
.view {
  .content {
    padding: 18rpx 40rpx;

    .desc {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
    }

    .okhx {
      margin-top: 140rpx;
      width: 670rpx;
      height: 82rpx;
      background: #fe5d4d;
      border-radius: 8rpx;
      text-align: center;
      font-size: 28rpx;
      font-family: SFUIDisplay-Medium, SFUIDisplay;
      font-weight: 500;
      color: #ffffff;
      line-height: 82rpx;
    }

    .canle {
      margin-top: 28rpx;
      background: #fff;
      color: #000000;
      border: 1px solid #bfbfbf;
    }
  }
}
</style>
