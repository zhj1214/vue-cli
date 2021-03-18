<!--
 * @Author: NineNan
 * @Date: 2020-12-30 13:35:49
 * @LastEditTime: 2021-01-28 14:11:58
 * @LastEditors: Please set LastEditors
 * @Description: 停车记录
 * @FilePath: /heng-weapp/src/pagesParking/parkingRecord/index.vue
-->
<template>
  <view class="parking-record">
    <navBar
      background="#f6f6f6"
      ext-class="fixed-bar"
      :home-btn="true"
      title="停车记录"
    />
    <view class="content">
      <image class="banner" :src="banner" />
      <!-- 记录数据 begin -->
      <view v-if="tableData.length">
        <view
          class="record-list"
          v-for="item in tableData"
          :key="item.parkOrderId"
        >
          <view class="title">
            <view>
              {{ item.carNumber }}
            </view>
            <view>
              <image :src="addressImg" />
              <text>
                {{ item.orgName }}
              </text>
            </view>
          </view>
          <view class="info">
            <view class="info-content">
              <view>入场时间</view>
              <view>{{ item.inTime }}</view>
            </view>
            <view class="info-content">
              <view>停车时长</view>
              <view>{{ item.parkTime }}</view>
            </view>
            <view class="info-content">
              <view>订单流水号</view>
              <view>{{ item.parkOrderId }}</view>
            </view>
          </view>
          <view class="money">
            <view class="actual-payment">
              <text>实付</text>
              <text>¥{{ item.totalRealFee }}</text>
            </view>
            <view>
              <text> 总计 ￥{{ item.totalActFee }} </text>
              <text> 优惠 ￥{{ item.totalDiscountFee }} </text>
            </view>
          </view>
        </view>
      </view>
      <!-- 记录数据 end -->
      <!-- 暂无数据 begin -->
      <no-data class="no-data" v-else />
      <!-- 暂无数据 end -->
    </view>
  </view>
</template>
<script>
import noData from "@/pageComponents/noData/index";
export default {
  components: {
    "no-data": noData,
  },
  data() {
    return {
      banner: require("@/static/images/parking/recordingBanner.png"),
      addressImg: require("@/static/images/settlement/adress.png"),
      tableData: [], // 停车记录数据
      pageData: {
        page: 1,
        size: 15,
      },
      total: 0, // 记录总数
    };
  },
  onLoad() {
    this.init();
  },
  onReachBottom() {
    if (this.total > this.tableData.length) {
      this.pageData.page++;
      this.getTableData();
    } else {
      return false;
    }
  },
  methods: {
    /**
     * @description 初始化
     */
    init() {
      this.getTableData();
    },
    /**
     * @description 获取停车记录
     */
    async getTableData() {
      const params = {
        ...this.pageData,
        orgId: uni.$localStorage.getItem("orgId"),
        memberId: uni.$localStorage.getItem("memberId"),
        parkStatus: 3,
      };
      const res = await uni.$api.apiRequest("parkingRecord", params);
      if (res && res.code === 10000) {
        const { data } = res;
        data.list.forEach((element) => {
          element.totalRealFee = element.totalRealFee || 0;
          element.totalActFee = element.totalActFee || 0;
          element.totalDiscountFee = element.totalDiscountFee || 0;
          element.parkTime = element.parkTime
            ? `${element.parkTime}分钟`
            : "0分钟";
        });
        this.total = data.count;
        this.tableData =
          this.pageData.page === 1
            ? data.list
            : this.tableData.push(...data.list);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>