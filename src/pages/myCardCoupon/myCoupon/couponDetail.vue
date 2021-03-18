<template>
  <view class="view" style="background-color: #f9f9f9">
    <navBar title="优惠券详情" background="#fff"></navBar>
    <!-- 优惠券 -->
    <view style="padding: 20px" :style="{ backgroundColor: data.backgroundColor }">
      <view class="listItem">
        <view style="width: 180rpx;height: 180rpx">
          <image
            :src="
              data.imageUrl || '../../../static/images/settlement/Pic10.png'
            "
            style="width: 100%;height: 100%"
          ></image>
        </view>

        <view class="listItem_info">
          <view class="color" v-if="data.couponType=='EXCHANGE'" style="font-size:14px;color:#fe5d4d;font-weight: 400;">{{ data.couponContent }}</view>
          <view class="title" v-if="data.couponType!=='EXCHANGE'"><text style="font-weight: 600;">{{ data.amount }}</text><text style="font-size:12px;margin-left: 2px;">{{data.couponType=='DISCOUNT'?'折':'元'}}</text></view>
          <view class="couponTypeName" :style="{ color: data.textColor,borderColor: data.textColor }">{{data.couponTypeName}}</view>
          <view class="color couponType-style" v-if="data.couponType=='REDUCTION' || data.couponType=='DISCOUNT'">消费满{{ data.useThresholdAmount }}可用</view>
          <view class="date" :style="{marginTop: data.couponType=='REDUCTION' || data.couponType=='DISCOUNT'?0:10 + 'px'}">{{ getDate(data.startTime, data.endTime) }}</view>
        </view>
      </view>
    </view>

    <!-- 二维码 -->
    <view class="qrcodeView flex-center-row">
      <view v-if="data.onlineOffline === 2">
        <image
          style="width: 260rpx; height: 260rpx"
          :src="data.couponPicUrl"
          v-if="data.useStatus === 1"
          mode=""
        ></image>
        <view v-else style="position: relative">
          <image
            style="width: 260rpx; height: 260rpx"
            :src="data.couponPicUrl"
            mode=""
          >
          </image>
          <view class="notallow">
            {{ data.useStatus === 2 ? "二维码已使用" : "二维码已过期" }}
          </view>
        </view>
        <view class="tickedNum"
          >票号：<text
            :style="{
              textDecoration: data.useStatus === 1 ? 'none' : 'line-through',
            }"
            >{{ data.uniqueCode }}</text
          ></view
        >
      </view>

      <view
        class="qrcodeBtn"
        @click="toVerifcate"
        v-if="data.onlineOffline === 2 && data.useStatus === 1"
        >到店核销</view
      >
      <view
        class="qrcodeBtn"
        @click="toIndex"
        v-if="data.onlineOffline === 1 && data.useStatus === 1"
        >立即使用</view
      >
    </view>
    <!-- 富文本 -->
    <view class="rich flex-center-row">
      <view class="title">使用说明</view>
      <view class="line"></view>
      <view style="margin: 5px 0px;padding:0 20px;width:100%;line-height:32px;font-size: 14px;">
        <jyf-parser
          style="color: #7F7F7F;"
          :html="data.couponDesc"
          ref="article"
        ></jyf-parser>
      </view>
    </view>
  </view>
</template>

