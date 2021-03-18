<!--
 * @Author: NineNan
 * @Date: 2020-12-30 10:08:32
 * @LastEditTime: 2021-01-28 09:43:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /heng-weapp/src/pagesParking/licensePlateManagement/index.vue
-->
<template>
  <view class="license-plate-management">
    <navBar
      background="#f6f6f6"
      ext-class="fixed-bar"
      :home-btn="true"
      title="车牌管理"
    />
    <view class="content">
      <view class="license-plate-number">
        已绑定 <text>{{ licensePlateData.length }}</text
        >张<span v-if="isBindCarNum"
          >，限绑定 <text>{{ bindCarNum }}</text> 张</span
        >
      </view>
      <view
        class="license-plate-list"
        v-for="(item, index) in licensePlateData"
        :key="index"
      >
        <license-plate
          :isShowUntie="true"
          :isShowStatus="item.isPark"
          :content="item"
          @untie="untie"
          @pay="pay"
        />
      </view>
      <button class="btn" @click="bindLicensePlate" v-if="isShowBandBtn">
        绑定车牌
      </button>
    </view>
    <alert-view
      v-if="isShowAlertView"
      :showCancel="true"
      :content="untieContent"
      :title="untieTitle"
      @cancel="cancel"
      @ok="ok"
    />
  </view>
</template>
<script>
import licensePlate from "../components/licensePlate"; // 车牌列表
import alertView from "@/pageComponents/alertView/alertView"; // 确认框
import { bingStatus } from "../dictionary";
export default {
  components: {
    "license-plate": licensePlate,
    "alert-view": alertView,
  },
  data() {
    return {
      bingStatus: bingStatus, // 绑定状态
      licensePlateData: [], // 绑定的车牌
      bindCarNum: 0,
      isBindCarNum: true,
      isShowAlertView: false, // 解除确认框显示
      untieContent: "是否确定解除此车牌的绑定？",
      untieTitle: "解绑车牌",
      currentLicensePlate: {}, // 当前车牌
      isShowBandBtn: false, // 是否显示绑定按钮
    };
  },
  onLoad() {
    this.userInfo = uni.$localStorage.getCurrentUser() || {};
    this.init();
  },
  methods: {
    /**
     * @description 初始化
     */
    init() {
      this.getCarList();
    },
    /**
     * @description 解绑
     */
    untie(content) {
      this.isShowAlertView = true;
      this.currentLicensePlate = content;
    },
    /**
     * @description 支付
     * @param {Object} content 当前车牌信息
     */
    async pay(content) {
      const params = {
        carNumber: content.carNumber,
        memberId: uni.$localStorage.getItem("memberId"),
        gradeId: uni.$localStorage.getItem("wxUserInfo").levelName,
        carType: content.carNumber.length === 8 ? 2 : 1,
      };
      const res = await uni.$api.apiRequest("parkCheckPlate", params);
      if (res && res.code === 10000) {
        if (!res.data.isPark) {
          uni.$alert.showToast("当前车辆未入场");
        } else {
          uni.navigateTo({
            url: `/pagesParking/payPark/index?json=${JSON.stringify(res.data)}`,
          });
        }
      }
    },
    /**
     * @description 取消绑定
     */
    cancel() {
      this.isShowAlertView = false;
    },
    /**
     * @description 确认取消绑定
     */
    ok() {
      var self = this;
      uni.$api
        .apiRequest("parkBindPlate", {
          carNumber: this.currentLicensePlate.carNumber,
          gradeId: uni.$localStorage.getItem("wxUserInfo").levelName,
          memberId: uni.$localStorage.getItem("memberId"),
          carType: this.currentLicensePlate.carNumber.length === 8 ? 2 : 1,
          isBind: false,
          isCheck: false,
        })
        .then((res) => {
          console.log(res);
          if (res.code === 10000) {
            if (!res.data) {
              uni.$alert.showToast("取消绑定成功");
            } else {
              uni.$alert.showToast(self.bingStatus[res.data]);
              setTimeout(() => {
                self.getCarList();
              }, 2000);
            }
          }
        });
    },
    /**
     * @description 绑定车牌
     */
    bindLicensePlate() {
      uni.navigateTo({
        url:
          "/pagesParking/bindLicensePlate/index?binds=" +
          `${this.bindCarNum || 0}&currentCars=${
            this.licensePlateData.length
          }&isBindCarNum=${this.isBindCarNum}`,
      });
    },
    /**
     * @description 获取绑定车牌列表
     */
    async getCarList() {
      this.isShowBandBtn = false;
      const params = {
        memberId: uni.$localStorage.getItem("memberId"),
        gradeId: this.userInfo.levelName,
      };
      const res = await uni.$api.apiRequest("parkList", params);
      if (res && res.code === 10000) {
        const { data } = res;
        if (
          (data.isBindCarNum && data.list.length < data.bindCarNum) ||
          !data.isBindCarNum
        ) {
          this.isShowBandBtn = true;
        }
        this.isBindCarNum = data.isBindCarNum;
        this.bindCarNum = data.bindCarNum;
        this.licensePlateData = data.list;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
