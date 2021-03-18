<!-- 我的奖品 -->
<template>
	<view class="my-prize">
		<navBar title="我的奖品" background="#fff"></navBar>
		<!-- 淡入 -->
		<view class="tip" v-show="show">
			<view class="tip-top">
				<span>温馨提醒</span>
				<image src="/static/images/lottery/closeMenu.png" style="width: 20px;height: 20px;" @click="show=false">
			</view>
			<p>优惠券需要到会员中心-优惠券中查看使用</p>
		</view>
		<view class="list">
			<view class="prize-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
				<view class="img-wrapper">
					<image class="img-wrapper-img" v-if="item.awardType == 'GROWTH_SCORE'" src="http://yonghuyunying.oss-cn-beijing.aliyuncs.com/c262b9a43751485fb77078ba268895ab.png" />
					<image class="img-wrapper-img" v-else-if="item.awardType == 'POINT'" src="http://yonghuyunying.oss-cn-beijing.aliyuncs.com/7fce3c451c4d4e44ae6984d0c7d38bd2.png" />
					<image class="img-wrapper-img" v-else :src="item.awardPicUrl" />
				</view>
				<view class="line"></view>
				<view class="info">
					<view class="name" v-if="item.awardType == 'GROWTH_SCORE'">{{item.awardSourceNum}}成长值</view>
					<view class="name" v-else-if="item.awardType == 'POINT'">{{item.awardSourceNum}}积分</view>
					<view class="name oneLine" v-else>{{item.awardInfo}}</view>
					<view class="info-time">{{filterTime(item.awardTime)}}</view>
					<view class="view-btn" v-if="item.awardType =='PRESENT'" @click="jumpGoodsPage(item)">{{!item.orderNum?'立即领取':'查看'}}</view>
				</view>
			</view>
		</view>
		<!-- 弹框 -->
		<u-modal v-model="showEnd" :mask-close-able="true" confirm-text="好的" content="奖品已下架，请联系客服！"></u-modal>
	</view>

</template>

<script>
	/**
	 * 礼品分两种类型
	 * 1.实物礼品（快递类型、线下核销）
	 * 2.虚拟商品
	 * 类型(1)跳转到 结算页面进行下单流程
	 * 类型(2)通过奖品参数， 调用预下单接口，在调用结算信息接口，在调用下单接口。下单成功（在调用通知 后端已领取接口）跳转订单详情页面
	 * */
	export default {
		data() {
			return {
				show: true,
				list: [],
				page: 1,
				size: 999,
				showEnd: false
			};
		},
		onShow() {
			this.getAwards()
		},
		created() {
			this.getOrderListEum()
		},
		methods: {
			/**
			 * 实物礼品流程
			 * 1.下单流程
			 * 2.跳转到订单详情页面
			 * */
			jumpGoodsPage(val) {
				// 异常终止
				if (val.invalid && !val.orderNum) {
					return this.showEnd = true
				}
				console.log(val)
				// 下单流程
				if (!val.orderNum) {
					this.zjGoods = val
					let param = {
						"goodsList": [{
							"goodsSkuId": val.mallSkuId,
							"num": 1,
							"goodsId": val.mallSpuId,
							"excludeGoodsState": true
						}]
					}
					uni.$util.currentClockin() // 点亮
					this.getPrepaidOrderId(param)
				} else {
					// 跳转到订单详情页面
					uni.navigateTo({
						url: `/pagesA/order/order-detail/order-detail?orderId=${val.orderNum}&orgId=${val.orgId}&isGame=1`,
					});
				}
			},
			getAwards() {
				uni.$api.apiRequest('game_my_award', {
					memberId: uni.$localStorage.getItem("memberId"),
					page: this.page,
					size: this.size
				}).then(res => {
					if (res.code == 10000) {
						this.list = res.data.list || []
					} else {
						this.list = []
					}
				})
			},
			filterTime(val) {
				if (!val) return ''
				return new Date(val).Format('YYYY-MM-DD HH:mm:ss')
			},
			toDetail(item) {
				// 异常终止
				if (item.invalid && !item.orderNum) {
					return this.showEnd = true
				}
			},
			/**
			 * 虚拟商品下单流程
			 * 生成预付单： getPrepaidOrderId
			 * 获取下单信息：getPlaceOrderInfo
			 * 下单接口：commitOrder
			 * 通知接口：noticeSuccess
			 * 注意：
			 * validTimeEffectTerm: 过期时间 多少天
			 * extractGoodsValidTime: 指定过期时间
			 * extractGoodsAddress: 自提地址
			 * */
			getPrepaidOrderId(val) {
				uni.$api.apiRequest('goodsSettlementApply', val).then(res => {
					if (res.code == 10000) {
						uni.navigateTo({
							url: "/pages/settlement/settlement?id=" + res.data + '&gameGoodsId=' + this.zjGoods.id
						});
					}
				});
			},
			getPlaceOrderInfo(id) {
				uni.$api.apiRequest('goodsSettlementInfo', {
					settlementId: id,
					pickUpList: []
				}).then(res => {
					if (res.code == 10000) {
						console.log(res.data);
						/* *
						 * 这里要处理几件事情
						 * 1.计算订单总价
						 * 2.到店自提商品有效期、地址不同时、进行商品分类
						 * */
						var orderTotal = 0; // 订单总价
						var orderExpressFeeTotal = 0; // 订单 运费总价
						var goodsIds = []; //订单ids
						if (res.data.orderList && res.data.orderList[0].goodsList) {
							res.data.orderList.forEach(goods => {
								if (goods.orderType == 1) {
									orderExpressFeeTotal += goods.expressFee;
								}
								var goodsNumPrice = 0;
								var goodsTotalPrice = 0;
								goods.goodsList.forEach(item => {
									// 商品金额
									goodsNumPrice += item.priceMoney * item.num; // 商品ids
									goodsIds.push(item.goodsId); // 订单总金额
									if (item.expressFee) {
										item.expressFee = uni.$util.decimalTwo(item.expressFee, true, 0);
									}
									orderTotal += item.priceMoney * item.num; // 分享id
								});
								// 单个订单 金额计算
								if (goods.orderType == 1) {
									goodsTotalPrice += goodsNumPrice + goods.expressFee;
								} else {
									goodsTotalPrice += goodsNumPrice;
								}

								goods.goodsNumPrice = goodsNumPrice;
								goods.goodsTotalPrice = goodsTotalPrice;
							});
							// 第二次 开始商品匹配
							res.data.orderList.forEach((goods, index) => {
								// goods.goodsSplit = this.classification(goods.goodsList);
								goods.adressId = index;
								// 如果没有地址 初始化一下字段（h5 特殊需要解决，第一次下单无地址情况，添加失败）
								if (!goods.address && goods.orderType == 1) {
									goods.address = {
										"city": "",
										"cityCode": "",
										"county": "",
										"countyCode": "",
										"createTime": 0,
										"detailed": "",
										"id": 0,
										"isDefault": 0,
										"memberId": 0,
										"province": "",
										"provinceCode": "",
										"receiver": "",
										"receiverPhone": "",
										"status": 0
									}
								}

							});
						}

						var orderTotaltz = uni.$util.decimalTwo(orderTotal + orderExpressFeeTotal, true, 0);
						this.setData({
							goodsIds: goodsIds,
							orderExpressFeeTotal: orderExpressFeeTotal,
							settlementData: res.data,
							orderTotal: orderTotaltz != 0 ? orderTotaltz : 0.01 * res.data.orderList.length
						});
						this.commitOrder()
					} else {
						uni.$alert.showAlert('领取失败，请重试')
					}
				});
			},
			/**
			 * 获取 订单状态枚举 这里解决订单详情页面无法获取订单状态问题
			 */
			getOrderListEum() {
				const app = getApp();
				uni.$api.apiRequest('getOrderHeaderData').then(res => {
					if (res.code == 10000) {
						uni.$localStorage.setItem('orderHeader', res.data);
						app.globalData.orderHeader = res.data;
					}
				});
			},
		}
	};
