<template>
	<view>
		<navBar title="申请退款" background="#fff" back="true"></navBar>
		<view class="view">
			<!-- 是否退货 -->
			<view class="returnsView" v-if="!chargebackType || isShowGoodsStatus">
				<view class="returnsView-title">您是否已收到货物？</view>
				<view class="returnsView-tool">
					<view :class="isReceipt?'returnsView-btn returnsView-btn-select':'returnsView-btn'" @tap.stop="receipt" data-type="0">
						<image v-if="isReceipt" class="returnsView-btn-img" src="/static/images/order/Check.png"></image>已收货
					</view>
					<view :class="!isReceipt?'returnsView-btn returnsView-btn-select':'returnsView-btn'" @tap.stop="receipt" data-type="1">
						<image v-if="!isReceipt" class="returnsView-btn-img" src="/static/images/order/Check.png"></image>未收货
					</view>
				</view>
			</view>
			<!-- 退款商品 -->
			<view class="refundGoods">
				<view class="refundGoods-header flex-row">
					<image style="width: 44rpx;height: 44rpx;margin-right:3px;" :src="refundInfo.shopLogolUrl" mode=""></image>
					<view style="font-size: 28rpx;font-weight: 500;color: #000000;margin-right:3px;">{{refundInfo.orgName}}</view>
					<image style="width: 8px;height: 13px;" src="../../../static/images/jtr.png" mode=""></image>
				</view>
				<view class="refundGoods-item">
					<view class="refundGoods-item-l">
						<image mode="aspectFit" class="refundGoods-item-img" :src="refundInfo.goodsImg"></image>
						<view class="refundGoods-item-info">
							<view class="refundGoods-item-title">{{refundInfo.goodsName}}</view>
							<view style="font-size: 22rpx;font-weight: 400;color: #808794;margin-bottom: 10rpx;">规格：{{refundInfo.gooodsSpec}}</view>
							<view class="refundGoods-item-value" style="margin-bottom: 18rpx;">{{func.handlePrice(refundInfo.goodsPrice, refundInfo.singleProductScore, ponitName)}}</view>
						</view>
					</view>
					<view class="refundGoods-item-r">
						<view class="refundGoods-item-desc">× {{refundInfo.goodsNum}}</view>
					</view>
				</view>
			</view>
			<!-- 申请退款 -->
			<view class="requestRefund">
				<view class="refundGoods-header">申请退款</view>
				<!-- 退款原因 -->
				<view class="requestRefund-item" @tap.stop="selectRequestRefund" v-if="reasonReturnList.length>0">
					<view class="requestRefund-item-title">
						<span class="xh">*</span>退款原因</view>
					<view class="requestRefund-item-r">
						<view class="requestRefund-item-r-title" :style="reasonReturn?'color:#000000;':''">{{reasonReturn?reasonReturn:'请选择原因'}}</view>
						<image style="width:15px;height:15px;margin-left:10rpx;" src="/static/images/order/more-icon.png"></image>
					</view>
				</view>
				<!-- 商品退款 -->
				<view class="requestRefund-item" :style="(refundInfo.expressType == 1 && !isPointGoods)?'':'border:none;'">
					<view class="requestRefund-item-title">
						<span class="xh">*</span>{{isPointGoods?'退还':'商品退款'}}
					</view>
					<!-- 纯积分 -->
					<view v-if="!refundInfo.maxRefundGoodsAmt">
						<view style="font-size: 28rpx;font-weight: 400;color: #D4D4D4;">{{refundInfo.goodsScore}}{{ponitName}}</view>
					</view>
					<!-- 现金 + 积分（积分不展示） -->
					<view class="requestRefund-item-r" v-else>
						<view v-if="refundInfo.expressType == 2">
							<view>{{refundInfo.maxRefundGoodsAmt}}</view>
						</view>
						<input v-else :value="productRefund" style="text-align: right;width: 460rpx;" @focus="bindfocus" @blur="bindblur"
						 data-type="0"></input>
					</view>
				</view>
				<!-- 建议 -->
				<view class="suggestView" v-if="!isPointGoods">建议最大可退¥{{refundInfo.maxRefundGoodsAmt}}</view>
				<!-- 运费退款 到店自提商品没有运费退款 -->
				<view class="requestRefund-item" v-if="refundInfo.expressType == 1 && !isPointGoods">
					<view class="requestRefund-item-title">
						<span class="xh">*</span>运费退款</view>
					<view class="requestRefund-item-r">
						<input :value="freightRefund" style="text-align: right;width: 460rpx;" @focus="bindfocus" @blur="bindblur"
						 data-type="1"></input>
					</view>
				</view>
				<!-- 建议 -->
				<view class="suggestView" v-if="refundInfo.expressType == 1 && !isPointGoods">最多可退¥{{refundInfo.maxRefundExpressFee}}</view>
				<!-- 退款描述 -->
				<view v-if="!showTextarea" class="textareaTextView" @tap.stop="clickTextarea">
					<view class="textareaTextView-text" v-if="refundDescription.length<=0">请填写退款描述（限200字）</view>
					<view v-else>{{refundDescription}}</view>
				</view>
				<textarea v-else class="textareaView" :value="refundDescription" :focus="showTextarea" maxlength="200" placeholder="请填写退款描述（限200字）"
				 placeholder-class="refundDescription" @blur="bindblur" data-type="2"></textarea>
			</view>
			<!-- 上传凭证 -->
			<view class="certificate">
				<view class="refundGoods-header">上传凭证</view>
				<view class="certificateList">
					<u-upload width="110" height="110" del-bg-color="#5E5E5E" del-color="#EAE6E1" :show-progress="false" :action="action"
					 :file-list="editFileList" :max-size="24 * 1024 * 1024" max-count="6" :custom-btn="true" @on-success="uploadSuccess"
					 @on-remove="removeSuccess">
						<view slot="addBtn">
							<image class="certificate-item" src="/static/images/order/add.png"></image>
						</view>
					</u-upload>
				</view>
				<!-- 建议 -->
				<view class="suggestView" style="text-align: inherit;">最多六张，支持JPG、JGEG、PNG格式</view>
			</view>
			<!-- 底部悬浮框 -->
			<cover-view class="btnView" v-if="!show">
				<cover-view class="btnView-Title" :style="theme.btn" @tap.stop="commitRequest">提交</cover-view>
			</cover-view>
		</view>
			<!-- 选择框 -->
			<u-select v-model="show" mode="single-column" :list="reasonReturnList" @confirm="confirmonPop" @cancel="cancelonPop"></u-select>
		<!-- 提示信息弹框 -->
		<alertView v-if="alertShow" title="提示" content="" :showCancel="true">
			<view class="contentView" slot="contentView">
				<view class="contentView-text0">退款金额以实际到账金额为准</view>
				<view class="contentView-text1">退款成功时，若用户当前账户积分值小于退款商品在原订单中发放的积分值，则将按照当前积分的货币价值从退款金额中扣减.</view>
			</view>
		</alertView>
		<!-- <alertView wx:if="{{alertShow}}" title="提示" catch:alertShow="alertShow">
			<view class="contentView" slot="contentView">
				<view class="contentView-text0">退款金额以实际到账金额为准</view>
				<view class="contentView-text1">退款成功时，若用户当前账户积分值小于退款商品在原订单中发放的积分值，则将按照当前积分的货币价值从退款金额中扣减.</view>
			</view>
		</alertView> -->
	</view>
