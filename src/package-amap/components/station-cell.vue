<template>
  <view class="alertView" :class="{ alertViewZindex: isPosition }" @click.stop="jumpPage('detail')">
    <!-- 收起箭头 -->
    <view class="alertView-header items-center" @click.stop="changeShowStatus(false)">
      <img class="alertView-header-img" :src="bottomIcon" />
    </view>
    <!-- 内容 -->
    <view class="alertView-content items-center">
      <!-- 左侧 -->
      <view class="items-center">
        <!-- 图片 -->
        <template v-if="item.imgUrl">
          <img v-if="isPosition" class="alertView-content-img" :src="item.imgUrl" />
          <img v-else class="alertView-content-detailimg" :src="item.imgUrl" />
        </template>
        <!-- 信息 -->
        <view v-if="isPosition" class="alertView-content-detailinfo" style="height: 130rpx">
          <view class="alertView-content-title">{{ item.name }}</view>
          <view class="alertView-content-adress">{{ item.address }}</view>
          <!-- 显示电话的时候上面的地址要一行显示 -->
          <view v-if="item.source == 1 && isShowPhone" class="items-center" @click.stop="contactStore">
            <img class="alertView-content-phoneimg" :src="phoneIcon" />
            <view class="alertView-content-phonetext">联系门店</view>
          </view>
        </view>
        <view v-else class="alertView-content-detailinfo">
          <view class="alertView-content-title">{{ item.name }}</view>
          <view class="alertView-content-adress">{{ item.address }}</view>
          <view class="alertView-right-location">距您{{ (item.distance / 1000).toFixed(2) }}KM</view>
        </view>
      </view>
      <!-- 右侧 -->
      <view v-if="isPosition" class="alertView-right items-center" @click.stop="openMap">
        <img class="alertView-right-img" :src="listNav" />
        <view class="alertView-right-title">到这去</view>
        <view class="alertView-right-location">{{ (item.distance / 1000).toFixed(2) }}KM</view>
      </view>
      <view v-else class="alertView-right alertView-right-flex items-center">
        <img class="alertView-right-detailimg" @click.stop="shareLocation" :src="shareIcon" />
        <img class="alertView-right-detailimg" @click.stop="openMap" :src="detailNav" />
      </view>
    </view>
    <!-- 底部信息 -->
    <view class="alertView-footer items-center" v-if="item.discount">
      <view class="alertView-footer-title">车主专享</view>
      <view class="alertView-footer-desc">{{ item.discount }}</view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, inject, defineComponent, computed } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { jumpAMap } from '../pages/map-page/AMapUtils'
const ENV = import.meta.env.VITE_APP_ENV

