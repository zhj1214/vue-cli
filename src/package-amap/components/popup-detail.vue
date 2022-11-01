<template>
  <uni-popup ref="detailPopup" type="bottom" @change="changePopup">
    <view class="moduleView" style="padding-bottom: 34px">
      <!-- 信息组件 -->
      <info-cell :item="detail" @change="clickMask"></info-cell>
      <!-- 横线 -->
      <view class="line" v-if="detail.introduction"></view>
      <!-- 驿站简介 -->
      <view class="descview" v-if="detail.introduction">
        <view class="descview-title">驿站简介</view>
        <!--  简介 -->
        <view class="descview-text" v-html="detail.introduction"> </view>
      </view>
    </view>
  </uni-popup>
</template>
<script lang="ts">
import { ref, reactive, defineComponent, watch } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import InfoCell from './station-cell.vue'

export default defineComponent({
  name: 'popup-detail',
  props: {
    detail: {
      type: Object,
      default: () => ({})
    },
    show: Boolean
  },
  components: {
    'info-cell': InfoCell
  },
  setup(props, { emit }) {
    const detailPopup = ref(null)

    const clickMask = () => {
      ;(detailPopup as any).value.close()
      emit('changeShow')
    }

    /**
     * @description: popup 状态改变
     * @param {*} val
     */
    const changePopup = (val: { show: boolean; type: string }) => {
      console.log('val:', val)
      if (val.show === false) {
        emit('changeShow')
      }
    }

    /**
     * @description: 监听弹窗显示
     */
    watch(
      () => props.show,
      (newValue, oldValue) => {
        console.log('newValue', newValue)

        if (newValue) {
          ;(detailPopup as any).value.open()
        }
        if (newValue === false) {
          clickMask()
        }
      }
    )
    return {
      clickMask,
      changePopup,
      detailPopup
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep .uni-popup__wrapper-box {
  border-radius: 20rpx 20rpx 0rpx 0rpx;
}

.moduleView {
  .line {
    margin: 4px 16px 10px 16px;
    width: calc(100% - 32px);
    height: 1px;
    background-color: #f6f6f6;
  }

  .descview {
    padding: 0px 16px 16px 16px;

    &-title {
      padding: 18rpx 0px;
      font-size: 34rpx;
      font-weight: 500;
      color: #323334;
    }

    &-text {
      font-size: 12px;
      max-height: 30vh;
      overflow: auto;
    }
  }
}
</style>
