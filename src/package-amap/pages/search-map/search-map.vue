<template>
  <view class="header items-center" :style="{ 'padding-top': `${statusBarH}px` }">
    <img class="header-back" :src="navBack" @click="backPage" />
    <view class="header-backview items-center">
      <img class="header-search" :src="searchIcon" />
      <input class="header-input" v-model="currentText" type="text" focus placeholder="搜索" @input="searchKey" />
    </view>
  </view>
  <view class="moduleView" :style="{ height: `calc(100% - ${45 + statusBarH}px)` }">
    <!-- 历史记录 -->
    <!-- v-if="searchArr.length === 0 && localArr.length > 0" -->
    <view class="history" v-if="false">
      <view class="history-title">历史记录</view>
      <view class="history-item items-center" v-for="(item, index) in localArr" :key="index" @click="searchKey({ detail: { value: item } }, true)">
        <img class="history-item-img" :src="locationIcon" />
        <view class="history-item-txt">{{ item }}</view>
      </view>
      <view v-if="localArr.length > 0" class="history-title" style="text-align: center; padding-top: 33px" @click="clearHistory">清楚历史记录</view>
    </view>
    <!-- 搜索结果 -->
    <view class="searchview" v-else>
      <template v-if="searchArr.length > 0">
        <view class="searchview-item items-center" v-for="(item, index) in searchArr" :key="index">
          <view class="searchview-item-left" @click="jumpMapLocation(item)">
            <view class="items-center">
              <img class="searchview-item-img" :src="locationIcon" />
              <view class="searchview-item-txt">{{ item.name }}</view>
            </view>
            <view class="searchview-item-desc">{{ item.address }}</view>
          </view>
          <view class="searchview-item-right items-center" @click="openMap(item)">
            <img class="searchview-item-rightimg" :src="detailnavIcon" />
            <view class="searchview-item-distance">{{ (item.distance / 1000).toFixed(2) }}KM</view>
          </view>
        </view>
      </template>
      <view class="notData items-center" v-else>
        <img class="notData-img" :src="searnotIcon" />
        <view class="notData-text">暂无搜索内容</view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { ref, inject, defineComponent, computed, onMounted } from 'vue'
import { onShow, onLoad, onReady } from '@dcloudio/uni-app'
import { getAllTypePoiList } from '@api/mine'
import { getDebounce } from '@util/shared'
import { jumpAMap } from '../map-page/AMapUtils'
import { isAndroid } from '@util/open-app'
const ENV = import.meta.env.VITE_APP_ENV