<script>
import jyfParser from "@/components/jyf-parser/jyf-parser";
export default {
  components: {
    jyfParser,
  },
  data() {
    return {
      data: {
        uniqueCode: "",
      },
    };
  },
  onLoad(option) {
    this.uniqueCode = option.uniqueCode;
  },
  onShow() {
    this.getPageList(this.uniqueCode);
  },
  onReady() {
    // 方式 1
    this.html =
      "";
  },
  methods: {
    toIndex() {
      if (this.data.couponType === "EXCHANGE") {
        //TODO 兑换券跳转方案， 待验证
        let arr = [
          {
            orgId: this.data.orgId,
            goodsList: {
              goodsId: this.data.goodsId,
              num: "1",
              goodsSkuId: this.data.skuId,
            },
            closeCheckGoodsListedStatusFlag: true
          },
        ];
        uni.$api.apiRequest("cartSettlementApply", arr).then((res) => {
          if (res.code == 10000) {
            let arr = res.data.map((item) => {
              return {
                settlementId: item,
              };
            });
            uni.navigateTo({
              url: `/pages/settlement/settlement?settlementId=${JSON.stringify(
                arr
              )}&isVoucher=${this.data.uniqueCode}`,
            });
          }
        });
        
      } else {
        uni.switchTab({
          url: "/pages/index/index",
        });
      }
    },
    toVerifcate() {
      uni.navigateTo({
        url: `/pages/verifier/voucherVerification?uniqueCode=${this.data.uniqueCode}`,
      });
    },
    getPageList(uniqueCode) {
      uni.$api
        .apiRequest("couponDetail", {
          uniqueCode: uniqueCode,
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.setData({
              data: res.data,
            });
          }
        });
    },
    getDate(startTime, endTime) {
      return `${new Date(startTime).Format("YYYY.MM.DD")}~${new Date(
        endTime
      ).Format("YYYY.MM.DD")}`;
    },
  },
};
</script>

<style lang="less" scoped>
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
.rich {
  margin-top: 10px;
  flex-direction: column;
  background-color: white;

  .title {
    margin-top: 10px;
    font-size: 14px;
    font-family: PingFang-SC-Light, PingFang-SC;
    font-weight: 300;
    // color: #fe5d4d;
    padding: 2px 5px;
    border-radius: 4px;
    display: inline-block;
  }

  .line {
    margin-top: 8px;
    width: 69rpx;
    height: 6rpx;
    background-color: #fe5d4d;
  }
}
.listItem {
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  background-color: #fff;
  display: -webkit-box;
  -webkit-box-align: center;
  height: 180rpx;
  margin-bottom: 20rpx;
  padding-right: 15rpx;
  overflow: hidden;
  .listItem_info {
    -webkit-box-flex: 1;
    padding: 20rpx;
    .title {
      font-size: 20px;
      font-weight: 400;
      color: #FE5D4D;
      // margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // padding: 2px 5px;
      // border-radius: 4px;
      // color: #fff;
      // display: inline-block;
    }
    .couponTypeName {
      padding: 2px 4px;
      font-size: 8px;
      color: #929497;
      border: 1px solid #929497;
      display: inline-block;
      border-radius: 2px;
      position: relative;
      top: -4px;
    }
    .color {
      font-size: 9px;
      font-weight: bold;
      color: #929497;
      margin-bottom: 4px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: normal !important;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .couponType-style {
          width: 100%;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
    .date {
      font-size: 18rpx;
      color: #929497;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .listItem_btn {
    width: 150rpx;
  }
}
.couponItem {
  padding: 12px 20px;
  padding-right: 0px;
  width: 670rpx;
  margin-top: 31rpx;

  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  border-radius: 5px;

  .info {
    flex: 1;
    margin-left: 14px;

    .item-title {
      font-size: 14px;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 500;
      color: #222222;
    }

    .item-spec {
      margin-top: 2px;
      font-size: 12px;
      font-family: PingFang-SC-Light, PingFang-SC;
      color: #c0c0c0;
    }

    .item-time {
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808794;
    }
  }
}

.qrcodeView {
  flex-direction: column;
  padding: 40rpx;

  background: #ffffff;
  border-radius: 25px 25px 0px 0px;
  overflow: hidden;
  margin-top: -12px;
  .tickedNum {
    margin: 20rpx 0px;
    font-size: 10px;
    font-family: PingFang-SC-Light, PingFang-SC;
    font-weight: 300;
    color: #929497;
  }

  .qrcodeBtn {
    margin-top: 60rpx;
    width: 670rpx;
    height: 46px;
    background: #fe5d4d;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    font-family: SFUIDisplay-Medium, SFUIDisplay;
    font-weight: 500;
    color: #ffffff;
    line-height: 46px;
  }
}
</style>
