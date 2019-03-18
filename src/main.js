/**
 * @状态码
 * @10000 OK
 * @20000 参数错误
 * @50000 内容未找到
 * @60000 服务器内部错误/处理异常
 * @30001 未登陆
 * @3002 数据过期
 * */
import Vue from 'vue';
import iView from 'iview';
import axios from 'axios';
import i18n from './assets/i18n'
import {format} from 'date-fns'
import App from './App.vue';
import router from './router';
import store from './store/index';
import 'iview/dist/styles/iview.css';
import {Notice} from 'iview';
import md5 from 'js-md5'
// 如果是开发者环境下，则引入mock
// if (process.env.NODE_ENV !== 'production') require('./mock')
Vue.config.productionTip = false; // false阻止vue启动时生成生产提示,true允许
const axiosIns = axios.create({});
// req 拦截器
axiosIns.interceptors.request.use(req => {
	//增加一层请求头的加密，防止被恶意获取数据
	let req_data ='';
	try {
		req_data=JSON.stringify(Object.assign({},req.data||{}))
	}catch (e) {
		req_data=''
	}
	req.headers['Designed-By-Sl']=md5(req_data).substring(0,16)+md5('shuli').substring(16,32)
	//admin mange发起的请求才增加uid
	if((/^\/manage/.test(req.url))){
		req.headers.uid=sessionStorage.getItem('uid')||''
	}
	return req;
}, err => {
	return Promise.reject(err.request);
});
// res 拦截器
axiosIns.interceptors.response.use(res => {
	if (res && res.data) {
		return Promise.resolve(res)
	}
	return res.data;
}, error => {
	return Promise.resolve(error.response);
});
Vue.prototype.$ajaxPost = (url, data={}, msg = '接口异常', headers) => {
  return axiosIns.post(url, data, headers).then(res => {
		let iRes = res&&res.config?res.data:res;
    if ((iRes && iRes.code === 10000) || iRes.infocode === '10000') {
	    return Promise.resolve(iRes);
	    } else if(iRes.code===30001){
        location.href='/login';
	      return  Promise.reject(iRes);
    }else {
			Notice.error({title:iRes.message|| "接口异常，请联系管理员！"})
      return Promise.resolve(iRes);
    }
  }).catch(err => {
		console.info(err.message||msg);
  });
};

Vue.prototype.$format =format;
Vue.prototype.$thisYear= new Date().getFullYear();
Vue.use(iView,{
	i18n(path, options) {
		let value = i18n.t(path, options);
		if (value !== null && value !== undefined) return value;
		return '';
	}
});
new Vue({
	i18n,
	router,
	store,
	render: h => h(App)
}).$mount('#app');
