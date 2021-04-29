<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-02-20 11:00:44
 * @LastEditTime: 2020-04-02 15:55:58
 * @LastEditors: sam.xutao
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      this.$store.dispatch('getAreaCityInfor') // 获取城市数据信息
    },
  }
</script>
<style lang="scss">
  @import url('./assets/scss/common.scss');
</style>
<style lang="scss">
  @import url('./assets/scss/admin-global.scss');
</style>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