</script>

<style lang='less' scoped>
	.my-prize {
		background: rgba(247, 246, 246, 1);
		min-height: 100vh;
	}

	.tip {
		height: 74px;
		background: #E9F5FF;
		padding: 0 20px;
		padding-top: 14px;

		.tip-top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			span {
				font-size: 12px;
				font-family: PingFangSC-Medium;
				font-weight: 500;
				color: #3091F3;
				line-height: 20px;
			}
		}

		p {
			font-size: 12px;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: #84C1FF;
			line-height: 20px;
			margin-top: 6px;
		}
	}

	.list {
		padding: 15px 14px;
	}

	.prize-item {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6px 12px 0px rgba(183, 183, 183, 0.06);
		border-radius: 6px;
		display: flex;
		padding: 12px;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 10px;
	}

	.img-wrapper {
		width: 60px;
		height: 60px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 12rpx 24rpx 0px rgba(0, 0, 0, 0.16);
		border-radius: 16rpx;
		position: relative;

		.img-wrapper-img {
			border-radius: 16rpx;
			max-width: 100%;
			max-height: 100%;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate3d(-50%, -50%, 0);
		}
	}

	.line {
		width: 0;
		height: 50px;
		border-right: 1px dashed #DEDEFF;
		margin-left: 15px;
	}

	.info {
		flex: 1;
		padding-left: 16px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 60px;
		padding-top: 3px;
		padding-bottom: 4px;
		position: relative;

		.info-time {
			font-size: 18rpx;
			font-family: ArialMT;
			color: rgba(170, 170, 170, 1);
		}

		.name {
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: rgba(38, 38, 38, 1);
			line-height: 17px;
		}

		.view-btn {
			position: absolute;
			width: 150rpx;
			height: 50rpx;
			line-height: 50rpx;
			background: #3091F3;
			border-radius: 7rpx;

			text-align: center;
			font-size: 28rpx;
			font-family: AlibabaPuHuiTiR;
			color: rgba(255, 255, 255, 1);
			right: 0;
			bottom: 10rpx;
		}
	}
</style>