export default defineComponent({
  name: 'infoCell',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    isPosition: Boolean
  },
  setup(props, { emit }) {
    console.log('props', props)

    // obs图片
    const gdp = inject('$gdp') as GeneratorDynamicPicFunc<string[]>
    const [bottomIcon, listNav, detailNav, shareIcon, phoneIcon] = gdp([
      'station-bottom-icon.png',
      'station-list-nav.png',
      'station-detail-nav.png',
      'station-detail-share.png',
      'station-phone-icon.png'
    ])
    // 不是捷途app
    const isNotJtApp = computed(() => {
      const userAgent = window.navigator.userAgent
      return !userAgent.match(/ios|android\/[0-9.]+/)
    })

    const isShowPhone = computed(() => {
      return props.item.hotline || props.item.contact
    })
    /**
     * @description: 页面交互
     */
    const changeShowStatus = (val: boolean) => {
      emit('change', val)
    }
    const jumpPage = (val: string) => {
      if (val === 'detail' && props.item.source == 2) {
        return emit('showDetail')
      }
    }

    // 联系门店
    const contactStore = () => {
      // 1. 关闭弹窗
      emit('change', false)
      // 2. 弹起电话选择
      const phones = ['拨打电话']
      if (props.item.hotline) {
        phones.push(`24小时热线：${props.item.hotline}`)
      }
      if (props.item.contact) {
        phones.push(`服务电话：${props.item.contact}`)
      }

      uni.showActionSheet({
        itemList: phones,
        success: function (res) {
          if (res.tapIndex === 1) {
            if (isNotJtApp.value) {
              uni.makePhoneCall({
                phoneNumber: props.item.hotline
              })
            } else {
              window.$flutter.fbPhoneCall({ phone: props.item.hotline })
            }
          }
          if (res.tapIndex === 2) {
            if (isNotJtApp.value) {
              uni.makePhoneCall({
                phoneNumber: props.item.contact
              })
            } else {
              window.$flutter.fbPhoneCall({ phone: props.item.contact })
            }
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
          emit('change', true)
        }
      })
    }

    // 分享
    const shareLocation = () => {
      const envUrls = {
        dev: 'https://h5-app.jetour-dev.supaur.tech',
        sit: 'https://h5-app.jetour-sit.supaur.tech',
        uat: 'https://h5-app-uat.jetour.com.cn',
        prod: 'https://h5-app.jetour.com.cn'
      }
      const httpurl = envUrls[ENV as EnvInfo]
      window.$flutter.fbShare({
        // platform: 0, //平台类型：0 微信好友，1 微信朋友圈，2 微博 （具体分享平台有待确认）
        title: props.item.name, //控制显示文本，空字符串表示显示默认文本
        content: props.item.discount || '', // 描述内容
        // imgUrl: imagePath.value, //显示图片 大小不超过10MB
        imgUrl: props.item.imgUrl || '',
        thumbUrl: props.item.thumbnail || '', // 缩略图 大小不超过 32KB
        webpageUrl: `${httpurl}/package-stationmap/pages/map-page/map-page?dms=${props.item.dms || ''}&id=${props.item.id || ''}`
      })
    }

    const openMap = () => {
      if (isNotJtApp.value) {
        jumpAMap(props.item)
      } else {
        window.$flutter.fbOpenMap({
          data: { longitude: props.item.longitude, latitude: props.item.latitude, name: props.item.name }
        })
      }
    }
    return {
      bottomIcon,
      listNav,
      detailNav,
      shareIcon,
      phoneIcon,
      isShowPhone,
      jumpPage,
      changeShowStatus,
      shareLocation,
      contactStore,
      openMap
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

.alertViewZindex {
  z-index: 9999;
  position: fixed;
}

.alertView {
  width: 100%;
  bottom: 0;
  background-color: white;
  padding: 0px 17px 16px 17px;
  border-radius: 10px 10px 0px 0px;

  &-header {
    justify-content: center;
    padding: 10rpx;

    &-img {
      width: 70rpx;
      height: 32rpx;
    }
  }

  &-content {
    justify-content: space-between;

    &-img {
      width: 140rpx;
      height: 140rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    &-detailimg {
      width: 188rpx;
      height: 188rpx;
      margin-right: 20rpx;
    }

    &-detailinfo {
      height: 188rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    &-phoneimg {
      width: 34rpx;
      height: 34rpx;
    }

    &-phonetext {
      margin-left: 6rpx;
      font-size: 24rpx;
      color: #00a198;
    }

    &-title {
      @include multi-line-omit(2);
      width: calc(100vw - 320rpx);
      font-size: 38rpx;
      font-weight: 500;
      color: #323334;
      text-align: left;
    }

    &-adress {
      @include multi-line-omit(2);
      width: calc(100vw - 340rpx);
      font-size: 24rpx;
      font-weight: 400;
      color: #666768;
    }
  }

  &-right {
    justify-content: center;
    flex-direction: column;

    &-img {
      width: 54rpx;
      height: 54rpx;
    }

    &-detailimg {
      width: 40rpx;
      height: 40rpx;
    }

    &-flex {
      height: 188rpx !important;
      justify-content: space-between !important;
    }

    &-title {
      margin: 2rpx 0px 6rpx 0px;
      font-size: 22rpx;
      color: #00a198;
    }

    &-location {
      font-size: 22rpx;
      color: #666768;
    }
  }

  &-footer {
    margin-top: 24rpx;
    background: rgba(0, 161, 152, 9%);
    border-radius: 6rpx;
    padding: 12rpx 14rpx;

    &-title {
      width: 130rpx;
      height: 50rpx;
      background: linear-gradient(134deg, #16e2dc 0%, #00a198 100%);
      border-radius: 6rpx;

      font-size: 24rpx;
      text-align: center;
      line-height: 50rpx;
      color: #ffffff;
    }

    &-desc {
      @include multi-line-omit(2);
      width: calc(100vw - 260rpx);
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #00a198;
      line-height: 32rpx;
    }
  }
}
</style>
