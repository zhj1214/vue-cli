<template>
  <view class="self-intergral-detail">
     <navBar title="自助积分记录" background="#fff" ext-class="fixed-bar"
            :home-btn="true"></navBar>
     <view class="status-bar" :style="'color: ' + status_map[detail.status].color">
       <image class="icon" :src="status_map[detail.status].icon"></image>
       <text class="text">{{status_map[detail.status].text}}</text>
     </view>

     <view class="detail-card">
       <view class="header">
         <image class="img" :src="detail.imgUrl" mode="widthFix"></image>
       </view>
       <view class="ceil">
         <view class="ceil--label">商场名称：</view>
         <view class="ceil--value">{{detail.orgName}}</view>
       </view>
       <view class="ceil">
         <view class="ceil--label">补录类型：</view>
         <view class="ceil--value">{{detail.recordWayStr}}</view>
       </view>
       <view class="ceil">
         <view class="ceil--label">提交时间：</view>
         <view class="ceil--value">{{detail.createTimeStr}}</view>
       </view>
       <view class="ceil">
         <view class="ceil--label">编号/ID：</view>
         <view class="ceil--value">{{detail.id}}</view>
       </view>
       <view class="ceil" v-if="detail.status == 1">
         <view class="ceil--label">消费店铺：</view>
         <view class="ceil--value">{{detail.shopName}}</view>
       </view>
       <view class="ceil" v-if="detail.status == 1">
         <view class="ceil--label">消费总金额：</view>
         <view class="ceil--value">{{detail.actualAmt}}元</view>
       </view>
       <view class="ceil" v-if="detail.status == 1">
         <view class="ceil--label">获得总积分：</view>
         <view class="ceil--value">{{detail.awardScore}}</view>
       </view>
       <view class="ceil" v-if="detail.status == 1">
         <view class="ceil--label">获得总成长值：</view>
         <view class="ceil--value">{{detail.awardGrowth}}</view>
       </view>
       <view class="ceil" v-if="detail.status == 2">
         <view class="ceil--label">原因：</view>
         <view class="ceil--value">{{detail.remark}}</view>
       </view>
       <view class="ceil" v-if="detail.status == 1||detail.status ==2">
         <view class="ceil--label">审核时间：</view>
         <view class="ceil--value">{{detail.reviewTimeStr}}</view>
       </view>
     </view>

     <view class="tip-card">
       <view class="btn-wrap">
         <button class="btn" hover-class="hover" @tap="jumpBack">返回自助积分</button>
       </view>
       <view class="text" v-if="detail.status == 1">
         <u-icon name="info-circle" color="#9B9B9B" size="28" margin-top="10rpx" top="4rpx"></u-icon>
         <text style="margin-left: 10rpx;font-size: 18rpx;">积分、成长值到账有延迟，请10分钟后查询，如有疑问请联系客服人员</text>
       </view>
     </view>
  </view>
</template>

<script>
export default {
  name: 'self-intergral-detail',
  data(){
    return {
      status_map: {
        3: {
          icon: '/static/images/self-integral/processing.png',
          text: '审核中',
          color: '#FAAD14'
        },
        1: {
          icon: '/static/images/self-integral/success.png',
          text: '审核通过',
          color: '#52C41A'
        },
        2: {
          icon: '/static/images/self-integral/error.png',
          text: '审核未通过',
          color: '#FF4D4F'
        },
      },
      detail: {
        // status: 2,
        // mallName: '恒太黄龙店',
        // imgUrl: 'https://eos-wuxi-1.cmecloud.cn/crmoss/ce960b93-f90d-4a93-8891-98ddabec56f4.png',
        // recodeType: '拍照积分',
        // updateDate: '2020-10-04',
        // uniqueCode: 123,
        // buyingShop: 'nike旗舰店',
        // totalPrice: 200.99,
        // totalIntergral: 29,
        // totalGroth: 29,
        // checkDate: '2020-10-04'
      },
      uniqueCode:0
    }
  },
  onLoad(option) {
    this.uniqueCode = option.uniqueCode;
    this.getintegralDetail()
  },
   methods: {
    jumpBack(){
      uni.navigateBack()
    },
    /**
     * 获取积分详情
     */
    getintegralDetail() {
      uni.$api
        .apiRequest("integralDetail", {
          id: this.uniqueCode
        })
        .then((res) => {
          if (res.code == 10000) {
            this.detail = res.data;
          }
        })
    },
  }
};
</script>

<style lang="less" scoped>
.self-intergral-detail {
  background-color: #f9f9f9;
  .status-bar{
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48rpx 40rpx;
    text-align: center;
    background-color: #fff;
    .icon{
      margin-right: 20rpx;
      width: 52rpx;
      height: 52rpx;
    }
    .text{
      font-size: 40rpx;
      font-weight: bold;
    }
  }

  .detail-card{
    margin-bottom: 20rpx;
    padding: 48rpx 40rpx;
    background-color: #fff;

    .header{
      margin-bottom: 48rpx;
      text-align: center;
      .img{
        width: 240rpx;
        height: 240rpx;
      }
    }

    .ceil{
      display: flex;
      padding: 10rpx 0;
      justify-content: space-between;
      color: #2E2E2E;
      font-size: 28rpx;
      line-height: 44rpx;
      .ceil--value {
        text-align: right;
      }

      &--label{
        min-width: 200rpx;
        margin-right: 10rpx;
      }
    }

  }

  .tip-card{
    padding: 48rpx 40rpx;
    text-align: center;
    background-color: #fff;
    .btn-wrap{
      .btn{
        display: inline-block;
        padding: 20rpx 40rpx;
        font-size: 32rpx;
        color: #2E2E2E;
        line-height: 24px;
        background-color: #fff;
        &.hover{
          opacity: .8;
        }
      }
    }

    .text{
      margin-top: 74rpx;
      color: #9B9B9B;
      text {
       vertical-align: middle; 
      }
    }

  }
}
</style>
