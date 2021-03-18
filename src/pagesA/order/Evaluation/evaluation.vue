<template>
	<view>
		<navBar title="评价" background="#fff" back="true"></navBar>
		<view class="view">
			<!-- 评价item -->
			<view v-for="(item, index) in evaluationData.waitCommentGoodsList" :key="index" class="evaluationView">
				<!-- 商品 -->
				<view class="goods">
					<image class="goods-img" mode="aspectFit" :src="item.goodsImg"></image>
					<view class="goodsInfo">
						<view class="goodsInfo-title oneLine">{{item.goodsName}}</view>
						<view class="goodsInfo-desc oneLine">规格：{{item.goodsSpec}}</view>
					</view>
				</view>
				<!-- 描述相符 -->
				<view class="description">
					<!-- 分割线 -->
					<van-divider contentPosition="center" style="width: 66vw;height: 92rpx;">描述相符</van-divider>
					<van-rate :value="item.descriptionServiceScore" void-color="#EAEAEA" void-icon="star" :data-index="index" @change="xxClick"></van-rate>
					<view class="description-text" v-if="item.descriptionServiceScore > 0">{{pjDesclist[item.descriptionServiceScore - 1]}}</view>
				</view>
				<!-- 买家建议 -->
				<labelArea maxlength="500" placeholder="亲爱的买家，你对这个商品满意吗？你的评价会帮助我们改进商品与服务哦~" @bindblur="changeSuggest"
				 :data-index="index"></labelArea>
				<!-- 上传凭证 -->
				<view class="certificate">
					<view class="certificateList">
						<van-uploader :file-list="item.commentImageList" preview-size="75" max-count="5" :disabled="item.commentImageList.legth == 5"
						 multiple="true" :data-index="index" @after-read="afterRead" @delete="afterDelete">
							<image class="certificate-item" src="/static/images/order/uploadpic.png"></image>
						</van-uploader>
					</view>
					<!-- 是否匿名 -->
					<view class="anonymousView" @tap.stop="clickAnonymous" :data-index="index">
						<view class="anonymous" v-if="item.secretMemberFlag == 0"></view>
						<image class="anonymous" v-else src="/static/images/order/icon_Choice.png" style="border-radius: initial;border: initial;"></image>
						<view class="anonymous-text">匿名</view>
					</view>
				</view>
			</view>
			<!-- 物流、上架、评价 -->
			<view class="bottomPjView">
				<!-- 物流服务 -->
				<view class="description">
					<van-divider contentPosition="center" style="width: 66vw;height: 92rpx;">物流服务</van-divider>
					<van-rate :value="expressServiceScore" void-color="#EAEAEA" void-icon="star" data-type="0" @change="score"></van-rate>
					<view class="description-text">{{pjDesclist[expressServiceScore]}}</view>
				</view>
				<!-- 商家服务 -->
				<view class="description">
					<van-divider contentPosition="center" style="width: 66vw;height: 92rpx;">商家服务</van-divider>
					<van-rate :value="merchantServiceScore" void-color="#EAEAEA" void-icon="star" data-type="1" @change="score"></van-rate>
					<view class="description-text">{{pjDesclist[merchantServiceScore]}}</view>
				</view>
			</view>
			<!-- 底部悬浮框 -->
			<cover-view class="btnView">
				<cover-view class="btnView-Title" :style="theme.btn" @tap.stop="commitRequest">发布</cover-view>
			</cover-view>
		</view>
	</view>
</template>

