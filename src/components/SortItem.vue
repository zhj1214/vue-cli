<!--
 * @Description: 表格单个字段编辑排序
 * @Author: sam.xutao
 * @Date: 2020-07-23 10:39:01
 * @LastEditTime: 2020-07-23 14:46:41
 * @LastEditors: sam.xutao
-->
<template>
  <div>
    <p class="num-box">
      <span v-if="item.edit">
        <InputNumber
          :value="item[sortName]"
          :formatter="(value)=>value.toFixed(0)*1"
          class="mr-10"
          @on-change="val=>$emit('changeSort',item,val)"
        />
        <Icon
          type="md-checkmark"
          style="font-size: 20px; color:#19be6b; cursor: pointer;"
          class="mr-10"
          @click="$emit('confirmSort',item)"
        />
        <Icon
          type="md-close"
          style="font-size: 20px; color:#FF4C4C; cursor: pointer;"
          @click="cancelSort"
        />
      </span>
      <span
        v-else
        class="edit-box"
      >
        <span>{{ item[sortName] }}</span>
        <Icon
          type="md-create"
          class="ml-10"
          @click="$emit('editRow',item)"
        />
      </span>
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      item:{type:Object,required:true},   // 需排序的条目
      sortName:{type:String,required:true},  // 排序字段名，用于从 item 中取值展示
    },
    data() {
      return {
        oldVal: this.item[this.sortName]
      }
    },
    methods: {
      // 点击取消排序，先将原有值赋给当前编辑项，然后执行取消执行方法
      cancelSort() {
        this.$emit('changeSort',this.item,this.oldVal);
        this.$emit('cancelSort');
      }
    },
  }
</script>
<style lang="scss" >
  .num-box{
    &:hover .edit-box i{display: inline-block;color:#756CEA;}
    .edit-box{
      cursor: pointer;
      span{display: inline-block; min-width: 40px;}
      i{display: none;}
    }
  }
</style>
