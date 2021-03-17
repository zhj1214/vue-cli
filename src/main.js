/**
 * @状态码
 * @10000 OK
 * @20000 参数错误
 * @50000 内容未找到
 * @60000 服务器内部错误/处理异常
 * @30001 未登陆
 * @3002 数据过期
 * */
// 使用babel-polyfill 兼容性处理ie
import 'babel-polyfill';
import Vue from 'vue';
import iView from 'view-design';
import { format, getTime } from 'date-fns';
import lodash from 'lodash';
import App from './App.vue';
import router from './router';
import store from './store/index';
// import 'view-design/dist/styles/iview.css';
import './theme/index.less';
import backIcon from './assets/images/backIcon.png';
import defaultImg from './assets/images/no-pic.svg';
import clipboard from 'clipboard';//引入复制功能
import eventEmitter from "./utils/EventEmitter";

import request, { axios_get, axios_post } from './utils/axios';
import {
  routerName,
  renderTime,
  formatNumber,
  filterPhone,
  unitNumber,
  saveImage,
  checkUrl,
} from './utils/tools';

// 城市级联组件: https://github.com/iview/iview-area <al-cascader />
import iviewArea from 'iview-area';

// import routes from "./router/backRouter";
// 如果是开发者环境下，则引入mock
// if (process.env.NODE_ENV !== 'production') require('./mock')
Vue.config.productionTip = false; // false阻止vue启动时生成生产提示,true允许
Vue.prototype.$ajaxGet = axios_get;
Vue.prototype.$ajaxPost = axios_post;
Vue.prototype.$http = request;

Vue.prototype.$_ = lodash;
Vue.prototype.$format = (time, str) => {
  if (!time) return '';
  return format(Number(time), str || 'YYYY-MM-DD HH:mm:ss');
};
Vue.prototype.$getTime = getTime;
Vue.prototype.$routerName = routerName;
Vue.prototype.$backIcon = backIcon;
Vue.prototype.$renderTime = renderTime;
Vue.prototype.$formatNumber = formatNumber;
Vue.prototype.$unitNumber = unitNumber;
Vue.prototype.$filterPhone = filterPhone;
Vue.prototype.$saveImage = saveImage;
Vue.prototype.$checkUrl = checkUrl;
Vue.prototype.$defaultImg = defaultImg;

Vue.prototype.clipboard = clipboard;//将复制功能放在原型上
// 全局性文件上传服务器地址

Vue.prototype.$upload = '/file-server/api/resources/files/upload'; //单传 {file:xx}
Vue.prototype.$uploads = '/file-server/api/resources/files/uploads'; //多传 {files:xx}

// 自定义事件
Vue.prototype.$eventEmitter = eventEmitter;
eventEmitter.constructor();


Vue.use(iviewArea);
Vue.use(iView);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