<script>
	import vanDivider from "./@vant/weapp/divider/index";
	import vanRate from "./@vant/weapp/rate/index";
	import labelArea from "pageComponents/textarea/textareaAndLabel";
	import vanUploader from "./@vant/weapp/uploader/index";
	import vanField from "./@vant/weapp/field/index";

	export default {
		data() {
			return {
				theme: uni.$theme,
				// 是否匿名
				isAnonymous: false,
				// 评价
				pjDesclist: ['非常不满意，各方面都很差', '不满意，比较差', '一般，仍可改善', '比较满意，仍可改善', '非常满意，无可挑剔'],
				// 商家服务
				merchantServiceScore: 0,
				// 物流服务
				expressServiceScore: 0,
				// 评价信息
				evaluationData: {},
				options: ""
			};
		},

		components: {
			vanDivider,
			vanRate,
			labelArea,
			vanUploader,
			vanField
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options && options.orderId) {
				this.setData({
					options: options
				});
				this.getOrderEvaluationData(options.orderId);
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},
		methods: {
			/**
			 * 获取 订单评价信息
			 */
			getOrderEvaluationData: function(orderId) {
				uni.$api.apiRequest('getOrderEvaluationData',{
					memberId: uni.$localStorage.getItem('memberId'),
					orderId: orderId
				}).then(res => {
					console.log(res);

					if (res.code == 10000 && res.data) {
						res.data.waitCommentGoodsList = res.data.waitCommentGoodsList.map(item => {
							return { ...item,
								descriptionServiceScore: 0,
								secretMemberFlag: 0,
								commentText: '',
								commentImageList: []
							};
						});
						this.setData({
							evaluationData: res.data
						});
					} else {
						setTimeout(() => {
							uni.navigateBack();
						}, 2200);
					}
				});
			},

			/**
			 * 星星点击事件
			 */
			xxClick(e) {
				console.log(e.currentTarget.dataset.index);
				this.evaluationData.waitCommentGoodsList[e.currentTarget.dataset.index].descriptionServiceScore = e.detail;
				this.setData({
					evaluationData: this.evaluationData
				});
			},

			score(e) {
				if (e.currentTarget.dataset.type == 0) {
					this.setData({
						expressServiceScore: e.detail
					});
				} else {
					this.setData({
						merchantServiceScore: e.detail
					});
				}
			},

			/**
			 * 买家建议
			 */
			changeSuggest: function(e) {
				console.log(e.currentTarget.dataset.index);
				this.evaluationData.waitCommentGoodsList[e.currentTarget.dataset.index].commentText = e.detail;
				this.setData({
					evaluationData: this.evaluationData
				});
			},

			/**
			 * 是否匿名
			 */
			clickAnonymous: function(e) {
				let current = this.evaluationData.waitCommentGoodsList[e.currentTarget.dataset.index].secretMemberFlag;
				this.evaluationData.waitCommentGoodsList[e.currentTarget.dataset.index].secretMemberFlag = current == 0 ? 1 : 0;
				this.setData({
					evaluationData: this.evaluationData
				});
			},

			/**
			 * 上传图片事件
			 * */
			afterRead(event) {
				const {
					file
				} = event.detail;
				console.log(file);

				if (!file.length) {
					uni.showToast({
						title: '请选择图片',
						icon: 'none'
					});
				} else {
					var t = new Date().getTime();
					file.forEach((item, index) => this.uploadFilePromise(`myPhoto${t}${index}.png`, item.path, event.currentTarget.dataset
						.index));
				}
			},

			uploadFilePromise(fileName, chooseResult, idx) {
				var self = this;
				uni.uploadFile({
					url: uni.$api.getApiHost() + '/file-server/api/resources/files/upload',
					// 仅为示例，非真实的接口地址
					filePath: chooseResult,
					name: 'file',
					formData: {
						photoName: fileName
					},

					success(res) {
						const {
							code,
							data
						} = JSON.parse(res.data);

						if (code == 10000) {
							self.evaluationData.waitCommentGoodsList[idx].commentImageList.push({
								fileName,
								url: data
							});
							self.setData({
								evaluationData: self.evaluationData
							});
						} else {
							uni.$alert.showToast('图片上传失败');
						}
					}

				});
			},

			// 删除照片
			afterDelete(event) {
				this.evaluationData.waitCommentGoodsList[event.currentTarget.dataset.index].commentImageList.remove(event.detail.index);
				this.setData({
					evaluationData: this.evaluationData
				});
			},

			/**
			 * 提交评价
			 * commitRequest
			 * */
			commitRequest() {
				// 校验是否有评分
				if (this.merchantServiceScore <= 0) {
					return uni.$alert.showToast('您还未完成星级评价哦');
				} else if (this.expressServiceScore <= 0) {
					return uni.$alert.showToast('您还未完成星级评价哦');
				}

				var isComment = true;
				var self = this;
				var arr = this.evaluationData.waitCommentGoodsList.map(item => {
					if (item.descriptionServiceScore <= 0) {
						isComment = false;
					}

					let urls = item.commentImageList.map(res => {
						return res.url;
					});
					return { ...item,
						expressServiceScore: self.expressServiceScore,
						merchantServiceScore: self.merchantServiceScore,
						commentImageList: urls.length > 0 ? urls : undefined
					};
				});

				if (!isComment) {
					return uni.$alert.showToast('您还未完成星级评价哦');
				}

				uni.$api.apiRequest('commitOrderEvaluation',{
					orderId: this.options.orderId,
					memberId: uni.$localStorage.getItem('memberId'),
					orgId: uni.$localStorage.getItem('userOrgId'),
					goodsCommentsDetailList: arr
				}).then(res => {
					if (res.code == 10000) {
						uni.navigateTo({
							url: '/pages/order/Evaluation/evaluationDone',
							success: () => {
								uni.$alert.showToast('感谢评价');
							}
						});
					}
				});
			}

		}
	};
</script>
<style>
	@import "./evaluation.css";
</style>
