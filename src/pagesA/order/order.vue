<template>
  <view>
    <navBar
      title="我的订单"
      background="#fff"
      :back="isShowHome ? false : true"
      :home="isShowHome"
      @home="handlerGohomeClick"
    ></navBar>
    <view class="view">
      <!-- tab -->
      <u-sticky>
        <u-tabs
          :list="tabs"
          :is-scroll="false"
          :current="currentIndex"
          @change="onTabChange"
          bar-width="90"
          font-size="26"
          inactive-color="#7F7F7F"
          :active-item-style="{ color: '#000000' }"
          :bar-style="{ 'background-color': '#FE5D4D' }"
        ></u-tabs>
      </u-sticky>
      <!-- 内容 -->
      <view>
        <view v-if="currentData.length == 0" class="noData">
          <image
            style="width: 135px; height: 135px"
            src="/static/images/picNotData.png"
          ></image>
          <view class="nodataTitle">当前状态暂无订单</view>
          <view class="nodataButton" :style="theme.btn" @tap.stop="gotoBrowse"
            >去逛逛吧</view
          >
        </view>
        <view v-else>
          <orderCell
            v-for="(item, index) in currentData"
            :key="index"
            :cell="item"
            @cancelOrder="onCancelOrder(item)"
            @gotoPay="onGotoPay"
            @reloadListData="reloadListData"
          ></orderCell>
        </view>
      </view>
    </view>
    <!-- 合并支付弹框 -->
    <!-- <mergePay v-if="mergePayInfo" :payShow="payShow" :payObj="mergePayInfo" :goodsId="samplingGoods"></mergePay> -->
    <!-- 取消订单 -->
    <cancelOrder
      :show="showCancelOrder"
      :item="cancelItem"
      @onCancelOrder="cancelOrder"
      @onClose="
        () => {
          showCancelOrder = false;
        }
      "
    ></cancelOrder>
  </view>
</template>

<script>
// pages/my-order/my-order.js
const app = getApp();

// import mergePay from "pageComponents/mergePay/mergePay";
import cancelOrder from "pageComponents/cancelOrder/cancelOrder";
import orderCell from "./cell/order_cell";

