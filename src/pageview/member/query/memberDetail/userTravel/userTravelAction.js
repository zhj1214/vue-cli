/**
 * 用户旅程级联
 * @type {({children: ({label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number})[], label: string, value: number}|{children: ({label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number})[], label: string, value: number})[]}
 */

const userTravelAction = [{
    value: 1,
    label: '会员信息',
    children: [{
        value: 101,
        label: '注册'
    }, {
        value: 102,
        label: '登录'
    }, {
        value: 103,
        label: '完善信息'
    }, {
        value: 104,
        label: '地址变更'
    }, {
        value: 105,
        label: '标签变更'
    }, {
        value: 106,
        label: '账户变动'
    }, {
        value: 107,
        label: '等级变动'
    }, {
        value: 108,
        label: '付费会员变动'
    }, {
        value: 109,
        label: '积分变动'
    }, {
        value: 110,
        label: '成长值变动'
    }, ]
}, {
    value: 2,
    label: '线上商城',
    children: [{
        value: 201,
        label: '点击广告位'
    }, {
        value: 202,
        label: '搜索商品'
    }, {
        value: 203,
        label: '浏览商品'
    }, {
        value: 204,
        label: '点击推荐位'
    },  {
        value: 205,
        label: '加入购物车'
    }, {
        value: 206,
        label: '支付订单'
    }, {
        value: 207,
        label: '商品分享'
    }, {
        value: 208,
        label: '退单'
    }, ]
}]

export { userTravelAction }