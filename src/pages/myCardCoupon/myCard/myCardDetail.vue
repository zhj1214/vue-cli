<template>
  <view class="view">
    <navBar title="门票详情" background="#fff"></navBar>
    <!-- headder -->
    <view class="header flex-center-row">
      <image
        style="width: 670rpx; height: 320rpx"
        :src="data.logo"
        mode="aspectFill"
      ></image>
      <!-- 悬浮层 -->
      <view class="headerBottomView flex-center-row">
        <view class="title">{{ data.activityTitle }}</view>
        <view class="desc">{{ data.title }}</view>
      </view>
    </view>
    <!-- 二维码 -->
    <view class="qrcodeView flex-center-row">
      <image
        style="width: 260rpx; height: 260rpx"
        :src="data.miniCodeUrl"
        v-if="data.status === 1"
        mode=""
      ></image>
      <view v-else style="position: relative">
        <image
          style="width: 260rpx; height: 260rpx"
          :src="data.miniCodeUrl"
          mode=""
        >
        </image>
        <view class="notallow"> 二维码已失效 </view>
      </view>

      <view class="qrcodeViewTitle">
        票号：<span v-if="data.status === 1">{{ data.ticketNo }}</span>
        <span v-else style="text-decoration: line-through">{{
          data.ticketNo
        }}</span></view
      >
    </view>
    <!-- 门票详情 -->
    <view class="rich flex-center-row">
      <view class="title">门票详情</view>
      <view class="line"></view>
      <view
        class="flex-center-row"
        style="
          margin: 10px 20px;
          flex-direction: column;
          width: 100%;
          align-items: flex-start;
        "
      >
        <view class="desc">活动时间：<text style="font-size:13px;">{{ translateDate }}</text></view>
        <view class="desc">活动地点：{{ data.address }}</view>
        <view class="desc" v-if="data.status === 1"
          >状态：<span style="color: #fec721">有效票</span></view
        >
        <view class="desc" v-else
          >状态：<span style="color: #7f7f7f">失效票</span></view
        >
        <view class="desc">票价：{{ data.amount }}{{data.payType==1?'积分':'元'}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      data: {},
    };
  },
  onLoad(option) {
    this.getDetail(option.ticketId);
  },
  computed: {
    translateDate() {
      return (
        new Date(this.data.beginTime).Format("YYYY-MM-DD HH:mm:ss") +
        " ~ " +
        new Date(this.data.endTime).Format("YYYY-MM-DD HH:mm:ss")
      );
    },
  },
  methods: {
    getDetail(ticketId) {
      uni.$api
        .apiRequest("ticketDetail", {
          ticketId: ticketId,
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.setData({
              data: res.data,
            });
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.view {
  background-color: white;
  height: 100vh;

  .rich {
    padding: 0px 40rpx;
    margin-top: 10px;
    flex-direction: column;
    background-color: white;

    .title {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 300;
      color: #fe5d4d;
    }

    .line {
      margin-top: 8px;
      width: 69rpx;
      height: 6rpx;
      background-color: #fe5d4d;
    }

    .desc {
      padding: 10rpx 0px;
      font-size: 14px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: #7f7f7f;
    }
  }

  .header {
    position: relative;
    border-bottom: 10px solid #f9f9f9;

    .headerBottomView {
      flex-direction: column;
      min-height: 47px;
      width: 670rpx;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 0px;

      .title {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
      }

      .desc {
        margin-top: 16rpx;
        font-size: 10px;
        font-family: PingFang-SC-Light, PingFang-SC;
        font-weight: 300;
        color: #ffffff;
      }
    }
  }
  .notallow {
    position: absolute;
    left: 0;
    top: 0;
    width: 260rpx;
    height: 260rpx;
    background: rgba(0, 0, 0, 0.62);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .qrcodeView {
    width: 375px;
    padding: 40rpx;
    border-bottom: 10px solid #f9f9f9;
    flex-direction: column;
    .qrcodeViewTitle {
      margin-top: 20rpx;
      font-size: 10px;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 300;
      color: #929497;
    }
  }
}
</style>