</template>
<script module="func" lang="wxs" src="../../../utils/utilFunc.wxs"></script>

<script>
	const app = getApp();
	import alertView from "../../../pageComponents/alertView/alertView.vue";
	export default {
		components: {
			alertView
		},

		data() {
			return {
				ponitName: app.globalData.pointName,
				isPointGoods: false,
				shopUrl: '',
				ponitName: app.globalData.pointName,
				action: uni.$api.getApiHost() + '/file-server/api/resources/files/upload',
				// 订单状态
				orderStatus: '',
				// true: 仅退款   false: 退款退货
				chargebackType: false,
				isShowGoodsStatus: false,
				// 您是否已收到货物？
				isReceipt: true,
				// 退款原因
				reasonReturn_temp: '',
				reasonReturn: '',
				reasonReturnList: [],
				// 商品退款
				productRefund: 0,
				// 运费退款
				freightRefund: '',
				// 退款描述
				refundDescription: "",
				// 仅退款
				reasonReturn_tk: [{
					orderStatu: '1',
					productStatus: false,
					list: ['多拍、错拍、不想要', '协商一致退款', '商家缺货', '发货慢', '未按承诺时间发货', '其他']
				}, {
					orderStatu: '2',
					productStatus: false,
					list: ['多拍、错拍、不想要', '未按承诺时间发货', '快递无跟踪记录', '商家缺货', '其他']
				}, {
					orderStatu: '3',
					productStatus: false,
					list: ['多拍、错拍、不想要', '未按承诺时间发货', '快递无跟踪记录', '商家缺货', '其他']
				}, {
					orderStatu: '2',
					productStatus: true,
					list: ['多拍、错拍、不想要', '不喜欢、效果不好', '商品成分描述不好', '大小尺寸与商品描述不符', '颜色、款式、包装与描述不符', '收到商品少件、破损或污渍', '空包裹', '商家发错货', '其他']
				}, {
					orderStatu: '4',
					productStatus: true,
					list: ['不喜欢、效果不好', '材质问题', '功能性问题', '做工瑕疵', '颜色、款式、包装与描述不符', '质量问题', '货物与描述不符', '收到商品少件、破损或污渍', '商家发错货', '假冒品牌',
						'空包裹', '其他'
					]
				}],
				// 退货退款
				reasonReturn_thtk: [{
					orderStatu: '1',
					productStatus: true,
					list: ['多拍、错拍、不想要', '不喜欢、效果不好', '商品成分描述不符', '大小尺寸与商品描述不符', '颜色、款式、包装与描述不符', '收到商品少件、破损或污渍', '商家发错货', '其他']
				}, {
					orderStatu: '4',
					productStatus: true,
					list: ['多拍、错拍、不想要', '不喜欢、效果不好', '商品成分描述不符', '大小尺寸与商品描述不符', '颜色、款式、包装与描述不符', '收到商品少件、破损或污渍', '商家发错货', '其他']
				}, {
					orderStatu: '2',
					productStatus: true,
					list: ['多拍、错拍、不想要', '不喜欢、效果不好', '商品成分描述不符', '大小尺寸与商品描述不符', '颜色、款式、包装与描述不符', '收到商品少件、破损或污渍', '商家发错货', '其他']
				}, {
					orderStatu: '3',
					productStatus: true,
					list: ['多拍、错拍、不想要', '不喜欢、效果不好', '商品成分描述不符', '大小尺寸与商品描述不符', '颜色、款式、包装与描述不符', '收到商品少件、破损或污渍', '商家发错货', '其他']
				}],
				show: false,
				// 退款 图片凭证
				editFileList: [],
				uploadFileList: [],
				// 参数传递
				options: {},
				// 退单信息
				refundInfo: {},
				// 提示信息
				alertShow: false,
				showTextarea: false
			};
		},



		/**
		 * 生命周期函数--监听页面加载
		 * 当退款类型是仅退款，订单是待收货，需要让用户选择货物状态
		 * 当商品交易成功时，默认已提货
		 */
		onLoad: function(options) {
			/**
			 * UI显示逻辑
			 * 1.从选择 仅退款、退货退款页面过来
			 * 2.从退单详情过来
			 * */
			//  情况一
			if (options.chargebackType) {
				options.order = JSON.parse(options.order);

				if (options.chargebackType == '1' && options.order.status == '2') {
					this.setData({
						isShowGoodsStatus: true
					});
				}

				this.setData({
					orderStatus: options.order.status,
					options: options,
					chargebackType: Number(options.chargebackType) ? true : false
				}); // 配置退款原因

				if (options.order.status != undefined) {
					this.configRequestRefund();
				}
			} // 情况二 需要去请求
			// http://192.168.1.156:8899/api/refund/cserver/queryRefundInfo?orderId=1&orgId=11&goodsSkuId=S001
			// 情况三 自提商品 无需选择是否收到货（2020-05-14-高枕）


			if (options.order && options.order.type == 2) {
				this.setData({
					isShowGoodsStatus: false,
					chargebackType: true
				});
			} // 开始获取数据


			this.getReturnsRequestInfo();
		},
		methods: {
			uploadSuccess(data, index, lists, name) {
				// console.log('_______uploadSuccess______-data', data)
				// console.log('_______uploadSuccess______index', index)
				// console.log('______uploadSuccess_______lists', lists)
				// console.log('______uploadSuccess_______name', name)
				this.uploadFileList = lists;

			},
			removeSuccess(index, lists, name) {
				// console.log('______removeSuccess_______index', index)
				// console.log('______removeSuccess_______lists', lists)
				// console.log('_____removeSuccess________name', name)
				this.uploadFileList = lists;
			},
			/**
			 * 获取退单申请信息
			 */
			getReturnsRequestInfo() {
				uni.$api.apiRequest('getReturnsRequestInfo', {
					orderId: this.options.order.id,
					orgId: this.options.order.orderOrgId || app.globalData.userOrgId || uni.$localStorage.getItem('userOrgId'),
					goodsSkuId: this.options.order.goodsSkuId
				}).then(res => {
					console.log(res);

					if (res.code == 10000) {
						var urls = [];

						if (res.data.imgList && res.data.imgList.length > 0) {
							res.data.imgList.forEach((item, index) => {
								if(item instanceof Object){
									urls.push({
									fileName: index + 'myPhoto.png',
									url: item
								});
								}
							});
						}

						// 自提订单退款金额不可修改
						let productRefundStr = 0
						if(res.data.expressType == 2){
							productRefundStr = res.data.maxRefundGoodsAmt
						}
						if(res.data.maxRefundGoodsAmt == 0){
							this.isPointGoods = res.data.maxRefundGoodsAmt == 0; // 是不是纯积分商品

						}
						

						this.setData({
							orderStatus: res.data.orderStatus,
							productRefund: productRefundStr?productRefundStr:(res.data.refundGoodsAmt || ''),
							freightRefund: res.data.refundExpressFee || '',
							editFileList: urls.length > 0 ? urls : [],
							reasonReturn: res.data.refundReason || '',
							refundDescription: res.data.refundDes || '',
							isReceipt: res.data.orderStatus == 4 ? true : res.data.productStatus == 1 ? true : false,
							// 交易完成 那么久默认已收货
							refundInfo: res.data
						});

						

						if (res.data.refundType != undefined) {
							this.setData({
								chargebackType: res.data.refundType == 1 ? true : false
							}); // 配置 退款原因

							this.configRequestRefund();
						} // 情况三 自提商品 无需选择是否收到货（2020-05-14-高枕）


						if (res.data.expressType == 2) {
							this.setData({
								isShowGoodsStatus: false,
								chargebackType: true
							});
						}
					}
				});
			},

			/**
			 * 您是否已收到货物？
			 */
			receipt: function(e) {
				console.log(e.currentTarget.dataset.type);
				this.setData({
					isReceipt: e.currentTarget.dataset.type == "0" ? true : false
				});
			},

			/**
			 * 展示 退款原因弹框
			 */
			configRequestRefund() {
				var arr = [];

				if (this.chargebackType) {
					this.reasonReturn_tk.forEach(item => {
						if (item.orderStatu == this.orderStatus) {
							arr = item.list;
						}
					});
				} else {
					this.reasonReturn_thtk.forEach(item => {
						if (item.orderStatu == this.orderStatus) {
							arr = item.list;
						}
					});
				}
				
				this.reasonReturnList = arr.map(item => {
					return {
						value: 0,
						label: item
					}
				})

			},

			selectRequestRefund: function() {
				this.setData({
					show: true
				});
			},
			// 退款原因
			confirmonPop: function(val) {
				console.log(val);
				this.reasonReturn = val[0].label
			},
			cancelonPop(val){
				console.log(val)
			},

		
			/**
			 * 解决 Textarea 层级太高问题
			 * 当需要获取焦点是 显示Textarea 否则隐藏clickTextarea，显示TextareaView
			 * */
			clickTextarea(e) {
				console.log(e);
				this.setData({
					showTextarea: true
				});
			},

			/**
			 * 焦点消失 输入框 事件
			 * type:  0 商品退款  1 运费退款 2 描述
			 * 判断一下啊是否大于最大值
			 * */
			bindblur(e) {
				console.log(e.currentTarget.dataset.type);

				if (e.currentTarget.dataset.type == '0') {
					var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;

					if (!reg.test(e.detail.value)) {
						this.setData({
							productRefund: ''
						});
						return uni.$alert.showToast("请输入正确的退款价格");
					}

					if (Number(e.detail.value) > this.refundInfo.maxRefundGoodsAmt) {
						this.setData({
							productRefund: ''
						});
						uni.$alert.showToast('退款金额最大为' + this.refundInfo.maxRefundGoodsAmt);
					} else {
						this.setData({
							productRefund: e.detail.value
						});
					}
				} else if (e.currentTarget.dataset.type == '1') {
					var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;

					if (!reg.test(e.detail.value)) {
						this.setData({
							productRefund: ''
						});
						return uni.$alert.showToast("请输入正确的退款价格");
					}

					if (Number(e.detail.value) > this.refundInfo.maxRefundExpressFee) {
						this.setData({
							freightRefund: ''
						});
						uni.$alert.showToast('运费退款最大为' + this.refundInfo.maxRefundExpressFee);
					} else {
						this.setData({
							freightRefund: e.detail.value
						});
					}
				} else {
					this.setData({
						showTextarea: false,
						refundDescription: e.detail.value
					});
				}
			},

			bindfocus(e) {
				if (e.currentTarget.dataset.type == '0') {
					this.setData({
						productRefund: ''
					});
				} else if (e.currentTarget.dataset.type == '1') {
					this.setData({
						freightRefund: ''
					});
				}
			},

			/**
			 * 提交申请
			 */
			commitRequest: function() {
				if (!this.reasonReturn) {
					return uni.$alert.showToast('请选择退款原因');
				} else if (!this.productRefund && !this.isPointGoods) {
					return uni.$alert.showToast('请输入退款金额');
				} else if (!this.freightRefund && this.refundInfo.expressType == 1 && !this.isPointGoods) {
					return uni.$alert.showToast('请输入运费退款');
				}
				
				var fileUrls = [];
				this.uploadFileList.forEach(res => {
					fileUrls.push(res.response.data);
				});
				fileUrls = fileUrls.concat(this.editFileList)
				
				uni.$api.apiRequest('returnsRequest', {
					refundOrderId: this.refundInfo.refundOrderId,
					orderId: this.options.order.id,
					orgId: this.options.order.orderOrgId || app.globalData.userOrgId || uni.$localStorage.getItem('userOrgId'),
					memberId: uni.$localStorage.getItem('memberId'),
					refundReason: this.reasonReturn,
					expressRefundFee: this.freightRefund,
					goodsRefundAmt: this.productRefund || 0,
					refundDesc: this.refundDescription,
					goodsSkuId: this.options.order.goodsSkuId,
					productStatus: this.refundInfo.expressType == 2 ? 1 : this.isReceipt ? 1 : 0,
					// 判断是不是自提商品
					refundType: this.chargebackType ? 1 : 2,
					imgList: fileUrls,
					refundProductPayScore: this.refundInfo.goodsScore // 【2020-11-11 添加】退订商品购买所需积分
				}).then(res => {
					if (res.code == 10000) {
						uni.$alert.showToast(this.refundInfo.refundOrderId ? '修改成功' : '申请成功');
						setTimeout(() => {
							uni.switchTab({
							url: '/pages/my/myPage'
						});	
						}, 1000);
						
					}
				});
			},

			/**
			 * 是否显示提示
			 * */
			alertShowFun(show) {
				this.setData({
					alertShow: show ? show.detail : true
				});
			}

		}
	};
</script>
<style>
	@import "./chargebackApplication.css";
</style>
