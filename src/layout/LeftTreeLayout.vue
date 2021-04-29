<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-10-10 17:37:31
 * @LastEditTime: 2020-10-11 17:57:43
 * @LastEditors: sam.xutao
-->
<template>
  <div class="left-right-tree clearfix">
    <div class="left-tree">
      <slot name="left" />
    </div>
    <div class="right-table">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LeftTreeLayout',
  }
</script>

<style scoped lang="scss">
  .left-tree {
    float: left;
    width: 300px;
    padding: 24px;
  }

  .right-table {
    padding: 24px;
    overflow: hidden;
    // margin-left: 300px;
    border-left: 1px solid #e2e2ea;
  }

  .query {
    padding: 24px 0;
  }

  .content {
    h3 {
      position: relative;
      height: 52px;
      padding-bottom: 24px;
      font-size: 18px;
      color: #171725;
      border-bottom: 1px solid #e2e2ea;

      &::before {
        position: absolute;
        top: 0;
        left: -25px;
        display: block;
        width: 6px;
        height: 28px;
        background: #887ef7;
        border-radius: 0 8px 8px 0;
        content: '';
      }
    }
  }
</style>
