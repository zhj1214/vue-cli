<template>
  <div
    class="base-tree"
    style="text-align: left;"
  >
    <i-input
      v-if="isSearch"
      v-model.trim="searchVal"
      class="tree-search fix-iview-icon"
      :placeholder="searchPlaceholder"
      clearable
      search
      @on-click="onSearchTree"
      @on-clear="onClearTree"
      @on-enter="onSearchTree"
    />
    <Tree
      ref="tree"
      :data="currentTreeData"
      class="fix-iview-icon tree-component"
      :render="render"
      empty-text=""
      @on-select-change="(item)=>$emit('on-select-change',item)"
      @on-toggle-expand="(status)=>$emit('on-toggle-expand',status)"
    />
  </div>
</template>

<script>
	export default {
		name: "BaseTree",
		props: {
			treeData: {
				required: true,
				type: Array,
				default() {
					return [];
				}
			},
			isSearch: {
				type: Boolean
			},
			searchPlaceholder: {
				type: String,
				default() {
					return '名称检索';
				}
			},
			render: {
				type: Function
			}
		},
		data() {
			return {
				searchVal: "",
				currentTreeData: [],
			};
		},
		watch: {
			treeData(val) {
				this.currentTreeData = val;
			}
		},
		methods: {
			// 搜索树
			onSearchTree(event) {
				const {value} = event.target;
				let tempTreeData = [];
				let deepSearch = (grandpa) => {
					console.info('grandpa===>', grandpa.title);
					for (let parent of grandpa.children) {
						if (parent.title.includes(value)) {
							console.info('parent==>', parent.title);
							tempTreeData.push(parent);
						} else {
							// 二级不存在，但可能是在三级里面
							deepSearch(parent)
						}
					}
					}
				for (let grandpa of this.treeData) {
					deepSearch(grandpa)
				}
				// for (let grandpa of this.treeData) {
				// 	console.info('grandpa===>', grandpa.title);
				// 	for (let parent of grandpa.children) {
				// 		if (parent.title.includes(value)) {
				// 			console.info('parent==>', parent.title);
				// 			tempTreeData.push(parent);
				// 		} else {
				// 			// 二级不存在，但可能是在三级里面
				// 			for (let child of parent.children) {
				// 				if (child.title.includes(value)) {
				// 					tempTreeData.push(parent);
				// 				}
				// 			}
				// 		}
				// 	}
				// }
				const [grandpaNode = {}] = this.treeData;
				const {...other} = grandpaNode;
				let treeDataList = [{...other, children: tempTreeData}];
				this.currentTreeData = treeDataList;

			},

			onClearTree() {
				this.currentTreeData = this.$options.propsData.treeData;
			}
		}
	};
</script>

<style lang="scss" scope>
		.tree-search {
				margin-bottom: 24px;
		}

		.base-tree {
				.ivu-tree-title {
						text-overflow: ellipsis;
						width: 100%;
						height: 40px;
						line-height: 40px;
						white-space: nowrap;
						padding-right: 10px;
				}
		}
		.fix-iview-icon{
			.ivu-tree-children:first-child{
				overflow: hidden;
				overflow-x: scroll;
			}
		}
		.tree-component .title-is-selected {
			background: rgba(117, 108, 234, 0.1);
		}
</style>
