<template>
  <view class="header items-center" :style="{ 'padding-top': `${statusBarH}px` }">
    <img v-if="!isNotJtApp" class="header-back" :src="navBack" @click="backPage" />
    <view
      class="header-backview items-center"
      :style="{ width: isNotJtApp ? '100%' : 'calc(100vw - 135rpx)' }"
      @click="jumpPage('search')"
    >
      <img class="header-search" :src="searchIcon" />
      <view class="header-searchtext">搜索</view>
    </view>
  </view>
  <view
    class="content"
    :style="{ height: `calc(100% - ${45 + statusBarH}px)`, top: `${45 + statusBarH}px` }"
  >
    <view id="containerMap"></view>
    <!-- 类目展示 -->
    <view class="category">
      <view style="max-height: 70vh; overflow: auto">
        <!-- 全部 -->
        <view
          class="category-item items-center"
          :class="{ categoryActivity: selectIdx === -1 }"
          @click="selectCategory(-1, true)"
        >
          <img class="category-item-img" :src="selectIdx === -1 ? allSelectIcon : allIcon" />
          <text class="category-item-title">全部</text>
        </view>
        <template v-if="isOpen">
          <view
            class="category-item items-center"
            :class="{ categoryActivity: selectIdx === index }"
            v-for="(item, index) in categorys"
            :key="item.type"
            @click="selectCategory(index)"
          >
            <img
              v-if="selectIdx === index && item.iconActive"
              class="category-item-img"
              :src="item.iconActive"
            />
            <img v-else-if="item.icon" class="category-item-img" :src="item.icon" />
            <view>
              <view class="category-item-title">{{ item.count }}</view>
              <view
                class="category-item-text"
                :style="{ width: item.iconActive || item.icon ? '90rpx' : '130rpx' }"
                >{{ item.title }}</view
              >
            </view>
          </view>
        </template>
      </view>
      <!-- 展开、收缩 -->
      <view class="category-footer items-center" @click="isOpen = !isOpen">
        <img v-if="isOpen" class="category-footer-img" :src="zkzdIcon" />
        <img v-else class="category-footer-img" :src="zkzdUpIcon" />
      </view>
    </view>
    <!-- 定位图标 -->
    <img v-if="!isNotJtApp" class="locationImg" :src="locationIcon" @click.stop="refreshLocation" />
    <!-- 信息展示 -->
    <view v-if="isShow">
      <info-cell
        style="padding-bottom: 34px"
        :item="markerinfo"
        :isPosition="true"
        @change="(val: boolean) => { isShow = val }"
        @showDetail=";(isShowDetail = true), (isShow = false)"
      ></info-cell>
    </view>
  </view>
  <!-- 详情弹窗 -->
  <popup-detail
    :show="isShowDetail"
    :detail="markerDetailInfo"
    @changeShow="isShowDetail = false"
  ></popup-detail>
</template>
<script lang="ts">
import { ref, inject, onMounted, computed, defineComponent } from 'vue'
// import { shallowRef } from '@vue/reactivity'

import { onShow, onLoad } from '@dcloudio/uni-app'
import store from '@src/store'
import { createMarker, createLayerMarker, jumpAMap, mapLoader } from './AMapUtils'
import InfoCell from '../../components/station-cell.vue'
import PopupDetail from '../../components/popup-detail.vue'
import { getStationList, getPoiDetailInfo, getAllTypePoiList } from '@api/mine'

