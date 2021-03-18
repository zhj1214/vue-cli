<template>
  <view class="view">
    <navBar
      style="position: absolute; top: 0px"
      color="white"
      background="inherit"
      backgroundColorTop="inherit"
      title="我的优惠券"
    ></navBar>
    <view class="header">
      <view class="bgc">
        <view class="nav-bar__left" @tap="jumpToSwitch">
          <view class="nav-bar__left--text">{{
            currentMall.marketName || "请选择"
          }}</view>
          <u-icon name="arrow-down"></u-icon>
        </view>
        <view class="couponTxt" @click="toTicket"> 我的门票 > </view></view
      >
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
        <!-- 列表 -->
        <view class="listContain" v-if="currentData.length">
          <view
            class="listItem"
            v-for="item in currentData"
            :key="item.uniqueCode"
            @click="toDetail(item)"
          >
            <view style="width: 180rpx;height: 180rpx">
              <image
                :src="
                  item.imageUrl || '../../../static/images/settlement/Pic10.png'
                "
                style="width: 100%;height: 100%"
              ></image>
            </view>
            <view class="listItem_info">
              <view class="color" v-if="item.couponType=='EXCHANGE'" style="font-size:14px;color:#fe5d4d;font-weight: 400;">{{ item.couponContent }}</view>
              <view class="title" v-if="item.couponType!=='EXCHANGE'"><text style="font-weight: 600;">{{ item.amount }}</text><text style="font-size:12px;margin-left: 2px;">{{item.couponType=='DISCOUNT'?'折':'元'}}</text></view>
               <view class="couponTypeName">{{item.couponTypeName}}</view>
              <view class="color couponType-style" v-if="item.couponType=='REDUCTION' || item.couponType=='DISCOUNT'">消费满{{ item.useThresholdAmount }}可用</view>
              <view class="date" :style="{marginTop: item.couponType=='REDUCTION' || item.couponType=='DISCOUNT'?0:10 + 'px'}">{{
                getDate(item.startTime, item.endTime)
              }}</view>
            </view>
            <view class="listItem_btn">
              <u-button
                shape="circle"
                :custom-style="customStyle"
                v-if="tabCurrent === 0"
                @click="toDetail(item)"
                >立即使用</u-button
              >
              <u-button
                shape="circle"
                :custom-style="notallowStyle"
                v-if="tabCurrent === 1"
                :disabled="true"
                >已使用</u-button
              >
              <u-button
                shape="circle"
                :disabled="true"
                :custom-style="notallowStyle"
                v-if="tabCurrent === 2"
                >已失效</u-button
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
          <view class="nocoupon"> 暂无优惠券 </view>
        </view>
      </view>
    </view>
    <view class="fixed">
      <u-button
        type="error"
        style="width: 100%"
        @click="toMore"
        :custom-style="moreCoupon"
        >更多好券</u-button
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentMall: uni.$localStorage.getItem("currentMall"),
      customStyle: {
        width: "68px",
        height: "25px",
        fontSize: "12px",
        borderColor: "#FE5D4D",
        color: "#FE5D4D",
      },
      notallowStyle: {
        width: "68px",
        height: "25px",
        lineHeight: "25px",
        textAlign: "center",
        fontSize: "12px",
        borderColor: "#FE5D4D",
        color: "#FE5D4D",
      },
      currentData: [],
      tabList: [
        {
          name: "未使用",
        },
        {
          name: "已使用",
        },
        {
          name: "已失效",
        },
      ],
      couponCard: {
        DISCOUNT: '折扣券',
        REDUCTION: '满减券',
        EXCHANGE: '兑换券',
        CARRIAGE: '运费券',
        CASH: '现金券',
        PARK: '停车券'
      },
      // 请求参数
      page: 1,
      size: 10,
      tabCurrent: 0,
    };
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    console.log(e);
    this.setData({
      page: this.page + 1,
    });

    this.getPageList();
  },
  computed: {},
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
    toTicket() {
      uni.navigateTo({
        url: "/pages/myCardCoupon/myCard/myCard",
      });
    },
    getCouponType(couponType) {
      let str = "";
      if (couponType === "DISCOUNT") {
        str = "折扣券";
      }
      if (couponType === "REDUCTION") {
        str = "满减券";
      }
      if (couponType === "EXCHANGE") {
        str = "兑换券";
      }
      if (couponType === "CARRIAGE") {
        str = "运费券";
      }
      if (couponType === "CASH") {
        str = "现金券";
      }
      if (couponType === "PARK") {
        str = "停车券";
      }
      return str;
    },
    getDate(startTime, endTime) {
      return `${new Date(startTime).Format("YYYY.MM.DD")}~${new Date(
        endTime
      ).Format("YYYY.MM.DD")}`;
    },
    toGetCoupon() {
      uni.navigateTo({
        url: "/pages/myCardCoupon/couponCenter/couponCenter",
      });
    },
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/myCardCoupon/myCoupon/couponDetail?uniqueCode=${item.uniqueCode}`,
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
        .apiRequest("pageList", {
          memberId: uni.$localStorage.getItem("memberId"),
          orgId: uni.$localStorage.getItem("orgId"),
          page: this.page,
          size: 10,
          useStatus: Number(this.tabCurrent) + 1,
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
    toMore() {
      uni.navigateTo({
        url: "/pages/myCardCoupon/couponCenter/couponCenter",
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
      .couponTxt {
        position: absolute;
        bottom: 60px;
        right: 20px;
        color: #ffffff;
      }
    }
  }
  .fixed {
    position: fixed;
    z-index: 999;
    bottom: 0;
    width: 100vw;
    height: 90px;
    background: #ffffff;
    box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.15);
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .list {
    margin-top: -40px;
    background-color: #fff;
    border-radius: 25px 25px 0px 0px;
    padding: 10px;
    position: absolute;
    width: 100%;
    padding-bottom: 70px;
  }
  .listContain {
    padding: 12px;
    background-color: #fff;

    .listItem {
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.04);
      border-radius: 4px;
      background-color: #fff;
      display: -webkit-box;
      -webkit-box-align: center;
      height: 180rpx;
      margin-bottom: 20rpx;
      padding-right: 15rpx;
      .listItem_info {
        -webkit-box-flex: 1;
        padding: 20rpx;
         .color {
          font-size: 9px;
          font-weight: bold;
          color: #929497;
          margin-bottom: 4px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .couponType-style {
          width: 172px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .title {
          font-size: 20px;
          font-weight: 400;
          color: #fe5d4d;
          // margin-bottom: 4px;
          overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
        }
        .couponTypeName {
          padding: 2px 4px;
          font-size: 8px;
          color: #929497;
          border: 1px solid #929497;
          display: inline-block;
          border-radius: 2px;
          position: relative;
          top: -4px;
        }
        .date {
          font-size: 18rpx;
          color: #929497;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .listItem_btn {
        width: 150rpx;
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
</style>
