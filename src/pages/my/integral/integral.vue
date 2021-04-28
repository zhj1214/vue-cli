<template>
  <view class="view">
    <navBar
      style="position: absolute; top: 0px"
      background="inherit"
      color="white"
      backgroundColorTop="inherit"
      title="我的积分"
    ></navBar>
    <image
      style="width: 100vw; height: 248px"
      src="https://eos-wuxi-1.cmecloud.cn/crmoss/36d9d85f-688f-463e-8694-8a934d53ec7a.png"
      mode=""
    ></image>
    <view class="contentBg">
      <!-- 积分信息  -->
      <view class="header">
        <view class="flex-row" style="width: 100%; justify-content: flex-end" @click="jumpRelus">
          <image
            style="width: 14px; height: 14px"
            src="../../../static/images/wh.png"
            mode=""
          ></image>
          <view class="integralText" style="margin-left: 4px">{{ ponitName }}规则</view>
        </view>
        <view class="integralText">可用{{ ponitName }}</view>
        <view class="integralValue">{{ totalIntergral || 0 }}</view>
        <view class="integralTotalValue" @click="jumpAll"
          >账户总{{ ponitName }}:{{ totalAllIntergral || 0 }}
          <image
            style="width: 9px; height: 9px; margin-left: 4px"
            src="../../../static/images/rightArrow.png"
            mode=""
          ></image>
        </view>
      </view>
      <!-- 积分列表 -->
      <view class="content">
        <view class="contentHeader">
          <u-tabs
            :list="list"
            :is-scroll="false"
            :font-size="32"
            height="106"
            inactive-color="#000000"
            active-color="#000000"
            bar-width="100"
            :bar-style="{ 'background-color': '#FE5D4D' }"
            :current="current"
            @change="change"
          ></u-tabs>
        </view>
        <view class="">
          <view class="item" v-for="(item, index) in currentData" :key="index">
            <view class="">
              <view class="item-text">{{ item.title }}</view>
              <view class="item-time">{{ item.timeStr }}</view>
            </view>
            <view class="item-value" :style="!item.isRed ? 'color:#444444;' : 'color:#FE5D4D;'"
              >{{ item.isRed ? '-' : '+' }}{{ item.score }}</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  const app = getApp()
  export default {
    data() {
      return {
        ponitName: app.globalData.pointName,
        list: [
          {
            name: '全部',
          },
          {
            name: '收入',
          },
          {
            name: '支出',
          },
        ],
        current: 0,
        options: {},
        // 数据源
        currentData: [],
        page: 1,
        totalIntergral: 0, // 账户 可用积分
        totalAllIntergral: 0, // 账户总积分
      }
    },

    onLoad(options) {
      this.options = options
      this.getListData()
    },
    methods: {
      /**
       * 获取积分明细
       */

      getListData() {
        var param = {
          page: this.page,
          size: 10,
          marketOrgId: uni.$localStorage.getItem('orgId'),
          type: this.current == 2 ? -1 : this.current, //查询类型 0：全部 1：增加 -1：减少
        }

        if (this.page == 1) this.currentData = []
        uni.$api.apiRequest('pointsDetail', param).then((res) => {
          if (res.code == 10000 && res.data) {
            // 如果后面的页码数据为空 则页码-1
            if (res.data.list.length == 0 && this.page > 1) {
              this.page = this.page - 1
              return
            }
            // 数据源合并
            var arr = res.data.list.map((item) => {
              return {
                ...item,
                ...{
                  isRed: item.isAdd != 1,
                  timeStr: new Date(item.createTime).Format('YYYY-MM-DD HH:mm:ss'),
                },
              }
            })
            if (this.page > 1) {
              arr = this.currentData.concat(res.data.list)
            }
            this.currentData = arr
            this.totalAllIntergral = res.data.pointsScore
            this.totalIntergral = res.data.subPointsScore
        })
      },
      change(index) {
        this.setData({
          currentData: [],
          page: 1,
          current: index,
        })
        this.getListData()
      },
      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function (e) {
        console.log(e)
        this.page += 1
        this.getListData()
      },
      jumpRelus() {
        const param = {
        page: 1,
        size: 10,
      };
        let p = JSON.stringify(param)
        uni.navigateTo({
          url: '/pagesA/out/parsePage?title=' + `${this.ponitName}规则&url=pointsRelus`,
        })
      },
      jumpAll() {
        uni.navigateTo({
          url: '/pages/my/integral/integralAll?value=' + this.options.allValue,
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .view {
    position: relative;
    display: flex;
    justify-content: center;

    .contentBg {
      position: absolute;
      width: 100%;
      margin-top: 110rpx;
      padding: 20px;
    }

    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .integralText {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }

      .integralValue {
        margin: 8px 0px;
        font-size: 34px;
        font-family: DINPro-Bold, DINPro;
        font-weight: bold;
        color: #ffffff;
      }

      .integralTotalValue {
        font-size: 12px;
        font-family: PingFang-SC-Light, PingFang-SC;
        font-weight: 300;
        color: #ffffff;
      }
    }

    .content {
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      margin-top: 20px;

      .item {
        padding: 16px 20px;
        width: 100%;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #d8d8d8;

        .item-text {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #444444;
        }

        .item-time {
          margin-top: 3px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #404040;
        }

        .item-value {
          font-size: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #444444;
        }
      }
    }
  }
</style>
