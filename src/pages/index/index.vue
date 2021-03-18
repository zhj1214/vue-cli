<template>
  <view class="page-home">
    <navBar title="首页"></navBar>
    <view class="">
      你好，敲键盘的
    </view>
  </view>
</template>

<script>
const app = getApp(); //获取应用实例

export default {
  components: {},

  data() {
    return {};
  },
  /**
   * 生命周期函数--监听页面显示
   * 没有options可以拿到
   */
  onShow: function() {
    this.sceneInit();
  },
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    if (options) this.options = options;
  },

  async onPullDownRefresh() {
    this.params.page = 1; // current page = 1
    try {
      await this.fetchList();
    } catch (error) {
      console.error(error);
    } finally {
      uni.stopPullDownRefresh();
    }
  },

  onPageScroll(obj) {
    this.opacity = obj.scrollTop / 100;
  },

  methods: {
    /**
     * 小程序逻辑处理
     * 1.查看当前是否是携带场景进入，是的话就进行场景模式流程，反之加载逻辑
     * */
    sceneInit() {
      var self = this;
      uni.$scene.setScene(this.options || {});
      self.jumpLogic(self);
    },
    /**
     * 一:场景逻辑
     * 1.未登录
     * 		(1)跳转登录注册页面。注册完成后悔自动  调用	修改注册来源接口
     * 2.已登录
     * 		是否需要切换商场
     * 			切换：直接触发(1)修改注册来源接口 (2)并切换商场 (3)更新用户积分成长值
     * 			不切换：(1)并切换商场 (2)更新用户积分成长值
     * 二：普通进入
     * 	1.是否选择商场
     * 		有商场：获取接口数据(也包括 切换商场逻辑)
     * 		无商场：进入 切换商场页面
     *  2.
     * */
    async jumpLogic() {
      await uni.$scene.next();
      // 场景值消费完毕，删除它，否则下次onshow还是执行扫那场景逻辑
      var self = this;
      if (self.options && self.options.scene) {
        delete self.options.scene;
      }
    },

    async fetchList() {
      const searchType = this.tabs[this.curTabIndex].type;
      const res = await uni.$api.apiRequest("__v2__searchGoods", {
        pageSize: this.params.size,
        pageNum: this.params.page,
        searchContent: "",
        searchType,
        sortType: this.tabs[this.curTabIndex].sortType || 1,
        orgId: uni.$localStorage.getItem("orgId"),
      });
      if (res.code !== 10000 && !res.data) return;
    },

    /**
     * 获取经纬度,是否需要切换商场
     * */
    getLocation() {
      if (this.isSelectMall) return;
      var self = this;
      uni.getLocation({
        type: "gcj02",
        success(res) {
          console.log("do some sing", res);
        },
        fail(err) {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-home {
  background-color: #f9f9f9;
}
</style>
