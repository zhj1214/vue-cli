<!--
 * @Description: 元素拖拽
 * @Author: sam.xutao
 * @Date: 2020-03-03 14:21:51
 * @LastEditTime: 2020-07-01 14:49:32
 * @LastEditors: sam.xutao
 * 
 * @params boxId String 拖拽盒子的id 用于同一个页面存在多个拖拽框的情况，必填
 * @params childClsname String 子元素项样式名，形如 .class ,#id 或者 labelname
 * @params xAxisDirection Boolean 水平方向是否可拖拽，默认为 true
 * @params yAxisDirection  Boolean 垂直方向是否可拖拽，默认为 false
 * @Function dragStop  function 拖拽结束后的方法回调
 * @slot  drag-items  需拖拽的元素数据，存放在 li 结构里
 *
 * @ 使用方法 Example
  <CommDrag childClsname=".img-view-box" @dragStop="dragStop" boxId="special-drag-box">
    <template slot="drag-items">
       <li v-for="(item,index) in list"  class="img-view-box"></li>
    </template>
  </CommDrag>
 -->
 <style lang="scss">
  .draggable-box{
    // display: flex; justify-content: space-evenly; 
    outline: none;
    li{
      height: 40px; line-height: 40px; background:#fff; margin: 0 10px;flex:1; text-align: center; 
      a{font-size:20px;}
      &:hover{outline:dashed 2px #2d8cf0;cursor:move;}
    }
    .draggable-source--is-dragging{
      // border:solid 1px #f00;
      background:transparent; color:#2d8cf0;
    }
    .draggable-mirror{background: #daebfd; color:#fff;}
    .draggable-original{border:solid 1px #999;}
  }
 </style>
<template>
  <div>
    <ul
      :id="boxId"
      class="draggable-box"
    >
      <slot name="drag-items">
        <li
          v-for="(item,index) in 2"
          :key="index+Math.random()"
        >
          {{ item }}
        </li>
      </slot>
    </ul>
  </div>
</template>
<script>
import {Sortable} from '@shopify/draggable';
export default {
  name:'CommDragbox',
  props:{
    childClsname:{type:String},
    boxId:{type:String,required:true},
    xAxisDirection:{type:Boolean,default:true},
    yAxisDirection:{type:Boolean,default:false},
  },
  data(){
    return {
      draggObj:null
    }
  },
  mounted(){
    const draggable = new Sortable(document.querySelectorAll('#'+this.boxId), {
      draggable: this.childClsname||'li',
      mirror: {
        constrainDimensions: true,
        cursorOffsetX: 10,
        cursorOffsetY: 10,
        yAxis: this.yAxisDirection,
        xAxis: this.xAxisDirection
      }
    });
    this.draggObj = draggable;
    this.$nextTick(()=>{
      // this.draggObj.on('drag:start', (e) => this.$emit('dragStart',e) );
      // this.draggObj.on('drag:move', (e) => this.$emit('dragMove',e));
      this.draggObj.on('drag:stop', () =>{
        setTimeout(()=>{
          this.$emit('dragStop',this.boxId)
        })
      });
    })
  }
}
</script>