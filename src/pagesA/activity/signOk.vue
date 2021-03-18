<template>
    <view class="signOk" >
        <view style="width:100%;height:auto;position:relative;">
            <navBar title="活动报名" 
            :backBtn="true" 
            :homeBtn="true"
            background="inherit"
            style="position: absolute; top: 0px"
            backgroundColorTop="inherit"></navBar>
            <image style="display：block;width:100%" :src="bgUrl" mode="widthFix"></image>
        </view>
        <view class="title">恭喜您，报名成功！</view>
        <view class="view">您已成功报名《{{activityItemTitle}}》，可到我的<br/>活动中查看已报名活动</view>
        <view class="pay_content">
            <view class="colum" style="margin-bottom:10px">
                <text>支付方式</text><text style="color:#444444">{{payType==1?'积分支付':'现金支付'}}</text>
            </view>
            <view class="colum">
                <text>支付金额</text><text style="color:#FE5D4D">-{{amount}}{{payType==1?'积分':'元'}}</text>
            </view>
        </view>
        <u-button :custom-style="customStyle" @click="backHandle">返回活动中心</u-button>
    </view>
</template>
<script>
export default {
    data () {
        return {
            bgUrl: 'https://eos-wuxi-1.cmecloud.cn/crmoss/c286662b-9dc7-4434-9d9b-09bab9edae71.png',
            customStyle:{
                background:'#FE5D4D',
                color:'#ffffff',
                fontSize:'14px',
                width: 'calc(100% - 80rpx)'
            },
            payType: '',
            amount: '',
            activityItemTitle: ''
        }
    },
    onLoad: function (option) {
        console.log('option--ok',option)
        this.activityItemTitle = option.activityItemTitle
        this.amount = option.amount || 0
        this.payType = option.payType || 2

    },
    methods: {
        backHandle () {
            uni.reLaunch({
                url: '/pagesA/activity/activityList'
            })
        }
    }
}
</script>
<style lang="less" scoped>
.signOk {
    .title {
        width: 100%;
        text-align: center;
        font-size: 40rpx;
        color: #4F4F4F;
        font-weight: 500;
    }
    // .img_box {
    //     width: 100%;
    //     height: auto;
    //     background: url('https://eos-wuxi-1.cmecloud.cn/crmoss/c286662b-9dc7-4434-9d9b-09bab9edae71.png') no-repeat left top;
    //     background-size: 100% auto;
    // }
    .view {
        width: 80%;
        text-align: center;
        font-size: 28rpx;
        color: #878787;
        margin: 24rpx auto 56rpx;
        font-weight: 400;
    }
    .pay_content {
        width: calc(100% - 80rpx);
        margin: 0 auto 160rpx;
        padding: 24rpx 0;
        border-top: 1px solid #DADADA;
        border-bottom: 1px solid #DADADA;
        .colum {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            text {
                font-size: 30rpx;
                color: #8E8E8E;
            }
        }
    }
}
</style>