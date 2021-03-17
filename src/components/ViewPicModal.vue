<!--
 * @Description: 点击查看大图
 * @Author: sam.xutao
 * @Date: 2020-03-03 17:06:19
 * @LastEditTime: 2020-03-31 13:43:02
 * @LastEditors: sam.xutao
 -->
<template>
  <div
    class="img-view-box"
    :style="{'width':(width||80)+'px','height':(height||80)+'px'}"
    title="查看大图"
  >
    <img
      :src="src"
      alt="图片"
    >
    <slot>
      <div class="img-view-box-cover">
        <Icon
          type="ios-eye-outline"
          @click="visible=true"
        />
      </div>
    </slot>
    <Modal
      v-model="visible"
      title="查看图片"
      :mask-closable="false"
      footer-hide
    >
      <img
        v-if="visible"
        :src="src"
        alt="图片"
        style="width:100%;"
      >
    </Modal>
  </div>
</template>
<script>
export default {
  name:"ViewPicmoal",
  props:{
    src:{type:String,required:true},
    width:Number,
    height:Number
  },
  data(){
    return {
      visible:false
    }
  }
}
</script>