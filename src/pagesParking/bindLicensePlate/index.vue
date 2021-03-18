<!--
 * @Author: NineNan
 * @Date: 2020-12-31 11:35:52
 * @LastEditTime: 2021-01-28 09:45:50
 * @LastEditors: Please set LastEditors
 * @Description: 绑定车牌
 * @FilePath: /heng-weapp/src/pagesParking/bindLicensePlate/index.vue
-->
<template>
  <view class="bind-license-plate">
    <navBar
      background="#f6f6f6"
      ext-class="fixed-bar"
      :home-btn="true"
      title="绑定车牌"
    />
    <view class="content">
      <view class="license-plate-number">
        已绑定 <text>{{ options.currentCars }}</text
        >张<span v-if="options.isBindCarNum == 'true'"
          >，限绑定 <text>{{ options.binds }}</text> 张</span
        >
      </view>
      <view class="keybord">
        <car-keybord
          :title="'请输入您的车牌号'"
          @success="success"
          @fail="fail"
        />
      </view>
      <button :class="btnStyle" @click="binding">确认绑定</button>
    </view>
  </view>
</template>
<script>
import carKeybord from "../components/carKeybord";
import { bingStatus } from "../dictionary";
export default {
  components: {
    "car-keybord": carKeybord,
  },
  data() {
    return {
      licensePlate: "", // 车牌号
      bingStatus: bingStatus, // 绑定状态
      options: {}
    };
  },
  computed: {
    btnStyle() {
      return this.licensePlate ? "btn-success" : "btn-disabled";
    },
  },
  onLoad(options){
    if(options){
      this.options = options
    }
  },
  methods: {
    /**
     * @description 符合规范的车牌号
     */
    success(val) {
      this.licensePlate = val;
    },
    /**
     * @description 不符合规范的车牌号
     */
    fail() {
      this.licensePlate = "";
    },
    /**
     * @description 绑定车牌
     */
    binding() {
      if (this.licensePlate) {
        uni.$api
          .apiRequest("parkBindPlate", {
            carNumber: this.licensePlate,
            memberId: uni.$localStorage.getItem("memberId"),
            carType: this.licensePlate.length == 8 ? 2 : 1,
            gradeId: uni.$localStorage.getItem("wxUserInfo").levelName,
            isBind: true,
            isCheck: false,
          })
          .then((res) => {
            if (res.code === 10000) {
              let pages = getCurrentPages(); // 获取当前页面js里面的pages里的所有信息。
              let prevPage = pages[pages.length - 2];
              if (res.data === 1) {
                setTimeout(() => {
                  uni.navigateBack({
                    success: () => {
                      prevPage.$vm.getCarList();
                    },
                  });
                }, 1000);
              }
              uni.$alert.showToast(this.bingStatus[res.data]);
            }
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
