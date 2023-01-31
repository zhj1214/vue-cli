<template>
  <view class="moduleView">ssss</view>
</template>
<script lang="ts">
import { ref, reactive, defineComponent } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
export default defineComponent({
  name: '',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    itemType: Number
  },
  setup(props) {
    /**
     * @description: promise 错误
     */
    const getJSON = async () => {
      throw new Error('inner error')
    }

    new Promise((resolve,reject) => {
    JSON.parse('')
    resolve();
  })

    // 通过try/catch处理
    const makeRequest = async () => {
        getJSON()
    }

    onLoad(() => {
      makeRequest()
    })
    onShow(() => {})
    return {}
  }
})
</script>
<style lang="scss" scoped>
.moduleView {
}
</style>
