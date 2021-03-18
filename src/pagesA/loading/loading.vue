<template>
  <view class="page-loading"> </view>
</template>

<script>
function stringify(json) {
  let str = '?';
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      str = str + key + '=' + json[key] + '&';
    }
  }
  return str.slice(0, -1);
}
export default {
  name: 'page-loading',
  onLoad() {
    this.backWithoutScene()
  },
  methods: {
    backWithoutScene() {
      const pages = getCurrentPages();
      const prePage = pages[pages.length - 2];
      const preRoute = prePage.route;
      const preQuery = prePage.options;
      console.log(pages)
     
      // 重新定义新的query , 消费掉scene值
      let newQuery = {}

       for (const key in preQuery) {
        if (preQuery.hasOwnProperty(key)) {
          if(key !== 'scene'){
            newQuery[key] = preQuery[key]
          }
        }
      }
      console.log( preRoute + stringify(newQuery))
      // prePage.fullPath = /pages/index/index

      // 重定向到之前页面执行逻辑
      // uni.navigateBack()
    },
  },
};
</script>

<style lang="less" scoped>
.page-loading {
}
</style>
