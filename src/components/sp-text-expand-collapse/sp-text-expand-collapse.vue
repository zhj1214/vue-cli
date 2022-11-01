<template>
  <div class="wrapper">
    <div ref="child" class="text" :style="{ '-webkit-line-clamp': status }">
      <div v-if="isShowExpandBtn && isShowBtn" class="btn" @click="changeExpandCollapse">{{ statusText }}</div>
      <text v-if="!nodes || nodes.length === 0" id="content" class="text-content" :style="textStyle" @click="changeExpandCollapse">{{ text }}</text>
      <rich-text v-else id="content" :nodes="nodes" @click="changeExpandCollapse" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  name: 'SpTextExpandCollapse',
  props: {
    text: {
      type: String,
      default: ''
    },
    nodes: {
      type: Array,
      default: () => []
    },
    lineNum: {
      type: String,
      default: '2'
    },
    textStyle: {
      type: Object,
      default: () => {}
    },
    // 是否显示右下角的按钮
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    let status = ref(props.lineNum) // 初始化,多少行开始显示...
    let statusText = ref('展开') // 右下角按钮文案
    const isShowExpandBtn = ref(false) // 是否显示展开按钮
    const instance = getCurrentInstance()
    onMounted(() => {
      // #ifdef MP-WEIXIN
      const query = uni.createSelectorQuery().in(instance)
      query.select('#content').boundingClientRect()
      query.select('.text').boundingClientRect()
      query.exec(function (res) {
        if (res[0] && res[0].height) {
          if (res[0].height > res[1].height) {
            isShowExpandBtn.value = true
          } else {
            isShowExpandBtn.value = false
          }
        }
      })
      // #endif
      // #ifdef H5
      const child = ref(null)
      const clientHeight = child.value && (child as any).value.clientHeight
      const scrollHeight = child.value && (child as any).value.scrollHeight
      if (scrollHeight && clientHeight && scrollHeight > clientHeight) {
        isShowExpandBtn.value = true // 文本超出了
      } else {
        isShowExpandBtn.value = false
      }
      // #endif
    })

    /**
     * @description: 展开收起事件
     * @author: zhj1214
     */
    const changeExpandCollapse = () => {
      if (status.value === props.lineNum) {
        status.value = '999'
        statusText.value = '收起'
      } else {
        status.value = props.lineNum
        statusText.value = '展开'
      }
    }

    return {
      status,
      statusText,
      isShowExpandBtn,
      changeExpandCollapse
    }
  }
})
</script>

<style lang="scss" scoped>
@import './sp-text-expand-collapse.scss';
</style>
