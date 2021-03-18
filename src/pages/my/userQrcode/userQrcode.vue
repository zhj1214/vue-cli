<template>
  <view class="view">
    <navBar title="会员码"></navBar>
    <view class="content">
      <view class="cardView flex-row">
        <view class="userinfo">
          <image
            class="userinfo-img"
            :src="userInfo.headImg"
            mode="aspectFill"
          ></image>
          <view class="name">{{
            userInfo.memberName || userInfo.nickName
          }}</view>
        </view>
        <view class="qrcode" v-if="qrcodeVal">
          <tki-qrcode
            style="padding:10px;"
            ref="qrcode"
            :val="qrcodeVal"
            :size="312"
            :usingComponents="false"
          >
          </tki-qrcode>
        </view>
        <view class="desc flex-row" @click="reload">
          <image
            style="width: 12px;height: 12px;margin-right: 4px;"
            src="../../../static/images/my/reload.png"
            mode=""
          ></image>
          会员码每<span style="color: #FE5D4D;">{{ times }}</span
          >s自动更新
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import tkiQrcode from "tki-qrcode";
const app = getApp(); //获取应用实例
export default {
  components: {
    tkiQrcode,
  },
  data() {
    return {
      times: 30,
      qrcodeVal: "",
      userInfo: {},
    };
  },
  onLoad() {
    this.userInfo = uni.$localStorage.getCurrentUser();
    
    // this.qrcodeVal = `${new Date().getTime()}&${uni.$localStorage.getItem('memberId')}`
  },
  mounted() {
    var self = this;
    let countMark = setInterval(() => {
      if (self.times > 0) {
        self.times -= 1;
      } else self.reload();
    }, 1000);
    this["countMark"] = countMark;
    this.getUserQrcodeStr();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.countMark) clearInterval(this.countMark);
  },
  methods: {
    /**
     * 从服务端获取
     * */

    getUserQrcodeStr() {
      var self = this;
      uni.$api
        .apiRequest("getUserQrcodeStr", {
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
			self.qrcodeVal = res.data;
			self.$nextTick(()=>{
				self.$refs.qrcode._makeCode();
			})
          }
        });
    },
    /**
     * 二维码事件
     * */
    reload() {
      this.times = 30;
      this.getUserQrcodeStr();
      //   this.qrcodeVal = `${new Date().getTime()}&${uni.$localStorage.getItem(
      //     "memberId"
      //   )}`;
      //   this.$refs.qrcode._makeCode();
    },
    qrResult(val) {
      console.log("二维码base64 数据", val);
    },
  },
};
</script>

<style lang="less">
.view {
  .content {
    display: flex;
    justify-content: center;

    .cardView {
      flex-direction: column;
      margin-top: 150rpx;
      width: 86.7vw;
      padding-bottom: 20px;
      background: #ffffff;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
      border-radius: 5px;

      .userinfo {
        position: relative;
        margin-top: -30px;

        .userinfo-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 5px solid white;
          box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1);
        }

        .name {
          font-size: 16px;
          font-weight: 500;
          color: #000000;
          text-align: center;
          margin-top: 7px;
        }
      }

      .desc {
        font-size: 12px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: #7f7f7f;
      }
    }
  }
}
</style>
