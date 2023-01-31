<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <u-button @click="showView">月落</u-button>

    <view>是大S大萨达所多按时</view>
    <u-action-sheet :list="list" v-model="show"></u-action-sheet>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'

const app = getCurrentInstance() //获取上下文实例，ctx=vue2的this

const title = ref('Hello')
const list = [
  {
    text: '点赞',
    color: 'blue',
    fontSize: 28
  },
  {
    text: '分享'
  },
  {
    text: '评论'
  }
]
const show = ref(false)
// setup 中的代码错误
// let aa = b
// 事件中的代码错误
const showView = () => {
  setTimeout(() => {
    let a = null
    if (a.length > 1) {
      // ...
    }
    return a
  }, 1000)
  show.value = true
}

onMounted(() => {
  // uni.$api.getDetil1({ sources: '1,2', fff: 111 }).then((res) => {
  //   console.log('getDetil1:', res)
  // })
  // uni.$api
  //   .getDetil0({
  //     id: 245183,
  //     dms: 245183,
  //     poiLocationId: '3686412523520720924',
  //     longitude: 120.153576,
  //     latitude: 30.287459
  //   })
  //   .then((res) => {
  //     console.log('getDetil0:', res)
  //   })
})
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
