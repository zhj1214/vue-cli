<template>
    <view class="coupons">
       <view class="shadow"></view>
       <view class="coupons_con">
           <view class="box">
               <view class="title">
                   领取优惠券
                   <image style="width: 20px;height:20px;position:absolute;top:14px;right:0px;" src="https://eos-wuxi-1.cmecloud.cn/crmoss/6bf6f09f-8805-416a-9c66-b5900e0a7e45.png" mode=""></image>
                </view>
               <view class="list_con">
                   <view class="list">
                       <image style="display：block;width: 90px;height:90px" src="https://eos-wuxi-1.cmecloud.cn/crmoss/f0903842-7e38-49cf-a2d6-f3b89233d399.png" mode=""></image>
                       <view class="detail">
                           <view class="type">满减券</view>
                           <view class="price">
                               <view class="left_c">50.00<text>元</text></view>
                               <view class="right_c" @click="takeTiketHandle">免费领取</view>
                           </view>
                           <view class="time">2018.11.02 ~ 2019.11.02</view>
                       </view>
                   </view>
                   <view class="list">
                       <image style="display：block;width: 90px;height:90px" src="https://eos-wuxi-1.cmecloud.cn/crmoss/f0903842-7e38-49cf-a2d6-f3b89233d399.png" mode=""></image>
                       <view class="detail">
                           <view class="type">满减券</view>
                           <view class="price">
                               <view class="left_c">50.00<text>元</text></view>
                               <view class="right_c" @click="takeTiketHandle">免费领取</view>
                           </view>
                           <view class="time">2018.11.02 ~ 2019.11.02</view>
                       </view>
                   </view>
               </view>
               <u-button :custom-style="customStyle" @click="backHandle">完成</u-button>
           </view>
       </view>
    </view>
</template>
<script>
export default {
    data () {
        return {
            customStyle:{
                background:'#ffffff',
                color:'#000000',
                fontSize:'14px',
                width: '100%',
                marginBottom: '20px',
                border: '1px solid #BFBFBF'
            }
        }
    },
    methods: {
        takeTiketHandle () {
            uni.$util.currentClockin() // 点亮
            uni.showToast({
                title: '领劵成功',
                icon: '成功'
            });
        }
    }
}
</script>
<style lang="less" scoped>
.coupons {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    .shadow {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(11, 11, 11, 0.65);
    }
    .coupons_con {
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        bottom:0;
        background: #ffffff;
        border-radius: 9px 9px 0px 0px;
        .box {
            width: calc(100% - 80rpx);
            height: auto;
            margin: 0 auto;
            overflow: hidden;
            .title {
                height: 96rpx;
                line-height: 96rpx;
                font-size: 28rpx;
                color: #000000;
                border-bottom: 1px solid#E5E5E5;
                position: relative;
            }
            .list_con {
                width: 100%;
                height: auto;
                background: #F9F9F9;
                margin: 27rpx 0 50rpx;
                position: relative;
                .list {
                    width: 100%;
                    height: auto;
                    background: #ffffff;
                    margin-bottom: 20rpx;
                    display: flex;
                    flex-direction: row;
                    .detail {
                        width: calc(100% - 180rpx);
                        height: 180rpx;
                        padding: 0 24rpx;
                        .type {
                            width: 100%;
                            font-size: 24rpx;
                            color: #222222;
                            line-height: 1;
                            margin-top: 28rpx;
                        }
                        .price {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            width: 100%;
                            height: 62rpx;
                            .left_c {
                                height: 62rpx;
                                font-size: 48rpx;
                                color: #FE5D4D;
                                font-weight: bold;
                                text {
                                    font-size: 24rpx;
                                    color: #FE5D4D;
                                    margin-left: 8rpx;
                                }
                            }
                            .right_c {
                                width: 136rpx;
                                height: 50rpx;
                                line-height: 50rpx;
                                text-align: center;
                                font-size: 24rpx;
                                color: #FE5D4D;
                                border-radius: 26rpx;
                                border: 1px solid #FE5D4D;
                                position: relative;
                                top:6rpx;
                            }
                        }
                        .time {
                            font-size: 24rpx;
                            color: #929497;
                            margin-top: 4rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>