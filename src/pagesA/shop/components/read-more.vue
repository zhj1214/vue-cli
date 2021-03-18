<template>
  <view class="app-shop-read-more">
    <view class="">{{content}}</view>
  </view>
</template>

<script>
const screenWidth = uni.getSystemInfoSync().screenWidth;
const oneLineWidth = screenWidth/375 * 335;

export default {
  name: 'app-shop-read-more',
  props: {
    content: {
      type: String,
      default(){
        return 'Fdsa方式大师傅大法师发生的撒法沙发沙发安德森法大师傅大师傅阿斯弗爱的色放爱的色放啊书法大赛'
      }
    },
    fontSize: {
      type: Number,
      default: 14
    },
    line: {
      type: Number,
      default: 2
    }
  },
  mounted(){
    this.calc()
  },
  methods: {
    calc(){
      console.log(this.content.length * this.fontSize)
      console.log(oneLineWidth)
    }
  }
};
</script>

<style lang="less" scoped>
.app-shop-read-more {
  padding: 20rpx 40rpx;

}
</style>
