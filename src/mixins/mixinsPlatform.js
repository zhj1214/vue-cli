export default {
	
	data() {
		return {
			treeData: []
		};
	},
	created() {
		this.getLeftTree();
	},
	methods: {
		getLeftTree() {
			return
			// this.$ajaxGet('/user-server/platform/department/tree')
			// 	.then(res => {
			// 		if (res && res.code === 10000) {
			// 			this.treeData = (res.data || []).map((item, index) => {
			// 				if (index === 0) {
			// 					item.expand = true;
			// 					item.selected = true;
			// 				}
			// 				return item;
			// 			});
			// 			const json = res.data[0] || {};
			// 			const data = JSON.parse(JSON.stringify(json));
			// 			delete data.children;
			// 			this.treeItem = data;
			// 			// 首次允许被加入账号拉取tree第一个组织列表而非门店或者商户的table
			// 			this.$nextTick(()=>{
			// 				this.getOrganizationTable&&this.getOrganizationTable(data.id)
			// 				this.getRoleTable&&this.getRoleTable(data.id);
			// 				this.getEmployeeTable&&this.getEmployeeTable(data.id);
			// 			})
			// 		}
			// 	});
		},
		renderContent(h, {node, data}) {
			return h('span',
				{
					class: 'tree-span-selected ' + (data.id === this.treeItem.id ? 'title-is-selected' : ''),
					on: {
						click: () => {
							const tree = this.$refs['theTree'].$refs['tree'];
							tree.handleSelect(node.nodeKey);//调用原生的方法，去勾选和取消
							data.selected = true;//任何时候都选中
							this.treeItem = data || {};//选择的值
							this.treeChange(data);
						}
					}			
				},
				[
					data.type === '10' ? h('i', {class: 'icon iconfont icondianpu', style: {fontSize:'14px', marginRight: '8px'}}) : '',
					data.type === '5' ? h('i', {class: 'icon iconfont iconShop'}) : '',
					data.type === '4' ? h('i', {class: 'icon iconfont iconCompany'}) : '',
					data.type === '3' ? h('i', {class: 'icon iconfont iconDepartment'}) : '',
					data.type === '1' ? h('i', {class: 'icon iconfont iconhengtaishangye', style: {fontSize:'14px', marginRight: '8px'}}) : '',
					h('span',
						{
							attrs: {
								title: data.title
							},
						}, data.title)
				]);
		},
		onClearSelect() {
			this.$refs.baseTable.$refs['ivu-table'].selectAll(false);
		},
	}
};

