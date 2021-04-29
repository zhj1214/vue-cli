<!--
 * @Description: 子级菜单，根据父级菜单显隐
 * @Author: sam.xutao
 * @Date: 2020-07-01 11:45:04
 * @LastEditTime: 2020-07-09 09:31:43
 * @LastEditors: sam.xutao
-->
<template>
  <div
    :style="{
      position: 'absolute',
      left: left + 'px',
      bottom: bottom + 'px',
      background: '#fff',
      width: menuWidth ? menuWidth + 'px' : width + 'px',
    }"
  >
    <CommDrag
      child-clsname=".img-view-box"
      box-id="secondMenuBox"
      :x-axis-direction="false"
      v-if="drag"
      :y-axis-direction="true"
      class="child-menu"
      @dragStop="dragStop"
    >
      <template slot="drag-items">
        <li
          v-for="item in menuList"
          :key="item.buttonId"
          :data-key="item.buttonId"
          class="img-view-box menu-view-item"
        >
          <span>{{ item.name }}</span>
        </li>
      </template>
    </CommDrag>
    <ul v-else class="child-menu">
      <slot name="content">
        <!-- <li v-for="item in menuList" :key="item.key" >
          {{ item.name }}
        </li> -->
      </slot>
    </ul>
  </div>
</template>

<script>
  import CommDrag from '@/components/CommDrag' // 通用拖拽组件
  export default {
    components: {
      CommDrag,
    },
    props: {
      menuList: { type: Array },
      offset: { type: Object }, // 父级元素offset
      drag: { type: Boolean }, // 是否支持拖拽
      menuWidth: { type: Number },
    },
    data() {
      return {
        width: this.offset.width,
        left: this.offset.left,
        bottom: this.offset.bottom,
      }
    },
    methods: {
      dragStop() {
        let lis = document.querySelectorAll('#secondMenuBox li.menu-view-item')
        if (lis.length) {
          let childKeys = Array.from(lis).map((item) => item.dataset.key)
          this.$parent.sortChildMenu(childKeys[0].split('-')[0], childKeys)
        }
        console.log(lis, 'asdf')
      },
    },
  }
</script>
<style lang="scss">
  #secondMenuBox {
    display: flex;
    flex-direction: column;
  }
</style>
<style lang="scss" scoped>
  .child-menu {
    position: relative;
    display: flex;
    min-height: 40px;
    padding: 8px 0;
    flex-direction: column;
    justify-content: center;

    li {
      width: auto;
      height: 30px;
      line-height: 30px;
      border-bottom: solid 1px #efefef;
      box-shadow: none;
      flex: 1;
    }

    &::after {
      position: absolute;
      bottom: -15px;
      left: calc(50% - 8px);
      display: inline-block;
      width: 0;
      height: 0;
      border: solid 8px transparent;
      border-top: 8px solid #fff;
      content: '';
    }
  }
</style>
