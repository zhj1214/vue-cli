<template>
	<view class="goodsItemView" @tap.stop="toGoodsDetail">
		<!-- 图片view -->
		<view class="goodsItem-imgbg">
			<view class="">
				<image class="goodsItem-img" mode="aspectFit" :src="prop.pictureUrl"></image>
				<view class="selled-out" v-if="prop.remainNum <= 0">
					<text class="selled-out-text">已售罄</text>
				</view>
			</view>
			<image class="goodsItem-img-jg" src="/static/images/icon_mycart.png" @tap.stop="addGoodToCar(prop)"></image>
		</view>
		<!-- 商品信息view -->
		<view class="goodsItem-infoView">
			<view class="goodsItem-info">
				<view class="goodsItem-info-title oneLine">{{prop.goodsName}}</view>
				<view class="goodsItem-info-desc oneLine">{{prop.secondName}}</view>
				<view class="goodsItem-info-price">{{prop.pricePoint}}积分</view>
			</view>
			<view class="goodsItem-info-jg" :style="theme.jgColor">
				<image class="goodsItem-info-jg-img" src="/static/images/Icon_next.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: uni.$theme
			};
		},
		props: {
			prop: {
				type: Object,
				default: {}
			}
		},
		created() {},
		methods: {
			/**
			 * @description 跳转商品详情
			 */
			toGoodsDetail() {
				let id = this.prop.id;
				if (!id) return;
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?goodsid=' + id
				});
			},

			/**
			 * 加入购物车
			 */
			addGoodToCar(good) {
				if (uni.$localStorage.getItem('Token')) {
					uni.$util.currentClockin() // 点亮
					// 加入购物车请求
					var skuId = '';

					if (good.skuRespList && good.skuRespList[0].id) {
						skuId = good.skuRespList[0].id;
					}

					var self = this;
					uni.$api.apiRequest('carGoodsNum', {
						orgId: good.orgId,
						goodsId: good.id,
						goodsNum: 1,
						goodsSkuId: skuId
					}).then(res => {
						if (res.code == 10000) {
							uni.$alert.showSuccess('已加入购物车');
							setTimeout(() => {
								// 埋点
								uni.$sampling.sampling('ADD_SHOPCART', good.id, self.route);
							}, 2000);
						}
					});
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			}

		}
	};
</script>
<style>
	@import "./goods.css";
</style>
