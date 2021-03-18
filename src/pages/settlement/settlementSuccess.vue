<template>
	<view class="view flex-center-row">
		<navBar title="支付结果" background="#fff" :homeBtn="true"></navBar>
		<view class="errorView flex-center-row" v-if="isSuccess">
			<view class="titleView flex-row">
				<image style="width: 26px;height: 26px;margin-right: 12rpx;" src="../../static/images/settlement/err.png" mode=""></image>
				<view class="title">支付失败</view>
			</view>
			<view class="content" style="margin-top: 20px;">支付失败</view>
			<view class="content">请尝试重新支付！</view>
			<view class="buttonView flex-row" style="margin-top: 30px;">
				<view class="btn0" @click="jump(0)">商城首页</view>
				<view class="btn1" @click="jump(1)">订单详情</view>
			</view>
		</view>
		<view class="errorView flex-center-row" v-else>
			<view class="titleView flex-row">
				<image style="width: 26px;height: 26px;margin-right: 12rpx;" src="../../static/images/settlement/success.png" mode=""></image>
				<view class="title" style="color: #52C41A;">支付成功</view>
			</view>
			<view class="content" style="margin-top: 20px;">支付成功</view>
			<view class="content">点击查看订单详情～</view>
			<view class="buttonView flex-row" style="margin-top: 30px;">
				<view class="btn0" @click="jump(0)">商城首页</view>
				<view class="btn1" @click="jump(1)">订单详情</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isSuccess: true
			}
		},
		onShow() {

		},
		onLoad(options) {
			if (options) {
				this.options = options
				this.isSuccess = options.isok == 1 ? false : true
			}
		},
		methods: {
			jump(val) {
				if (val) {
					uni.navigateTo({
						url: '/pagesA/order/order?isShowHome=true'
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}

			}
		}
	}
</script>

<style lang="less" scoped>
	.view {
		height: 100vh;

		.errorView {
			padding: 0rpx 36px;
			flex-direction: column;
			width: 100vw;

			.title {
				font-size: 20px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FF4D4F;
			}

			.buttonView {
				width: 100%;
				justify-content: space-between;

				.btn0 {
					width: 136px;
					height: 42px;
					background: #FE5D4D;
					border-radius: 4px;
					text-align: center;
					font-size: 16px;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: #FFFFFF;
					line-height: 42px;
				}

				.btn1 {
					width: 136px;
					height: 42px;
					border: 1px solid #7F7F7F;
					border-radius: 4px;
					text-align: center;
					font-size: 16px;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: #2E2E2E;
					line-height: 42px;
				}
			}
		}
	}
</style>
