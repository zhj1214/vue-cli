<template>
  <view class="couponItem flex-row" @click="selectcheckboxChange">
    <view class="couponItem-left flex-row">
      <u-image
        :width="180"
        :height="180"
        :src="cell.imageUrl"
        mode="aspectFill"
        v-if="cell.imageUrl"
      ></u-image>
      <image
        v-else
        style="width: 180rpx;height: 180rpx;"
        src="../../static/images/myCardCoupon/couponIcon.png"
      ></image>
      <view class="info" style="flex: 1;">
        <view class="">
          <view class="item-title"
            >{{ cell.couponAmount }}
            <span class="item-min">{{
              cell.couponType == "DISCOUNT" ? "折" : "元"
            }}</span>
          </view>
          <view class="item-type">{{ cell.couponTypeName }}</view>
          <view class="item-content" v-if="cell.useThresholdAmount"
            >订单满{{ cell.useThresholdAmount }}元可用</view
          >
        </view>

        <view class="item-time"
          >{{ new Date(cell.startTime).Format("YYYY.MM.DD") }} ~
          {{ new Date(cell.endTime).Format("YYYY.MM.DD") }}</view
        >
      </view>
    </view>
    <!-- <u-checkbox-group @change="checkboxGroupChange"> -->
    <view @click.stop>
      <u-checkbox
        @change="checkboxChange"
        v-model="checked"
        active-color="#FF4C4C"
        :name="cell.uniqueCode"
        shape="circle"
      ></u-checkbox>
    </view>

    <!-- </u-checkbox-group> -->
  </view>
</template>

<script>
export default {
  props: {
    cell: Object,
    bestUseList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  created() {
    this.checked = this.cell.checked;
  },
  watch: {
    cell(newVal, oldVal) {
      if (newVal.checked != oldVal.checked || newVal.checked != this.checked) {
        this.checked = newVal.checked;
      }
    },
  },
  methods: {
    checkboxChange(e) {
      // 选中某个复选框时，由checkbox时触发
      // console.log(e);
      this.cell.checked = e.value;
      this.$emit("change", this.cell);
    },
    selectcheckboxChange() {
      this.checked = !this.checked;
      this.checkboxChange({ value: this.checked });
    },
  },
};
</script>

<style lang="less" scoped>
.couponItem {
  width: 670rpx;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.04);
  margin-top: 31rpx;
  border-radius: 4px;
  overflow: hidden;
  justify-content: space-between;
  background: white;

  .info {
    flex: 1;
    margin-left: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 180rpx;

    .item-min {
      font-size: 12px;
    }

    .item-title {
      font-size: 20px;
      font-family: PingFangSCSemibold-, PingFangSCSemibold;
      color: #fe5d4d;
      font-weight: 600;
    }

    .item-type {
      width: 48px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #929497;
      text-align: center;
      padding: 2px 4px;
      margin: 6px 0px;
      font-size: 8px;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 300;
      color: #929497;
    }
    .item-content {
      font-size: 9px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #929497;
    }

    .item-time {
      font-size: 9px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #929497;
    }
  }
}
</style>