export default {
  data() {
    return {
      theme: uni.$theme,
      tabs: [
        {
          name: "全部",
          status: "",
        },
        {
          name: "待付款",
          status: "",
        },
        {
          name: "待发货",
          status: "",
        },
        {
          name: "待收货",
          status: "",
        },
        {
          name: "退款售后",
          status: "",
        },
      ],
      currentIndex: 0,
      currentData: [],
      // 请求参数
      page: 1,
      size: 10,
      // 合并支付是否显示
      payShow: false,
      // 取消订单
      showCancelOrder: false,
      isShowHome: false,
      samplingGoods: [],
      // mergePayInfo: undefined,
      cancelItem: "",
    };
  },

  components: {
    // mergePay,
    cancelOrder,
    orderCell,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options && options.isShowHome) {
      this.setData({
        isShowHome: true,
      });
    }

    this.showTabChange(options);
    this.tabNumsRequest();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // var info = {
    // 	id: 11,
    // 	status: '待发货',
    // 	goodsStatus: 1,
    // 	type: 1,
    // 	goodsSkuId: 341,
    // 	orderOrgId: 5423
    // }
    // setTimeout(() => {
    // 	uni.navigateTo({
    // 		url: '/pagesA/order/Chargeback/chargeback?json=' + JSON.stringify(info),
    // 	})
    // }, 2000)
  },

  /**
   * 生命周期函数--监听页面显示
   * 1.从支付过来
   * 2.从订单详情返回
   */
  onShow: function(options) {
    if (app.globalData.orderHeader) {
      this.machiningTab(app.globalData.orderHeader);

      if (options && options.type) {
        console.log(options);
        var idx = undefined;
        this.tabs.forEach((item, index) => {
          if (item.title == options.type) {
            idx = index;
          }
        });

        if (idx != undefined) {
          this.setData({
            currentIndex: idx,
          });
        }
      }

      if (this.currentIndex != undefined) {
        if (this.currentIndex == 4) {
          this.getChargebackList();
        } else {
          this.getOrderListData(this.tabs[this.currentIndex].status);
        }
      }
    } else {
      this.getOrderListEum();
    }
    this.tabNumsRequest();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    console.log(e);
    this.setData({
      page: this.page + 1,
    });

    if (this.currentIndex != 4) {
      this.getOrderListData(this.tabs[this.currentIndex].status);
    }
  },
  methods: {
    /**
     *  获取 徽标指数
     * */
    tabNumsRequest() {
      uni.$api
        .apiRequest("tabNums", {
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000) {
            this.tabs.map((item) => {
              if (item.name == "待付款") {
                item.count = res.data.unPayCount;
              } else if (item.name == "待发货") {
                item.count = res.data.unSendCount;
              } else if (item.name == "待收货") {
                item.count = res.data.unReceiveCount;
              } else if (item.name == "退款售后") {
                item.count = res.data.refundCount;
              }
              return item
            });
          }
        });
    },
    //
    handlerGohomeClick() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },

    /**
     * 页面进入tab 切换逻辑
     * */
    showTabChange(options) {
      if (options.type) {
        this.tabs.forEach((item, index) => {
          if (item.name == options.type) {
            this.setData({
              currentIndex: index,
            });
          }
        });
      }
    },

    /**
     * 获取 订单状态枚举
     */
    getOrderListEum() {
      uni.$api.apiRequest("getOrderHeaderData").then((res) => {
        if (res.code == 10000) {
          uni.$localStorage.setItem("orderHeader", res.data);
          this.machiningTab(res.data);
          app.globalData.orderHeader = res.data;

          if (this.currentIndex == 4) {
            this.getChargebackList();
          } else {
            // 获取列表数据
            this.getOrderListData(this.tabs[this.currentIndex].status);
          }
        }
      });
    },

    machiningTab(data) {
      var tab = this.tabs.map((item) => {
        data.forEach((el) => {
          if (item.name == el.title) {
            item.status = el.code;
          }
        });
        return item;
      });

      this.setData({
        tabs: tab,
      });
    },

    /**
     * 获取订单列表数据
     * 1.正常订单状态列表
     * 2.待评价订单列表
     */
    getOrderListData(exchangeStatus) {
      if (this.currentIndex == 4) {
        app.globalData.orderHeader.forEach((item) => {
          if (item.title == "交易完成") {
            exchangeStatus = item.code;
          }
        });
      }

      var param = {
        memberId: uni.$localStorage.getItem("memberId"),
        memberDelete: 1,
        page: this.page,
        size: 10,
        orderStatus: exchangeStatus,
        commentStatus: this.currentIndex == 4 ? "1" : undefined,
        pageAccessSource: 2,
      };

      if (this.page == 1) {
        this.setData({
          currentData: [],
        });
      }

      uni.$api.apiRequest("getOrderList", param).then((res) => {
        if (res.code == 10000 && res.data) {
          // 如果后面的页码数据为空 则页码-1
          if (res.data.list.length == 0 && this.page > 1) {
            this.setData({
              page: this.page - 1,
            });
            return;
          } // 数据源合并

          var arr = res.data.list;

          if (this.page > 1) {
            arr = this.currentData.concat(res.data.list);
          }

          this.setData({
            currentData: arr,
          });
        }
      });
    },

    /**
     * 获取退单列表
     */
    getChargebackList() {
      this.setData({
        currentData: [],
      });
      uni.$api
        .apiRequest("orderChargebackList", {
          memberId: uni.$localStorage.getItem("memberId"),
          pageNum: 1,
          pageSize: 10000,
        })
        .then((res) => {
          if (res.code == 10000) {
            var list = res.data.list.map((item) => {
              return { ...item, productList: [item.productInfo] };
            });
            this.setData({
              currentData: list,
            });
          }
        });
    },

    /**
     * tab 切换事件
     */
    onTabChange(val) {
      this.tabNumsRequest();
      this.setData({
        currentData: [],
        page: 1,
        currentIndex: val,
      });

      if (val == 4) {
        this.getChargebackList();
      } else {
        if (app.globalData.orderHeader) {
          this.getOrderListData(this.tabs[val].status);
        }
      }
    },
    // 收货成功 触发
    reloadListData(val) {
      this.onTabChange(val.type);
    },
    /**
     * 去逛逛吧
     */
    gotoBrowse() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },

    /**
     * 合并支付
     * */
    onGotoPay(e) {
      console.log(e);
      uni.$api.apiRequest("getPayInfoForPay", e.detail).then((res) => {
        if (res.code == 10000 && res.data) {
          if (res.data.orderInfoList) {
            this.setData({
              samplingGoods: e.detail.samplingGoods,
              mergePayInfo: res.data,
              payShow: true,
            });
          } else {
            uni.$util.weChatPay({
              ...res.data.payParamInfo,
              route: this.route,
              goodsIds: e.detail.samplingGoods,
            });
          }
        }
      });
    },

    /**
     * 取消订单 按钮事件
     * */
    onCancelOrder(item) {
      console.log(item);
      this.cancelItem = item;
      this.showCancelOrder = true;
    },
    /**
     * 取消订单回调事件
     * */

    cancelOrder() {
      this.showCancelOrder = false;
      this.page = 1;
      this.getOrderListData(this.tabs[this.currentIndex].status);
    },
  },
};
</script>
<style>
@import "./my-order.css";
</style>