export default defineComponent({
  name: 'stationMap',
  components: { 'info-cell': InfoCell, 'popup-detail': PopupDetail },
  setup(props) {
    // obs图片
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [
      currentIcon,
      allIcon,
      zkzdIcon,
      zkzdUpIcon,
      allSelectIcon,
      navBack,
      searchIcon,
      localDefault,
      locationIcon
    ] = gdp([
      'station-cur-icon.png',
      'station-all-icon.png',
      'station-zkzd-icon.png',
      'station-zkzd-bottom-icon.png',
      'station-all-activity-icon.png',
      'station-back-icon.png',
      'station-search-icon.png',
      'station-map-default.png',
      'station-location-icon.png'
    ])
    const statusBarHeight = ref(0)
    const statusBarH = computed(() => {
      return statusBarHeight.value || 10
    })
    // 1. 捷途app: false   2. 不是： true
    const isNotJtApp = computed(() => {
      const userAgent = window.navigator.userAgent
      return !userAgent.match(/ios|android\/[0-9.]+/)
    })

    // 是否显示详情
    const isShowDetail = ref(false)
    // 是否显示选中poi信息
    const isShow = ref(false)
    // 是否展开全部类目
    const isOpen = ref(true)
    const selectIdx = ref(-2)
    // 获取的类目
    const categorys = ref([])
    // 选中的poi对象
    const markerinfo = ref({})
    // 选中poi的详细信息
    const markerDetailInfo = ref({})
    // 地图上显示的poi对象数组
    let markerinfos: any[]
    // 地图对象
    let aMap: any
    // 定位图标
    let curIcon: any
    // 当前经纬度
    let curLng: string | number = 0
    let curLat: string | number = 0
    // 传入的地图中心位置
    let mapCenterLng = 0
    let mapCenterLat = 0

    /**
     * @description: 生命周期
     */
    onLoad((val: any) => {
      console.log('地图页面参数：', val)
      // 1. 隐藏导航
      window.$flutter.fbHiddenNavigationBar({
        data: { hidden: true }
      })

      // 2. 加载地图
      loadMap(val && (val.dms || val.id)).then(() => {
        // 2.1 是否是搜索页过来的，是：不需要加载所有类目信息点； 不是: 在加载
        if (val && (val.dms || val.id)) {
          getPoiDetailInfoRequest(val, true)
        }
      })

      // 2.2 设置地图中心位置
      if (!val.dms && val.lng && val.lat) {
        mapCenterLng = val.lng
        mapCenterLat = val.lat
        // 2.3 地图平移值目标中心位置
        aMap.setCenter(new AMap.LngLat(mapCenterLng, mapCenterLat, false))
      }
      // 3. 获取类目数据
      getStationList({ sources: '1,2' }).then((res) => {
        console.log('获取类目数据:', res)
        categorys.value = res.map((e) => {
          e.title = e.type
          if (e.type === '010100') {
            e.title = '加油站'
          } else if (e.type === '011100') {
            e.title = '充电桩'
          } else if (e.type === 'service_center') {
            e.title = '服务中心'
          }
          return e
        })
      })
    })

    // 获取导航状态栏高度
    onMounted(async () => {
      statusBarHeight.value = await window.$flutter.fbGetStatusBarHeight()
      console.log('导航高度：', statusBarHeight.value)
    })
    /**
     * @description: 地图操作
     */
    let cacheImgObject: any = null // 缓存上一次选中的信息
    const loadMap = async (isLoadPoiLiat: boolean) => {
      // 1. 加载高德地图SDK
      aMap = await mapLoader()
      // 2. 加载地图界面
      aMap = new AMap.Map('containerMap', {
        //设置地图容器id
        // viewMode: '3D', //是否为3D地图模式
        showBuildingBlock: true,
        animateEnable: false, // 地图平移过程中是否使用动画
        zoom: 16, //初始化地图级别
        center: [120.153576, 30.287459] //初始化地图中心点位置,应该是当前位置
      })
      // 3. 加载插件
      loadMapPlugin()
      // 4. 处理地图交互事件
      aMap.on('click', function (ev: any) {
        // console.log('点击地图空白位置-隐藏poi信息：', ev)
        isShow.value = false
        isShowDetail.value = false
      })
      // 5. marker点击事件

      aMap.markerClick = (e: any, img: any) => {
        // console.log('点击的marker位置：', e)

        // 5.1 获取选中的信息
        let info = markerinfos.find((item: any) => {
          if (e.target._position === item.position) {
            return item
          }
        })
        console.log('遍历集合得到的marker信息：', info)

        if (info) {
          if (cacheImgObject && cacheImgObject.id === info.id) {
            if (isShow.value === false) {
              isShow.value = true
            }
            return console.log('选择了相同的点位')
          }
          // 5.2 赋值当前选中的marker字段
          markerinfo.value = info
          if (!isShow.value) {
            isShow.value = true
          }
          // 5.3 设置选中的图标
          img.src = markerinfo.value.iconActive || ''

          // 5.4 保存、还原这次的选中信息
          if (!cacheImgObject) {
            cacheImgObject = {
              image: img,
              id: markerinfo.value.id, // 防止点击同一个标记，导致清空了上一个标记
              icon: markerinfo.value.icon || ''
            }
          } else {
            // 还原上一次选中的图片
            cacheImgObject.image.src = cacheImgObject.icon
            if (cacheImgObject.id !== markerinfo.value.id) {
              cacheImgObject.image = img
              cacheImgObject.id = markerinfo.value.id
              cacheImgObject.icon = markerinfo.value.icon || ''
            }
          }
          // 5.5 获取这个poi的详情数据，以便后面展示
          getPoiDetailInfoRequest(markerinfo.value)
        }
      }

      // 6. 获取当前位置信息 （拒绝定位使用天安门位置：116.397455,39.909187）
      try {
        if (!isNotJtApp.value) {
          const { latitude, longitude } = await window.$flutter.fbLocation()
          curLng = longitude || '116.397455'
          curLat = latitude || '39.909187'
          // 添加中心点小车
          new AMap.Marker({
            map: aMap,
            icon: curIcon,
            position: [curLng, curLat]
          })
          // 地图平移值目标中心位置
          aMap.setCenter(new AMap.LngLat(curLng, curLat, false))
        } else {
          const locationInfo = await getGeoLocation()
          console.log('getGeoLocation位置信息：', locationInfo)
          if (locationInfo && locationInfo.position) {
            curLng = locationInfo.position.lng || locationInfo.position[0] || 116.397455
            curLat = locationInfo.position.lat || locationInfo.position[1] || 39.909187
          } else {
            curLng = 116.397455
            curLat = 39.909187
          }
        }

        console.log(isNotJtApp.value, '当前位置：', `经纬度：${curLng}/${curLat}`)
        // 6.1 获取-全部-驿站信息
        if (!isLoadPoiLiat) {
          selectCategory(-1, true)
        }
      } catch (error) {
        console.error('定位失败', error)
        curLng = 116.397455
        curLat = 39.909187
        // 添加中心点小车
        new AMap.Marker({
          map: aMap,
          icon: curIcon,
          position: [curLng, curLat]
        })
        // 地图平移值目标中心位置
        aMap.setCenter(new AMap.LngLat(curLng, curLat, false))
        // 获取-全部-驿站信息
        if (!isLoadPoiLiat) {
          selectCategory(-1, true)
        }
      }
    }
    // 重新获取定位
    const refreshLocation = async () => {
      // 判断上一次定位是否成功
      let lastOk = false
      if (curLng && curLat) {
        lastOk = true
      }
      // 获取app定位
      const { latitude, longitude } = await window.$flutter.fbLocation()
      curLng = longitude || 0
      curLat = latitude || 0
      // 上一次定位失败：重置选中状态，在获取一下当前类型数据
      if (!lastOk) {
        const last = selectIdx.value
        selectIdx.value = -2
        selectCategory(last)
      }
      // 移动地图
      aMap.setCenter(new AMap.LngLat(longitude, latitude, false))
    }
    // 获取当前位置信息
    const getGeoLocation = () => {
      return new Promise((resolve, reject) => {
        aMap.plugin('AMap.Geolocation', function () {
          // 1. 创建定位对象
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 5000, //超过10秒后停止定位，默认：无穷大
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, //显示定位按钮，默认：true
            position: 'RB', //  定位按钮的排放位置,  RB表示右下
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            offset: [20, 44], // 定位按钮的停靠位置的偏移量
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            markerOptions: {
              icon: curIcon
            },
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true. 如果改成false，会导致定位成功后，地图缩放级别变到最小了，应该是地图的bug
            needAddress: false, // 是否需要将定位结果进行逆地理编码操作
            getCityWhenFail: true, // 定位失败之后是否返回基本城市定位信息
            extensions: 'all', // 是否需要详细的逆地理编码信息，默认为'base'只返回基本信息，可选'all'
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          })
          // 3. 添加定位控件
          aMap.addControl(geolocation)
          // 4. 回调定位结果
          geolocation.getCurrentPosition((status: string, result: any) => {
            if (status === 'complete') {
              resolve(result)
            } else {
              reject(result)
            }
          })
        })
      })
    }
    // 加载地图插件(比例尺)
    const loadMapPlugin = () => {
      // 1. 创建定位点icon对象
      curIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(31, 60),
        // 图标的取图地址
        image: currentIcon,
        // 图标所用图片大小
        imageSize: new AMap.Size(31, 60)
      })
      // 2. 同时引入工具条插件，比例尺插件和鹰眼插件 'AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MapType', 'AMap.Geolocation'
      AMap.plugin(['AMap.Scale'], function () {
        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        aMap.addControl(new AMap.Scale())
      })
    }

    // 页面返回
    const backPage = () => {
      if (!isNotJtApp.value) {
        window.$flutter.fbNavigationBack()
      }
    }
    // 创建marker函数
    const createMarkerFn = (arr: any[]) => {
      // 1. 字段映射 item中必须有id
      markerinfos = arr.map((item: any) => {
        item.position = [item.longitude || 0, item.latitude || 0] // 位置
        item.icon = item.iconb || localDefault
        item.iconActive = item.iconbActive || localDefault
        return item
      })

      // 2. 创建marker到地图上
      // createLayerMarker(aMap, markerinfos)
      markerinfos.forEach((e) => {
        createMarker(aMap, e)
      })
    }
    /**
     * @description: 选择类目
     */
    const selectCategory = (idx: number, isAll?: boolean) => {
      // 1. 切换选中样式
      if (idx === selectIdx.value) return
      // 1.1 重置保存的选中marker信息
      cacheImgObject = null
      //
      if (isAll) {
        selectIdx.value = -1
      } else {
        selectIdx.value = idx
      }
      if (!curLng || !curLat) return

      // 2. 清楚地图标记
      let l = Object.keys(aMap.markers || []).length
      if (l > 0) {
        // 1. 清楚所有覆盖物
        aMap.clearMap()
        // 2. 添加中心点小车
        new AMap.Marker({
          map: aMap,
          icon: curIcon,
          position: [curLng, curLat]
        })
      }

      // 2. 请求该类目下的所有标记点，并绘制到地图上
      getAllTypePoiList({
        page: 1,
        pageSize: 9999,
        sources: '1,2', // 来源 1位置服务 2捷途驿站 1,2都有
        type: isAll || idx === -1 ? undefined : categorys.value[idx].type,
        longitude: `${curLng}`,
        latitude: `${curLat}`
      }).then((res) => {
        console.log('获取当前类目下的poi数据', res)
        let resArr = []
        for (let key in res) {
          const values = res[key]
          resArr = resArr.concat(values)
        }
        createMarkerFn(resArr)
      })
    }

    /**
     * @description: 获取poi详情数据
     */
    const getPoiDetailInfoRequest = (val: any, isSearch?: boolean) => {
      getPoiDetailInfo({
        dms: val.dms || '',
        poiLocationId: val.id || '',
        longitude: `${curLng}`,
        latitude: `${curLat}`
      }).then((res) => {
        console.log('poi的详细信息：', res)
        // 1. 赋值poi信息
        markerDetailInfo.value = res
        // 是否是从搜索页面跳转过的
        if (isSearch) {
          // 2 地图添加目标marker
          const m = {
            ...{
              id: res.id,
              position: [res.longitude || 0, res.latitude || 0], // 位置
              icon: res.iconb || localDefault,
              iconActive: res.iconbActive || localDefault
            },
            ...res
          }
          createMarkerFn([m])

          // 3 地图平移值目标中心位置
          aMap.setCenter(new AMap.LngLat(res.longitude, res.latitude, false))
        }
      })
    }
    /**
     * @description: 页面交互
     */
    const jumpPage = (val: string) => {
      let url = ''
      if (val === 'search') {
        url = `/package-stationmap/pages/search-map/search-map?type=${
          selectIdx.value >= 0 ? categorys.value[selectIdx.value].type : ''
        }&lng=${curLng}&lat=${curLat}`
      }
      url && uni.navigateTo({ url })
    }

    return {
      jumpPage,
      jumpAMap,
      selectCategory,
      backPage,
      refreshLocation,
      statusBarH,
      markerDetailInfo,
      isShow,
      allIcon,
      zkzdIcon,
      zkzdUpIcon,
      allSelectIcon,
      navBack,
      searchIcon,
      locationIcon,
      isOpen,
      selectIdx,
      categorys,
      markerinfo,
      isNotJtApp,
      isShowDetail,
      currentIcon
    }
  }
})
</script>
<style lang="scss" scoped>
// 多行文本超出显示省略号
@mixin multi-line-omit($line: 1) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
  overflow: hidden;
}

