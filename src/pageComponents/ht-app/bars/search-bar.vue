<template>
  <view class="ht-search-bar">
    <view class="search__field">
      <image
        class="search__field--icon"
        mode="widthFix"
        src="/static/images/store/search/search.png"
      ></image>
      <input
        :focus="focus"
        class="search__field--input"
        type="text"
        confirm-type="search"
        :placeholder="placeholder"
        :value="value"
        :disabled="disabled"
        :maxlength="50"
        @input="onInput"
        @confirm="onSearch"
      />
      <image
        v-if="!disabled"
        class="search__field--icon"
        mode="widthFix"
        src="/static/images/store/search/clear.png"
        @tap="onClear"
      ></image>
    </view>
    <view v-if="showCancel" class="search__action" @tap="onCancel">
      取消
    </view>
  </view>
</template>

<script>
export default {
  name: 'ht-search-bar',
  props: {
    placeholder: {
      type: String,
      default: '搜索好物',
    },
    value: {
      type: String,
      default: null,
    },
    showCancel: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.detail.value);
    },
    onClear() {
      this.$emit('clear');
    },
    onCancel() {
      this.$emit('cancel');
    },
    onSearch(e) {
      this.$emit('search', e.detail.value);
    },
  },
};
</script>

<style lang="less" scoped>
.ht-search-bar {
  display: flex;
  align-items: center;
  padding: 24rpx 40rpx;
  .search__field {
    flex: 1;
    display: flex;
    align-items: center;
    height: 80rpx;
    background-color: #f4f4f4;
    border-radius: 12rpx;

    &--icon {
      margin: 0 20rpx;
      width: 40rpx;
    }
    &--input {
      flex: 1;
      border-left: 1px solid #d8d8d8;
      padding-left: 10rpx;
    }
  }
  .search__action {
    margin-left: 36rpx;
    height: 80rpx;
    line-height: 80rpx;
  }
}
</style>
