<template>
  <view class="ht-actionsheet-share">
    <u-popup
      :value="visible"
      mode="bottom"
      border-radius="16"
      safe-area-inset-bottom
      :mask-close-able="false"
    >
      <view class="wrap">
        <view class="actions">
          <view class="actions-item" v-for="(item, index) in list" :key="index">
            <button
              class="actions-item-btn"
              v-if="item.openType"
              :open-type="item.openType"
              type="primary"
              @tap="onTapAction(item, index)"
            >
              {{ item.text }}
            </button>
            <view v-else class="actions-item" @tap="onTapAction(item, index)"
              >{{ item.text }}
            </view>
          </view>
        </view>

        <view class="cancel" @tap="cancel"> 取消 </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'ht-actionsheet-share',
  props: {
    list: {
      type: Array,
      default() {
        return [
          {
            text: '分享给朋友',
            openType: 'share',
          },
          {
            text: '分享到朋友圈',
          },
        ];
      },
    },

    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onTapAction(item, index) {
      this.$emit('change', {
        index,
        detail: item
      });
       this.$emit('cancel');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="less" scoped>
.ht-actionsheet-share {
  .wrap {
    background-color: #f2f2f2;
  }
  .actions {
    margin-bottom: 16rpx;
    background-color: #fff;
    &-item {
      text-align: center;
      font-size: 28rpx;
      line-height: 112rpx;
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
      &-btn {
        background-color: #fff;
        border-radius: 0;
        border: none;
        color: #444;
        font-size: 28rpx;
        line-height: 112rpx;
        &:after {
          border: none;
        }
      }
    }
  }
  .cancel {
    text-align: center;
    font-size: 28rpx;
    line-height: 112rpx;
    background-color: #fff;
  }
}
</style>
