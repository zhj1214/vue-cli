<template>
    <view class="signOk" >
        <view style="width:100%;height:auto;position:relative;">
            <navBar 
              title="活动报名" 
              :backBtn="true" 
              :homeBtn="true"
              background="inherit"
              style="position: absolute; top: 0px"
              backgroundColorTop="inherit"></navBar>
            <image style="display：block;width:100%" :src="bgUrl" mode=""></image>
        </view>
        <view class="title">报名失败</view>
        <view class="reason_content">
            很抱歉，我们会将已支付的现金和积分原路返回，报名失败原因如下： 
            <view class="reason">1.支付失败。请重新报名所选场次</view>
            <view class="reason">2.网络延迟。如已扣款请联系客服人员</view> 
            <view class="reason">3.报名人数超额或超时。可联系客服人员查询详情</view>
        </view>
        <u-button :custom-style="customStyle" @click="backHandle">返回活动中心</u-button>
    </view>
</template>
<script>
export default {
    data () {
        return {
            bgUrl: 'https://eos-wuxi-1.cmecloud.cn/crmoss/2fb2e5a2-fd10-47de-be46-efdfdcf96ee5.png',
            customStyle:{
                background:'#FE5D4D',
                color:'#ffffff',
                fontSize:'14px',
                width: 'calc(100% - 80rpx)'
            }
        }
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
    .reason_content {
        width: 80%;
        height: auto;
        margin: 24rpx auto 272rpx;
        font-size: 28rpx;
        color: #878787;
        .reason {
            margin-top: 8rpx;
        }
    }
}
</style>