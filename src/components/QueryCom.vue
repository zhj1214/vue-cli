<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2020/7/20 0020
 * 用于 右侧点击过滤图片展开多项搜索项目
 -------------------------->
<template>
  <div class="queryCom">
    <div class="query-button">
      <slot name="query" />
    </div>
    <span :class="'filter-block ' + (propExpand.isExpand ? 'is-active' : '')" @click="onExpand">
      <icon class="icon iconfont iconFilter" />
      <icon
        :class="'icon iconfont ' + (propExpand.isExpand ? 'iconDropdownUnfold' : 'iconTreeFold')"
      />
    </span>

    <div v-if="propExpand.isExpand" class="clear fix-line">
      <span style="float: right;" />
    </div>
    <!-- 展开可选的选项 -->
    <div v-if="propExpand.isExpand" class="expand-row">
      <slot />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'QueryCom',
    props: {
      propExpand: {
        type: Object,
        default() {
          return {
            isExpand: false,
          }
        },
      },
    },
    methods: {
      onExpand() {
        this.$emit('onExpandFilter')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .queryCom {
    position: relative;
  }

  .query-button {
    margin-right: 90px;
  }

  .is-active {
    color: #756cea;
    background: #fafafb;
    border-bottom: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .filter-block {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    padding: 4px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #e2e2e9;
    border-radius: 8px;
  }

  .fix-line {
    height: 12px;
    border-right: 1px solid #e2e2ea;

    span {
      position: relative;
      z-index: 1;
      display: block;
      width: 66px;
      height: 20px;
      background: #fafafb;

      &::before {
        position: absolute;
        bottom: 7px;
        left: -8px;
        display: block;
        width: 16px;
        height: 22px;
        background: white;
        border-right: 1px solid #e2e2ea;
        border-bottom: 1px solid #e2e2ea;
        border-bottom-right-radius: 12px 12px;
        content: '';
      }
    }
  }

  .expand-row {
    position: relative;
    padding: 24px;
    background: #fafafb;
    border: 1px solid #e2e2ea;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;

    &::after {
      /*
						display: block;
						content: "";
						position: absolute;
						top: -20px;
						width: 60px;
						height: 20px;
						right: 0;
						background: red;
						border-right: 1px solid #E2E2EA; */
    }
  }
</style>
