<template>
	<view class="customizeCard">
		<navBar title="自定义会员卡面" :backBtn="true" :homeBtn="true"></navBar>
		<view class="checkCardInfo" :style="{background: 'url('+memberCardFaceLogo+')','background-size': '100% 100%','background-repeat': 'no-repeat;'}">
			<view class="info">
				<view class=" flex-row">
					<view class="card_type">{{levelName}}</view>
					<view class="card_type_text" style="color:#EEDCBA;">当前等级</view>
				</view>
				<view class="date">有效期至：{{searchedTime}}</view>
			</view>
			<view class="preview">卡面预览</view>
		</view>
		<view style="width:100%;height:20rpx;background:#F9F9F9;"></view>
		<view class="card_box">
			<view style="height:44rpx;line-height:44rpx;font-size:32rpx;color:#333333">可使用卡面</view>
			<view class="card_content">
				<view class="card_list" v-for="(item,index) in memberCardFaceList" :key="index" @click="chooseCardHandle(item)">
					<image style="width: 80rpx;height: 42rpx;position:absolute;left:0;top:0" src="../../../static/images/my/use.png"
					 mode="" v-if="memberCardFaceLogo==item"></image>
					<image style="width: 320rpx;height: 156rpx;position:absolute;left:0;top:0" src="../../../static/images/my/checked.png"
					 mode="" v-if="checkedCard==item"></image>
					<image :src="item" mode=""></image>
				</view>
			</view>
			<u-button style="position:relative;top:119px" :custom-style="customStyle" @click="saveHandle">立即使用</u-button>
		</view>
	</view>
</template>
<script>
	import navBar from '@/components/navBar/navBar'
	export default {
		components: {
			navBar
		},
		data() {
			return {
				customStyle: {
					background: '#FE5D4D',
					color: '#ffffff',
					fontSize: '16px'
				},
				levelId: '',
				levelName: '',
				searchedTime: '',
				defaultCardFace: '',
				memberCardFaceLogo: '',
				memberCardFaceList: [],
				checkedCard: ''
			}
		},
		onLoad: function(option) {
			this.levelId = option.levelId
			this.levelName = option.levelName
			this.searchedTime = option.searchedTime!==undefined ? new Date(Number(option.searchedTime)).Format('YYYY-MM-DD') : ''
		},
		mounted() {
			this.getCardInfo()
		},
		methods: {
			getCardInfo() {
				uni.$api.apiRequest('getCardFaceInfo', {
					memberId: uni.$localStorage.getItem('memberId')
				}).then(res => {
					if (res.code == 10000 && res.data) {
						this.defaultCardFace = res.data.defaultCardFace
						this.memberCardFaceLogo = res.data.memberCardFaceLogo
						this.memberCardFaceList = res.data.memberCardFaceList
						this.memberCardFaceList.unshift(this.defaultCardFace)
					}
				});
			},
			// getTime(searchedTime) {
			//     if (!searchedTime) {return ''}
			//     return uUtils.getTimeFormat("YYYY-MM-DD",new Date(searchedTime))
			// },
			chooseCardHandle(url) {
				this.checkedCard = url
				this.memberCardFaceLogo = url
			},
			saveHandle() {
				uni.$api.apiRequest('saveCardFaceInfo', {
					memberId: uni.$localStorage.getItem('memberId'),
					memberCardFaceLogo: this.memberCardFaceLogo
				}).then(res => {
					console.log('=====getCardInfo', res)
					if (res.code == 10000) {
						uni.showToast({
							title: '会员卡面已替换',
							mask: false,
							duration: 1500
						})
						uni.navigateTo({
							url: '/pages/my/memberLevel/personnalInfo'
						})
					}
				});
			},
		}
	}
</script>
<style lang="less" scoped>
	.customizeCard {
		.checkCardInfo {
			width: calc(100% - 80rpx);
			height: 328rpx;
			margin: 40rpx;
			position: relative;

			.info {
				position: absolute;
				left: 40rpx;
				top: 52rpx;
				background-size: 100% 100%;

				.card_type {
					height: 56rpx;
					line-height: 56rpx;
					font-size: 40rpx;
					color: #333333;

				}

				.card_type_text {
					width: 116rpx;
					height: 36rpx;
					line-height: 36rpx;
					text-align: center;
					background-color: #444444;
					border-radius: 24rpx;
					margin-left: 16rpx;
					font-size: 20rpx;
					display: inline-block;

				}

				.date {
					font-size: 20rpx;
					color: #CCA96B;
					margin-top: 4rpx;
				}
			}

			.preview {
				width: 100%;
				height: 58rpx;
				line-height: 58rpx;
				text-align: center;
				font-size: 24rpx;
				color: #FFFFFF;
				background: rgba(0, 0, 0, 0.26);
				position: absolute;
				left: 0;
				bottom: 0;
			}
		}

		.card_box {
			width: calc(100% - 80rpx);
			margin: 40rpx auto 192rpx;

			.card_content {
				width: 100%;
				height: auto;
				margin-top: 40rpx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.card_list {
					width: 320rpx;
					height: 156rpx;
					border-radius: 8rpx;
					overflow: hidden;
					margin-bottom: 28rpx;
					position: relative;
					// border: 1px solid red;
				}

				.card_list image {
					display: block;
					width: 100%;
					height: 100%
				}

				.card_list:nth-last-child(1),
				.card_list:nth-last-child(2) {
					margin-bottom: 0;
				}
			}
		}
	}
</style>
