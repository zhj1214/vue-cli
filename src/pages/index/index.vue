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
import { ref } from "vue";
const title = ref("Hello");
const list = [
  {
    text: "点赞",
    color: "blue",
    fontSize: 28,
  },
  {
    text: "分享",
  },
  {
    text: "评论",
  },
];
const show = ref(false);
const showView = () => {
  show.value = true;
};
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
