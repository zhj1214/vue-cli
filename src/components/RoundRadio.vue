<template>
  <div class="radio-container">
    <div
      v-for="d in dataList"
      :key="d.value"
      :class="selectClass(d.value)"
      class="each-select"
      @click="changeRadio(d.value)"
    >
      {{ d.label }}
    </div>
  </div>
</template>

<script>
  /**
 * 圆角的类似 radio 的组件
 * props: {
 *   数据源 dataList: [{
        label: '全部',
        value: '',
    }],
    defaultSelect 默认值
 * }
 * 用法：
 *  <RoundRadio
 :dataList="list"
 @select="selectRadio"
 :defaultSelect="''" />
 * 事件: select，返回值是选中的值，此时需要再次设置 defaultSelect.
 */
  export default {
    name: 'RoundRadio',
    components: {},
    props: {
      dataList: Array,
      defaultSelect: [String, Number],
    },
    data() {
      return {
        select: this.defaultSelect,
      }
    },
    computed: {},
    watch: {
      defaultSelect(updateValue) {
        this.select = updateValue
      },
    },
    created() {},
    mounted() {},
    methods: {
      selectClass(value) {
        return value === this.select ? 'select-item' : ''
      },
      changeRadio(value) {
        this.select = value
        this.$emit('select', this.select)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .radio-container {
    display: flex;
    width: fit-content;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: #f1f1f5;
    border-radius: 16px;
    justify-content: flex-start;
  }

  .each-select {
    padding-right: 26px;
    padding-left: 26px;
    cursor: pointer;
  }

  .select-item {
    //width: 96px;
    height: 32px;
    color: #fff;
    background: #756cea;
    border-radius: 16px;
  }
</style>
