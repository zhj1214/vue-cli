/*
 * @Description: 菜单改造
 * @Author: sam.xutao
 * @Date: 2020-02-20 11:00:57
 * @LastEditTime: 2021-03-15 17:31:27
 * @LastEditors: zhj1214
 *
 * @mata 使用
 * h2：true，true则页面自己h2级的页面标题（如果标题右侧还有按钮之类的），false，则由adminLayout实现显示meta 的title
 * icon：iconfont class名，menu 左侧的icon
 * hidden：true ，则不在menu显示这个路由，说明是隐藏的页面
 * fullTitle，用于设置展开菜单全称
 * */
import platformRouter from './router-platform' // 平台管理菜单
import memberRouter from './router-member' // 会员中心菜单
import channel from './router-channel' // 渠道

const routes = [
  {
    path: '/',
    name: 'admin',
    meta: {
      title: '管理后台',
    },
    redirect: '/welcome',
    component: () => import('../layout/AdminLayout'),
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('../view/Welcome'),
        meta: {
          title: '欢迎页面',
          hidden: true,
          public: true,
          h2: true,
        },
      },
      platformRouter,
      memberRouter,
      channel,
    ],
  },
]

export const loginRouter = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../view/Login'),
    meta: {
      title: '登录',
      hidden: true,
      public: true,
    },
  },
]

// 超时
export const timeoutRouter = [
  {
    path: '/timeout',
    name: 'timeout',
    component: () => import('../view/Timeout'),
    meta: {
      title: 'timeout',
      hidden: true,
      public: true,
    },
  },
]
// 无权限
export const permissionRouter = [
  {
    path: '*',
    name: 'permission',
    component: () => import('../view/Permission'),
    meta: {
      title: 'permission',
      hidden: true,
      public: true,
    },
  },
]

export default routes
