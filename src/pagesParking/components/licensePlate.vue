<!--
 * @Author: NineNan
 * @Date: 2020-12-29 16:41:51
 * @LastEditTime: 2021-01-27 10:15:59
 * @LastEditors: Please set LastEditors
 * @Description: 车牌列表信息及操作
 * @FilePath: /heng-weapp/src/pagesParking/home/components/licensePlate.vue
-->
<template>
  <view class="license-plate">
    <view class="license-plate-title">
      <view class="license-plate-type">
        <view class="title">
          {{ content.carType === 1 ? "普通车牌" : "新能源车牌" }}
        </view>
        <view class="num"> {{ content.carNumber }} </view>
      </view>
      <image v-if="!isShowUntie" :src="carImg" />
      <view class="unite" @tap.stop="untie" v-else>
        <image :src="untieImg" />
        <text>解绑</text>
      </view>
    </view>
    <view class="license-plate-status" v-if="isShowParkStatus">
      <view>
        <view class="letter">P</view>
        <view class="status">停车中</view>
      </view>
      <view class="status-btn" @tap.stop="pay"> 立即缴费 </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    // 车牌信息
    content: {
      required: true,
      type: Object,
      default: () => {},
    },
    // 解除绑定按钮显示
    isShowUntie: {
      type: Boolean,
      default: false,
    },
    // 是否显示停车状态
    isShowStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      carImg: require("@/static/images/parking/parkingCar.png"),
      untieImg: require("@/static/images/parking/untie.png"),
    };
  },
  computed: {
    // 是否显示停车状态
    isShowParkStatus() {
      return this.isShowStatus && this.content.isPark;
    },
  },
  methods: {
    /**
     * @description 缴费
     */
    pay() {
      this.$emit("pay", this.content);
    },
    /**
     * @description 解除绑定
     */
    untie() {
      this.$emit("untie", this.content);
    },
  },
};
</script>
<style lang="scss" scoped>
.license-plate {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.license-plate-title {
  display: flex;
  justify-content: space-between;
  .title {
    width: 60px;
    height: 20px;
    border-radius: 2px;
    border: 1px solid #d8d8d8;
    font: 11px/16px "PingFangSC-Regular, PingFang SC";
    color: #919191;
    text-align: center;
    margin-bottom: 8px;
  }
  .num {
    font: 500 20px/28px "PingFangSC-Medium, PingFang SC";
    color: #000000;
  }
  > image {
    width: 176px;
    height: 51px;
  }
  .unite {
    display: flex;
    height: 17px;
    image {
      width: 15px;
      height: 15px;
    }
    text {
      font: 12px/17px "PingFangSC-Regular, PingFang SC";
      color: #7f7f7f;
    }
  }
}
.license-plate-status {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 12px;
  padding-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  > view:first-child {
    display: flex;
    flex-direction: row;
  }
  .letter {
    color: #ffffff;
    background-color: #fe5d4d;
    border-radius: 2px;
    padding: 0 5px;
    font: 14px/20px "PingFangSC-Regular, PingFang SC";
    margin-right: 4px;
  }
  .status {
    font: 14px/20px "PingFangSC-Regular, PingFang SC";
    color: rgba(0, 0, 0, 0.57);
  }
  .status-btn {
    width: 68px;
    background: #fe5d4d;
    border-radius: 13px;
    font: 12px/26px "PingFangSC-Regular, PingFang SC";
    font-weight: 400;
    color: #ffffff;
    text-align: center;
  }
}
</style>