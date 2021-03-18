<template>
  <view class="view">
    <navBar
      style="position: absolute; top: 0px"
      color="white"
      background="inherit"
      backgroundColorTop="inherit"
      title="我的门票"
    ></navBar>
    <view class="header">
      <view class="bgc">
        <view class="nav-bar__left" @tap="jumpToSwitch">
          <view class="nav-bar__left--text">{{
            currentMall.marketName || "请选择"
          }}</view>
          <u-icon name="arrow-down"></u-icon>
        </view>
      </view>

      <view class="list">
        <view>
          <u-tabs
            :list="tabList"
            :is-scroll="false"
            :current="tabCurrent"
            bar-width="55"
            active-color="#FE5D4D"
            @change="tabChange"
          ></u-tabs>
        </view>

        <view class="content" v-if="currentData.length">
          <view
            class="ticketItem"
            v-for="item in currentData"
            :key="item.ticketId"
            @click="toDetail(item.ticketId)"
          >
            <image
              style="width: 100%; height: 320rpx"
              :src="item.logo"
              mode="aspectFill"
            ></image>
            <view
              class="flex-row"
              style="justify-content: space-between; padding: 28rpx"
            >
              <view class="">
                <view class="title">{{ item.title }}</view>
                <view class="desc" style="margin-top: 10rpx">{{
                  item.itemTitle
                }}</view>
              </view>
              <view class="checkTicket" v-if="tabCurrent === 0">查看门票</view>
              <view
                class="checkTicket"
                style="background: #f2f2f2; color: #bfbfbf"
                v-else
                >已失效</view
              >
            </view>
          </view>
        </view>
        <view v-else class="nodata">
          <view>
            <image
              src="https://eos-wuxi-1.cmecloud.cn/crmoss/6bb11724-c450-456c-8e3b-c5cf1d789814.png"
              style="width: 140px; height: 140px"
            ></image>
          </view>
          <view class="nocoupon"> 暂无门票 </view>
          <u-button type="error" @click="goHome">去逛逛吧</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentMall: uni.$localStorage.getItem("currentMall"),
      tabList: [
        {
          name: "有效票",
        },
        {
          name: "失效票",
        },
      ],
      currentData: [],
      tabCurrent: 0,
      page: 1,
      size: 10,
    };
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.log(e);
    this.setData({
      page: this.page + 1,
    });

    this.getPageList();
  },
  onLoad() {
    this.getPageList();
  },
  onShow() {
    this.setData({
      currentMall: uni.$localStorage.getItem("currentMall"),
    });
    this.getPageList();
  },
  methods: {
    jumpToSwitch() {
      uni.navigateTo({
        url: `/pages/index/switchMall/switchMall?type=${true}`,
      });
    },
    goHome() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    toDetail(ticketId) {
      uni.navigateTo({
        url: `/pages/myCardCoupon/myCard/myCardDetail?ticketId=${ticketId}`,
      });
    },
    tabChange(index) {
      this.tabCurrent = index;
      this.page = 1;
      this.getPageList();
    },
    /**
     * 获取优惠券列表
     */
    getPageList() {
      uni.$api
        .apiRequest("ticketList", {
          uid: uni.$localStorage.getItem("memberId"),
          orgId: uni.$localStorage.getItem("orgId"),
          page: this.page,
          size: 10,
          status: this.tabCurrent ? [-1, 2] : [1],
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            // 如果后面的页码数据为空 则页码-1
            if (res.data.list.length == 0 && this.page > 1) {
              this.setData({
                page: this.page - 1,
              });
            } else {
              // 数据源合并

              var arr = res.data.list;

              if (this.page > 1) {
                arr = this.currentData.concat(res.data.list);
              }

              this.setData({
                currentData: arr,
              });
            }
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.view {
  .header {
    height: 100vh;
    .bgc {
      background: url(https://eos-wuxi-1.cmecloud.cn/crmoss/1892dde5-7e2e-4bd7-b88b-3c9b77271e78.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 100vw;
      height: 210px;
      position: relative;
      .nav-bar__left {
        position: absolute;
        bottom: 60px;
        left: 20px;
        font-size: 14px;
        font-weight: 300;
        color: #ffffff;
        display: flex;
      }
    }
    .list {
      margin-top: -40px;
      background-color: #fff;
      border-radius: 25px 25px 0px 0px;
      padding: 10px;
      position: absolute;
      width: 100%;
      .content {
        padding: 24rpx 40rpx;
        background-color: #fff;
        height: calc(100vh - 250px);

        .ticketItem {
          border-radius: 8rpx;
          border: 1px solid #e1e6eb;
          margin-bottom: 10px;
          .checkTicket {
            width: 86px;
            height: 34px;
            background: #fe5d4d;
            border-radius: 19px;
            text-align: center;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 34px;
          }
          .title {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #2e2e2e;
          }

          .desc {
            font-size: 10px;
            font-family: PingFang-SC-Light, PingFang-SC;
            font-weight: 300;
            color: #929497;
          }
        }
      }
    }
    .nodata {
      display: flex;
      margin-top: 110px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .nocoupon {
        font-size: 18px;
        font-weight: 300;
        color: #7f7f7f;
        margin-bottom: 28px;
      }
    }
  }
}
</style>
