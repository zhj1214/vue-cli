<template>
    <view class="detail_box">
        <view style="width:100%;height:auto;position:relative;">
            <navBar title="活动详情" 
            :backBtn="true" 
            :homeBtn="true"
            background="inherit"
            style="position: absolute; top: 0px"
            backgroundColorTop="inherit"></navBar>
            <image v-if="dataForm.logo" style="display：block;width: 100%;" :src="dataForm.logo" mode=""></image>
            </view>
        <view class="detail_box">
           <view class="title">{{dataForm.title}}</view>
           <view class="viewNum">
               <image style="width:12px;height:12px;margin-right:3px;position:relative;top:2px" src="https://eos-wuxi-1.cmecloud.cn/crmoss/3e9370b6-12f2-4ab0-a081-bea945c655ce.png"></image>
               {{dataForm.pvNum}}
            </view>
        </view>
        <view class="swiperBox">
            <swiper style="min-height: 305px!important;" :autoplay="true" :current="currentIndex" @change='swiperTab'>
                <swiper-item v-for="(item,index) in list" :key="index">
                   <view class="swiper_item">
                       <view class="content">
                           <view class="title">
                               {{item.title}}
                               <view class="status" :style="{background:item.status==2?'#FE5D4D':'#9A9A9A'}">{{item.status==1?'未开始':item.status==2?'进行中':'已结束'}}</view>
                            </view>
                            <view class="inforC">
                               <view class="info">
                                   报名方式<text class="common_t">线上报名</text>
                               </view>
                               <view class="info">
                                   报名费用<text class="common_t">{{item.pay&&item.pay[0].amount || 0}}{{item.pay&&item.pay[0].type==1?'积分':'元' || '元'}}</text>
                               </view>
                               <view class="info">
                                   报名人数<text class="common_t">{{item.totalNumber - item.remainNumber}}/{{item.totalNumber}}</text>
                               </view> 
                               <view class="info">
                                   活动时间<text class="common_t">{{getTime(item.beginTime)}}-{{getTime(item.endTime)}}</text>
                               </view>
                               <view class="info">
                                   活动地点<text class="common_t">{{item.address}}</text>
                               </view>
                               <view class="info" v-if="item.signupBeginTime && item.signupEndTime">
                                   报名时间<text class="common_t">{{getTime(item.signupBeginTime)}}-{{getTime(item.signupEndTime)}}</text>
                               </view>
                           </view>
                           <view class="inforC" v-if="type==2">
                               <view class="info">
                                   活动人数<text class="common_t">{{item.signNum}}/{{item.totalNum}}</text>
                               </view>
                               <view class="info">
                                   活动地点<text class="common_t">{{item.address}}</text>
                               </view>
                               <view class="info">
                                   活动时间<text class="common_t">{{item.time}}</text>
                               </view>
                           </view>
                           <view class="counp_box" v-if="type==2">活动领券<view class="btn">满100减20</view><view class="btn">满100减20</view></view>
                       </view>
                       <view class="right_border" v-if="index !== list.length-1"></view>
                   </view>
                </swiper-item>
           </swiper>
        </view>
        <view class="common_title">活动详情</view>
        <view v-html="dataForm.content" class="content_detail"></view>
        <view v-if="!isOnlyPreview">
        <button class="btnStyle unSignStyle" v-if="signupConf == 1 && (status == 1 || status == 3)">{{status==1?'未开始':'已结束'}}</button>
        <button class="btnStyle" :class="canSign==0?'canSignStyle':'unSignStyle'" :disabled="canSign==0?false:true" @click="signHandle(canSign)" v-if="(status == 2 || status == 1) && signupConf == 1">{{getSignName()}}</button>
        </view>
        <coupons v-if="couponsVisable"></coupons>
        <payWay v-if="payModalVisable" ref="payModal" @closeHandle="closeHandle"></payWay>
    </view>
