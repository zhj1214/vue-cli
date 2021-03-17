/*
 * @Description:
 * @Author: sam.xutao
 * @Date: 2020-04-26 14:34:08
 * @LastEditTime: 2020-09-09 17:36:52
 * @LastEditors: sam.xutao
 */
/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020/3/23 0023
 ***********************/

export default {
  path: 'channel',
  name: 'channel',
  redirect: '/channel/miniProgram/base',
  meta: {
    title: '渠道',
    fullTitle: '渠道管理',
    icon: 'iconqudaoyingyong',
  },
  component: () => import('../layout/ComponentsLayout'),
  children: [
    {
      path: 'miniProgram',
      name: 'channel-miniProgram',
      meta: {
        title: '微信小程序',
      },
      redirect: '/channel-miniProgram/base',
      component: () => import('../layout/ComponentsLayout'),
      children: [
        {
          path: 'base',
          name: 'channel-miniProgram-base',
          meta: {
            title: '基础信息',
          },
          component: () => import('../pageview/channel/miniProgram/Base'),
        },
      ],
    },
    {
      path: 'officeAccount',
      name: 'channel-officeAccount',
      meta: {
        title: '微信公众号',
      },
      component: () => import('../layout/ComponentsLayout'),
      children: [
        {
          path: 'setting',
          name: 'channel-officeAccount-setting',
          meta: {
            title: '公众号设置',
          },
          component: () =>
            import('../pageview/channel/officeAccount/Account'),
        },
        {
          path: 'menu',
          name: 'channel-officeAccount-menu',
          meta: {
            title: '自定义菜单',
          },
          component: () =>
            import('../pageview/channel/officeAccount/Account'),
        },
      ],
    },

    {
      path: 'register-mng',
      name: 'channel-register-mng',
      meta: {
        title: '注册渠道',
      },
      redirect: '/channel/register-mng/base',
      component: () => import('../layout/ComponentsLayout'),
      children: [
        {
          path: 'base', 
          name: 'channel-register-mng-base',
          meta: {
            title: '注册渠道管理',
          },
          component: () =>
            import('../pageview/channel/registerChannelMng/Base'),
        },
      ],
    },
  ],
};
