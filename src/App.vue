<script setup lang="ts">
import './utils/base/string'
import local from './utils/localStorage'
import api from './utils/http/apiRequest'
import util from './utils/tool'

import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { ENV } from './utils/glob'
onLaunch(() => {
  console.log('App Launch')
  uni.$local = local
  uni.$api = api
  uni.$util = util
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import './style/mixin.scss';
@import './style/variable.scss';
@import './style/common.scss';
</style>
