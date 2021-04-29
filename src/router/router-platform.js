/*
 * @Description:
 * @Author: sam.xutao
 * @Date: 2020-02-24 11:31:48
 * @LastEditTime: 2020-03-20 16:46:02
 * @LastEditors: sam.xutao
 */
// 平台管理菜单
module.exports = {
  path: 'platform',
  name: 'platform',
  redirect: '/platform/organization/department',
  meta: {
    title: '平台',
    fullTitle: '平台管理',
    icon: 'iconpingtaiguanli',
  },
  component: () => import('../layout/ComponentsLayout'),
  children: [
    {
      path: 'organization',
      name: 'platform-organization',
      meta: {
        title: '组织管理',
      },
      redirect: '/platform/organization/department',
      component: () => import('../layout/ComponentsLayout'),
      children: [
        {
          path: 'department', //组织管理，真实情况是部门管理
          name: 'platform-organization-department',
          meta: {
            title: '组织机构',
          },
          component: () => import('../pageview/platform/Organization'),
        },
        {
          path: 'role', //角色管理
          name: 'platform-organization-role',
          meta: {
            title: '角色管理',
          },
          component: () => import('../pageview/platform/Role'),
        },
        {
          path: 'employee', //员工管理
          name: 'platform-organization-employee',
          meta: {
            title: '员工管理',
          },
          component: () => import('../pageview/platform/Employee'),
        },
        {
          path: 'logs', //日志管理
          name: 'platform-organization-logs',
          meta: {
            title: '日志管理',
          },
          component: () => import('../pageview/platform/Logs'),
        },
      ],
    },
    {
      path: 'approval',
      name: 'platform-approval',
      meta: {
        title: '审批中心',
      },
      redirect: '/platform/approval/setting',
      component: () => import('../layout/ComponentsLayout'),
      children: [
        {
          path: 'setting', //审批设置
          name: 'platform-approval-setting',
          meta: {
            title: '审批设置',
          },
          component: () => import('../pageview/platform/Approval/Install'),
        },
        {
          path: 'edit', //编辑审批
          name: 'platform-approval-edit',
          permission: true,
          meta: {
            title: '编辑审批',
            h2: true,
            hidden: true,
          },
          component: () => import('../pageview/platform/Approval/EditApproval'),
        },
        {
          path: 'addApprovalPeople', //添加审批人
          name: 'platform-approval-addApprovalPeople',
          permission: true,
          meta: {
            title: '添加审批人',
            h2: true,
            hidden: true,
          },
          component: () => import('../pageview/platform/Approval/AddApprovalPeople'),
        },
        {
          path: 'manage', //审批管理
          name: 'platform-approval-manage',
          meta: {
            title: '审批管理',
          },
          component: () => import('../pageview/platform/Approval/Manage'),
        },
        {
          path: 'approvalDetail', //审批详情
          name: 'platform-approval-approvalDetail',
          permission: true,
          meta: {
            title: '审批详情',
            h2: true,
            hidden: true,
          },
          component: () => import('../pageview/platform/Approval/ApprovalDetail'),
        },
        // {
        // 	path: 'test',
        // 	name: 'platform-approval-test',
        // 	meta: {
        // 		title: '测试页',
        // 		h2:true,
        // 		// hidden: true,
        // 	},
        // 	component: () => import('../pageview/platform/Approval/test'),
        // },
      ],
    },
  ],
}
