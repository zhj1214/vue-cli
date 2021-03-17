/*
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2020-12-22 04:00:57
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-16 09:08:14
 */
// 会员中心菜单
export default {
	path: 'cmpDemo', //会员中心
	name: 'cmpdemo',
	id: "cmp",
	meta: {
		title: '组件',
		fullTitle: '组件中心',
		icon: 'iconhuiyuanzhongxin'
	},
	component: () => import('../layout/ComponentsLayout'),
	children: [{
			id: "cmp-1",
			path: 'fileUpload', //会员字段设置
			name: 'cmpdemo-fileupload',
			meta: {
				title: '文件上传',
			},
			component: () => import('../components/FileUpload/demo'),
		}

	]
}

export const CmpServerMenu = [{
	children: [{
		id: "cmp-1",
		industry: null,
		industryId: null,
		level: null,
		orgId: null,
		parentId: "0",
		showOrder: 2,
		storeType: null,
		title: "文件上传",
		type: "MENU",
		value: "cmpdemo-fileupload",
		_disabled: false,
	}],
	hasPower: true,
	id: "cmp",
	industry: null,
	industryId: null,
	level: null,
	orgId: null,
	parentId: "0",
	showOrder: 2,
	storeType: null,
	title: "组件",
	type: "MENU",
	value: "cmpdemo",
	_disabled: false,
}]