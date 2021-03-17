/*
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2020-10-16 09:41:27
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-15 18:01:03
 */
/***********************
 * @desc 大厅路由
 * @name JS
 * @author Jo.gel
 * @date 2020/3/2 0002
 ***********************/
export default [
	{
		path: '/hall',
		name: "hall",
		redirect: '/hall/account',
		component: () => import('../layout/HallLayout'),
		meta: {
			title: '账号管理',
			icon: 'md-people',
		},
		children: [
			{
				path: 'account',
				name: 'hall-account',
				meta: {
					title: '账号信息',
				},
				component: () => import('../pageview/hall/Account')
			},
			{
				path: 'password',
				name: 'hall-password',
				meta: {
					title: '修改密码'
				},
				component: () => import('../pageview/hall/Password')
			},
			{
				path: 'changephone',
				name: 'hall-changephone',
				meta: {
					title: '更换手机号'
				},
				component: () => import('../pageview/hall/components/ChangePhone')
			},
			{
				path: 'cancelaccount',
				name: 'hall-cancelaccount',
				meta: {
					title: '注销账号'
				},
				component: () => import('../pageview/hall/components/CancelAccount')
			}
		]
	},

];
