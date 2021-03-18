<template>
	<view>
		<view class="bottomView" v-if="isShow">
			<view class="bottomContent" :style="isShareType?'justify-content: flex-end;':''">
				<!-- 首页、购物车 -->
				<view class="jumpView" v-if="!isShareType">
					<view class="carImg" @tap.stop="jumpIndex" style="margin-right: 50rpx;">
						<image style="width:20px;height:20px;" src="/static/images/tab/home-active.png"></image>
						<text>首页</text>
					</view>
					<view class="carImg" @tap.stop="jumpCarPage">
						<view>
							<image style="width:20px;height:20px;" src="/static/images/goodsCar.png"></image>
							<view class="biaoji" v-if="getCartGoddsCounts > 0">
								<text>{{getCartGoddsCounts}}</text>
							</view>
						</view>
						<text :style="getCartGoddsCounts > 0?'margin-top: 8px;margin-left: -5px;':''">购物车</text>
					</view>
				</view>
				<!-- 加入购物车、立即购买 -->
				<view class="bottomBtnView" v-if="currentStatus==0">
					<view class="bottomBtn" style="border:1px solid #BFBFBF;" @click="addCarGoods" v-if="!isShareType">加入购物车</view>
					<view class="bottomBtn" :style="theme.btn" @click="immediatelyBuy">立即购买</view>
				</view>
				<view v-else class="bottomBtnView">
					<view class="bottomBtn" @click="addCarGoods" v-if="!isShareType && currentStatus != 5" style="border: 1px solid rgb(191, 191, 191);margin-right:20rpx;">加入购物车</view>
					<view class="bottomBtn forbidView" @click="forbidClick">{{status[currentStatus].buttonTitle}}</view>
				</view>
			</view>
		</view>
		<!-- 选择规格 custom-class="ZHJ-Style" -->
		<u-popup v-model="showSpec" mode="bottom" @close="onCloseSpec">
			<view style="margin: 32rpx;margin-bottom: 90rpx;height: 116vw;background-color: white;">
				<!-- 商品信息 -->
				<view class="popGoodsView">
					<view class="popGoodsInfoView">
						<view>
							<image mode="aspectFit" style="width:86px;height:86px;" :src="goodsToolData.pictureUrl"></image>
						</view>
						<view style="margin-left:10px;">
							<view class="popGoodsPrice" v-if="goodsToolData.availableNum != undefined">{{goodsToolData.priceMoney || goodsToolData.intervalPrice}}积分</view>
							<view class="popGoodsPrice" v-else>{{goodsToolData.intervalPrice}}积分</view>
							<view class="popGoodsInventory" v-if="goodsToolData.showStockToMember && goodsToolData.availableNum != undefined">库存：{{goodsToolData.availableNum}}</view>
							<view class="popGoodsNumber" v-if="goodsToolData.availableNum != undefined">已选：{{goodsToolData.goodsName}} ×
								{{ggGoodsNum || 1}}</view>
						</view>
					</view>
					<image style="width:14px;height:14px;padding: 12px;" src="/static/images/goods/Close.png" @tap.stop="onCloseSpec"></image>
				</view>
				<!-- 规格 -->
				<view style="padding-bottom: 180rpx;">
					<view v-if="goodsToolData.goodsType != 3">
						<view v-for="(item, idx) in goodsSpecs.data" :key="idx" class="speceView-List">
							<view style="font-size:16px;font-family:PingFangSC-Medium;font-weight:500;color:rgba(0,0,0,1);line-height:30px;">{{item.specName}}：</view>
							<view class="specesView">
								<view v-for="(item, index) in item.specContents" :key="index" @tap.stop="speceClick(item,idx,item.specContentId)">
									<view v-if="item.select" class="speceButton-select">{{item.specContent}}</view>
									<view v-else-if="!item.isPut" class="speceButton-disable">{{item.specContent}}</view>
									<view v-else class="speceButton">{{item.specContent}}</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else>
						<view style="font-size:16px;font-family:PingFangSC-Medium;font-weight:500;color:rgba(0,0,0,1);line-height:30px;">规格：</view>
						<view class="specesView">
							<view class="speceButton" style="color:#FF595F;">{{ffhySpecName|| '张'}}</view>
						</view>
					</view>
					<!-- 数量 -->
					<view style="margin-top:18px;">
						<view style="font-size:16px;font-family:PingFangSC-Medium;font-weight:500;color:rgba(0,0,0,1);line-height:30px;">数量：</view>
						<u-number-box :input-width="50" :min="1" :max="goodsNumberLimit" @change="vanStepperonChange"></u-number-box>
						<view v-if="goodsToolData.userLimit" style="margin-top:10px;font-size:14px;font-family:PingFangSC-Light;font-weight:300;color:rgba(0,0,0,0.5);">兑换数量：每人最多可兑换
							{{goodsToolData.userLimit}} 件</view>
					</view>
				</view>
			</view>

		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: uni.$theme,
				// 数据源
				goodsToolData: {},
				// 是否显示 规格弹框
				showSpec: false,
				// 商品SkuId
				requestGoodsSkuId: '',
				// 购物车数量
				getCartGoddsCounts: 0,
				// 商品规格数据
				goodsSpecs: {},
				// 请求参数
				requestParam: {},
				// 商品详情 四种状态
				currentStatus: 0,
				status: [{
					type: '0',
					message: '',
					buttonTitle: ''
				}, {
					type: '1',
					message: '该商品已售罄',
					buttonTitle: '已售罄'
				}, {
					type: '2',
					message: '该商品已达兑换上限',
					buttonTitle: '已达兑换上限'
				}, {
					type: '3',
					message: '该商品为银卡会员、金卡会员独享',
					buttonTitle: '当前等级无法兑换'
				}, {
					type: '4',
					message: '有买家尚未付款',
					buttonTitle: '有买家尚未付款'
				}, {
					type: '5',
					message: '该商品已下架',
					buttonTitle: '暂未上架'
				}],
				goodsNumberLimit: 0,
				ffhySpecName: '',
				ggGoodsNum: 1
			};
		},
		props: {
			// 是否显示组件
			isShow: {
				type: Boolean,
				default: true
			},
			// 是不是从分享 链接或二维码过来的
			isShareType: {
				type: Boolean,
				default: false
			},
			// 请选择规格套餐
			selectGoddsspec: String,
			// 商品数据
			goodsDetailData: {
				type: Object,
				default: () => ({})
			}
		},
		watch: {
			goodsDetailData: {
				handler: function(newVal, oldVal) {
					newVal && newVal != {} && this.initData(newVal);
				},
				deep: true
			},
			goodsToolData: function(newVal, oldVal) {
				if (newVal.goodsName && oldVal.goodsName) {
					// console.log(newVal, '___监听',oldVal)
					this.$emit('dataChange', {
						detail: newVal
					});
				}
			}
		},

		/**
		 * 布局完成
		 * */
		mounted: function() {
			this.getCartNumbers();
		},
		methods: {
			/**
			 * 拿到商品数进行组装
			 * 在显示的时候触发
			 */
			initData(val) {
				// 防止循环
				if (this.goodsToolData.goodsName || !val.goodsName) return; // console.log(this.data.goodsToolData, val, '______________')
				// 防止循环 //

				this.setData({
					goodsToolData: this.goodsDetailData
				}); // 获取规格

				this.getGoodsSpec([], val); // 当所有 1上架规格都是已售罄 2或者都是有买家尚未付款  3或者都是前两种情况的情况
				// buyStatus 2 => (4)有买家尚未付款  3=>(1)已售罄

				var ysq = 0;
				var ymjswfk = 0;
				if (!val.skuRespList) return;
				val.skuRespList.forEach(item => {
					if (item.buyStatus == 2) {
						ymjswfk += 1;
					} else if (item.buyStatus == 3) {
						ysq += 1;
					}
				});

				if (ysq == val.skuRespList.length) {
					this.setData({
						currentStatus: 1
					});
				} else if (ymjswfk == val.skuRespList.length) {
					this.setData({
						currentStatus: 4
					});
				} else if (ymjswfk + ysq == val.skuRespList.length) {
					this.setData({
						currentStatus: 4
					});
				}

				this.setData({
					requestParam: {
						goodsId: val.id
					}
				});
			},

			/**
			 * 获取 购物车数量
			 */
			getCartNumbers(isShoeText) {
				if (uni.$localStorage.getItem('Token')) {
					uni.$api.apiRequest('getCartGoddsCount').then(res => {
						if (res.code == 10000) {
							this.setData({
								getCartGoddsCounts: res.data
							});

							if (isShoeText) {
								uni.$alert.showSuccess('加购成功');
							}
						}
					});
				}
			},

			/**
			 * 跳转到购物车/首页
			 */
			jumpCarPage() {
				uni.switchTab({
					url: '/pages/cart/cart',
					complete: (res) => {
						console.log(res)
					}
				});
			},

			jumpIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},

			/**
			 * 立即兑换
			 */
			immediatelyBuy() {
				if (uni.$localStorage.getItem('Token')) {
					// 判断是否选择了规格
					if (this.selectGoddsspec.indexOf('x') < 0 && !this.showSpec) {
						this.selectGoodSpec();
						return;
					}

					if (this.goodsToolData.goodsType == 1 && this.goodsSpecs.list.length < this.goodsSpecs.data.length) {
						return uni.$alert.showToast('请选择商品规格');
					}
					// 先计算加入购物车的 数量
					if (this.goodsToolData.remainNum && this.goodsToolData.remainNum > 0) {
						// 匹配相对规格
						var currentSpec = undefined;
						this.goodsToolData.skuRespList.forEach(item => {
							if (this.goodsToolData.goodsType == 1) {
								if (item.skuId == this.requestGoodsSkuId) {
									currentSpec = item.id;
								}
							} else {
								currentSpec = item.id;
							}
						});
						let param = {
							goodsList: [{
								goodsSkuId: currentSpec,
								num: this.requestParam.goodsNum || 1,
								goodsId: this.goodsToolData.id
							}]
						};
						uni.$api.apiRequest('goodsSettlementApply', param).then(res => {
							if (res.code == 10000) {
								uni.navigateTo({
									url: "/pages/settlement/settlement?id=" + res.data
								});
							}
						});
					} else {
						if (this.goodsToolData.goodsType == 1) {
							if (this.requestGoodsSkuId == undefined || this.requestGoodsSkuId == '') {
								return uni.$alert.showToast('请选择商品规格');
							}
						} else {
							return uni.$alert.showToast('库存不足');
						}
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},

			/**
			 * 加入购物车
			 * 1.实物商品
			 * 2.虚拟商品
			 */
			addCarGoods(e) {
				if (uni.$localStorage.getItem('Token')) {
					// 判断是否选择了规格
					if (this.selectGoddsspec.indexOf('x') < 0 && !this.showSpec) {
						this.selectGoodSpec();
						return;
					}

					if (this.goodsToolData.goodsType == 1 && this.goodsSpecs.list.length < this.goodsSpecs.data.length) {
						return uni.$alert.showToast('请选择商品规格');
					}

					var param = {
						orgId: this.goodsToolData.orgId,
						goodsId: this.goodsToolData.id,
						goodsNum: this.requestParam.goodsNum || 1
					};
					// 这里开始区分是 实物还是虚拟物品

					if (this.goodsToolData.goodsType == 1) {
						if (this.requestGoodsSkuId == undefined || this.requestGoodsSkuId == '') {
							return uni.$alert.showToast('请选择商品规格');
						}
					} else {
						param.goodsSkuId = this.goodsToolData.skuRespList[0].id;
					}

					this.goodsToolData.skuRespList.forEach(item => {
						if (item.skuId == this.requestGoodsSkuId) {
							param.goodsSkuId = item.id;
						}
					});
					uni.$util.currentClockin() // 点亮
					uni.$api.apiRequest('carGoodsNum', param).then(res => {
						if (res.code == 10000) {
							// 埋点
							uni.$sampling.sampling('ADD_SHOPCART', this.goodsToolData.id, this.route, this.requestParam.goodsNum);
							this.getCartNumbers(true);
							this.onCloseSpec();
						}
					});
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},

			/**
			 * 选择规格 事件
			 */
			selectGoodSpec() {
				if (this.selectGoddsspec == '选择兑换规格数量') {
					let param = {};
					param.goodsNum = 1;
					this.setData({
						requestParam: param,
						showSpec: true
					});
				} else {
					this.setData({
						showSpec: true
					});
				}
			},

			/**
			 * 禁止点击
			 * */
			forbidClick() {
				if (this.currentStatus == 1) {
					uni.$alert.showToast(this.status[1].message);
				} else if (this.currentStatus == 2) {
					uni.$alert.showToast(this.status[2].message);
				} else if (this.currentStatus == 3) {
					uni.$alert.showToast('该商品为' + this.exchangeAbleGradeScopes + '独享');
				}
			},

			/**
			 * 隐藏 选择规格
			 */
			onCloseSpec() {
				this.setData({
					showSpec: false
				});
			},

			/**
			 * 获取商品规格
			 */
			getGoodsSpec: function(specContentIds = [], val) {
				if (!val.skuRespList) return; // 组装 skuIds

				var arr = [];
				val.skuRespList.forEach(item => {
					arr.push(item.skuId);
				});
				uni.$api.apiRequest('getGoodsSpec', {
					specDataList: specContentIds,
					spuId: val.goodsIdentify,
					skuIds: arr,
					data: [],
					sets: []
				}).then(res => {
					if (res.code == 10000) {
						var defaultList = [];
						var selectGoddsspec = '请选择';
						res.data.data.forEach((gg, idx) => {
							selectGoddsspec += gg.specName + (idx == res.data.data.length - 1 ? '' : '、');
							gg.specContents = gg.specContents.map((item, index) => {
								var select = false;

								if (specContentIds.length > 0) {
									specContentIds.forEach(el => {
										if (el.specContentId == item.specContentId) {
											select = true;
											defaultList.push({ ...item,
												index: idx
											});
										}
									});
								}

								return { ...item,
									select: select
								};
							});
						});
						res.data.list = defaultList;
						this.setData({
							selectGoddsspec: selectGoddsspec,
							goodsSpecs: res.data
						});
						uni.$eventEmitter.trigger('changeSelectGoddsspec', selectGoddsspec); // 当规格选择完毕的时候进行 匹配规格信息
						if (defaultList.length == res.data.data.length) {
							this.getGoodsSkuId();
						}
					}
				});
			},

			/**
			 * speceClick 点击了规格
			 * 每一次点击规格都回去重新请求 规格总数据接口用来获取当前可用的规格信息
			 * */
			speceClick(spec, idx, id) {

				// 拦截掉 禁用的点击
				if (!spec.isPut) {
					return;
				}

				var self = this;
				// 如果点击的是同一行的规格，则替换
				var isSame = -1;
				var isSameEl = false;

				if (self.goodsSpecs.list.length > 0) {
					self.goodsSpecs.list.forEach((item, index) => {
						if (item.index == idx) {
							isSame = index;

							if (item.specContentId == spec.specContentId) {
								isSameEl = true;
								isSame = index;
							}
						}
					});
				}
				// 如果点击的是同一个按钮则取消选择
				var arr = self.goodsSpecs.data[idx].specContents;
				if (isSameEl) {
					self.goodsSpecs.list.splice(isSame, 1);
					arr.forEach(item => {
						if (id == item.specContentId) {
							item.select = false;
						}
					});
					self.goodsSpecs.data[idx].specContents = arr;
					// 取消所有的 规格选择，则恢复显示
					if (self.goodsSpecs.list.length < this.goodsSpecs.data.length) {
						self.goodsToolData.availableNum = undefined;
						self.setData({
							selectGoddsspec: '选择兑换规格数量',
							goodsToolData: self.goodsToolData
						});
						uni.$eventEmitter.trigger('changeSelectGoddsspec', '选择兑换规格数量');
					}

					self.setData({
						goodsSpecs: self.goodsSpecs
					});
					// 取出标记的规格 进行请求
					var specContentIds = [];
					self.goodsSpecs.list.forEach(item => {
						specContentIds.push({
							specId: self.goodsSpecs.data[item.index].specId,
							specContentId: item.specContentId
						});
					});
					self.selectSpecItemStyle(specContentIds);
					return;
				}
				// 点击的是其他规格 则添加
				if (arr && arr.length > 0) {
					arr.forEach(item => {
						if (id == item.specContentId) {
							item.select = true;

							if (isSame != -1) {
								self.goodsSpecs.list[isSame] = { ...item,
									index: idx
								};
							} else {
								self.goodsSpecs.list.splice(idx, 0, { ...item,
									index: idx
								});
							}
						} else {
							item.select = false;
						}
					});
				}

				self.goodsSpecs.data[idx].specContents = arr; // 取出标记的规格 进行请求

				var specContentIds = [];
				self.goodsSpecs.list.forEach(item => {
					specContentIds.push({
						specId: self.goodsSpecs.data[item.index].specId,
						specContentId: item.specContentId
					});
				}); // 下一步

				self.selectSpecItemStyle(specContentIds);
			},

			/**
			 * 选中规格高亮
			 * */
			selectSpecItemStyle(specContentIds) {
				var defaultList = [];
				this.goodsSpecs.data.forEach((gg, idx) => {
					gg.specContents = gg.specContents.map((item, index) => {
						var select = false;

						if (specContentIds.length > 0) {
							specContentIds.forEach(el => {
								if (el.specContentId == item.specContentId) {
									select = true;
									defaultList.push({ ...item,
										index: idx
									});
								}
							});
						}

						return { ...item,
							select: select
						};
					});
				});
				this.goodsSpecs.list = defaultList;
				this.setData({
					goodsSpecs: this.goodsSpecs
				}); // 当规格选择完毕的时候进行 匹配规格信息

				if (defaultList.length == this.goodsSpecs.data.length) {
					this.getGoodsSkuId();
				}
			},

			/**
			 * 先获取组合的id
			 * 在匹配 当前规格的 库存，价格，信息
			 * */
			getGoodsSkuId() {
				var self = this;
				var specContentIds = '';
				this.goodsSpecs.list.forEach(item => {
					specContentIds += item.specContentId + ',';
				});
				specContentIds = specContentIds.substring(0, specContentIds.length - 1);
				uni.$api.apiRequest('getGoodsSkuId', {
					spuId: self.goodsToolData.goodsIdentify,
					specContentIds: specContentIds
				}).then(res => {
					// console.log(res)
					if (res.code == 10000) {
						var currentSpec = {};
						self.goodsToolData.skuRespList.forEach(item => {
							if (self.goodsToolData.goodsType == 2 || self.goodsToolData.goodsType == 3) {
								// 虚拟商品只有一个规格
								currentSpec = item;
							} else {
								if (item.skuId == res.data) {
									currentSpec = item;
								}
							}
						});
						
						if (currentSpec.price) {
							self.setData({
								currentStatus: 0
							}); // 库存

							self.goodsToolData.remainNum = currentSpec.stock;
							self.goodsToolData.availableNum = currentSpec.availableNum; // 规格组合

							let s;

							if (self.goodsDetailData.goodsType == 1) {
								s = currentSpec.goodsSkuSpec || '';
							} else {
								s = self.goodsDetailData.goodsName;
								if (self.goodsDetailData.goodsType == 3) {
									self.setData({
										ffhySpecName: currentSpec.goodsSkuSpec
									})
								}
							}

							self.setData({
								selectGoddsspec: '已选：' + s + ' x ' + (self.requestParam.goodsNum || 1)
							});
							uni.$eventEmitter.trigger('changeSelectGoddsspec', self.selectGoddsspec); // 价格

							self.goodsToolData.priceMoney = currentSpec.price;
							self.goodsToolData.guidancePrice = currentSpec.guidancePrice; // 商品状态

							self.goodsToolData.buyStatus = currentSpec.buyStatus;
							self.changeBuyStatus(self.goodsToolData);
							self.setData({
								goodsToolData: self.goodsToolData,
								requestGoodsSkuId: res.data
							});
						} else {
							// 库存
							self.goodsToolData.remainNum = undefined;
							self.goodsToolData.availableNum = undefined; // 价格

							self.goodsToolData.priceMoney = undefined;
							self.goodsToolData.guidancePrice = undefined;
							self.setData({
								selectGoddsspec: '选择兑换规格数量',
								goodsToolData: self.goodsToolData,
								currentStatus: 5
							});
							uni.$eventEmitter.trigger('changeSelectGoddsspec', '选择兑换规格数量');
						}
					} else {
						uni.navigateBack({
							success: res => {
								uni.$alert.showToast('商品规格数据异常，请重试');
							}
						});
					}
				});
			},

			/**
			 * 改变那商品状态
			 * */
			changeBuyStatus(data) {
				// 商品状态
				if (data.buyStatus == 3) {
					this.setData({
						currentStatus: 1
					});
				} else {
					// 设置上限
					if (data.userLimit) {
						if (data.userLimit > data.remainNum) {
							this.goodsNumberLimit = data.remainNum;
						} else {
							this.goodsNumberLimit = data.userLimit;
						}
					} else {
						this.goodsNumberLimit = data.availableNum;
					}

					this.setData({
						goodsNumberLimit: this.goodsNumberLimit
					});
				} // 是否已达兑换上限


				if (data.userLimit) {
					let userExchangedNum = data.userExchangedNum ? data.userExchangedNum : 0;

					if (userExchangedNum == data.userLimit) {
						this.setData({
							currentStatus: 2
						});
					}
				}

				if (data.buyStatus == 2) {
					this.setData({
						currentStatus: 4
					});
				}
			},

			/**
			 * 选择数量
			 * */
			vanStepperonChange(e) {
				this.requestParam['goodsNum'] = e.value;
				this.ggGoodsNum = e.value;
				console.log(this.requestParam)
			}

		}
	};
</script>
<style lang="less">
	@import "./goodsTool.css";

	.bottomBtnView {
		display: flex;
		align-items: center;

		.bottomBtn {
			width: 200rpx;
			height: 80rpx;
			border-radius: 8rpx;
			text-align: center;
			line-height: 80rpx;
			margin-left: 20rpx;
		}
	}
</style>
