<template>
  <view class="container">
    <view class="view">
      <navBar
        color="black"
        background="inherit"
        backgroundColorTop="inherit"
        title="券码核销"
      ></navBar>
      <view class="top">
        <view class="code">
          <view class="codefonzt">自提码: {{ exchangeCode }}</view>
          <u-button
            :custom-style="customStyle"
            hover-class="none"
            @click="scanCode"
            >重新扫描</u-button
          >
        </view>
        <view class="good">
          <image
            :src="productInfoOfExchangeCode.goodsImg"
            lazy-load
            mode="scaleToFill"
            style="width: 74px; height: 74px"
          ></image>
          <view class="refundFlag" v-if="productInfoOfExchangeCode.refundFlag">
            <view class="refundFlagText">退款中</view>
          </view>
          <view class="content">
            <view class="title">{{ productInfoOfExchangeCode.goodsName }}</view>
            <view class="rules"
              >规格：{{ productInfoOfExchangeCode.goodsSpec }}</view
            >
            <view class="priceNum">
              <view
                ><text>{{ getDesc(productInfoOfExchangeCode) }}</text></view
              >

              <view>× {{ productInfoOfExchangeCode.num }}</view>
            </view>
          </view>
        </view>
        <view class="note">
          <u-input
            v-model="remark"
            :clearable="false"
            type="text"
            :custom-style="inputStyle"
            placeholder="请输入备注"
          />
        </view>
      </view>
      <view class="gray" v-if="hasData"
        >查询到订单内其他未核销商品可一起核销</view
      >
      <view class="gray" v-else>未查询到订单内其他未核销商品可一起核销</view>
      <view class="goodsList" :style="{ display: collaspe ? 'none' : 'block' }">
        <u-checkbox-group @change="checkboxGroupChange">
          <view v-for="item in otherProductList" :key="item.exchangeCode">
            <u-checkbox
              shape="circle"
              active-color="#FE5D4D"
              v-model="item.checked"
              :name="item.exchangeCode"
            >
              <view class="good">
                <image
                  :src="item.goodsImg"
                  lazy-load
                  mode="scaleToFill"
                  style="width: 74px; height: 74px"
                ></image>
                <view class="content">
                  <view class="title">{{ item.goodsName }}</view>
                  <view class="rules">规格：{{ item.goodsSpec }}</view>
                  <view class="priceNum">
                    <view
                      ><text>{{ item.desc }}</text></view
                    >
                    <view>× {{ item.num }}</view>
                  </view>
                </view>
              </view>
            </u-checkbox>
          </view>
        </u-checkbox-group>
      </view>

      <view v-if="hasData">
        <view class="gray" v-if="!collaspe" style="margin-bottom: 100px"
          ><text @click="allowUp">收起</text
          ><u-icon @click="allowUp" name="arrow-up"></u-icon
        ></view>
        <view class="gray" v-else style="margin-bottom: 100px"
          ><text @click="allowDown" style="color: #fe5e4e">点击查看</text
          ><u-icon name="arrow-down" color="#FE5E4E" @click="allowDown"></u-icon
        ></view>
      </view>
    </view>
    <view class="bottomBtn">
      <u-button class="custom-style" @click="handleCacel">取消</u-button>
      <u-button
        type="error"
        class="custom-style"
        @click="handleConfirm"
        :disabled="isDisabled"
        >确认核销
      </u-button>
    </view>
    <alertView
      v-if="alertShow"
      title="核销成功"
      content="商品已核销成功。"
      :showCancel="true"
      :okText="'继续核销'"
      :cancelText="'返回首页'"
      :cancel="handleCacel"
      @ok="scanCode"
    >
    </alertView>
  </view>
</template>

