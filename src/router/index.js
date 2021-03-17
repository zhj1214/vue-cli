/*
 * @Description:
 * @Author: sam.xutao
 * @Date: 2020-02-20 11:00:58
 * @LastEditTime: 2020-09-10 10:55:18
 * @LastEditors: sam.xutao
 */
import Vue from 'vue';
import Router from 'vue-router';
// import routes from './backRouter'; //开启加载本地路由
import { loginRouter, permissionRouter, timeoutRouter } from './backRouter';
import HallRouter from './router-hall';
import TenantRouter from './router-tenant';
import { getRouter } from './fn';

Vue.use(Router);

// fix Uncaught (in promise) NavigationDuplicated {_name: "NavigationDuplicated"}
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
let router = new Router({
  // routes: routes.concat(loginRouter),
  routes: loginRouter,
  mode: 'history',
});
// routes
getRouter().then((res) => {
  if (res && res[0] && res[0].children) {
    const routerNameArray = [];
    for (let item of res[0].children || []) {
      routerNameArray.push(item.name);
    }
    if (!routerNameArray.includes('welcome')) {
      res[0].children.push({
        path: '/welcome',
        name: 'welcome',
        component: () => import('../view/Welcome'),
        meta: {
          title: '欢迎页面',
          hidden: true,
          public: true,
          h2: true,
        },
      });
    }
  }

  res && res.push(...HallRouter, ...TenantRouter); // 增加大厅和商户路由
  res && router.addRoutes(res || []);
  // 补充 404/403 错误页面,当power 为空之后显示错误页面而非空白页面
  router.addRoutes(permissionRouter);
  router.addRoutes(timeoutRouter);
});

router.beforeEach((to, from, next) => {
  next();
});
export default router;
