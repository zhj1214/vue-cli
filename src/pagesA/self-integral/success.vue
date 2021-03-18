<template>
  <view class="page-self-intergral-success">
    <view class="card">
      <view class="status-bar" style="color: #52C41A;">
        <image
          class="icon"
          src="/static/images/self-integral/success.png"
        ></image>
        <text class="text">小票提交成功</text>
      </view>

      <view class="tip-bar">
        <view>
          客服人员正在审核
        </view>
        <view>
          建议留存小票至积分成功哦！
        </view>
      </view>

      <view class="btn-wrap">
         <button class="btn" hover-class="hover" @tap="jumpBack">返回自助积分</button>
       </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'page-self-intergral-success',
  data(){
    return {}
  },
  methods: {
    jumpBack(){
      uni.navigateBack()
    }
  }
};
</script>

<style lang="less" scoped>
.page-self-intergral-success {
  .card{
    margin-top: 50%;
  }
  .status-bar {
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

  .tip-bar{
    text-align: center;
    color: #929497;
    line-height: 1.6;
  }

  .btn-wrap{
    margin-top: 60rpx;
     text-align: center;
      .btn{
        display: inline-block;
        padding: 20rpx 40rpx;
        font-size: 32rpx;
        color: #2E2E2E;
        line-height: 24px;
        background-color: #fff;
        border-color: #7F7F7F;
        &.hover{
          opacity: .8;
        }
      }
    }
}
</style>
