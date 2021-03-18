<template>
	<view>
		<navBar title="电子小票" background="#fff" back="true"></navBar>
		<view class="listContainer" v-if="orderList.length">
			<view
				class="listRow"
				v-for="(listItem, index) in orderList"
				:key="listItem.orderId"
				@click="jumpToOrderDetail(listItem)"
			>
				<view>
					<view class="listItemRow">
						<view class="itemLeftPart specialText">{{listItem.marketName}}</view>
						<view class="itemRightPart" :style="{color: colorObj[listItem.orderStatus]}">{{listItem.orderStatusName}}</view>
					</view>
					<view class="listItemRow lightText">
						<view class="itemLeftPart">{{new Date(listItem.orderOccurTime).Format('YYYY-MM-DD HH:mm:ss')}}</view>
						<view class="itemRightPart">￥{{listItem.actualAmt}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="noRecord">
				<image
					style="width: 180px; height: 180px; margin-bottom: 15px"
					src="/static/images/my/receiptItemNone.png"
				></image>
				<view class="px16Text">暂无相关记录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				colorObj: {
					"0": "#52C41A",
					"1": "#FAAD14",
					"2": "#FF4D4F",
				},
				memberId: uni.$localStorage.getItem("memberId"),
				orderList: [],
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onShow: function() {
			console.log("onShow", this.memberId)
			this.getReceiptListRequest()
		},
		methods: {
			/*** 跳转至小票详情*/
			jumpToOrderDetail(listItem) {
				uni.navigateTo({
					url: `/pagesA/myCenter/myReceipt/receiptDetail?orderId=${listItem.orderId}`,
				});
			},
			/** 获取小票列表 */
			getReceiptListRequest() {
				uni.$api.apiRequest('getReceiptList', {
					memberId: this.memberId,
					page: 1,
					size: 9999
				}).then(res => {
					this.orderList = res && res.data && res.data.list || []
				});
			},
		}
	};
</script>
<style scoped lang="less">
	.listContainer {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
	}
	.listRow {
		padding: 40rpx;
		margin-bottom: 20rpx;
		background: #FFFFFF;
		box-shadow: 0 0 20px -2px rgba(0, 0, 0, 0.07);
		border-radius: 5px;
	}
	.listItemRow {
		display: flex;
		margin-bottom: 15rpx;
	}
	.itemLeftPart {
		width: 60%;
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
	.noRecord {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		height: 80vh;
	}
</style>
