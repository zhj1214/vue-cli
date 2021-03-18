<template>
  <view class="page-self-integral-list">
    <view class="page-header">
      <navBar title="自助积分记录" background="#fff" ext-class="fixed-bar"
            :home-btn="true"></navBar>
      <u-tabs
        :list="tabs"
        :is-scroll="false"
        active-color="#FE5D4D"
        :current="tabCurrent"
        @change="tabChange"
      ></u-tabs>
    </view>

    <view class="page-body">
      <view v-if="entryRecords.length" class="page-body__bd">
        <view  v-for="item in entryRecords" :key="item.id" @click="jumpDetail(item)">
          <app-intergral-log-card  :card="item" ></app-intergral-log-card>
        </view>
      </view>
      <app-empty-card v-else></app-empty-card>
    </view>
  </view>
</template>

<script>
import AppIntergralLogCard from '@/pageComponents/ht-app/cards/intergral-log-card.vue';
import AppEmptyCard from '@/pageComponents/ht-app/cards/empty.vue';

export default {
  name: 'page-self-integral-list',
  components: {AppIntergralLogCard, AppEmptyCard},
  data() {
    return {
      tabs: [
        {
          name: '全部',
        },
        {
          name: '审核中',
        },
        {
          name: '已通过',
        },
        {
          name: '未通过',
        },
      ],
      entryRecords: [
        // {mallName: '恒太黄龙店', imgUrl: '/static/images/self-integral/location.png', date: '2020-10-04', status: 0, uniqueCode: 123},
        // {mallName: '恒太aa店', imgUrl: '', date: '2020-10-04', status: 1, uniqueCode: 1234},
        // {mallName: '恒太bb店', imgUrl: '', date: '2020-10-04', status: 2, uniqueCode: 12345},
        // {mallName: '恒太cc店', imgUrl: '', date: '2020-10-04', status: 3, uniqueCode: 123456},
      ],
      // 请求参数
      tabCurrent: 0,
      integralStatus: 0,
      page: 1,
      total: 0,
      currentMall: uni.$localStorage.getItem("currentMall"),
    };
  },
  onShow() {
    this.setData({
      currentMall: uni.$localStorage.getItem("currentMall"),
    });
    this.userInfo = uni.$localStorage.getCurrentUser() || {};
    this.getIntegralList();
    
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function(e) {
    // 如果还有数据
    if (this.total > this.entryRecords.length) {
      this.page = this.page + 1;
      this.getIntegralList();
      return;
    }
    // 已经是最后一页
    uni.showToast({
      title: '没有更多了',
      icon: 'none',
    });
  },
  methods: {
    tabChange(index) {
      this.page = 1;
      switch(index) {
        case 0:
          this.integralStatus = 0;
          this.tabCurrent = 0;
          break;
        case 1:
          this.integralStatus = 3;
          this.tabCurrent = 1;
          break;
        case 2:
          this.integralStatus = 1;
          this.tabCurrent = 2;
          break;
        case 3:
          this.integralStatus = 2;
          this.tabCurrent = 3;
          break;
      }
      this.getIntegralList();
      // this.tabCurrent = index;
      // console.log(this.tabCurrent);
    },
    /**
     * 记录详情
     * */
    jumpDetail(item) {
      uni.navigateTo({
        url: `/pagesA/self-integral/detail?uniqueCode=${item.id}`
      })
    },
    /**
     * 获取积分记录
     */
    getIntegralList() {
      uni.$api
        .apiRequest("integralList", {
          memberId: uni.$localStorage.getItem("memberId"),
          orgId: uni.$localStorage.getItem("orgId"),
          status: this.integralStatus,
          page: this.page,
          size: 10,
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.total = res.data.count; // 保存总条数
            // 保存列表数据
            if (this.page === 1) {
              this.entryRecords = res.data.list || [];
            } else {
              this.entryRecords = this.entryRecords.concat(res.data.list || []);
            }
          }
        })
    },
  },
};
</script>

<style lang="less" scoped>
.page-self-integral-list {
  .page-body {
    background-color: #fff;
    &__bd{
      margin: 20rpx 40rpx;
    }
  }
}
.ht-empty {
  margin-top: 300rpx !important;
}
</style>
