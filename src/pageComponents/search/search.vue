<template>
	<view class="search-containerbg" hover-class="none">
		<!-- 头部搜索框 -->
		<view class="header" :style="'margin-top:' + navHeight + 'px;'">
			<view class="search-box">
				<image @tap="toResult" class="search-icon" src="/static/images/search-icon.png"></image>
				<input :value="searchValue" @confirm="onConfirm" @input="change" confirm-type="search" placeholder-class="search-placeholder"
				 placeholder="搜索" class="search-input"></input>
				<image class="del-icon" src="/static/images/clear-icon.png" @tap="clear"></image>
			</view>
			<view class="cancel" @tap="cancel">取消</view>
		</view>
		<!-- 搜索记录 -->
		<view class="history">
			<view class="title">
				最近的搜索记录
				<image class="remove" @tap="remove" src="/static/images/remove-icon.png"></image>
			</view>
			<view class="history-words">
				<view v-for="(item, index) in historyWords" :key="index" @tap="search" :data-text="item" class="history-item">
					{{item}}
					<image class="history-item-img" src="/static/images/more-icon.png"></image>
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
				navHeight: app.globalData.navHeight,
				searchValue: '',
				historyWords: []
			};
		},

		components: {},
		props: {},

		beforeMount() {
			this.setData({
				navHeight: app.globalData.navHeight,
				historyWords: uni.$localStorage.getItem('historyWords')
			});
			// #ifdef MP-WEIXIN
			uni.hideTabBar({});
			// #endif
		},

		methods: {
			/**
			 * @description 搜索框内清楚按钮
			 */
			clear() {
				this.setData({
					searchValue: ''
				});
			},

			/**
			 * @description 取消搜索
			 */
			cancel() {
				this.$emit('cancel', {
					detail: {}
				});
				uni.showTabBar({});
			},

			/**
			 * @description 输入框内容改变时，设置搜索值
			 */
			change(e) {
				if (e.detail.value == 'root.out') {
					// 清楚本地缓存
					uni.$localStorage.remove('Token');
					uni.$localStorage.remove('wxUserInfo');
				}

				this.setData({
					searchValue: e.detail.value
				});
			},

			/**
			 * @description 点击手机键盘搜索按钮
			 */
			onConfirm(e) {
				let s = e.detail.value || e.detail.text;

				if (!s) {
					uni.$alert.showToast('请输入搜素词');
					return;
				}

				let historyWords = uni.$localStorage.getItem('historyWords') || [];
				this.$emit('cancel', {
					detail: {}
				});
				if (!historyWords.includes(s)) {
					historyWords.unshift(s);
				}

				historyWords = historyWords.slice(0, 10);
				uni.$localStorage.setItem('historyWords', historyWords);
				uni.showTabBar({});
				app.globalData.banner = '';
				uni.navigateTo({
					url: '/pages/search-result/search-result?s=' + s
				});
			},

			/**
			 * @description 点击最新的搜索记录
			 */
			search(e) {
				console.log(e);
				let s = e.currentTarget.dataset.text;

				if (!s) {
					uni.$alert.showToast('请输入搜素词');
					return;
				}

				this.$emit('cancel', {
					detail: {}
				});
				uni.showTabBar({});
				app.globalData.banner = '';
				uni.navigateTo({
					url: '/pages/search-result/search-result?s=' + s
				});
			},

			/**
			 *@description 点击搜索按钮
			 *
			 */
			toResult() {
				let historyWords = uni.$localStorage.getItem('historyWords') || [];
				let s = this.searchValue;

				if (!s) {
					uni.$alert.showToast('请输入搜素词');
					return;
				}

				if (!historyWords.includes(s)) {
					historyWords.unshift(s);
				}

				historyWords = historyWords.slice(0, 10);
				uni.$localStorage.setItem('historyWords', historyWords);
				this.$emit('cancel', {
					detail: {}
				});
				uni.showTabBar({});
				app.globalData.banner = '';
				uni.navigateTo({
					url: '/pages/search-result/search-result?s=' + s
				});
			},

			remove() {
				uni.$localStorage.setItem('historyWords', []);
				this.setData({
					historyWords: []
				});
			}

		}
	};
</script>
<style>
	@import "./search.css";
</style>
