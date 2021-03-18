<template>
	<view>
		<navBar title="小票详情" background="#fff" back="true"></navBar>
		<view class="pageContainer">
			<view class="receiptContainer">
				<view class="titleContainer flexCenter">
					<image
						style="width: 90px; height: 26px; margin-bottom: 10px"
						src="/static/images/login/login.png"
					></image>
					<view class="titleText">{{receiptDetail.marketName}}</view>
				</view>
				<view class="topPartText">
					<view class="listItemRow">
						<text class="lightText">收款机编码：</text>
						<text>{{receiptDetail.machineId}}</text>
					</view>
					<view class="listItemRow">
						<text class="lightText">收款员ID：</text>
						<text>{{receiptDetail.cashierId}}</text>
					</view>
					<view class="listItemRow">
						<text class="lightText">日期：</text>
						<text>{{receiptDetail.orderOccurTime ? new Date(receiptDetail.orderOccurTime).Format('YYYY-MM-DD HH:mm:ss') : ""}}</text>
					</view>
					<view class="listItemRow">
						<text class="lightText">订单状态：</text>
						<text>{{receiptDetail.orderStatusName}}</text>
					</view>
				</view>
				<view class="codePart">
					<view class="flexCenter" v-if="receiptDetail.orderId">
						<tkiBarcode
							ref="barcode"
							:val="receiptDetail.orderId"
							:opations="opations"
						/>
					</view>
					<view class="flexCenter" style="margin-top: 5px;letter-spacing: 2px;">{{receiptDetail.orderId}}</view>
				</view>
				<view class="receiptLine">
					<view class="receiptLineLeft"></view>
					<view class="receiptLineCenter"></view>
					<view class="receiptLineRight"></view>
				</view>
				<view class="goodsTableTitle">
					<view class="itemLeftPart">商品/编号</view>
					<view class="itemCenterPart">数量*单价</view>
					<view class="itemRightPart">金额</view>
				</view>
				<view
					class="goodsItem"
					v-for="(item, index) in receiptDetail.productList"
					:key="item.id"
				>
					<view class="listItemRow">
						<view class="itemLeftPart specialText">{{item.goodsName}}</view>
						<view class="itemCenterPart">{{item.num}} *￥{{item.price}}</view>
						<view class="itemRightPart">￥{{item.num * item.price}}</view>
					</view>
					<view class="listItemRow lightText">
						<view class="itemLeftPart">{{item.productId}}</view>
						<view class="itemCenterPart"></view>
						<view class="itemRightPart" :style="{color: colorObj[item.goodsStatus]}">{{item.goodsStatusName}}</view>
					</view>
				</view>
				<view class="receiptLine">
					<view class="receiptLineLeft"></view>
					<view class="receiptLineCenter"></view>
					<view class="receiptLineRight"></view>
				</view>
				<view>
					<view class="listItemRow lightText" v-if="goodsTotalNum >= 0">
						<view class="itemLeftPart">购买件数</view>
						<view class="itemRightPart">{{goodsTotalNum}}</view>
					</view>
					<view class="listItemRow lightText" v-if="receiptDetail.totalAmt >= 0">
						<view class="itemLeftPart">订单总金额</view>
						<view class="itemRightPart">￥{{receiptDetail.totalAmt}}</view>
					</view>
					<view class="listItemRow lightText" v-if="receiptDetail.discount > 0">
						<view class="itemLeftPart">优惠总计</view>
						<view class="itemRightPart">￥{{receiptDetail.discount}}</view>
					</view>
					<view class="listItemRow lightText" v-if="receiptDetail.refundActTotalCharge > 0">
						<view class="itemLeftPart">退款金额</view>
						<view class="itemRightPart">￥{{receiptDetail.refundActTotalCharge}}</view>
					</view>
					<view class="listItemRow" v-if="receiptDetail.actualAmt >= 0">
						<view class="itemLeftPart">支付金额</view>
						<view class="itemRightPart">￥{{receiptDetail.actualAmt}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"

	export default {
		components: {
			tkiBarcode
		},
		data() {
			return {
				colorObj: {
					"0": "#52C41A",
					"1": "#FAAD14",
					"2": "#FF4D4F",
				},
				goodsList: [],
				opations: {
					width: 3,
					margin: 0,
					displayValue:false
				},
				receiptDetail: {},
			};
		},
		onLoad: function (option) {
			this.getReceiptDetailRequest(option)
		},
		computed: {
			goodsTotalNum() {
				const productList = this.receiptDetail.productList;
				let totalNum = 0;
				productList && productList.forEach(item => totalNum += item.num)
				return totalNum;
			}
		},
		methods: {
			/** 获取小票详情 */
			getReceiptDetailRequest(option) {
				if (option && option.orderId) {
					uni.$api.apiRequest('getReceiptDetail', {
						orderId: option.orderId,
					}).then(res => {
						this.receiptDetail = res && res.data || {}
						console.log("res", res)
					});
				} else {
					console.log("failed")
				}
			},
		}
	};
</script>
<style scoped lang="less">
	.titleContainer {
		margin: 20px 0;
	}
	.titleText {
		font-weight: 400;
		font-size: 16px;
	}
	.pageContainer {
		overflow: scroll;
		height: 90vh;
		padding: 40rpx;
		background: #F9F9F9;
	}
	.receiptContainer {
		display: flex;
		flex-direction: column;
		padding: 20rpx 0;
		background: white;
		box-shadow: 0 0 20px -2px rgba(0, 0, 0, 0.07);
		border-radius: 15px;
	}
	.topPartText {
		font-size: 12px;
	}
	.listItemRow {
		display: flex;
		padding: 2rpx 40rpx;
		margin-bottom: 15rpx;
	}
	.itemLeftPart {
		width: 60%;
	}
	.itemCenterPart {
		width: 40%;
		text-align: end;
	}
	.itemRightPart {
		width: 40%;
		text-align: end;
	}
	.specialText {
		font-size: 32rpx;
	}
	.lightText {
		color: #929497
	}
	.flexCenter {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}
	.receiptLine {
		display: flex;
		align-items: center;
		height: 12px;
		margin: 10px 0;
	}
	.receiptLineLeft {
		height: 16px;
		width: 10px;
		border-radius: 0 8px 8px 0;
		background: #F3F3F3;
	}
	.receiptLineCenter {
		height: 2px;
		margin: 0 7px;
		width: 100%;
		border-bottom: 1px dashed #929497;
	}
	.receiptLineRight {
		height: 16px;
		width: 10px;
		border-radius: 8px 0 0 8px;
		background: #F3F3F3;
	}
	.goodsItem {
		margin-top: 16px;
	}
	.codePart {
		margin-top: 5px;
	}
	.goodsTableTitle {
		display: flex;
		padding: 0 20rpx 30rpx 20rpx;
		margin: 0 20rpx;
		border-bottom: 1px solid #EAEAEA;
	}
</style>
