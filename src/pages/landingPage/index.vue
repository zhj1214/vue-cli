<!--
 * @Author: zhj
 * @Date: 2020-12-30 17:49:16
 * @LastEditTime: 2021-01-23 11:57:49
 * @Description: 缴费页面
 * @FilePath: /heng-weapp/src/pages/landingPage/index.vue
-->
<template>
  <view class="view">
    <navBar :title="navBarTitle" :homeBtn="true"></navBar>
    <u-parse
      :html="content"
      :lazy-load="true"
      :show-with-animation="true"
    ></u-parse>
  </view>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      options: undefined,
      navBarTitle: "落地页",
      content: ``,
      shareTitle: "",
    };
  },
  onBackPress(event) {
    console.log(event, "eventeventeventeventevent");
  },
  onLoad(options) {
    console.log(options, "optionsoptionsoptions");
    let id;
    this.options = options;
    if (options.landId) {
      id = options.landId;
    } else if (options.scene && this.sceneParse(options.scene).paramsId) {
      id = this.sceneParse(options.scene).paramsId;
    }
    if (id) this.init(id);
  },
  methods: {
    init(id) {
      uni.$api
        .apiRequest("landPage", {
          pageId: id,
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.navBarTitle = res.data.pageTitle;
            this.content = res.data.pageContent;
            this.shareTitle = res.data.customTitle;
            this.shareImg = res.data.customPicture;
            if (res.data.isSend) {
              wx.showShareMenu({
                withShareTicket: true,
                menus: ["shareAppMessage", "shareTimeline"],
              });
            } else {
              wx.hideShareMenu({
                menus: ["shareAppMessage", "shareTimeline"],
              });
            }
          }
        });
    },
    sceneParse(scene) {
      const arr = scene.split("_");
      if (arr.length == 3) {
        return {
          paramsId: arr[2],
          orgId: arr[1],
          type: arr[0],
        };
      }
    },
  },
  onShareAppMessage: function(res) {
    // if (res.from === "button") {
    //   // 来自页面内转发按钮
    //   console.log(res.target);
    // }
    return {
      title: this.shareTitle,
      path: "/pages/landingPage/index?landId=" + this.options.landId,
      imageUrl: this.shareImg,
    };
  },
};
</script>
<style lang="less" scoped>
.view {
  padding: 33px 20px;
}
</style>
