<template>
  <view class="view">
    <!-- 优惠券弹框 -->
    <u-popup
      v-model="isShow"
      mode="bottom"
      border-radius="18"
      :closeable="true"
      @close="closePop"
    >
      <view class="selectCouponPopView">
        <view class="header">选择优惠券</view>
        <scroll-view scroll-y="true" style="height: 660rpx;">
          <view class="couponList">
          <couponCell
            v-for="(item, index) in couponList"
            :key="index"
            :cell="item"
            @change="selectCoupon"
          ></couponCell>
        </view>
				</scroll-view>
        
        <view class="couponCommit flex-center-row" @click="commitSelectCoupon">提交</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import couponCell from "./couponItem";
export default {
  components: {
    couponCell,
  },
  props: {
    show: Boolean,
    money: String,
    pressFee: Number,
    list: {
      type: Array,
      default: [],
    },
    bestUseList: {
      type: Array,
      default: [],
    },
  },
  // computed:{
  //   showView(){
  //     return this.isShow
  //   }
  // },
  data() {
    return {
      isShow: this.show,
      couponList: [], // 原始优惠券
      currentSelectCouponList: [], // 当前选择的优惠券
    };
  },
  created() {
    this.couponList = uni.$util.mutableCopy(this.list);
    if (this.bestUseList.length > 0) {
      this.bestUseList.forEach((item) => {
        this.couponList.forEach((cell) => {
          if (item == cell.uniqueCode) {
            cell.checked = true;
            this.currentSelectCouponList.push(cell);
          }
        });
      });
    }
    // if (
    //   !this.currentSelectCouponList ||
    //   this.currentSelectCouponList.length == 0
    // ) {
    //   if (this.couponList && this.couponList.length) {
    //     this.currentSelectCouponList.push(this.couponList[0]);
    //     this.$set(this.couponList[0], "checked", true);
    //   }
    // }
  },
  watch:{
    currentSelectCouponList(newval,oldval){
      console.log(newval,"________currentSelectCouponList")
    },
    tempSelectCoupon(newval,oldval){
      console.log(newval,"________tempSelectCoupon")
    }
  },
  methods: {
    /**
     * 提交优惠券
     * */
    commitSelectCoupon() {
      let price = this.calculationGoodsPrice();
      this.$emit("priceChange", {
        money: price,
        coupons: this.currentSelectCouponList,
      });
      this.closePopupViewResetData();
    },
    /**
     * 弹框关闭
     * */
    closePop() {
      this.$emit("priceChange");
      this.closePopupViewResetData();
    },
    // 取消  需要清空所有的选择，当展示的时候在根据当前选择的优惠券进行反显
    closePopupViewResetData() {
      this.couponList = []; // 原始优惠券
      this.currentSelectCouponList = []; // 当前选择的优惠券
      this.tempSelectCoupon = [];
    },
    /**
     * 计算商品价格
     * couponType:  CARRIAGE=运费券   REDUCTION=满减券    DISCOUNT=折扣券     EXCHANGE=兑换券
     * */
    calculationGoodsPrice() {
      var couponList = uni.$util.mutableCopy(this.currentSelectCouponList);
      if (couponList.length == 0) {
        return 0;
      } else {
        var types = couponList.map((t) => {
          return t.couponType;
        });
        /**
         * couponType:  CARRIAGE=运费券   REDUCTION=满减券    DISCOUNT=折扣券     EXCHANGE=兑换券   CASH=现金券
         * */
        var tempPrice = 0;
        // couponList.length > 1
        if (types.includes("CASH")) {
          couponList.forEach((item) => {
            if (item.couponType == "CASH")
              tempPrice += item.couponDiscountAmount;
          });
          console.log(
            couponList,
            "couponListcouponListcouponListcouponList___",
            tempPrice
          );
        } else if (types.includes("REDUCTION") || types.includes("DISCOUNT")) {
          console.log(
            couponList[0].couponDiscountAmount,
            "couponList[0].couponDiscountAmount"
          );
          couponList.forEach((item) => {
            if (
              item.couponType == "REDUCTION" ||
              item.couponType == "DISCOUNT"
            ) {
              tempPrice = item.couponDiscountAmount;
            }
          });
        }

        // 运费券
        // let carriagePrice = 0;
        // couponList.forEach((item) => {
        //   if (item.couponType == "CARRIAGE") {
        //     carriagePrice += item.couponDiscountAmount;
        //   }
        // });

        // tempPrice +=
          // carriagePrice <= this.pressFee ? carriagePrice : this.pressFee;
          tempPrice = tempPrice > this.money?this.money:tempPrice
        return uni.$util.decimalTwo(tempPrice, true);
      }
    },

    /**
     * 选择优惠券
     * */
    selectCoupon(coupon) {
      console.log(coupon, "当前选择的优惠券");
      // 优惠券的选择状态与当前数据源 进行同步
      this.couponList.forEach((item) => {
        if (coupon.uniqueCode == item.uniqueCode) item.checked = coupon.checked;
      });
      // copy 当前选择的优惠券 currentSelectCouponList
      if (
        (!this.tempSelectCoupon || this.tempSelectCoupon.length == 0) &&
        this.currentSelectCouponList.length > 0
      ) {
        var ischecked = false;
        this.couponList.forEach((item) => {
          if (item.checked) {
            ischecked = true;
          }
        });
        if (ischecked) {
          this.tempSelectCoupon = uni.$util.mutableCopy(
            this.currentSelectCouponList || []
          );
        }
      }
      // 是否存在快递订单，若存在则可以选择运费券
      // var isyfq = false;
      // this.settlementData.orderList.forEach((order) => {
      //   if (order.orderType == 1) {
      //     isyfq = true;
      //   }
      // });
      // if (!isyfq && coupon.couponType == "CARRIAGE") {
      //   return uni.$alert.showToast("订单非快递寄送类型不能使用运费券");
      // }

      // 兑换券逻辑
      // if (this.redeemVoucherCoupon.uniqueCode) {
      //   if (coupon.couponType == "CARRIAGE") {
      //     if (!this.tempSelectCoupon) {
      //       this.tempSelectCoupon = [];
      //     }
      //     this.tempSelectCoupon.push(e.currentTarget.dataset.coupon);
      //   } else {
      //     return uni.$alert.showToast("兑换券只能与运费券同时使用");
      //   }
      // }

      // mos 最多支持 两种类型的优惠券同时使用，而且折扣券和满减券只能选一张
      // * redeemVoucherCoupon 兑换券 只能使用运费券
      /**
       * 最多支持 一种类型的优惠券使用（暂不考虑运费券、prd中明确写道满减券、折扣券、现金券一次只能使用同一种类型。与mos不同）
       * */

      if (this.tempSelectCoupon && this.tempSelectCoupon.length > 0) {
        if (this.isContinueSelect(coupon)) {
          var isSame = -1; // 相同优惠券的索引
          var currenttypeAndIdx = -1; // 相同类型优惠券的 索引
          let hasCARRIAGE = false; // 选择的优惠券中 是否包含运费券
          this.tempSelectCoupon.forEach((item, index) => {
            if (item.couponType == coupon.couponType) {
              currenttypeAndIdx = index;
            }

            if (coupon.uniqueCode == item.uniqueCode) {
              isSame = index;
            }

            if (item.couponType == "CARRIAGE") {
              hasCARRIAGE = true;
            }
          });
          // 选择同一张 优惠券则取消选中
          if (isSame != -1) {
            // 步骤1
            this.tempSelectCoupon.splice(isSame, 1);
            this.currentSelectCouponList = uni.$util.mutableCopy(
              this.tempSelectCoupon
            );
            console.log("删掉了吗", this.tempSelectCoupon);
            // 步骤2 把选中的优惠券 取消选中
            this.couponList.forEach((item) => {
              if (coupon.uniqueCode == item.uniqueCode) {
                item.checked = false;
              }
            });
            return;
          } else if (coupon.couponType == "CASH") {
            this.tempSelectCoupon.push(coupon);
            this.currentSelectCouponList.push(coupon);
          } else {
            // console.log(this.currentSelectCouponList,'this.currentSelectCouponListthis.currentSelectCouponList')
            // 1.选中的优惠券类型相同，但不是现金券，替换选中的优惠券 
            // 步骤1 重新赋值
            if (currenttypeAndIdx != -1 && coupon.couponType != "CARRIAGE") {
              this.tempSelectCoupon = [coupon];
              this.currentSelectCouponList = [coupon];
            }
            console.log(hasCARRIAGE,'__咋回事现金券叠加运费券',this.tempSelectCoupon,this.currentSelectCouponList)
            // 步骤2 把选中的优惠券 取消选中(运费券除外)
            if (!hasCARRIAGE && coupon.couponType != "CARRIAGE") {
              this.couponList.forEach((item) => {
                item.checked = coupon.uniqueCode == item.uniqueCode;
              });
              
            } else {
              
              this.tempSelectCoupon.push(coupon);
              this.currentSelectCouponList.push(coupon);
            }

            console.log("现在的样子", this.couponList);
          }
        } else {
          var self = this;
          self.$nextTick(() => {
            self.couponList.forEach((item) => {
              if (coupon.uniqueCode == item.uniqueCode) item.checked = false;
            });
          });
          return;
        }
      } else if(coupon.checked){
        this.tempSelectCoupon = [coupon];
        this.currentSelectCouponList = [coupon];
      } else {
        this.tempSelectCoupon = [];
        this.currentSelectCouponList = [];
      }
    },
    /**
     * 是否能 使用此张优惠券
     * */
    isContinueSelect(coupon) {
      /**
       * 遍历得出 前两种优惠券类型
       * 当第二次选择的时候就开始保存 类型数组
       * */
      var list = uni.$util.mutableCopy(this.tempSelectCoupon || []);
      console.log(list, "当前tempSelectCoupontempSelectCoupontempSelectCoupon");
      if (list.length > 0) {
        /**
         * couponType:  CARRIAGE=运费券   REDUCTION=满减券    DISCOUNT=折扣券     EXCHANGE=兑换券   CASH=现金券
         * 先判断 coupon 在不在 list中
         * 存在 1.是不是相同的两张券  2.不相同
         *   相同：一.是不是同一张券是则是取消流程，不是则判断是不是现金券 是 ok 不是则 false
         *   不相同： 结束
         * */
        let pressFeeTotal = 0;
        var isNotType = true;
        let tempPrice = 0;
        let selectCoupon = false;
        let allOk = coupon.couponType == "CARRIAGE";
        let types = list.map((t) => {
          return t.couponType;
        });
        // 之前的逻辑是 最有推荐肯定有券的情况下，list肯定有内容切不是运费券
        list.forEach((item, index) => {
          if(item.couponType == "CASH"){
            tempPrice += item.couponDiscountAmount;
          }
          if (item.couponType == "CARRIAGE") {
            pressFeeTotal += item.couponDiscountAmount;
            // 再次选中 同一张 运费券
            if (item.uniqueCode == coupon.uniqueCode) {
              selectCoupon = true;
              return false;
            }
          }
          // 数组中有没有运费券   1.有 看看有没有其他券  2.没有
          let next = false;
          if (types.includes("CARRIAGE")) {
            if (
              types.includes("REDUCTION") ||
              types.includes("DISCOUNT") ||
              types.includes("CASH")
            ) {
              next = true;
            } else {
              allOk = true;
            }
          } else {
            next = true;
          }
          if (item.couponType != "CARRIAGE" && next) {
            if (item.couponType == coupon.couponType) {
              isNotType = false;
              if (item.uniqueCode == coupon.uniqueCode) {
                selectCoupon = true;
                return false;
              }
            }
          }
        });

        if (selectCoupon) return true;
        // 如果运费 优惠大于当前运费总和则不能使用
        if (allOk) {
          if (
            pressFeeTotal >= this.pressFee &&
            coupon.couponType == "CARRIAGE"
          ) {
            uni.$alert.showToast("运费券优惠金额已达上限");
            return false;
          }
          return true;
        }

        // 满减券、折扣券与现金券不能同时使用
        if (isNotType) {
          uni.$alert.showToast("满减券、折扣券与现金券不能同时使用");
          return false;
        }
        // 如果是现金券 当优惠金额超过订单金额的时候也不能使用
        if(coupon.couponType == "CASH"){
          if(tempPrice >= this.money){
            uni.$alert.showToast("现金券优惠金额已达上限");
            return false;
          }
        }
      }
      return true;
    },

    // isContinueSelect(coupon) {
    //   /**
    //    * 遍历得出 前两种优惠券类型
    //    * 当第二次选择的时候就开始保存 类型数组
    //    * */
    //   var list = uni.$util.mutableCopy(this.tempSelectCoupon || []);
    //   if (list.length > 0) {
    //     /**
    //      * couponType:  CARRIAGE=运费券   REDUCTION=满减券    DISCOUNT=折扣券     EXCHANGE=兑换券   CASH=现金券
    //      * 先判断 coupon 在不在 list中
    //      * 存在 1.是不是相同的两张券  2.不相同
    //      *   相同：一.是不是同一张券是则是取消流程，不是则判断是不是现金券 是 ok 不是则 false
    //      *   不相同： 结束
    //      * */
    //     var isNotType = true;
    //     let tempPrice = 0;
    //     let pressFeeTotal = 0;
    //     let selectCoupon = false;
    //     list.forEach((item, index) => {
    //       if (item.couponType == "CASH") {
    //         tempPrice += item.couponDiscountAmount;
    //       }
    //       if (item.couponType == "CARRIAGE") {
    //         pressFeeTotal += item.couponDiscountAmount;
    //       }

    //       if (item.couponType == coupon.couponType) {
    //         isNotType = false;
    //         if (item.uniqueCode == coupon.uniqueCode) {
    //           selectCoupon = true;
    //           return false;
    //         }
    //       } else if(coupon.couponType == "CARRIAGE"){
    //         isNotType = false
    //       }
    //     });
    //     if (selectCoupon) return true;
    //     // 满减券、折扣券与现金券不能同时使用
    //     if (isNotType) {
    //       uni.$alert.showToast("满减券、折扣券与现金券不能同时使用");
    //       return false;
    //     }
    //     // 如果是现金券 当优惠金额超过订单金额的时候也不能使用
    //     if (coupon.couponType == "CASH") {
    //       if (tempPrice >= this.money) {
    //         uni.$alert.showToast("现金券优惠金额已达上限");
    //         return false;
    //       }
    //     }

    //     // 如果运费 优惠大于当前运费总和则不能使用
    //     if (coupon.couponType == "CARRIAGE") {
    //       if (pressFeeTotal >= this.pressFee) {
    //         uni.$alert.showToast("运费券优惠金额已达上限");
    //         return false;
    //       }
    //     }
    //   }
    //   return true;
    // },
  },
};
</script>

<style lang="less" scoped>
.view {
  .selectCouponPopView {
    padding: 28rpx 0px;
    padding: 0rpx 40rpx;
    

    .header {
      border-bottom: 1px solid #E5E5E5;
      padding: 28rpx 0px;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }

    .couponList {
    }

    .couponCommit {
      width: 100%;
      margin: 20rpx 0px;
      margin-top: 40rpx;
      line-height: 80rpx;
      background: #fe5d4d;
      border-radius: 8rpx;
      text-align: center;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      height: 80rpx;
    }
  }
}
</style>
