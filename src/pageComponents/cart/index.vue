<template>
	<!-- 购物车商品组件 -->
	<view :class="isDisable?'cart-item cart-item-Disable':'cart-item'" @tap.stop="toGoodsDetail" :data-goodsid="cartObj.goodsId">
		<view :class="'right ' + (noBorder ? 'no-border': '')">
			<image class="cart-item-right-img" mode="aspectFit" :src="cartObj.pictureUrl"></image>
			<view class="goods-info">
				<view class="goods-words">
					<view class="goods-name">{{cartObj.goodsName}}</view>
					<!-- goosType 1-商品 2-优惠券 -->
					<view class="filed-value-bg">
						<view @tap.stop>
							<u-number-box v-model="cartObj.cartNum" :input-width="50" :disabled="isDisable" :min="1" :max="cartObj.userLimit||99999999999999"
							 @blur="onInput(arguments,cartObj.userLimit||99999999999999)" @change="changeNumber"></u-number-box>
						</view>
						<view class="left" @tap.stop="onChange" :data-id="cartObj.goodsId">
							<!-- 下架 -->
							<view v-if="cartObj.goodsState == 'DELISTED' || cartObj.goodsState == 'DELETED'" class="goods-status">已下架</view>
							<!-- 有买家尚 未付款 -->
							<view v-else-if="cartObj.buyStatus == 2" class="goods-status" style="width: inherit;">有买家尚 未付款</view>
							<!-- 库存不足 -->
							<view v-else-if="cartObj.remainNum <= 0" class="goods-status">已售罄</view>
							<!-- 在售 -->
							<view v-else>
								<u-checkbox-group>
									<u-checkbox v-model="cartObj.checked" active-color="#FE5D4D" shape="circle"></u-checkbox>
								</u-checkbox-group>
							</view>
						</view>
					</view>
				</view>
				<view class="price">
					<view class="filed-value" v-if="cartObj.goodsType == 1">规格：{{goodsSpec}}</view>
					<view class="filed-value" v-else>规格：张</view>
					<!-- goosType 1-商品 2-优惠券 -->
					<view class="price-left">{{allMoney}}积分</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				theme: uni.$theme,
				// checked: true,
				// 商品是否禁用
				isDisable: false,
				// 商品规格
				goodsSpec: '',
				// 总价
				allMoney: 0
			};
		},
		props: {
			cartObj: Object,
			noBorder: Boolean
		},
		// 布局完成
		mounted: function() {
			var goodsSpecStr = '';
			if (this.cartObj.spec) {
				this.cartObj.spec.forEach(item => {
					goodsSpecStr += item.specContent + ',';
				});
				goodsSpecStr = goodsSpecStr.substring(0, goodsSpecStr.length - 1);
			}

			this.setData({
				goodsSpec: goodsSpecStr,
				isDisable: this.cartObj.goodsState == 'DELETED' || this.cartObj.goodsState == 'DELISTED' ||
					this.cartObj.buyStatus == 2 || this.cartObj.remainNum <= 0,
				allMoney: uni.$util.decimalTwo(this.cartObj.priceMoney * this.cartObj.cartNum, true,0)
			});
		},

		beforeMount() {},

		methods: {
			onChange(event) {
				let cartObj = this.cartObj;
				if (cartObj.goodsState == 'LISTED' && cartObj.remainNum > 0 && cartObj.buyStatus != 2) {
					this.setData({
						cartObj: cartObj
					});
					this.$emit('checkChange', {
						detail: {
							checked: cartObj.checked,
							id: event.currentTarget.dataset.id
						}
					});
				}
			},

			selectTap(e) {
				let cartObj = this.cartObj;
				cartObj.checked = !cartObj.checked;
				this.setData({
					cartObj: cartObj
				});
				this.$emit('checkChange', {
					detail: {
						checked: cartObj.checked
					}
				});
			},

			/**
			 * 计步器 事件
			 * */
			changeNumber(e) {

				if (this.isDisable) {
					return;
				} // 判断一下 增量


				var ling = e.value - this.cartObj.cartNum;
				this.addGoodsche(ling);
				this.$emit('triggerNumber', {
					detail: {
						number: e.value
					}
				});
				this.setData({
					allMoney: uni.$util.decimalTwo(this.cartObj.priceMoney * e.value, true,0)
				});
			},

			onInput(e, max) {
				if (this.isDisable)
					return;
				let value = parseInt(e[0].value);
				var jiu = this.cartObj.cartNum;
				if (value < 1) {
					value = 1;
				} else if (value > max) {
					value = max;
				}

				var ling = value - jiu;
				if (ling != 0)
					this.addGoodsche(ling);
				this.$emit('triggerNumber', {
					detail: {
						number: value
					}
				});
			},

			// 加入购物车请求
			addGoodsche(ling) {
				if (ling) {
					uni.$util.currentClockin() // 点亮
					var skuId = '';

					if (this.cartObj.goodsSkuId) {
						skuId = this.cartObj.goodsSkuId;
					}

					var self = this;
					uni.$api.apiRequest('carGoodsNum',{
						orgId: this.cartObj.orgId,
						goodsId: this.cartObj.id,
						goodsNum: ling,
						goodsSkuId: skuId
					}).then(res => {
						if (res.code == 10000) {
							setTimeout(() => {
								// 埋点
								uni.$sampling.sampling('ADD_SHOPCART', self.cartObj.id, self.route);
							}, 2000);
						}
					});
				}
			},

			/**
			 * 跳转
			 * */
			toGoodsDetail(e) {
				if (this.cartObj.goodsState == 'DELETED' || this.cartObj.goodsState == 'DELISTED') {
					uni.$alert.showToast('该商品已下架');
					return;
				}

				let id = e.currentTarget.dataset.goodsid;
				uni.navigateTo({
					url: `/pages/goodsDetail/goodsDetail?goodsid=${id}`
				});
			}

		}
	};
</script>
<style>
	@import "./index.css";
</style>
