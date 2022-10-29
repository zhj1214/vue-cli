<template>
  <view class="view">
    <navBar title="购物车" background="#fff"></navBar>
    <view>购物车</view>
  </view>
</template>

<script>
  const app = getApp()

  export default {
    data() {
      return {}
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 滑到底部触发分页
     * */
    onReachBottom() {},
    /**
     * 页面离开
     * */
    onHide: function () {},
    methods: {
      /**
       * @description 获取更多商品数据
       */
      async getGoodsData() {
        const res = await uni.$api.apiRequest('__v2__searchGoods', {
          pageNum: this.goodsPage,
          pageSize: this.goodsSize,
          searchContent: '',
          searchType: 1,
          sortType: 1,
          orgId: uni.$localStorage.getItem('orgId'),
        })
        console.log('数据：', res)
      },
    },
  }
</script>
<style scoped lang="less"></style>
