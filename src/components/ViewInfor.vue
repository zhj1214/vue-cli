<!--
 * @Author: your name
 * @Date: 2021-01-08 10:52:48
 * @LastEditTime: 2021-01-08 10:53:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \pi-heng\src\components\commons\ViewInfor.vue
-->

<style lang="scss">
.cardDescView{
  .cardDescCont{
    padding:20px;
    font-family:PingFangSC-Regular;
    font-weight:600; max-height:75%; overflow:hidden; overflow-y:auto;
    .prodList{max-width:300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    .prodList span{margin-right:8px;}
    li{ list-style-type: none; margin-bottom:16px;
    position: relative;text-indent: 1em;
      &::before{content:''; display: inline-block; width:6px; height: 6px; background: #DBB678; border-radius: 50%; left:0; top:8px;position: absolute;}}
    li h3{
      font-size:14px;
      color:rgba(103,103,143,1); 
      &+div{word-break:break-word;}
    }
    li>div{color:rgba(145, 145, 145, 1)}
  } 
}
.cardDescView{
  height: 97%;overflow: hidden; overflow-y:auto;
}
</style>
<style lang="scss">
  .prodList .ivu-tag{text-indent:0 !important;}
</style>
<style lang="less">
  .instructionsWrapper {
    width: 100%;
    height: auto;

    p {
      margin-top: 11px;
      font-size: 14px;

      label {
        color: #B4B4B4;
      }

      span {
        font-size: #333333;
      }
    }
  }
</style>
<template>
  <i-col
    span="24"
    class="cardDescView"
  >
    <div
      v-if="infor.couponDesc!=initDesc"
      class="instructionsWrapper"
      v-html="infor.couponDesc"
    />
    <div
      v-else
      class="instructionsWrapper"
    />
  </i-col>
</template>

<script>
export default {
  name: "CouponView",
  props: {
    infor: { type: Object },
  },
  data(){
    return{
      amountTypeObj:{1:'元',2:'小时',3:'分钟'},
      initDesc:'<ul><li>优惠券名称</li><li>优惠内容</li><li>适用商品</li><li>有效日期</li></ul>'
    }
  },
  computed:{
    
  }
};
</script>

