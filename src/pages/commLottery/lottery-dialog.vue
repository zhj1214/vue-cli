<!-- 抽奖弹窗 -->
<template>
	<view class="lottery-dialog" v-if="dialogShow">
		<view class="content" v-if="title == '恭喜您'">
			<view class="lottery-bg">
				<view class="lottery-info">
					<image class="image" :src="awardPicUrl" />
					<span>恭喜您获得</span>
					<view class="gift">{{awardInfo}}*1</view>
				</view>
				<view class="continue-btn" @click="handleBtn"></view>
				<view class="view-btn" @click="toAward"></view>
			</view>
			<view class="close">
				<image style="width: 60rpx;height: 60rpx;" src="../../static/images/lottery/Close.png" @click="dialogShow = false"></image>
			</view>
		</view>
		<view class="content" v-else>
			<view class="box">
				<view class="title">{{title}}</view>
				<view class="info">
					<template v-if="title != '免费抽奖任务'">
						<i class="circle circle-left-top"></i>
						<i class="circle circle-left-bottom"></i>
						<i class="circle circle-right-top"></i>
						<i class="circle circle-right-bottom"></i>
					</template>
					<view class="thanks-image" v-if="title == '谢谢参与'"></view>
					<view class="text" v-html="text"></view>
				</view>
				<view class="btn" @click="handleBtn">{{btnText}}</view>
			</view>
			<view class="close">
				<image style="width: 60rpx;height: 60rpx;" src="../../static/images/lottery/Close.png" @click="dialogShow = false"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 标题
			title: {
				type: String,
				default: "谢谢参与"
			},
			// 内容
			text: {
				type: String,
				default: "别灰心，再来一次吧～"
			},
			// 确认按钮
			btnText: {
				type: String,
				default: "继续抽奖"
			},
			gameId: {
				type: String
			},
			awardInfo: {
				type: String
			},
			awardPicUrl: {
				type: String
			},
			isTourist: Boolean
		},
		data() {
			return {
				dialogShow: false
			};
		},

		methods: {
			show() {
				this.dialogShow = true;
			},
			hide() {
				this.dialogShow = false;
			},
			handleBtn() {
				this.dialogShow = false;
				if (this.btnText == "立即登录") {
					uni.navigateTo({
						url: '/pages/login/notLogin/notLogin'
					})
					// location.href = location.origin + this.$ENV.loginRouter + "?from=/lottery/lottery-circle/" + this.gameId;
					// // this.$router.push({
					//   path: this.$ENV.loginRouter+"?from=lottery-circle&gameId=" + this.gameId
					// });
				}
			},
			toAward() {
				if (this.isTourist)
					return uni.$alert.showToast('预览模式无法查看')
				uni.navigateTo({
					url: `/pages/commLottery/my-prize?gameId=${this.gameId}`
				})
			}
		}
	};
</script>

<style lang='less' scoped>
	.lottery-dialog {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 9999;
		background-color: rgba(0, 0, 0, 0.53);
		user-select: none;
	}

	.content {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate3d(-50%, -50%, 0);
		width: 303px;
	}

	.lottery-bg {
		background: url('https://eos-wuxi-1.cmecloud.cn/crmoss/45c2a248-dd69-4bc5-af42-7cdeddbb7a2e.png') no-repeat center;
		background-size: 100% 100%;
		width: 100%;
		height: 346px;
		position: relative;

		.lottery-info {
			width: 269px;
			height: 152px;

			position: absolute;
			left: 50%;
			bottom: 120px;
			transform: translateX(-50%);
			z-index: 99;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 5px;

			.image {
				width: 66px;
				height: 66px;
				border-radius: 50%;
				margin-top: 32rpx;
			}

			span {
				font-size: 14px;
				font-family: PingFangSC;
				font-weight: 400;
				color: rgba(255, 255, 255, .8);
				line-height: 20px;
				text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.23);
				margin-top: 4px;
			}

			.gift {
				font-size: 14px;
				font-family: PingFangSC;
				font-weight: 400;
				color: rgba(253, 215, 129, 1);
				line-height: 20px;
				text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.23);
			}
		}

		.continue-btn {
			width: 242px;
			height: 40px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 65px;
			z-index: 99;
		}

		.view-btn {
			width: 242px;
			height: 40px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 16px;
			z-index: 99;
		}
	}

	.box {
		width: 100%;
		padding-bottom: 16px;
		background: linear-gradient(180deg, rgba(227, 74, 91, 1) 0%, rgba(226, 57, 76, 1) 100%);
		border-radius: 26rpx;
	}

	.title {
		height: 59px;
		font-size: 24px;
		font-family: AlibabaPuHuiTiB;
		color: #fdd780;
		line-height: 69px;
		text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
		text-align: center;
		opacity: 0.8;
		font-weight: 600;
	}

	.info {
		width: 269px;
		min-height: 80px;
		position: relative;
		background: linear-gradient(180deg, rgba(243, 61, 80, 0.4) 0%, rgba(212, 32, 51, 0.4) 100%);
		box-shadow: inset 0px 0px 40rpx 0px rgba(0, 0, 0, 0.2);
		border-radius: 12rpx;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.thanks-image {
			width: 49px;
			height: 49px;
			background: url(../../static/images/lottery/xiaolian.png) no-repeat center;
			background-size: 100% 100%;
			border-radius: 50%;
			margin-top: 36rpx;
			margin-bottom: 24rpx;
		}

		.text {
			max-height: 500rpx;
			overflow-y: scroll;
			padding: 0px 18px;
			margin-bottom: 32rpx;
			font-size: 14px;
			font-family: PingFangSC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			line-height: 20px;
			opacity: 0.8;
		}

		.circle {
			position: absolute;
			width: 7px;
			height: 7px;
			background: linear-gradient(180deg,
				rgba(218, 157, 121, 1) 0%,
				rgba(178, 91, 61, 1) 100%);
			box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.22);
			border-radius: 50%;
		}

		.circle-left-top {
			left: 9px;
			top: 9px;
		}

		.circle-left-bottom {
			left: 9px;
			bottom: 9px;
		}

		.circle-right-top {
			right: 9px;
			top: 9px;
		}

		.circle-right-bottom {
			right: 9px;
			bottom: 9px;
		}
	}

	.btn {
		width: 240px;
		height: 40px;
		background: linear-gradient(270deg,
			rgba(255, 217, 130, 1) 0%,
			rgba(216, 166, 90, 1) 100%);
		border-radius: 8px;
		text-align: center;
		font-size: 16px;
		font-family: PingFangSC;
		font-weight: 500;
		color: rgba(147, 38, 67, 1);
		line-height: 40px;
		margin: 0 auto;
		margin-top: 17px;
	}

	.close {
		text-align: center;
		margin-top: 28px;
	}
</style>
