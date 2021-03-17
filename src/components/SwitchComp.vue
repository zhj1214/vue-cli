<!--
 * @Description: 显隐组件
 * @Author: sam.xutao
 * @Date: 2020-02-26 10:09:01
 * @LastEditTime: 2020-02-26 10:59:14
 * @LastEditors: sam.xutao
 * @Params visible  开关绑定的数值  必填
 * @Params openText  开关开启状态显示的文字
 * @Params closeText  开关关闭状态显示的文字
 * @Params size  开关尺寸，多于两个汉字时建议设置为 large ，默认 default
 * @Function switchChange  开发变更状态时回传具体状态给父组件
 -->
<template>
  <div>
    <i-switch
      :value="visible"
      :disabled="isDisabled"
      :size="size||'default'"
      @on-change="(value)=>$emit('switchChange',value)"
    >
      <span slot="open">{{ openText||"显示" }}</span>
      <span slot="close">{{ closeText||"隐藏" }}</span>
    </i-switch>
  </div>
</template>
<script>
export default {
  name:"SwitchComp",
  props:{
    visible:{type:Boolean,required:true},
    openText:{type:String},
    closeText:{type:String},
    size:{type:String},
    isDisabled:{type:Boolean,default: false,}
  }
}
</script>