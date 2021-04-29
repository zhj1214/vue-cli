<!--
 * @Description: 排序按钮组件
 * @Author: sam.xutao
 * @Date: 2020-02-26 10:08:20
 * @LastEditTime: 2020-03-11 19:05:58
 * @LastEditors: sam.xutao
 * @Params index  当前条目隶属下标  必填
 * @Params list  总条目列表   必填
 * @Function sortItem  针对某项进行排序，回传是升序(up)还是降序(down)，以及操作项下标
 -->
<style lang="scss" scoped>
  span i {
    font-size: 20px;
    color: #ccc;

    &:hover {
      color: rgba(61, 113, 255, 1);
    }
  }
</style>
<template>
  <div>
    <span>
      <!-- 如果是第一项，不显示向上排序图标 -->
      <a v-if="index" href="javascript:void(0);" @click="$emit('sortItem', 'up', id)"
        ><Icon type="md-arrow-round-up"
      /></a>
      <!-- 除非是最后一项，不然显示向下排序图标 -->
      <a v-if="!isLast" href="javascript:void(0);" @click="$emit('sortItem', 'down', id)"
        ><Icon type="md-arrow-round-down"
      /></a>
      <a v-if="!index && isLast" href="javascript:void(0);">-</a>
    </span>
  </div>
</template>
<script>
  export default {
    name: 'SortComp',
    props: {
      index: { type: Number, required: true },
      list: { type: Array, required: true },
      id: { type: [String, Number], required: true },
    },
    computed: {
      isLast() {
        return this.index == this.list.length - 1
      },
    },
  }
</script>
