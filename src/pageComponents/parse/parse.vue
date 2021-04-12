<!--
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-26 18:29:28
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-12 15:56:59
-->
<template>
	<view>
		<view class="wxParse">
			<jyf-parser :html="dkcontent"></jyf-parser>
		</view>
	</view>
</template>

<script>
// https://github.com/jin-yufeng/mp-html 后续使用mp-html来代替wxParse 能有效减少包的体积
	import jyfParser from "@/components/jyf-parser/jyf-parser";

	export default {
		data() {
			return {
				dkcontent: ""
			};
		},
		components: {
			jyfParser
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
