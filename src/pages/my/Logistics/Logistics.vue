<template>
<view>
<!--pages/my/Logistics/Logistics.wxml-->
<navBar title="物流详情" background="#fff" back="true"></navBar>
<view class="view">
	<view class="header">
		<view class="header-title">物流状态</view>
		<view class="header-status">{{logisticsData.state == 0 ? '暂无轨迹信息':logisticsData.state == 1 ?'已揽收':logisticsData.state == 2 ?'运输中':logisticsData.state == 3 ?'已送达':'问题件'}}</view>
	</view>
	<!-- 时间轴 -->
	<view class="timeLine" style="overflow: hidden;">
		<timeLine v-for="(item, index) in logisticsData.track" :key="index" :param="item" v-if="index<=currentLength">
			<view slot="playlog-item-left" class="timeLine-timebg">
				<view class="timeLine-time">
					<view>{{item.detailedTime}}</view>
					<view>{{item.time}}</view>
				</view>
			</view>
			<view slot="playlog-item-right">
				<view class="timeLine-content">
					{{item.acceptStation}}
				</view>
			</view>
		</timeLine>
		<view v-if="logisticsData.track.length == 0" style="text-align: center;">暂无物流信息</view>
	</view>
	<!-- 查看更多 -->
	<view class="timeLineMore" @tap.stop="startAnimationInterval" v-if="logisticsData.track.length>3">
		<view class="timeLineMore-text">点击{{currentLength == 3?'展开':'收起'}}更多记录
			<image style="width:30rpx;height:30rpx;margin-left:10rpx;" :animation="animation" src="/static/images/settlement/Icon_more.png"></image>
		</view>
	</view>
	<!-- 物流信息展示 -->
	<view class="timeLineBottom">
		<view class="timeLineBottom-header">物流信息</view>
		<view class="item">
			<view class="text">物流公司：</view>
			<view class="value">{{logisticsName}}</view>
		</view>
		<view class="item">
			<view class="text">物流单号：</view>
			<view class="value">{{logisticsData.logisticCode}}</view>
		</view>
	</view>
</view>
</view>
</template>

<script>
// pages/my/Logistics/Logistics.js
const app = getApp();
import vanSteps from "./@vant/weapp/steps/index";
import timeLine from "../../../components/Timeline/Timeline";

export default {
  data() {
    return {
      logisticsData: {},
      logisticsName: '',
      // 是否展示更多
      currentLength: 3,
      userInfo: {},
      isShowMoreData: "",
      animation: ""
    };
  },

  components: {
    vanSteps,
    timeLine
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   * 1.从传参中获取物流信息
   * 2.请求接口获取物流信息
   */
  onLoad: function (options) {
    this.setData({
      userInfo: uni.$localStorage.getCurrentUser()
    });

    if (options.logisticsData) {
      this.setData({
        logisticsData: JSON.parse(options.logisticsData)
      });
      this.machiningData();
    } else {
      this.getLogisticsInfo(options);
    }

    this.setData({
      logisticsName: options.logisticsName
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  methods: {
    machiningData() {
      this.logisticsData.track.forEach((item, index) => {
        if (index == 0) {
          item.select = true;
        }

        item.time = item.acceptTime.substring(0, 11);
        item.detailedTime = item.acceptTime.substring(11, item.acceptTime.length);
      });
      this.setData({
        logisticsData: this.logisticsData
      });
    },

    /**
     * 获取 每个物流的物流信息
     */
    getLogisticsInfo: function (val) {
      uni.$api.getOrderLogisticsInformation({
        phone: this.userInfo.phone || '',
        logisticCode: val.logisticCode,
        shipperCode: val.shipperCode
      }).then(res => {
        if (res.code == 10000) {
          this.setData({
            logisticsData: res.data
          });
          this.machiningData();
        }
      });
    },

    /**
     * 实现image旋转动画，每次旋转 180*n度
     */
    rotateAni: function () {
      this.animation = uni.createAnimation({
        duration: 1,
        timingFunction: 'linear',
        // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
        delay: 1,
        transformOrigin: '50% 50% 0'
      });
      this.animation.rotate(180 * (this.isShowMoreData ? 0 : 1)).step();
      this.setData({
        isShowMoreData: !this.isShowMoreData,
        animation: this.animation.export()
      });
    },

    /**
     * 开始旋转
     */
    startAnimationInterval: function () {
      // 
      this.setData({
        currentLength: this.currentLength == 3 ? this.logisticsData.track.length : 3
      }); // 开始动画

      this.rotateAni();
    }
  }
};
</script>
<style>
/* pages/my/Logistics/Logistics.wxss */

.view {
  background-color: white;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 130rpx;
  padding: 0px 40rpx;
}

.header-title {
  font-size: 38rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(55, 55, 55, 1);
}

.header-status {
  padding: 0rpx 20rpx;
  height: 44rpx;
  background: rgba(159, 227, 110, 0.38);
  border-radius: 8rpx;
  font-size: 20rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(84, 156, 32, 1);
  line-height: 44rpx;
  text-align: center;
}

/* 时间轴 */

.timeLine {
  padding: 0rpx 40rpx;
}

.timeLine-timebg {
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeLine-time {
  min-width: 125rpx;
  margin-right: 12rpx;
  font-size: 20rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(94, 94, 94, 1);
  text-align: right;
}

.timeLine-content {
  min-width: 330rpx;
  margin-left: 20rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 12rpx 24rpx 15rpx 0rpx rgba(148, 171, 196, 0.06);
  border-radius: 6rpx;
  border: 1rpx solid rgba(213, 230, 238, 1);
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(104, 114, 136, 1);
}

/* 展示更多 */

.timeLineMore {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60rpx;
  padding-bottom: 40rpx;
  border-bottom: 20rpx solid #f7f7f7;
}

.timeLineMore-text {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(104, 114, 136, 1);
}

/* 物流信息 */

.timeLineBottom {
  padding: 40rpx;
}

.timeLineBottom-header {
  font-size: 38rpx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(55, 55, 55, 1);
  margin-bottom: 15rpx;
}

.timeLineBottom  .item {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
}

.timeLineBottom  .item .text {
  font-size: 28rpx;
  font-family: SFUIDisplay-Light, SFUIDisplay;
  font-weight: 300;
  color: rgba(127, 127, 127, 1);
}

.timeLineBottom  .item .value {
  font-size: 28rpx;
  font-family: SFUIDisplay-Light, SFUIDisplay;
  font-weight: 300;
  color: rgba(0, 0, 0, 1);
}

</style>