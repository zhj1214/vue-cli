<template name='sunui-grand'>
	<view>
		<view v-show="isHide">
			<view class="sunui-grand-hide-bg" :style="'background-color:'+bg+';'" :class="isBt?'isbottomyes':'isbottomno'">
				<view class="sunui-grand-summary numbersty" :style="'-webkit-line-clamp:'+clamp+';'">
					{{ content }}
				</view>
				<view class="sunui-grand-show-btn" v-show="isHidebt&&content" :style="'background-color:'+btbg+';'">
					<view @tap="show" class="text-right">
						<!-- <text style="padding-right: 10rpx;">...</text> -->
						<u-icon name="arrow-down" :color="color" size="22"></u-icon>
						<!-- <text :style="{color:color}">{{expandText}}</text> -->
					</view>
				</view>
			</view>
		</view>
		<view v-show="!isHide">
			<view class="sunui-grand-show-bg numbersty" :style="'background-color:'+bg+';'" :class="isBt?'isbottomyes':'isbottomno'">
				<view style="font-size: 11px;font-weight: 300;color: #444444;">
					{{ content }}
				</view>
				<view class="sunui-grand-hide-btn" v-show="isHidebt" :style="'background-color:'+btbg+';'">
					<view @tap="hide" class="text-right">
						<u-icon name="arrow-up" :color="color" size="22"></u-icon>
						<!-- <text :style="{color:color}">{{shinkText}}</text> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const screenWidth = uni.getSystemInfoSync().screenWidth;
	const oneLineWidth = screenWidth/375 * 335;
	var _self;
	export default {
		data() {
			return {
				isHide: true,
				isHidebt: true,
				isBt:true
			};
		},
		name: 'sunui-grand',
		props: {
			clamp: {
				type: [Number, String],
				default: 2
			},
			color: {
				type: String,
				default: `#444444`
			},
			content: {
				type: String,
				default: ``
			},
			bg: {
				type: String,
				default: ``
			},
			expandText: {
				type: String,
				default: "展开∨"
			},
			shinkText: {
				type: String,
				default: "收起∧"
			},
			btbg:{
				type: String,
				default: "#FFFFFF"
			}
		},
		created() {
			_self = this;
		},
		mounted () {
			// this.onChange(this.content)
		},
		methods: {
			show() {
				let _this = this;
				_this.isHide = false;
			},
			hide() {
				let _this = this;
				_this.isHide = true;
			},
			onChange (val) {
				if(val.length * 11 < parseInt(oneLineWidth) * this.clamp) {
					let _this = this;
					_this.isHidebt = false;
					_this.isBt=false;
				}
			}
		},
		watch: {
			content (val) {
				this.onChange(val)
			}
		},
		// mounted(){
		// 	let that = this
		// 	console.log('content',that.content)
		// 	if(	this.content.length * 14 < parseInt(oneLineWidth) * this.clamp) {
		// 		let _this = this;
		// 		_this.isHidebt = false;
		// 		_this.isBt=false;
		// 	}
		// }
	}
</script>

<style>
.sunui-grand-hide-bg{
	position: relative;
}
.sunui-grand-show-bg{
	position: relative;
}
	.sunui-grand-summary {
		overflow: hidden;
		display: -webkit-box;
		/* text-overflow: ellipsis; */
		-webkit-box-orient: vertical;
		font-size: 11px;
		line-height: 1.6;
		font-weight: 300;
		color: #444444;
		line-height: 18px;
	}

	.sunui-grand-show-btn {
		position: absolute;
		display: inline-block;
		right: 0;
		bottom: 0;
	}

	.sunui-grand-hide-btn {
		position: absolute;
		display: inline-block;
		right: 0;
		bottom: 0;
	}
	.numbersty{
		word-break:break-all;
		/*防止数字字母溢出*/
		text-align: justify;
		/*防止文字参差不齐*/
	}
	.isbottomyes{
	}
	.isbottomno{
	}
</style>
