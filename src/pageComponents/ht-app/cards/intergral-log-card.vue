<template>
  <view class="ht-intergral-log-card">
    <view class="card__left">
      <image :src="card.imgUrl" class="left__img" ></image>
      <view class="left__body">
        <view class="left__body--item top">商场名称：{{card.orgName}}</view>
        <view class="left__body--item bottom">提交日期：{{card.createTimeStr}}</view>
      </view>
    </view>
    <view class="card__right">
      <view :class="statusClass">
        {{statusName}}
      </view>
    </view>
  </view>
</template>

<script>

const ENUM_MAP = {
  3: {
    name: '审核中',
    color: '#FAAD14',
    class: 'processing'
  },
  1: {
    name: '已通过',
    color: '#52C41A',
    class: 'success'
  },

  2: {
    name: '未通过',
    color: '#FF4D4F',
    class: 'error'
  },
}

export default {
  name: 'ht-intergral-log-card',
  props: {
    card: {
      type: Object,
      default(){
        return {
          status: 1
        }
      }
    }
  },
  data(){
    return {
      status_map: ENUM_MAP
    }
  },
  computed: {
    statusClass() {
      if(!this.card.status) return 'card__right--tag';
      return this.status_map[this.card.status].class ? 'card__right--tag ' + this.status_map[this.card.status].class: 'card__right--tag'
    },
    statusName() {
      return this.status_map[this.card.status].name
    }
  }
};
</script>

<style lang="less" scoped>
.ht-intergral-log-card {
  margin-bottom: 20rpx;
  padding: 36rpx 40rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0px 0px 30rpx -4rpx rgba(0, 0, 0, 0.08);
  .card{
    &__left{
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 20rpx;
      color: #444;
      .left__img{
        margin-right: 24rpx;
        width: 68rpx;
        height: 68rpx;
        border-radius: 4rpx;
        // background-color: #D8D8D8;
      }
      .left__body{
        height: 68rpx;
        .left__body--item{
          height: 30rpx;
        }
        .bottom{
          margin-top: 8rpx;
        }
      }
    }
    &__right{
      &--tag{
        position: relative;
        padding-left: 20rpx;
        font-size: 20rpx;
        color: #9D9D9D;
        &::after{
          position: absolute;
          content: ' ';
          top: 50%;
          transform: translateY(-50%);
          left: 0;
          width: 10rpx;
          height: 10rpx;
          background-color: #9D9D9D;
          border-radius: 50%;
        }
        &.default{
          color: #9D9D9D;
          &:after{
              background-color: #9D9D9D;
          }
        }
        
        &.success{
          color: #52C41A;
          &:after{
              background-color: #52C41A;
          }
        }
        &.processing{
          color: #FAAD14;
          &:after{
              background-color: #FAAD14;
          }
        }
        &.error{
          color: #FF4D4F;
          &:after{
              background-color: #FF4D4F;
          }
        }
      }
      
    }
  }
}
</style>