</template>
<script>
import coupons from '@/pageComponents/activity/coupons'
import payWay from '@/pageComponents/activity/payWay'
import Utils from '@/utils/h5utils/util.js'
export default {
    components:{coupons,payWay},
    data () {
        return {
            isOnlyPreview:false,
            dataForm:{},
            list: [],
            activityId: '', // 详情id
            type: 1, // 1、报名活动 2、领劵活动
            customStyle:{
                background:'#F2F2F2',
                color:'#BFBFBF',
                fontSize:'14px',
                width: 'calc(100% - 80rpx)',
                position: 'fixed',
                left: '40rpx',
                bottom: '20px',
                border: 0
            },
            couponsVisable: false,
            payModalVisable: false,
            currentIndex: 0,
            status: '', // 场次报名状态.
            canSign: '', // 是否可以报名
            activityItemId: '', // 场次id
            signupConf: '' // 1、需要报名 2、不需要报名
        }
    },
    onLoad: function (option) {
        this.activityId = option.activityId || ''
        uni.$scene.setScene(option);
        this.init()
    },
    mounted () {
    },
    methods: {
        async init(){
            await uni.$scene.next(async ({ sceneObj }) => {
                if(!uni.$localStorage.getItem('Token')){
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return false
				}
                try {
                    this.activityId = sceneObj.paramsId
                    this.isOnlyPreview = true;
                } catch (error) {
                console.error(error);
                } finally {
                return true; // 标识场景结束
                }
            });
            this.loadDetail(this.activityId);
        },
        loadDetail (activityId) {
            uni.$api.apiRequest('getActivityDetail', {
                orgId: uni.$localStorage.getItem('orgId'),
                uid: uni.$localStorage.getItem('memberId'),
                openid: uni.$localStorage.getItem("userOpenId"),
                activityId
            }).then(res => {
                if (res.code==10000&&res.data) {
                    this.dataForm = {
                        ...this.dataForm,
                        ...res.data
                    }
                    if (this.dataForm.content) {
                        this.dataForm.content = this.dataForm.content.replace('请编辑内容', '')
                    }
                    this.list = res.data.itemList || []
                    if (this.list&&this.list.length) {
                        this.status = this.list[this.currentIndex].status
                        this.canSign = this.list[this.currentIndex].canSign
                        this.activityItemId = this.list[this.currentIndex].id
                        this.signupConf = this.list[this.currentIndex].signupConf
                    }
                }
            })
        },
        getTime (time) {
            if (!time) {
                return
            }
            // Utils.getTimeFormat("YYYY-MM-DD HH:mm",new Date(Number(time)))
            return  new Date(time).Format('YYYY-MM-DD HH:mm') 
        },
        swiperTab (e) {
            this.currentIndex = e.detail.current
            this.activityItemId = this.list[this.currentIndex].id
            this.signupConf = this.list[this.currentIndex].signupConf
            this.canSign = this.list[this.currentIndex].canSign
            this.status = this.list[this.currentIndex].status
        },
        getSignName () {
            if (this.canSign==0) {
                return '立即报名'
            } else if (this.canSign==1) {
                return '抱歉，您不在客群中'
            } else if (this.canSign==2) {
                return ' 已报名'
            } else if (this.canSign==3) {
                return '已满额'
            } else if (this.canSign==4) {
                return '报名未开始'
            } else if (this.canSign==5) {
                return '报名已结束'
            }
        },
        // 立即报名
        signHandle (canSign) {
            uni.$util.currentClockin() // 点亮
            if (canSign==0) {
                this.payModalVisable = true
                this.$nextTick(()=> {
                    this.$refs.payModal.activityId=this.activityId
                    this.$refs.payModal.activityItemId=this.activityItemId
                    this.$refs.payModal.init()
                })
            } else if (canSign==3) {
                return uni.showToast({title: '报名场次已满!'})
            }
        },
        // 支付
        closeHandle () {
            this.payModalVisable = false
        }
    }
}
</script>
<style lang="less" scoped>
.detail_box {
    width: 100%;
    height: auto;
    margin-bottom: 120rpx;
    overflow: hidden;
    .common_title {
        width: calc(100% - 80rpx);
        height: auto;
        overflow: hidden;
        margin: 28rpx auto 0;
    }
    .detail_box {
       width: calc(100% - 80rpx);
       height: auto;
       overflow: hidden;
       margin: 28rpx auto 0;
       .title {
           font-size: 36rpx;
           color: #2E2E2E;
           font-weight: 500;
           margin-bottom: 20rpx;
       }
       .viewNum {
           height: 28rpx;
           line-height: 28rpx;
           font-size: 22rpx;
           color: #9A9A9A;
       }
    }
    .swiperBox {
        width: calc(100% - 40rpx);
        height: auto;
        margin: 28rpx 0 0 40rpx;
        .swiper_item {
           width: 100%;
        //    height:440rpx;
           position: relative;
           overflow: hidden;
           .content {
               width: 670rpx;
            //    height: 440rpx;
               border:1px solid #E1E6EB;
               border-radius: 8rpx;
               padding: 36rpx;
               .title {
                    font-size: 32rpx;
                    color: #474747;
                    padding-bottom: 24rpx;
                    border-bottom: 1px solid #DADADA;
                    overflow: hidden;
                    .status {
                        width: 53px;
                        height: 18px;
                        line-height: 18px;
                        text-align: center;
                        font-size: 11px;
                        color: #FFFFFF;
                        border-radius: 9px;
                        background-color: #FE5D4D;
                        float: right;
                    }
                }
                .inforC {
                    width: 100%;
                    height: auto;
                    margin: 24rpx auto 20rpx;
                    overflow: hidden;
                    .info {
                        width: 100%;
                        margin-bottom: 20rpx;
                        font-size: 14px;
                        color: #8E8E8E;
                        .common_t {
                            color: #444444;
                            margin-left: 40rpx;
                        }
                    }
                    .info:nth-last-child(1) {
                        margin-bottom: 0;
                    }
                }
                .counp_box {
                    width: 100%;
                    height: 42rpx;
                    line-height: 42rpx;
                    padding: 28rpx 0;
                    font-size: 28rpx;
                    color: #8E8E8E;
                    border-top: 1px solid #DADADA;
                    .btn {
                        width: 156rpx;
                        text-align: center;
                        height: 42rpx;
                        line-height: 42rpx;
                        font-size: 24rpx;
                        color: #FFFFFF;
                        background-color: #FE5D4D;
                        border-radius: 24rpx;
                        display: inline-block;
                        margin-left: 40rpx;
                    }
                }
           }
           .right_border {
               width: 670rpx;
               height: 100%;
               border:1px solid #E1E6EB;
               border-radius: 8rpx;
               position: absolute;
               right: -646rpx;
               top: 0;
           }
       }
    }
    .content_detail {
        width: calc(100% - 80rpx);
        height: auto;
        margin: 40rpx auto 200rpx;
        word-break:break-all;word-wrap:break-word;
        rich-text {
            word-break:break-all;word-wrap:break-word;
        }
    }
    .btnStyle {
        width: calc(100% - 80rpx);
        text-align: center;
        height: 46px;
        line-height: 46px;
        font-size: 14px;
        position: fixed;
        left: 40rpx;
        bottom:40px;
        z-index: 1;
    }
    .btnStyle::after {
        border: 0;
    }
    .canSignStyle {
        background: #FE5D4D;
        color: #FFFFFF;
    }
    .unSignStyle {
        background: #F2F2F2;
        color: #BFBFBF;
    }
}
</style>
