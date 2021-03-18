<template>
<view>
<!--miniprogram/pages/my/my-order/Evaluation/evaluationDone.wxml-->
<navBar title="评价" background="#fff"></navBar>
<view class="view">
	<image class="img" src="/static/images/pjsuccess.png"></image>
	<view class="text0">评价成功，感谢您！</view>
	<view class="text1" @tap.stop="checkAllEvaluation">继续评价其他订单 <image style="width: 24rpx;height: 24rpx;" src="/static/images/selectcityMore.png"></image>
	</view>
	<view class="bottom">
		<view class="bottom-l" @tap.stop="backHome">返回首页</view>
		<view class="bottom-r" @tap.stop="checkMyPj">查看评价</view>
	</view>
</view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
     * 返回首页
     */
    backHome: function () {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },

    /**
     * 查看评价
     */
    checkMyPj: function () {
      uni.redirectTo({
        url: '/pages/my/myComment/myComment'
      });
    },

    /**
     * 查看全部待评价订单列表
     */
    checkAllEvaluation: function () {
      uni.navigateTo({
        url: '/pages/order/my-order?type=' + '待评价' + '&isShowHome=' + 1
      });
    }
  }
};
</script>
<style>
@import "./evaluationDone.css";
</style>