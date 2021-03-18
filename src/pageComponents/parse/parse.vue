<template>
	<view>
		<view class="wxParse">
			<!-- #ifndef MP-WEIXIN -->
			<jyf-parser :html="dkcontent"></jyf-parser>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<template is="wxParse" :wxParseData="dkcontent.nodes" />
			<!-- #endif -->
		</view>
	</view>
</template>
<script>
	// #ifdef MP-WEIXIN
	import wxParse from '@/components/wxParse/wxParse';
	// #endif
	// #ifndef MP-WEIXIN
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	// #endif

	export default {
		data() {
			return {
				dkcontent: ""
			};
		},
		components: {
			// #ifndef MP-WEIXIN
			jyfParser
			// #endif
		},
		props: {
			content: {
				type: String,
				default: ""
			}
		},
		mixins: [],
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		// 在组件实例进入页面节点树时执行
		beforeMount: function() {},
		moved: function() {},
		// 在组件实例被移动到节点树另一个位置时执行
		destroyed: function() {}, //在组件实例被从页面节点树移除时执行
		// 布局完成
		mounted: function() {
			var filter = this.content.replace(/<o:p>/g, '');
			this.setData({
				dkcontent: filter
			});
			// #ifdef MP-WEIXIN
			// 延迟 处理一下
			setTimeout(() => {
				wxparse.wxParse('dkcontent', 'html', this.dkcontent, this, 5);
			}, 300);
			// #endif
		},
		// 组件所在页面的生命周期函数
		onPageShow: function() {},
		onPageHide: function() {},
		onPageResize: function() {},
		methods: {}
	};
</script>
<style>
	@import "./parse.css";
</style>
