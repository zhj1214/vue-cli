/**
 * 用户旅程级联
 * @type {({children: ({label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number})[], label: string, value: number}|{children: ({label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number})[], label: string, value: number})[]}
 */

const growthAction = [{
    value: 1,
    label: '积分增加',
    children: [{
        value: 101,
        label: '活动赠送'
    }, {
        value: 102,
        label: '小游戏获取'
    }, {
        value: 103,
        label: '线上消费累积'
    }, {
        value: 104,
        label: '线下消费累积'
    }, {
        value: 105,
        label: '拼团消费累积'
    }, {
        value: 106,
        label: '注册赠送'
    }, {
        value: 107,
        label: '签到赠送'
    }, {
        value: 108,
        label: '手动调整等级累积'
    }, {
        value: 109,
        label: '订单补录'
    }, {
        value: 110,
        label: '手动增加'
    }, ]
}, {
    value: -1,
    label: '积分减少',
    children: [{
        value: 201,
        label: '积分商品兑换'
    }, {
        value: 202,
        label: '拼团退单扣减'
    }, {
        value: 203,
        label: '手动扣减'
    }, {
        value: 204,
        label: '手动调整等级扣减'
    },  {
        value: 205,
        label: '积分过期'
    }, {
        value: 206,
        label: '线上退款扣减'
    }, {
        value: 207,
        label: '线下退款扣减'
    }, ]
}]

export { growthAction }