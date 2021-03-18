<template>
    <view class="payWay">
        <view class="shadow"></view>
        <view class="pay_cont">
            <view class="title">支付方式
                <image style="width: 20px;height:20px;position:absolute;top:14px;right:20px;" src="https://eos-wuxi-1.cmecloud.cn/crmoss/6bf6f09f-8805-416a-9c66-b5900e0a7e45.png" mode="" @click="closeHandle"></image>
            </view>
            <view class="list">
                <view class="detail" :class="checkIndex==index?'active': ''" v-for="(item,index) in payWayList" :key="index" @click="choosePayWay(index)">
                    <image style="width:16px;height:16px;position:relative;top:2px" v-if="item.type==1"  src="https://eos-wuxi-1.cmecloud.cn/crmoss/22841473-4802-4622-8c36-35e60250b5d8.png" mode=""></image>
                    <image style="width:16px;height:16px;position:relative;top:2px" v-if="item.type==2" src="https://eos-wuxi-1.cmecloud.cn/crmoss/cf365eb0-d3c6-4ce4-8c1d-d5d5bf28fd37.png" mode=""></image>
                    <view class="pay">{{item.type==1?'积分支付':'微信支付'}}</view>
                    <image v-if="checkIndex==index" style="width:20px;height:20px;position:absolute;right:14px;top:20px;" src="https://eos-wuxi-1.cmecloud.cn/crmoss/f300c71a-7d4c-4320-84a6-efc4cb15c8df.png" mode=""></image>
                    <image v-if="checkIndex!==index" style="width:20px;height:20px;position:absolute;right:14px;top:20px;" src="https://eos-wuxi-1.cmecloud.cn/crmoss/7f3c55f3-c9f8-4e29-9e3f-43fb39663d26.png" mode=""></image>
                </view>
                <!-- <view class="detail">
                    <image style="width:16px;height:16px;position:relative;top:2px" src="https://eos-wuxi-1.cmecloud.cn/crmoss/cf365eb0-d3c6-4ce4-8c1d-d5d5bf28fd37.png" mode=""></image>
                    <view class="pay">微信支付</view>
                    <image style="width:20px;height:20px;position:absolute;right:14px;top:20px;" src="https://eos-wuxi-1.cmecloud.cn/crmoss/7f3c55f3-c9f8-4e29-9e3f-43fb39663d26.png" mode=""></image>
                </view> -->
            </view>
        </view>
        <view class="footer">
            <view class="f_cont">
                <view class="sum">
                    <view style="font-size:12px;color:#000000;">合计：</view>
                    <view style="font-size:16px;color:#FF4C4C;">{{amount}}{{unit}}</view>
                </view>
                <view class="order" @click="submitOrder">提交订单</view>
            </view>
        </view>
        <u-modal v-model="payConfirmModalVisable" title="确认支付" :content="content" :mask-close-able="true" :show-cancel-button="true"  @confirm="confirm">
        </u-modal>
    </view>