export default defineComponent({
  name: 'search-station',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    itemType: Number
  },

  setup(props) {
    // obs图片
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [navBack, searchIcon, locationIcon, detailnavIcon, searnotIcon] = gdp([
      'station-back-icon.png',
      'station-search-icon.png',
      'station-list-location.png',
      'station-detail-nav.png',
      'station-searnot-icon.png'
    ])
    // 当前输入内容
    const currentText = ref('')
    // 不是捷途app
    const isNotJtApp = computed(() => {
      const userAgent = window.navigator.userAgent
      return !userAgent.match(/ios|android\/[0-9.]+/)
    })
    // 状态栏高度
    const statusBarHeight = ref(0)
    const statusBarH = computed(() => {
      return statusBarHeight.value || 10
    })

    // 本地历史记录
    const localArr: any = ref([])
    // 搜索结果
    const searchArr: any = ref([])
    // 搜索的类目type
    let categoryType = ''
    // 当前位置的经纬度
    let lng = 0
    let lat = 0

    onLoad(async (val: any) => {
      // 获取导航状态栏高度
      statusBarHeight.value = await window.$flutter.fbGetStatusBarHeight()
      // 1. 获取本地历史记录
      // uni.getStorage({
      //   key: 'station_history_inputtext',
      //   success: function (res) {
      //     console.log('station_history_inputtext', res.data)
      //     localArr.value = res.data
      //   }
      // })
      // 2. 获取选择的type
      if (val && val.type) {
        categoryType = val.type
      }
      if (val && val.lng) {
        lng = val.lng
        lat = val.lat
      }
    })

    // 搜索
    const searchKey = getDebounce(
      (val: { detail: { value: string } }, isClick?: boolean) => {
        //   console.log('搜索框失去焦点', val)
        if (isClick) {
          currentText.value = val.detail.value
        }
        if (val.detail.value) {
          // 1. 保存历史
          // setHistoryToLocal(val.detail.value)
          // 2. 获取搜索结果
          getAllTypePoiList({
            page: 1,
            pageSize: 9999,
            queryKey: val.detail.value,
            sources: '1,2',
            longitude: `${lng}` || undefined,
            latitude: `${lat}` || undefined,
            type: categoryType
          }).then((res) => {
            console.log('搜索关键字数据：', res)
            let resArr = []
            for (let key in res) {
              const values = res[key]
              resArr = resArr.concat(values)
            }
            if (resArr && resArr.length > 0) {
              searchArr.value = resArr
            } else {
              uni.showToast({ title: '暂无搜索内容', icon: 'none' })
              searchArr.value = []
            }
          })
        }
      },
      600,
      false
    )

    // 保存历史
    const setHistoryToLocal = (val: string) => {
      let list = localArr.value
      list.unshift(val)
      list = [...new Set(list)] // 去重
      list.length > 30 && list.pop() // 超过10条删除最后一个
      localArr.value = list
      uni.setStorage({
        key: 'station_history_inputtext',
        data: localArr.value
      })
    }
    const clearHistory = () => {
      uni.showModal({
        title: '提示',
        content: '确认清除全部历史记录？',
        confirmColor: '#1ea198',
        success: function (res) {
          if (res.confirm) {
            localArr.value = []
            uni.setStorage({
              key: 'station_history_inputtext',
              data: []
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    // 页面返回
    const backPage = () => {
      // 由于-安卓-navigateBack无法返回，且app桥接也无法返回。临时方案重新加载一下地图首页
      if (isAndroid) {
        const envUrls = {
          dev: 'https://h5-app.jetour-dev.supaur.tech',
          sit: 'https://h5-app.jetour-sit.supaur.tech',
          uat: 'https://h5-app-uat.jetour.com.cn',
          prod: 'https://h5-app.jetour.com.cn'
        }
        const httpurl = envUrls[ENV as EnvInfo]
        window.location.href = `${httpurl}/package-stationmap/pages/map-page/map-page`
      } else {
        if (!isNotJtApp.value) {
          window.$flutter.canGoBack()
        } else {
          uni.navigateBack({})
        }
      }
    }

    // 跳转到地图指定经纬度poi
    const jumpMapLocation = (val: any) => {
      //   console.log('跳转到地图指定经纬度poi', val)
      uni.navigateTo({
        url: `/package-stationmap/pages/map-page/map-page?dms=${val.dms || ''}&id=${val.id || ''}`
      })
    }

    const openMap = (val: any) => {
      //   console.log('代开地图', val)
      if (isNotJtApp.value) {
        jumpAMap(val)
      } else {
        window.$flutter.fbOpenMap({
          data: { longitude: val.longitude, latitude: val.latitude, name: val.name }
        })
      }
    }
    return {
      navBack,
      searchIcon,
      locationIcon,
      localArr,
      detailnavIcon,
      searnotIcon,
      searchArr,
      statusBarH,
      currentText,
      getDebounce,
      jumpMapLocation,
      openMap,
      clearHistory,
      searchKey,
      backPage
    }
  }
})
</script>
<style lang="scss" scoped>
@mixin multi-line-omit($line: 1) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
  overflow: hidden;
}

.header {
  position: sticky;
  top: 0px;
  background-color: #fff;
  padding: 10px 12.5px;

  &-back {
    width: 24px;
    height: 24px;
    margin-right: 14px;
  }

  &-backview {
    width: calc(100vw - 67.5px);
    height: 35px;
    background: #f2f7f8;
    border-radius: 17.5px;
  }

  &-search {
    margin-left: 13px;
    width: 18px;
    height: 18px;
  }

  &-searchtext {
    margin-left: 4px;
    line-height: 35px;
    font-size: 14px;
    color: #c0c0c0;
  }
}

.moduleView {
  padding: 0px 32rpx;

  .history {
    &-title {
      margin: 24rpx 0rpx 4rpx 0rpx;
      font-size: 24rpx;
      color: #979797;
    }

    &-item {
      height: 110rpx;
      border-bottom: 1px solid #edeeef;

      &-img {
        width: 28rpx;
        height: 28rpx;
        margin-right: 18rpx;
      }

      &-txt {
        @include multi-line-omit();
        width: calc(100% - 65rpx);
        font-size: 28rpx;
        font-weight: 500;
        color: #1f1f22;
      }
    }
  }

  .searchview {
    &-item {
      height: 160rpx;
      justify-content: space-between;
      border-bottom: 1px solid #edeeef;

      &-img {
        width: 32rpx;
        height: 32rpx;
        margin-right: 18rpx;
      }

      &-txt {
        @include multi-line-omit();
        width: calc(100% - 35rpx);
        font-size: 32rpx;
        font-weight: 500;
        color: #1f1f22;
      }

      &-left {
        width: calc(100% - 88rpx);
      }

      &-right {
        flex-direction: column;
        justify-content: center;
      }

      &-rightimg {
        width: 54rpx;
        height: 54rpx;
      }

      &-distance {
        margin-top: 4rpx;
        font-size: 24rpx;
        color: #979797;
      }

      &-desc {
        @include multi-line-omit();
        margin-top: 12rpx;
        margin-left: 51rpx;
        font-size: 24rpx;
        color: #98999a;
      }
    }
  }

  .notData {
    justify-content: center;
    flex-direction: column;
    margin-top: 20vh;

    &-img {
      width: 150rpx;
      height: 150rpx;
    }

    &-text {
      margin-top: 32rpx;
      font-size: 26rpx;
      color: #979797;
    }
  }
}
</style>
