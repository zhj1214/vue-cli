<template>
	<!--components/mergePay/mergePay.wxml-->
	<view>
		<u-popup v-model="payShow" :custom-style="{'width': '100%','height':'76vh','border-radius':'12rpx'}" mode="bottom">
			<!-- header -->
			<view class="popupHeader">
				<view class="popupHeader-top">
					<view class="popupHeader-top-title">以下订单需一起付款</view>
					<image style="width:28rpx;height:28rpx;padding: 8rpx;" src="/static/images/goods/Close.png" @tap.stop="closePopupView"></image>
				</view>
				<view class="popupHeader-bottom">由于以下订单共享优惠，需要一起付款</view>
			</view>
			<!-- 内容 -->
			<view class="goodsScroll">
				<!-- 商品列表 -->
				<view v-for="(item, index) in payObj.orderInfoList" :key="index" class="goodsList">
					<view class="refundGoods-header">订单编号: {{item.orderId}}</view>
					<view v-for="(el, index2) in item.productList" :key="index2" class="refundGoods-item">
						<view class="refundGoods-item-l">
							<image class="refundGoods-item-img" :src="el.goodsImg"></image>
							<view class="refundGoods-item-info">
								<view class="refundGoods-item-title">{{el.goodsName}}</view>
								<view class="refundGoods-item-desc">规格：{{el.goodsSpec}}</view>
							</view>
						</view>
						<view class="refundGoods-item-r">
							<view class="refundGoods-item-desc" style="margin-bottom: 18rpx;">￥{{el.productCharge}}</view>
							<view class="refundGoods-item-desc">× {{el.num}}</view>
						</view>
					</view>
					<!-- footer -->
					<view class="footerView">
						<view class="footerTitle">
							<span class="footerTitle">合计：</span>
							<span class="footerPrice">{{ item.actualAmt }}</span>
							<!-- {{item.expressFee}} -->
							<span class="Freight" v-if="cell.expressType == 1">（含运费￥0）</span>
						</view>
					</view>
				</view>
			</view>
			<!-- 悬浮框 -->
			<view class="bottom-tool">
				<view class="bottom-tool-btn" style="background: #FE5D4D;color: white;" @tap.stop="closePopupView" data-type="2">取消支付</view>
				<view class="bottom-tool-btn downBtn" :style="'background: #FE5D4D;color: white;' + them.btn" @tap.stop="gotoPay">支付(
					<u-count-down :timestamp="downTime" :show-days="false" :show-hours="false" :bg-color="theme.borderColor" :separator-color="theme.color" :color="theme.color"></u-count-down>
					<!-- <van-count-down :time="downTime" format="mm:ss" catch:finish="timeFinish"></van-count-down> -->
					)</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				downTime: 1245000
			};
		},
		props: {
			payShow: {
				type: Boolean,
				default: false
			},
			goodsId: {
				type: Array,
				default: []
			},
			payObj: {
				type: Object,
				default: false
			}
		},
		methods: {
			/**
			 * 关闭弹框
			 * */
			closePopupView() {
				this.setData({
					payShow: false
				});
			},

			/**
			 * 待支付状态 倒计时
			 */
			timeFinish() {
				if (this.downTime < 0) {
					const countDown = this.selectComponent('.control-count-down');

					if (countDown) {
						countDown.pause();
					}
				}

				this.closePopupView();
			},

			/**
			 * 取消订单
			 * */
			confirmReceipt() {
				this.$emit('cancelShow');
			},

			/**
			 * 去支付
			 */
			gotoPay() {
				var samplingGoods = [];
				this.payObj.orderInfoList.forEach(item => {
					item.productList.forEach(el => {
						samplingGoods.push(el.goodsSpuId);
					});
				});
				samplingGoods = samplingGoods.concat(this.goodsId);
				uni.$util.weChatPay({ ...this.payObj.payParamInfo,
					route: this.route,
					goodsIds: samplingGoods
				});
			}

		}
	};
</script>
<style>
	@import "./mergePay.css";
</style>
