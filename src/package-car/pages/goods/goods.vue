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
    onLoad(() => {})
    onShow(() => {})
    return {}
  }
})
</script>
<style lang="scss" scoped>
.moduleView {
}
</style>
