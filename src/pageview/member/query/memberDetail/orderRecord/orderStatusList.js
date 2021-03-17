/**
 * 订单记录表格筛选
 * @type {({label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number}|{label: string, value: number})[]}
 */
const orderStatusList = [{
    value: '',
    label: '全部'
}, {
    value: 0,
    label: '待支付'
}, {
    value: 1,
    label: '待发货'
}, {
    value: 2,
    label: '待收货'
}, {
    value: 3,
    label: '待提货'
}, {
    value: 4,
    label: '交易完成'
}, {
    value: 5,
    label: '已关闭'
}, {
    value: 6,
    label: '退款/售后'
},  ]

const refundStatusList = [{
    value: '',
    label: '全部'
}, {
    value: 1,
    label: '退款中'
}, {
    value: 2,
    label: '退款成功'
}, {
    value: 3,
    label: '退款关闭'
},  ]

const expressTypeList = [{
    value: '',
    label: '全部'
}, {
    value: 1,
    label: '快递'
}, {
    value: 2,
    label: '自提'
}, {
    value: 3,
    label: '系统'
}, ]

const orderSourceList = [{
    value: '',
    label: '全部'
}, {
    value: '',
    label: '在线商城'
},]



export { orderStatusList, expressTypeList, orderSourceList, refundStatusList }