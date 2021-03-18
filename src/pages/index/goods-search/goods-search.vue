<template>
  <view class="app-goods-search">
    <navBar title="搜索好物" :showBackBtn="false" background="#fff"></navBar>
    <app-search-bar
      focus
      show-cancel
      v-model="query.keyword"
      @clear="onClear"
      @cancel="onCancel"
      @search="onSearch"
    ></app-search-bar>
    <view class="history" v-if="list.length">
      <view class="history__title">搜索历史 
        <image
          @click="deleteLog"
          src="https://eos-wuxi-1.cmecloud.cn/crmoss/f037c323-6b8e-4cb3-82e1-06c9df863f02.png"
          style="width:20px;height:20px;float:right;position:relative;top:2px;"
          mode=""
      ></image>
      </view>
      <view class="history__tags">
        <view class="history__tags-item" v-for="(tag, i) in list" :key="i">
          <u-tag
            :closeable="closeable"
            :text="
              tag.content && tag.content.length > 15
                ? tag.content.slice(0, 15) + '...'
                : tag.content
            "
            type="info"
            mode="light"
            shape="circle"
            border-color="#f4f4f4"
            bg-color="#f4f4f4"
            color="#2E2E2E"
            @tap="onTap(tag)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import AppSearchBar from '@/pageComponents/ht-app/bars/search-bar.vue';

export default {
  name: 'app-goods-search',
  components: { AppSearchBar },

  data() {
    return {
      closeable: false,

      query: {
        keyword: '',
      },

      list: [],
    };
  },
  onLoad(options) {
    this.query.keyword = options.keyword || '';
  },

  onShow () {
    this.fetchSearchLog();
  },
  
  methods: {
    async fetchSearchLog() {
      const memberId = uni.$localStorage.getItem('memberId');
      const searchLogs = uni.$localStorage.getItem('search_logs');
      if (memberId && searchLogs) {
        this.list = searchLogs;
        // 如果是刚登录来搜索, 同步本地搜索记录
        searchLogs.forEach((log, index) => {
          // 减轻点服务器压力
          setTimeout(() => {
            uni.$api.apiRequest('__v2__addSearchLog', {
              uid: memberId,
              content: log.content,
            });
          }, 10 * index);
        });
        uni.$localStorage.remove('search_logs');
        return;
      }

      if (memberId) {
        const res = await uni.$api.apiRequest('__v2__fetchSearchLog', {
          uid: memberId,
          pageSize: 10,
          pageNum: 1,
        });
        if (res.code === 10000 && res.data) {
          this.list = res.data.records;
        }
      } else {
        this.list = searchLogs;
      }
    },
    // 删除搜索历史
    async deleteLog() {
      const memberId = uni.$localStorage.getItem('memberId');
      // 如果已登录，则搜索历史记录在服务端
      if (memberId) {
        const res = await uni.$api.apiRequest('__v2__removeSearchLog', {
          uid: memberId,
        });
        if (res.code==10000) {
          uni.$localStorage.remove('search_logs');
          this.list = []
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          });
        }
      } else {
        uni.showToast({
            title: '请登录!',
            icon: 'none',
          });
      }
    },
    onCancel() {
      uni.reLaunch({
        url: '/pages/index/index',
      });
    },
    onClear() {
      this.query.keyword = '';
    },
    onSearch(val, flag) {
      let url = `/pages/index/goods-search/goods-search-result?keyword=${val}`;
      if (flag) {
        url = url + '&flag=' + flag;
      }
      uni.navigateTo({
        url,
      });
    },
    onTap(tag) {
      this.query.keyword = tag.content;
      this.onSearch(tag.content);
    },
  },
};
</script>

<style lang="less">
.app-goods-search {
  .history {
    margin: 40rpx;
    &__title {
      margin-bottom: 28rpx;
      font-size: 32rpx;
      line-height: 56rpx;
      color: #2e2e2e;
      font-weight: bold;
    }
    &__tags {
      display: flex;
      flex-wrap: wrap;
      &-item {
        margin: 0 20rpx 20rpx 0;
      }
    }
  }
}
</style>
