/**
 * @desc 登录平台~
 * */
import "babel-polyfill"
import Vue from 'vue';
import iView from 'view-design';
import App from './view/Login.vue';
import VueRouter from 'vue-router';
import './theme/index.less';
import {axios_get, axios_post} from './utils/axios';
import store from "./store";

Vue.prototype.$ajaxGet = axios_get;
Vue.prototype.$ajaxPost = axios_post;

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import('./view/Login.vue')
		}]
});

Vue.use(iView);
Vue.use(VueRouter);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
