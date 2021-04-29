<!--
 * @Description: 自定义表头
 * @Author: sam.xutao
 * @Date: 2020-03-17 19:38:22
 * @LastEditTime: 2020-03-27 14:07:13
 * @LastEditors: sam.xutao
 -->
<template>
  <div>
    <div class="title-box">
      <slot>
        <span v-for="item in titles" :key="item.key">
          {{ item.title }}
        </span>
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'PowerTitle',
    props: {
      title: { type: Array },
    },
    data() {
      return {
        titles: [],
      }
    },
    mounted() {
      this.titles = this.title.concat(...this.titles)
    },
  }
</script>
<style lang="scss" scoped>
  .title-box {
    display: flex;
    height: 48px;
    background: rgba(240, 244, 250, 1);

    span {
      display: flex;
      padding: 0 8px;
      font-weight: bold;
      border-right: solid 1px #d8e3ee;
      flex: 1;
      align-items: center;

      label {
        min-width: 48%;
      }
    }
  }
</style>
