<template>
  <view>
    <navBar title="收货地址" background="#fff" back="true"></navBar>
    <view class="view">
      <view class="adressViewbg">
        <view v-for="(item, index) in list" :key="index" class="adressView">
          <view class="adressView-info">
            <view class="adressView-info-title">
              {{ item.receiver }} {{ item.receiverPhone }}
              <view
                class="aderss-tool-select"
                v-if="isChangeAdress"
                :data-idx="index"
                @tap.stop="selectReceiptAdress"
              >
                <image
                  class="adressView-info-adress-img-select"
                  v-if="item.isSwitch"
                  src="/static/images/my/check.png"
                ></image>
                <view class="adressView-info-adress-img-noram" v-else></view>
              </view>
            </view>
            <view class="adressView-info-adress">
              <image
                class="adressView-info-adress-img"
                style="margin-right: 4rpx;"
                src="/static/images/my/address.png"
              ></image>
              {{ item.province + item.city + item.county + item.detailed }}
            </view>
          </view>
          <view class="aderss-tool">
            <view class="aderss-tool-select" v-if="!isChangeAdress">
              <view
                class="adressView-info-adress-img-noram"
                v-if="item.isDefault != 1"
                @tap.stop="addDefault(item)"
              ></view>
              <image
                class="adressView-info-adress-img-select"
                v-else
                src="/static/images/my/check.png"
              ></image>
              <view class="adressView-info-adress-title">设为默认</view>
            </view>
            <view v-else>
              <view
                class="adressView-info-adress-default"
                v-if="item.isDefault == 1"
                >默认</view
              >
            </view>
            <view class="aderss-tool-select">
              <image
                class="adressView-info-adress-img"
                style="margin-right: 28rpx;"
                src="/static/images/my/Icon_edit.png"
                @click="editAdress(item)"
              ></image>
              <image
                class="adressView-info-adress-img"
                src="/static/images/my/delete.png"
                @tap.stop="showDetele(item)"
              ></image>
            </view>
          </view>
        </view>
      </view>
      <!-- 新增按钮 -->
      <view class="btnView" v-if="list.length < 20">
        <view class="btnView-Title" :style="theme.btn" @tap.stop="addAdresss"
          >新增地址</view
        >
      </view>
    </view>
    <!-- 弹框 -->
    <u-popup v-model="show" mode="center" border-radius="6">
      <view style="height:364rpx;padding: 20rpx 32rpx;">
        <view class="header headerPadding">
          <view class="header-title">确认删除</view>
          <image
            style="width:24rpx;height:24rpx;"
            src="/static/images/clear-icon.png"
          ></image>
        </view>
        <view class="content">确认删除该条地址？</view>
        <view class="bottomView">
          <view
            class="canle bottomView-title"
            style="color:#2E2E2E;"
            @tap.stop="delate"
            data-type="0"
            >取消</view
          >
          <view
            class="ok bottomView-title"
            style="color:white;"
            @tap.stop="delate"
            data-type="1"
            >确认</view
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      theme: uni.$theme,
      show: false,
      list: [],
      // 是不是更换地址情况
      isChangeAdress: false,
      // 当前地址id
      currentDeleteId: "",
      // 要切换的地址
      switchObj: {},
      //
      options: {},
      adressSwitch: "",
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.type);

    if (options.type && options.type == "switch") {
      this.setData({
        options: options,
        isChangeAdress: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAdressData();
  },
  methods: {
    /**
     * 地址列表
     */
    getAdressData() {
      uni.$api
        .apiRequest("userReceipList", {
          memberId: uni.$localStorage.getItem("memberId"),
        })
        .then((res) => {
          if (res.code == 10000) {
            console.log(res);

            function compare(val1, val2) {
              return val1.isDefault ? -1 : 1;
            }

            res.data.sort(compare);
            this.setData({
              list: res.data || [],
            });
          }
        });
    },

    /**
     * 新增地址、更换地址
     */
    addAdresss() {
      // if (!this.data.isChangeAdress) {
      uni.navigateTo({
        url:
          "./receiptAdressAdd?isEmpty=" + (this.list.length != 0 ? "0" : "1"),
      }); // } else {
      //   wx.navigateTo({
      //     url: '/pages/my/receiptAdress/receiptAdressAdd?adressId=' + this.data.options.adressId,
      //   })
      // }
    },

    /**
     * 设置为默认
     */
    addDefault(item) {
      console.log(item);
      uni.$api
        .apiRequest("userAddReceipEdit", {
          id: item.id,
          county: item.county,
          city: item.city,
          province: item.province,
          memberId: uni.$localStorage.getItem("memberId"),
          receiver: item.receiver,
          receiverPhone: item.receiverPhone,
          detailed: item.detailed,
          isDefault: true,
        })
        .then((res) => {
          if (res.code == 10000) {
            this.list.forEach((el) => {
              if (el.id == item.id) {
                el.isDefault = 1;
              } else {
                el.isDefault = -1;
              }
            });
            this.setData({
              list: this.list,
            });
          }
        });
    },

    /**
     * 编辑地址
     */
    editAdress(item) {
      uni.navigateTo({
        url: "./receiptAdressAdd?editInfo=" + JSON.stringify(item),
      });
    },

    /**
     * 删除地址
     */
    showDetele(item) {
      this.setData({
        currentDeleteId: item.id,
        show: true,
      });
    },

    delate(e) {
      // console.log(e.currentTarget.dataset.type);
      if (e.currentTarget.dataset.type == "1") {
        uni.$api
          .apiRequest("userReceipdetele", {
            id: this.currentDeleteId,
          })
          .then((res) => {
            this.getAdressData();
            this.setData({
              show: false,
            });
          });
      } else {
        this.setData({
          show: false,
        });
      }
    },

    /**
     * 下单的时候 进行地址切换
     * */
    selectReceiptAdress(e) {
      console.log(e.currentTarget.dataset.idx);
      var obj = this.list[e.currentTarget.dataset.idx];
      obj.isSwitch = obj.isSwitch ? !obj.isSwitch : true;
      obj.adressId = 1;
      this.list[e.currentTarget.dataset.idx] = obj;
      this.setData({
        switchObj: obj.isSwitch ? obj : {},
        list: this.list,
      }); // 返回 下单页面

      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

      let backPage = pages[pages.length - 2];
	  backPage.$vm.currentAdress = this.switchObj
	//   console.log(backPage.$vm,'_____console;');
    //   uni.$localStorage.setItem("adresstemp", this.switchObj);
      setTimeout(() => {
        uni.navigateBack({});
      }, 300);
    },
  },
};
</script>
<style>
@import "./receiptAdress.css";
</style>
