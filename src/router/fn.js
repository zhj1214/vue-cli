/*
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-01-15 18:45:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-15 19:13:08
 */
/***********************
 * @desc 路由方法
 * @name JS
 * @author Jo.gel
 * @date 2019/5/24 0024
 ***********************/
import {
	axios_get
} from "../utils/axios";
import store from '../store/index';
import {
	deepCopy
} from "../utils/tools";
import routes from './backRouter';
import {CmpServerMenu} from "./router-cmpDemo"

export const matchMenu = function (tree, itype, obj) {
	tree && tree.forEach((item) => {
		if (item.type === itype) {
			obj[item.value] = item.id;
		}
		if (item.children && item.type === itype) {
			matchMenu(item.children, itype, obj);
		}
	});
	return obj;
};


export const matchTree = function (tree, obj, flag) {
	const result = [];
	const ids = Object.keys(obj || {}) || [];
	flag++;
	tree && tree.forEach((item) => {

		/**
		 * 案例demo，不走服务端，本地直接加进去
		 * @author huyp
		 * @date 2020-10-19
		 */
		if (item.path.indexOf("cmpDemo") > -1) {
			result.push(item)
			return
		}

		// 如果当前页面没有按钮权限，则默认分配页面权限
        if (item.permission) {
            result.push(item)
        }

		// 如果有子节点，递归
		if (item.children) {
			item.children = matchTree(item.children, obj, flag);
		}
		if (flag < 1 || ids.includes(item.name)) {
			item.meta.id = obj[item.name];
			result.push(item);
		}
	});
	return result;
};
//分割前端实际路由
export const getRouter = (local) => {
	// local
	sessionStorage.clear();
	const token = localStorage.getItem('token');
	if (!token) {
		location.href = '/login.html';
	}
	return axios_get('/user-server/auth/user/powers')
		.then(res => {
			if (res && res.code === 10000) {

				let menuData = [
					...res.data,
					...CmpServerMenu
				]
				let iMenu = matchMenu(menuData, 'MENU', {}); //返回 {路由名:id}
				let copyData = Object.create(null);

				copyData = deepCopy(routes, copyData);

				const allRoutes = [copyData[0]];
				let iRouter = matchTree(allRoutes, iMenu, -1); //真实路由
				sessionStorage.setItem("operTree", JSON.stringify(iMenu));
				sessionStorage.setItem("roleTree", JSON.stringify(menuData)); //powers
				if (local) {
					sessionStorage.removeItem('roleTree');
				}
				store.dispatch('setModuleId', iMenu); //设置模块
				store.dispatch('switchCompany', menuData); //menu
				store.dispatch('setRealRouter', iRouter); //切换子公司时候，将值给store
				return Promise.resolve(iRouter);
			}
		});
};