<template>
	<view class="view">
		<view class="deliveryMethod flex-row">
			<view class="deliveryMethodDesc">配送方式</view>
			<view class="deliveryMethodView">
				<u-radio-group v-model="deliveryMethod" icon-size="18" @change="radioGroupChange" active-color="#FE5D4D">
					<u-radio v-for="(radio, j) in getRodio(cell.deliverType)" :key="j" :name="radio.name"
					 label-size="24" icon-size="18">{{ radio.text }}</u-radio>
				</u-radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			cell: Object,
			idx: Number
		},
		data() {
			return {
				deliveryMethod: ''
			}
		},
		created() {
			this.deliveryMethod = this.cell.deliveryMethod
		},
		methods: {
			getRodio(val) {
				var a = [];
				if (val.indexOf("1") != -1) {
					a.push({
						name: "kdyq",
						text: "快递寄送",
					});
				}
				if (val.indexOf("2") != -1) {
					a.push({
						name: "ddzt",
						text: "到店自提",
					});
				}
				return a;
			},
			/**
			 * 快递、自提
			 * */
			radioGroupChange(val) {
				console.log(val, "——————单选");
				this.cell.deliveryMethod = val
				this.$emit('change',{
					cell: this.cell,
					type: val,
					idx: this.idx
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.deliveryMethod {
		background: #ffffff;
		padding: 36rpx 40rpx;
		justify-content: space-between;

		.deliveryMethodDesc {
			font-size: 26rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #ababab;
		}
	}
</style>
