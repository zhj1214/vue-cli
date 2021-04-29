// 会员中心菜单
module.exports = {
  path: 'member', //会员中心
  name: 'member',
  meta: {
    title: '会员',
    fullTitle: '会员中心',
    icon: 'iconhuiyuanzhongxin',
  },
  component: () => import('../layout/ComponentsLayout'),
  children: [
    {
      path: 'manage', //会员字段设置
      name: 'member-manage',
      meta: {
        title: '会员管理',
      },
      redirect: '/member/manage/query',
      component: () => import('../layout/ComponentsLayout'),
      children: [
        {
          path: 'query',
          name: 'member-manage-query',
          meta: {
            title: '会员查询',
          },
          component: () => import('../pageview/member/query/QueryMember'),
        },
        {
          path: 'details',
          name: 'member-manage-details',
          permission: true,
          meta: {
            title: '会员详情',
            h2: true,
            hidden: true,
          },
          component: () => import('../pageview/member/query/memberDetail/MemberDetail'),
        },
        {
          path: 'field', //会员字段设置
          name: 'member-manage-field',
          meta: {
            title: '字段设置',
          },
          component: () => import('../pageview/member/fontSetting/FontSetting'),
        },
      ],
    },
    {
      path: 'fans',
      name: 'member-fans',
      meta: {
        title: '粉丝管理',
      },
      component: () => import('../pageview/member/fanManage/FanManage'),
    },
    {
      path: 'labelLayer',
      name: 'member-labelLayer',
      meta: {
        title: '标签客群',
      },
      redirect: '/member/labelLayer/labels',
      component: () => import('../layout/ComponentsLayout'),
      children: [
        {
          path: 'labels',
          name: 'member-labelLayer-labels',
          meta: {
            title: '会员标签',
            h2: true,
          },
          component: () => import('../pageview/member/label/MemberLabel'),
        },
        {
          path: 'labelGroup',
          name: 'member-labelLayer-labelGroup',
          meta: {
            title: '标签分组',
            hidden: true,
          },
          component: () => import('../pageview/member/label/labelGroup/LabelGroup'),
        },
        {
          path: 'layers',
          name: 'member-labelLayer-layers',
          meta: {
            title: '会员客群',
            h2: true,
          },
          component: () => import('../pageview/member/layers/Layers'),
        },
      ],
    },
    {
      path: 'settingLevel',
      name: 'member-settingLevel',
      meta: {
        title: '会员等级',
        h2: true,
      },
      component: () => import('../pageview/member/level/SettingLevel'),
    },
    {
      path: 'editLevel',
      name: 'member-editLevel',
      permission: true,
      meta: {
        title: '等级编辑',
        h2: true,
        hidden: true,
      },
      component: () => import('../pageview/member/level/editLevel/EditLevel'),
    },
  ],
}
