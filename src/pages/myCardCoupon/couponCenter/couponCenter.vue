<template>
  <view class="view">
    <navBar
      style="position: absolute; top: 0px"
      color="white"
      background="inherit"
      backgroundColorTop="inherit"
      title="领券中心"
    ></navBar>
    <view class="header">
      <view class="bgc"></view>
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
            :key="item.couponContactId"
            @click="toDetail(item.couponContactId)"
          >
            <view style="width: 180rpx;height: 180rpx">
              <image
                :src="
                  item.imageUrl || '../../../static/images/settlement/Pic10.png'
                "
                style="width: 100%;height: 100%;"
              ></image>
            </view>

            <view class="listItem_info">
              <!-- <view class="title">{{ item.couponName }}</view>
              <view class="color">{{ item.couponContent }}</view> -->
              <view class="color" v-if="item.couponType=='EXCHANGE'" style="font-size:14px;color:#fe5d4d;font-weight: 400;">{{ item.couponContent }}</view>
              <view class="title" v-if="item.couponType!=='EXCHANGE'"><text style="font-weight: 600;">{{ item.amount }}</text><text style="font-size:12px;margin-left: 2px;">{{item.couponType=='DISCOUNT'?'折':'元'}}</text></view>
               <view class="couponTypeName">{{item.couponTypeName}}</view>
              <view class="color couponType-style" v-if="item.couponType=='REDUCTION' || item.couponType=='DISCOUNT'">消费满{{ item.useThresholdAmount }}可用</view>
              <view class="date" :style="{marginTop: item.couponType=='REDUCTION' || item.couponType=='DISCOUNT'?0:10 + 'px'}">{{ computedTime(item) }}</view>
            </view>
            <view class="listItem_btn">
              <u-button
                shape="circle"
                :custom-style="customStyle"
                @click="toReceive(item.couponContactId)"
                >免费领取</u-button
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
      customStyle: {
        width: "68px",
        height: "25px",
        fontSize: "12px",
        borderColor: "#FE5D4D",
        color: "#FE5D4D",
      },
      tabList: [
        {
          name: "优惠券",
        },
        {
          name: "停车券",
        },
        {
          name: "兑换券",
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
      currentData: [],
    };
  },
  onShow() {
    this.getPageList();
  },
  onLoad(options){
    console.log(options,'optionsoptionsoptionsoptions')
    if(options.tabCurrent){
      this.tabCurrent  = options.tabCurrent;
    }
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
  methods: {
    toReceive(couponContactId) {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      uni.$util.currentClockin() // 点亮
      uni.$api
        .apiRequest("recieveCoupon", {
          couponContactId: couponContactId,
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            uni.showToast({
              title: "领取成功",
            });
          }
        });
    },
    // 根据前一步生成的使用说明内容
    computedTime(item) {
      if (item.useTimeType === 1) {
        return (
          new Date(item.startTime).Format("YYYY.MM.DD") +
          " ~ " +
          new Date(item.endTime).Format("YYYY.MM.DD")
        );
      }
      if (item.useTimeType === 2) {
        return "领券当日起" + (item.useDays || 1) + "天内可用";
      }
      if (item.useTimeType === 3) {
        return "领券次日起" + (item.useDays || 1) + "天内可用";
      }
      return "";
    },
    toDetail(couponContactId) {
      uni.navigateTo({
        url: `/pages/myCardCoupon/couponCenter/couponCenterDetail?couponContactId=${couponContactId}`,
      });
    },
    tabChange(index) {
      this.tabCurrent = index;
      this.page = 1;
      this.getPageList();
    },
    goHome() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    /**
     * 获取领券中心列表
     */
    getPageList() {
      uni.$api
        .apiRequest("couponCenterList", {
          memberId: uni.$localStorage.getItem("memberId"),
          orgId: uni.$localStorage.getItem("orgId"),
          page: this.page,
          size: 10,
          type: Number(this.tabCurrent) + 1,
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
      background: url(https://eos-wuxi-1.cmecloud.cn/crmoss/da624245-305f-463f-a0fd-2629f00c25db.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 100vw;
      height: 210px;
    }
  }
}
.list {
  margin-top: -20px;
  background-color: #fff;
  border-radius: 25px 25px 0px 0px;
  padding: 10px;
}
.listContain {
  padding: 12px;
  background-color: #fff;
  height: calc(100vh - 250px);

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
</style>
