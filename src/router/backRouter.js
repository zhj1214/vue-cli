const routes = [{
    path: '',
    component:()=> import('../components/layout/adminLayout'),
    children: [
        {
            path: 'platform',
            children: [{
                    path: 'orgs'
                },
                {
                    path: 'roles'
                },
                {
                    path: 'users'
                },
                {
                    path: 'logs'
                },
            ]
        }, 
        {
            path: 'store',
            children: [{
                    path: 'trade' //业态
                },
                {
                    path: 'floor' //楼层
                },
                {
                    path: 'wechat' //微信配置
                }
            ]
        }, 
        {
            path: 'audit' //审批中心
        }, 
        {
            path: 'member' //会员中心
        },
        {
            path: 'integral' //积分中心
        },
        {
            path: 'ticket' //券包中心
        },
        {
            path: 'report' //报表中心
        },
        {
            path: 'park' //停车管理
        },
        {
            path: 'data' //资料管理
        },
        {
            path: 'order' //订单管理
        },
        {
            path: 'card' //储值卡
        },
        {
            path: 'visit' //回访
        },
        {
            path: 'consult' //咨询记录
        }

    ],
}]
export default routes