<script>
const app = getApp();
import alertView from "../../pageComponents/alertView/alertView.vue";
export default {
  components: {
    alertView,
  },
  data() {
    return {
      collaspe: false,
      alertShow: false,
      hasData: false,
      productInfoOfExchangeCode: {},
      otherProductList: [],
      waitWriteOffExchangeCodeList: [],
      exchangeCode: "",
      writeOffPeoplePhone: "",
      remark: "",
      orgId: "",
      memberId: uni.$localStorage.getItem("memberId"),
      type: 8,
      orderId: "",
      customStyle: {
        borderColor: "#FE5D4D", // 注意驼峰命名，并且值必须用引号包括，因为这是对象
        color: "#FE5D4D",
        width: "70px",
        height: "25px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 400,
      },
      inputStyle: {
        background: "#F6F7F8",
        borderRadius: "12px",
        height: "51px",
        paddingLeft: "15px",
      },
    };
  },
  onShow() {},
  computed: {
    isDisabled() {
      return (
        this.productInfoOfExchangeCode.refundFlag &&
        !this.waitWriteOffExchangeCodeList.length
      );
    },
  },
  onLoad(option) {
    this.isRequirements();
    const { scene } = option;
    const arr = scene && scene.split("_");
    if (arr && arr.length == 3) {
      this.setData({
        type: Number(arr[2]),
        exchangeCode: arr[0],
      });
      uni.$localStorage.setItem("orgId", arr[1]);

      // if (uni.$localStorage.getItem("orgId") !== arr[1]) {
      //   uni.$localStorage.remove("currentMall");
      // }
      this.getGoodList(arr[0]);
    }
  },

  methods: {
    getDesc(item) {
      console.log(item);
      let str = "";
      if (item.productCharge && item.singleProductScore) {
        str = `￥${item.productCharge}+${item.singleProductScore}积分`;
      }
      if (item.productCharge && !item.singleProductScore) {
        str = `￥${item.productCharge}`;
      }
      if (!item.productCharge && item.singleProductScore) {
        str = `${item.singleProductScore}积分`;
      }
      return str;
    },
    scanCode() {
      wx.scanCode({
        onlyFromCamera: true,
        success: function(res) {
          // success
          uni.redirectTo({
            url: "/" + res.path,
          });
        },
        fail: function() {
          // fail
        },
        complete: function(res) {
          // complete
        },
      });
    },
    getGoodList(exchangeCode) {
      uni.$api
        .apiRequest("queryData", {
          exchangeCode,
        })
        .then((res) => {
          if (res.code == 10000) {
            if (res.data.otherProductList && res.data.otherProductList.length) {
              this.setData({
                hasData: true,
              });
            }

            this.setData({
              orgId: res.data.orgId,
              orderId: res.data.orderId,
              memberId: res.data.memberId,
              productInfoOfExchangeCode: res.data.productInfoOfExchangeCode,
              otherProductList:
                res.data.otherProductList &&
                res.data.otherProductList.map((item) => {
                  return {
                    ...item,
                    checked: false,
                    desc: this.getDesc(item),
                  };
                }),
            });
          }
        });
    },
    // 判断是否有商场 然后是否登录
    isRequirements() {
      // if (!uni.$localStorage.getItem("orgId")) {
      //   uni.navigateTo({
      //     url: "/pages/index/switchMall/switchMall",
      //   });
      //   return;
      // }
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      if (!uni.$localStorage.getItem("wxUserInfo")) {
        this.getHomeMemberInfo();
      } else {
        this.setData({
          writeOffPeoplePhone: uni.$localStorage.getItem("wxUserInfo").phone,
        });
      }
    },
    /**
     * @description 获取用户信息
     */
    getHomeMemberInfo() {
      if (uni.$localStorage.getItem("Token")) {
        var self = this;
        // 更新用户信息
        uni.$api
          .apiRequest("getUserInfo", {
            orgId: uni.$localStorage.getItem("orgId"),
          })
          .then((res) => {
            if (res.code == 10000 && res.data) {
              this.setData({
                writeOffPeoplePhone: res.data.phone,
              });
              uni.$localStorage.setCurrentUser(res.data);
            }
          });
      }
    },
    checkboxChange(value) {
      this.otherProductList = this.otherProductList.map((item) => {
        return {
          ...item,
          checked: value.name === item.name ? value.checked : item.checked,
        };
      });
    },
    checkboxGroupChange(list) {
      this.waitWriteOffExchangeCodeList = [...list];
    },
    allowUp() {
      this.collaspe = true;
    },
    allowDown() {
      this.collaspe = false;
    },
    handleCacel() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
    handleConfirm() {
      const arr = this.productInfoOfExchangeCode.refundFlag
        ? []
        : [this.exchangeCode];
      uni.$api
        .apiRequest("submitWriteOff", {
          orgId: this.orgId,
          orderId: this.orderId,
          writeOffPeoplePhone: this.writeOffPeoplePhone,
          remark: this.remark,
          operatorId: this.memberId,
          waitWriteOffExchangeCodeList: this.waitWriteOffExchangeCodeList.concat(
            arr
          ),
        })
        .then((res) => {
          if (res.code == 10000) {
            // 弹窗
            if (res.data.writeOffPowerFlag) {
              this.setData({
                alertShow: true,
              });
            } else {
              uni.navigateTo({
                url: `/pages/verifier/codeVerifierFail?code=${this.exchangeCode}`,
              });
            }
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  background-color: #f9f9f9;
  .bottomBtn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 84px;
    background: #ffffff;
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
    .custom-style {
      width: 100px;
      height: 40px;
      margin-right: 20px;
    }
  }
}
.view {
  background-color: #fff;
  .top {
    padding: 0 20px;
    .code {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 25px 0 14px 0;
      border-bottom: 1px solid #ececec;
      .codefonzt {
        font-size: 13px;
        font-weight: 500;
        color: #475774;
      }
    }
    .good {
      margin-top: 13px;
      display: flex;
      align-items: center;
      margin-bottom: 13px;
      position: relative;

      .refundFlag {
        position: absolute;
        top: 0;
        left: 0;
        width: 74px;
        height: 74px;
        background: rgba(0, 0, 0, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        .refundFlagText {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 300;
          color: #ffffff;
        }
      }
      .content {
        width: 60%;
        flex: 1;
        margin-left: 24px;
        .title {
          font-size: 13px;
          font-weight: 500;
          color: #475774;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 5px;
        }
        .rules {
          font-size: 11px;
          font-weight: 400;
          color: #808794;
          margin-bottom: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .priceNum {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: bold;
          color: #475774;
        }
      }
    }
    .note {
      padding-top: 13px;
      border-top: 1px solid #ececec;
      margin-bottom: 14px;
    }
  }
  .gray {
    background-color: #f9f9f9;
    font-size: 12px;
    font-weight: 500;
    color: #a7afb4;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0;
  }
  .goodsList {
    padding: 0 20px;
    .good {
      margin-top: 13px;
      width: 83vw;
      display: flex;
      align-items: center;
      margin-bottom: 13px;
      .content {
        width: 60%;
        flex: 1;
        margin-left: 24px;
        .title {
          font-size: 13px;
          font-weight: 500;
          color: #475774;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 5px;
        }
        .rules {
          font-size: 11px;
          font-weight: 400;
          color: #808794;
          margin-bottom: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .priceNum {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: bold;
          color: #475774;
        }
      }
    }
  }
}
</style>
