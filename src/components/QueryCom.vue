<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2020/7/20 0020
 * 用于 右侧点击过滤图片展开多项搜索项目
 -------------------------->
<template>
  <div class="queryCom">
    <div class="query-button">
      <slot name="query" />
    </div>
    <span
      :class="'filter-block '+ (propExpand.isExpand?'is-active':'')"
      @click="onExpand"
    >
      <icon class="icon iconfont iconFilter" />
      <icon :class="'icon iconfont '+ (propExpand.isExpand?'iconDropdownUnfold':'iconTreeFold')" />
    </span>

    <div
      v-if="propExpand.isExpand"
      class="clear fix-line"
    >
      <span style="float: right" />
    </div>
    <!-- 展开可选的选项 -->
    <div
      v-if="propExpand.isExpand"
      class="expand-row"
    >
      <slot />
    </div>
  </div>
</template>
<script>
	export default {
		name: 'QueryCom',
		props: {
			propExpand: {
				type: Object,
				default() {
					return {
						isExpand: false
					};
				}
			}
		},
		methods: {
			onExpand() {
				this.$emit("onExpandFilter");
			}
		}
	};
</script>
<style lang="scss" scoped>
		.queryCom {
				position: relative;
		}

		.query-button {
				margin-right: 90px;

				div {
				}
		}

		.is-active {
				color: #756CEA;
				background: #FAFAFB;
				border-bottom: 0 !important;
				border-bottom-right-radius: 0 !important;
		}

		.filter-block {
				position: absolute;
				top: 0;
				right: 0;
				width: 60px;
				padding: 4px;
				border-radius: 8px;
				border: 1px solid #E2E2E9;
				text-align: center;
				cursor: pointer;

		}

		.fix-line {
				height: 12px;
				border-right: 1px solid #E2E2EA;

				span {
						position: relative;
						display: block;
						background: #FAFAFB;
						width: 66px;
						height: 20px;
						z-index: 1;

						&:before {
								display: block;
								content: "";
								position: absolute;
								bottom: 7px;
								width: 16px;
								left: -8px;
								background: white;
								height: 22px;
								border-right: 1px solid #e2e2ea;
								border-bottom: 1px solid #e2e2ea;
								border-bottom-right-radius: 12px 12px;
						}
				}
		}

		.expand-row {
				position: relative;
				border-top-left-radius: 8px;
				border-bottom-left-radius: 8px;
				border-bottom-right-radius: 8px;
				border: 1px solid #E2E2EA;
				background: #FAFAFB;
				padding: 24px;


				&:after {
						/*
						display: block;
						content: "";
						position: absolute;
						top: -20px;
						width: 60px;
						height: 20px;
						right: 0;
						background: red;
						border-right: 1px solid #E2E2EA;*/
				}
		}
</style>
