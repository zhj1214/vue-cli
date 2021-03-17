<!--
 * @Author: your name
 * @Date: 2021-01-07 11:01:24
 * @LastEditTime: 2021-02-18 10:00:24
 * @LastEditors: Please set LastEditors
 * @Description: 该组件是用来在inputNumber输入框前后加内容，形成一个新的样式框
 * @FilePath: \pi-heng\src\components\right\parkingManage\index.vue
-->

<template>
  <div class="inpuWithUnit">
    <p
      v-if="isUnitBefore"
      class="inpuWithUnit__beforeUnit"
    >
      {{ unitBeforeText }}
    </p>
    <InputNumber
      ref="inputNumber"
      :class="[
        { inpuWithUnit__beforeInput: isUnitAfter },
        { inpuWithUnit__afterInput: isUnitBefore },
      ]"
      :max="maxValue"
      :min="minVlue"
      :placeholder="placeholder"
      :value="introductionInputValue"
      :disabled="isDisabled"
      :formatter="(value) => Number(value.toFixed(toFixedNum))"
      @on-change="change"
    />
    <p
      v-if="isUnitAfter"
      class="inpuWithUnit__afterUnit"
    >
      {{ unitAfterText }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    isUnitBefore: {
      // 单位位置，是否在前，是则前面展示单位
      type: Boolean,
      default: false,
    },
    unitBeforeText: {
      // 前面单位
      type: String,
      default: "",
    },
    isUnitAfter: {
      // 单位位置，是否在后，是则后面展示单位
      type: Boolean,
      default: false,
    },
    unitAfterText: {
      // 后面单位
      type: String,
      default: "",
    },
    minVlue: {
      // 最小值
      type: Number,
      default: 0,
    },
    maxValue: {
      // 最大值
      type: Number,
      default: Infinity,
    },
    placeholder: {
      // 默认提示
      type: String,
      default: "0",
    },
    introductionInputValue: {
      // 传入的值
      type: [Number, null],
    },
    isDisabled: {
      // 禁用
      type: Boolean,
      default: false,
    },
    changeInputValue: {
      // 改变值方法
      type: Function,
      default: () => {},
    },
    toFixedNum: {
      // 数字小数保留位数
      type: [Number, String],
      default: 0,
    },
  },
  methods: {
    change(value) {
      let newValue = value;
      if (value !== null) {
        newValue = Number(value.toFixed(this.toFixedNum));
      }
      this.$emit("changeInputValue", newValue);
    },
  },
};
</script>

<style lang="less" scoped>
.inpuWithUnit {
  width: 160px;
  height: auto;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.inpuWithUnit__beforeInput {
  flex: 1 1 auto;
  border-radius: 8px 0 0 8px;
}
.inpuWithUnit__afterUnit {
  width: 46px;
  height: 32px;
  background: rgba(250, 250, 251, 1);
  border-radius: 0px 8px 8px 0px;
  border: 1px solid rgba(226, 226, 234, 1);
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  color: #696974;
  font-weight: 300;
}
.inpuWithUnit__afterInput {
  flex: 1 1 auto;
  border-radius: 0px 8px 8px 0px;
}
.inpuWithUnit__beforeUnit {
  width: 46px;
  height: 32px;
  background: rgba(250, 250, 251, 1);
  border-radius: 8px 0 0 8px;
  border: 1px solid rgba(226, 226, 234, 1);
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  color: #696974;
  font-weight: 300;
}
</style>

<style lang="less">
.inpuWithUnit {
  .ivu-icon-ios-arrow-down::before {
    font-family: unset !important;
    content: "\F116";
    font-size: unset;
  }
}
</style>
