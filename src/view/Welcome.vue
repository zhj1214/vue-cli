<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-02-20 11:00:58
 * @LastEditTime: 2020-10-10 19:06:41
 * @LastEditors: sam.xutao
 -->
<template>
  <div class="welcome-page">
    <h2 style="line-height: 500px; text-align: center;">
      <Icon type="ios-cafe" size="64" />
      <span style="font-size: 32px;"
        >欢迎 {{ $store.state.username || $store.state.phone }} , 银泰数字运营平台</span
      >
    </h2>
  </div>
</template>

<script>
  export default {
    name: 'Welcome',
  }
</script>
