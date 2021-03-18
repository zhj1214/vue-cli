<template>
	<view>
		<navBar title="申请退款" background="#fff" back="true"></navBar>
		<view class="view">
			<view class="item" @click="selectItem" data-type="0" v-if="show_tk">
				<view class="item-l">
					<image class="item-l-img" src="/static/images/order/chargeback1.png"></image>
					<view class="item-l-info">
						<view class="item-l-info-t">退货退款</view>
						<view class="item-l-info-d">因质量、错发等问题需要退货退款</view>
					</view>
				</view>
				<image style="width: 24rpx;height: 24rpx;" src="/static/images/order/more-icon.png"></image>
			</view>
			<view class="item" @click="selectItem" data-type="1">
				<view class="item-l">
					<image class="item-l-img" src="/static/images/order/chargeback0.png"></image>
					<view class="item-l-info">
						<view class="item-l-info-t">仅退款</view>
						<view class="item-l-info-d">拒收包裹或未收到包裹</view>
					</view>
				</view>
				<image style="width: 24rpx;height: 24rpx;" src="/static/images/order/more-icon.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				show_tk: true,
				// 传递参数
				options: {}
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 * 当订单是待发货状态 只显示仅退款
		 * 自提商品，处于待提货状态只能发起仅退款
		 */
		onLoad: function(options) {
			console.log(options);
			let obj = JSON.parse(options.json);

			if (obj.type && obj.type == 2 && obj.status == '3') {
				this.show_tk = false
				if (obj.goodsStatus && obj.goodsStatus == '已提货') {
					this.show_tk = true
				}
			} else if (obj.status && obj.status == '1') {
				this.show_tk = obj.goodsStatus == '已发货' ? true : false
			}
			this.options = obj
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			/**
			 * 跳转
			 */
			selectItem: function(e) {
				console.log(e.currentTarget.dataset.type);

				if (e.currentTarget.dataset.type == '1' && this.options.status == '2') {
					uni.navigateTo({
						url: '/pagesA/order/Chargeback/chargebackApplication?chargebackType=' + e.currentTarget.dataset.type +
							'&order=' + JSON.stringify(this.options)
					});
				} else {
					uni.navigateTo({
						url: '/pagesA/order/Chargeback/chargebackApplication?chargebackType=' + e.currentTarget.dataset.type +
							'&order=' + JSON.stringify(this.options)
					});
				}
			}
		}
	};
</script>
<style>
	@import "./chargeback.css";
</style>