::-webkit-scrollbar {
  display: none;
}
.locationImg {
  position: fixed;
  bottom: 88rpx;
  right: 40rpx;
  width: 50rpx;
  height: 50rpx;
  background-color: #fff;
  padding: 10rpx;
  border-radius: 5rpx;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.header {
  position: fixed;
  top: 0;
  width: 100vw;
  padding: 10px 25rpx;
  background-color: #fff;
  z-index: 9999999;

  &-back {
    width: 24px;
    height: 24px;
    margin-right: 14px;
  }

  &-backview {
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

.content {
  position: relative;
  height: 100%;

  #containerMap {
    height: 100%;
    width: 100%;
  }

  .categoryActivity {
    background-color: #00a198 !important;

    & > text {
      color: #fff !important;
    }

    & view {
      color: #fff !important;
    }
  }

  .category {
    position: absolute;
    top: 40rpx;
    right: 30rpx;
    width: 170rpx;
    min-height: 122rpx;
    background-color: #ffffff;
    border-radius: 6rpx;

    &-item {
      overflow: hidden;
      height: 80rpx;
      width: 100%;
      padding: 0px 16rpx;

      &-img {
        min-width: 30rpx;
        min-height: 30rpx;
        max-width: 31rpx;
        max-height: 31rpx;
        margin-right: 10rpx;
      }

      &-title {
        @include multi-line-omit();
        width: 130rpx;
        font-size: 15px;
        font-weight: 500;
        color: #020202;
      }

      &-text {
        @include multi-line-omit();
        font-size: 7px;
        font-weight: 500;
        color: #020202;
      }
    }

    &-footer {
      height: 42rpx;
      justify-content: center;

      &-img {
        width: 22rpx;
        height: 14rpx;
      }
    }
  }
}
</style>