</template>
<script>
export default {
    data () {
        return{
            activityId: '',
            activityItemId: '',
            checkIndex: 0,
            payWayList: [],
            amount: 0,
            unit: '元',
            type: '',
            content: '您将支付：0积分 用于活动报名',
            payConfirmModalVisable:false
        }
    },
    methods: {
        init () {
            uni.$api.apiRequest('getPayInfo', {
                orgId: uni.$localStorage.getItem('orgId'),
                uid: uni.$localStorage.getItem('memberId'),
                activityItemId: this.activityItemId
            }).then(res => {
                if (res.code==10000&&res.data) {
                    this.payWayList = res.data.pay
                    if (this.payWayList&&this.payWayList.length) {
                        this.amount = this.payWayList[0].amount
                        this.type = this.payWayList[0].type
                        this.unit = this.payWayList[0].type==1?'积分':'元'
                    }
                }
            })
        },
        // 选择支付方式
        choosePayWay (index) {
            this.checkIndex = index
            this.amount = this.payWayList[this.checkIndex].amount
            this.type = this.payWayList[this.checkIndex].type
            this.unit = this.payWayList[this.checkIndex].type==1?'积分':'元'
        },
        // 提交订单
        submitOrder () {
            this.content = `您将支付：${this.amount}${this.type==1?'积分':'元'} 用于活动报名`
            this.payConfirmModalVisable = true
        },
        // 确认支付
        confirm () {
            this.payConfirmModalVisable = false
            uni.$api.apiRequest('getOrderPay', {
                orgId: uni.$localStorage.getItem('orgId'),
                openId: uni.$localStorage.getItem("userOpenId"),
                uid: uni.$localStorage.getItem('memberId'),
                activityItemId: this.activityItemId,
                activityId: this.activityId,
                payType: this.type,
                amount: this.amount
            }).then(res => {
                console.log('getOrderPay',res)
                if (res.code==10000&&res.data) {
                    if (this.type==1) {
                        // 积分支付
                        let {orderId} = res.data
                        orderId && this.getOrderDetail(orderId)
                    } else {
                        // 现金支付
                        this.getWeixinPay(res.data)
                    }
                } else if (res.code==60000) {
                    uni.showToast({title: res.message})
                    setTimeout(()=>{
                      this.$emit('closeHandle')
                    },3000)
                }
            })
        },
        // 微信支付
        getWeixinPay (data) {
            const {timeStamp,nonceStr,signType,paySign,packageInfo,orderId} = data
            let that = this
            wx.requestPayment(
                {
                'timeStamp': timeStamp,
                'nonceStr': nonceStr,
                'package': packageInfo,
                'signType': signType,
                'paySign': paySign,
                'success':function(res){
                   console.log('resrequestPayment',res)
                   that.getOrderDetail(orderId)
                },
                'fail':function(res){},
                'complete':function(res){}
            })
        },
        // 下单结果
        getOrderDetail (orderId) {
            uni.$api.apiRequest('getOrderDetail', {
                orderId: orderId,
            }).then(res => {
                if (res.code==10000&&res.data) {
                    if (res.data.payStatus==20) { // payStatus 20 已支付 -1 未支付 50支付失败
                        // 跳转报名成功页面1
                        uni.navigateTo({
                            url: `/pagesA/activity/signOk?payType=${res.data.payType}&amount=${res.data.amount}&activityItemTitle=${res.data.activityItemTitle}` // payType 1. 积分支付 2. 现金支付
                        })
                    } else {
                        // 跳转报名失败页面
                        uni.navigateTo({
                            url: `/pagesA/activity/signFail`
                        })
                    }
                }
            })
        },
        // 关闭支付弹框
        closeHandle () {
            this.$emit('closeHandle')
        }
    }
}
</script>
<style lang="less" scoped>
.payWay {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99999;
    overflow: hidden;
    .shadow {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(11, 11, 11, 0.65);
    }
    .pay_cont {
        width: 100%;
        padding: 20px;
        height: auto;
        margin: 0 auto;
        background-color: #F9F9F9;
        position: absolute;
        left: 0;
        bottom: 136rpx;
        .title {
            font-size: 32rpx;
            color: #2E2E2E;
            margin-bottom: 24rpx;
        }
        .list {
            width: 100%;
            height: auto;
            overflow: hidden;
            background-color: #F9F9F9;
            .detail {
                width: 100%;
                height: auto;
                overflow: hidden;
                display: flex;
                flex-direction: row;
                margin-bottom: 24rpx;
                position: relative;
                border: 1px solid #D8D8D8;
                border-radius: 4px;
                padding: 19px 14px;
                background-color: #ffffff;
                .pay {
                    height: 40rpx;
                    line-height: 40rpx;
                    margin-left: 20rpx;
                    font-size: 28rpx;
                    color: #2E2E2E;
                }
            }
            .active {
                border: 1px solid #FE5D4D;
            }
        }
    }
    .footer {
        width: 100%;
        padding: 24rpx 40rpx 36rpx;
        background: #ffffff;
        position: absolute;
        left: 0;
        bottom: 0;
        .f_cont {
            height: 92rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .sum {
                width: 300rpx;
            }
            .order {
                width: 246rpx;
                height: 9r2px;
                line-height: 92rpx;
                text-align: center;
                background: #FE5D4D;
                border-radius: 8rpx;
                font-size: 28rpx;
                color: #ffffff;
            }
        }
    }
}
</style>