<template>
<view>
<!--miniprogram/pages/my/Logistics/openLogistics.wxml-->
<navBar title="查看物流" background="#fff" back="true"></navBar>
<view class="view">
	<!-- 提示 -->
	<view class="alertView">该订单共被分成{{logisticsData.length}}个包裹发货</view>
	<!-- 物流订单 -->
	<view v-for="(item, index) in logisticsData" :key="index" class="logisticsItem" :data-idx="index" @tap.stop="jumpOpenLogistics">
		<!-- 标题 -->
		<view class="logisticsItem-header">
			<view class="logisticsItem-header-title">包裹{{index+1}}</view>
			<!-- <view class="logisticsItem-header-desc">{{item.logisticsInfos.state == 0 ? '暂无轨迹信息':item.logisticsInfos.state == 1 ?'已揽收':item.logisticsInfos.state == 2 ?'运输中':item.logisticsInfos.state == 3 ?'已送达':'问题件'}}</view> -->
		</view>
		<!-- 运输信息 -->
		<!-- <view class="logisticsItem-Info">{{item.logisticsInfos.track[0].acceptStation?item.logisticsInfos.track[0].acceptStation:'暂无物流信息'}}</view> -->
		<!-- 商品 -->
		<view class="logisticsItem-imgsbg" :style="isShowMoreData?'height: inherit;':'height: 220rpx;'">
			<view v-for="(item, index2) in item.goodsList" :key="index2" class="logisticsItem-item">
				<image class="logisticsItem-img" :src="item.goodsImg" @click="onGoodsCardTap(item)"></image>
				<view class="logisticsItem-item-text oneLine">{{item.goodsName}}</view>
			</view>
		</view>
		<!-- 展开收缩 -->
		<view class="logisticsItem-num">共 {{item.goodsList.length}} 件商品</view>
		<view class="mentionAdress-bottom" @tap.stop="startAnimationInterval" v-if="item.goodsList.length>4">
			<view class="mentionAdress-bottom-title">{{isShowMoreData?'收起全部':'展示更多'}}</view>
			<image style="width:30rpx;height:30rpx;margin-left:10rpx;" :animation="animation" src="/static/images/settlement/Icon_more.png"></image>
		</view>
		<!-- 物流信息 -->
		<view class="logistics-info" style="margin-top:20rpx;">
			<span class="orderDesc">物流公司：</span>
			<span class="orderTitle">{{item.expressName}}</span>
		</view>
		<view class="logistics-info" style="margin-bottom:20rpx;">
			<span class="orderDesc">物流单号：</span>
			<span class="orderTitle">{{item.expressNo}}</span>
		</view>
	</view>
</view>
</view>
</template>

<script>
// miniprogram/pages/my/Logistics/openLogistics.js
const app = getApp();

export default {
  data() {
    return {
      // 动画
      isShowMoreData: false,
      animation: '',
      // 拆单数据
      logisticsData: [],
      userInfo: {}
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: uni.$localStorage.getCurrentUser()
    });

    if (options.expressListJson) {
      this.setData({
        logisticsData: JSON.parse(options.expressListJson)
      });
    }

    // this.logisticsData.forEach((item, index) => {
    //   this.getLogisticsInfos(index);
    // });
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
		/**
		 * @description 跳转商品详情
		 */
		onGoodsCardTap(item) {
			// console.log(item);
			uni.navigateTo({
				url: `/pages/goods/detail?id=${item.goodsSpuId}`,
			});
		},
    /**
     * 获取 每个物流的物流信息
     */
    getLogisticsInfos: function (index) {
      uni.$api.apiRequest('getOrderLogisticsInformation',{
        phone: this.userInfo.phone || '',
        logisticCode: this.logisticsData[index].expressNo,
        shipperCode: this.logisticsData[index].expressCode
      }).then(res => {
        if (res.code == 10000) {
          var arr = uni.$util.mutableCopy(this.logisticsData);
          arr[index].logisticsInfos = res.data;
          this.setData({
            logisticsData: arr
          });
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
      this.rotateAni();
    },

    /**
     * 跳转到详情页面
     */
    jumpOpenLogistics(e) {
      console.log(e);
      // let obj = this.logisticsData[e.currentTarget.dataset.idx];
      // uni.navigateTo({
      //   url: '/pages/my/Logistics/Logistics?logisticCode=' + obj.expressNo + '&shipperCode=' + obj.expressCode + '&logisticsName=' + this.logisticsData[e.currentTarget.dataset.idx].expressName
      // }); 
      // wx.navigateTo({
      //   url: '/pages/my/Logistics/Logistics?logisticsData=' + JSON.stringify(this.data.logisticsData[e.currentTarget.dataset.idx].logisticsInfos) + '&logisticsName=' + this.data.logisticsData[e.currentTarget.dataset.idx].expressName,
      // })
    }

  }
};
</script>
<style>
/* miniprogram/pages/my/Logistics/openLogistics.wxss */


.view {
  background-color: white;
}

.alertView {
  margin: 0rpx 32rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(184, 184, 184, 1);
  border-bottom: 1rpx solid #e5e5e5;
}

/* 订单 */

.logisticsItem {
  display: flex;
  flex-direction: column;
  padding: 0rpx 32rpx;
  border-bottom: 20rpx solid #FAFAFA;
}

.logisticsItem-header {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
	border-bottom: 1rpx solid #e5e5e5;
	margin-bottom: 32rpx;
}

.logisticsItem-header-title {
  font-size: 28rpx;
  font-family: SFUIDisplay-Medium, SFUIDisplay;
  font-weight: 500;
  color: rgba(0, 0, 0, 1);
}

.logisticsItem-header-desc {
  font-size: 28rpx;
  font-family: SFUIDisplay-Light, SFUIDisplay;
  font-weight: 300;
  color: rgba(209, 167, 121, 1);
}

/* 运输信息 */

.logisticsItem-Info {
  margin: 32rpx 0rpx;
  background: rgba(244, 244, 255, 1);
  border-radius: 8rpx;
  padding:24rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(104, 114, 136, 1);
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* 商品 */

.logisticsItem-imgsbg {
  display: flex;
  align-items: center;
  /* justify-content: space-around; */
  flex-wrap: wrap;
  overflow: hidden;
  height: 214rpx;
}

.logisticsItem-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0px 20rpx 20rpx 0rpx;
}

.logisticsItem-img {
  width: 148rpx;
  height: 148rpx;
  margin: 0rpx 0rpx 10rpx 0rpx;
}

.logisticsItem-item-text {
  font-size: 24rpx;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(0, 0, 0, 1);
  margin-top: 10rpx;
}

/* 展示更多 */

.logisticsItem-num {
  width: 100%;
  text-align: center;
  font-size: 24rpx;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(64, 64, 64, 1);
}

.mentionAdress-bottom {
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #e5e5e5;
}

.mentionAdress-bottom-title {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(219, 182, 120, 1);
}
/* 物流 */
.logistics-info{
  display: flex;
  align-items: center;
  height: 55rpx;
}
.orderTitle {
  font-size: 14px;
  font-family: PingFangSC-Light;
  font-weight: 300;
  color: rgba(0, 0, 0, 1);
}

.orderDesc {
  margin: 6rpx 0rpx;
  font-size: 14px;
  font-family: PingFangSC-Light;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.5);
}

</style>