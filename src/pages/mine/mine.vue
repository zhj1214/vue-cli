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
    onLoad(() => {
      // this.a ='11'
    })
    this.a ='11'
    onShow(() => {})
    // 首个经销商信息
    // const dealerInfo = reactive({
    //   name: '',
    //   address: '',
    //   image: ''
    // }) as DealerInfo
    return {}
  }
})
</script>
<style lang="scss" scoped>
.moduleView {
}
</style>
