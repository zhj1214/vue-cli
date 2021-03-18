<template>
    <view class="activityList" style="width:100%;height:100%;background:#F9F9F9">
        <navBar title="活动中心" :backBtn="true" :homeBtn="true"></navBar>
        <view class="swiper_box" v-if="swiperList&&swiperList.length">
             <swiper style="height: 200px;" :autoplay="true" :indicator-dots="true" indicator-color="rgba(0,0,0,0.5)" indicator-active-color="rgba(255,255,255,1)">
                <swiper-item v-for="(item,index) in swiperList" :key="index" @click="routerBanner(item.linkAddress)">
                    <image style="display：block;width: 100%;height: 200px;" :src="item.image" mode=""></image>
                </swiper-item>
             </swiper>
        </view>
        <view class="content_box">
            <view class="com_title">强力推荐</view>
            <view class="scroll_box">
                <swiper style="height: 164px;" next-margin="180">
                    <swiper-item v-for="(item,index) in bannerList" :key="index" class="swiper-item" @click="routerBanner(item.linkAddress)">
                        <view class="scroll_li" @click="routerDetail(item.activityId)">
                            <view class="status">{{item.status==1?'未开始':item.status==2?'进行中':'已结束'}}</view>
                            <view class="img_box">
                              <image :src="item.logo" mode=""></image>
                            </view>
                            <!-- <image style="display：block;width: 100%;" :src="item.logo" mode=""></image> -->
                            <view class="des">{{item.title}}</view>
                        </view>
                    </swiper-item>
                </swiper>
                <!-- <view class="scroll_ul" :style="{width: scrollWidth}">
                    <view class="scroll_li" v-for="(item,index) in bannerList" :key="index" @click="routerDetail(item.activityId)">
                        <view class="status">{{item.status==1?'未开始':item.status==2?'进行中':'已结束'}}</view>
                        <image style="display：block;width: 100%;" :src="item.logo" mode=""></image>
                        <view class="des">{{item.title}}</view>
                    </view>
                </view> -->
            </view>
            <view class="com_title">全部活动</view>
            <view class="page_list">
                <view class="list" v-for="item in dataList" :key="item.id" @click="routerDetail(item.activityId)">
                    <view class="img">
                      <view class="status" :class="item.status==2?'processing':'unstart'">{{item.status==1?'未开始':item.status==2?'进行中':'已结束'}}</view>
                      <image style="display：block;width: 100%;" :src="item.logo" mode=""></image>
                    </view>
                    <view class="infor">
                        <view class="title">{{item.title}}</view>
                        <view class="viewNum">
                            <!-- <image style="width:12px;height:12px;margin-right:3px;position:relative;top:2px" src="https://eos-wuxi-1.cmecloud.cn/crmoss/3e9370b6-12f2-4ab0-a081-bea945c655ce.png"></image> -->
                            <u-icon name="eye" color="#9A9A9A" size="24" style="width:12px;height:12px;margin-right:5px;position:relative;"></u-icon>
                            {{item.pvNum}}
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import navBar from '@/components/navBar/navBar'
export default {
    components:{navBar},
    data () {
        return {
            bannerList: [],
            scrollWidth: 0,
            dataList: [],
            page: 1,
            size: 5,
            count:0,
            swiperList: []
        }
    },
    mounted () {
        this.getBannerList()
        this.getHotList()
        this.getAllList()
    },
    methods: {
        // 拉取广告位数据
        getBannerList() {
            uni.$api.apiRequest('getActivityBannerList', {
                orgId: uni.$localStorage.getItem('orgId'),
                placement: 25,
            }).then(res => {
                if (res.code==10000&&res.data) {
                    this.swiperList = res.data || []
                }
            })
        },
        // 强力推荐活动数据
        getHotList () {
            uni.$api.apiRequest('getActivityList', {
                orgId: uni.$localStorage.getItem('orgId'),
                displayPosition: 2,
                status: [2]
            }).then(res => {
                if (res.code==10000&&res.data) {
                    this.bannerList = res.data.list
                    this.scrollWidth = 162 * this.bannerList.length + 10 * (this.bannerList.length - 1) + 'px'
                }
            })
        },
        // 全部活动数据1111
        getAllList () {
            uni.$api.apiRequest('getActivityList', {
                orgId: uni.$localStorage.getItem('orgId'),
                page: this.page,
                size: this.size
            }).then(res => {
                if (res.code==10000&&res.data) {
                    const data = res.data.list || []
                    this.dataList = this.dataList.concat(data)
                    this.count = res.data.count
                }
            })
        },
        // 详情跳转
        routerDetail (activityId) {
            activityId && uni.navigateTo({
                        url: `/pagesA/activity/activityDetail?activityId=${activityId}`
                    })
        },
        routerBanner (linkAddress) {
            console.log('linkAddress',linkAddress)
            linkAddress && uni.navigateTo({
                        url: linkAddress
                    })
        },
    },
    // 滑到底部触发分页
    onReachBottom () {
        let maxPage = Math.ceil(this.count / this.size)
        this.page++
        if (this.page <= maxPage) {
            this.getAllList()
        }
    }
}
</script>
<style lang="less" scoped>
.swiper_box {
    width: 100%;
    height: auto;
}
.content_box {
    width: calc(100% - 80rpx);
    height: auto;
    margin: 0 auto;
    overflow: hidden;
    .com_title {
        height: 44rpx;
        line-height: 44rpx;
        font-size: 32rpx;
        color: #2E2E2E;
        font-weight: 500;
        margin: 40rpx 0 24rpx;
    }
    .scroll_box {
        width: 100%;
        height: auto;
        // overflow-x: scroll;
        .scroll_ul {
            width: 100%;
            height: auto;
            overflow: hidden;
            display: flex;
            flex-direction: row;
        }
        .swiper-item {
            width: 162px;
            .scroll_li {
                width: 162px;
                // width: 100%;
                height: 328rpx;
                // float: left;
                background: #FFFFFF;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.04);
                border-radius: 8rpx;
                overflow: hidden;
                margin-right: 20rpx;
                position: relative;
                display: inline-block;
                .img_box {
                    width: 162px;
                    height: 100px;
                    border-radius: 4px;
                    overflow: hidden;
                    image {
                        display: block;
                        width: 162px;
                        height: 100px;
                    }
                }
                .des {
                    width: calc(100% - 40rpx);
                    height: auto;
                    margin: 20rpx auto 0;
                    font-size: 28rpx;
                    color: #444444;
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .status {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    width: 53px;
                    height: 18px;
                    line-height: 18px;
                    text-align: center;
                    color: #FFFFFF;
                    background-color: #fe5d4d;
                    border-top-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }
            .scroll_li:nth-last-child(1) {
                margin-right: 0
            }
        }
    }
    .scroll_box::-webkit-scrollbar {display: none;}
    .page_list {
        width: 100%;
        height: auto;
        overflow: hidden;
        .list {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            margin-bottom: 40rpx;
            .img {
                width: 260rpx;
                height: 160rpx;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
                .status {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    width: 53px;
                    height: 18px;
                    line-height: 18px;
                    text-align: center;
                    color: #FFFFFF;
                    background-color: #fe5d4d;
                    border-top-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
                .processing {
                    color: #FFFFFF;
                    background-color: #fe5d4d;
                }
                .unstart {
                    color: #FFFFFF;
                    background-color: #666666;
                }
                image {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .infor {
                width: 386rpx;
                height: 160rpx;
                overflow: hidden;
                position: relative;
                .title {
                    font-size: 28rpx;
                    color: #444444;
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .viewNum {
                    font-size: 24rpx;
                    color: #9A9A9A;
                    position: absolute;
                    left: 0;
                    bottom: 10rpx;
                }
            }
        }
    }
}
</style>
