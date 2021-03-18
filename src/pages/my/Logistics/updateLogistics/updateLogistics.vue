<template>
    <view>
        <!--miniprogram/pages/my/Logistics/updateLogistics/updateLogistics.wxml-->
        <navBar title="退货物流" background="#fff" back="true"></navBar>
        <view class="updateLogistics">
            <!-- 物流公司 -->
            <view class="item" @tap.stop="selectWlcompony">
                <view class="item-title">
                    <span class="xh">*</span>物流公司</view
                >
                <view class="item-r">
                    <view
                        class="item-r-title"
                        :style="logisticscompany.label ? 'color:#000000;' : ''"
                        >{{
                            logisticscompany.label
                                ? logisticscompany.label
                                : "请选择物流公司"
                        }}</view
                    >
                    <!-- <image
                        style="width: 15px; height: 15px; margin-left: 10rpx"
                        src="/static/images/bottomMore.png"
                    ></image> -->
                </view>
            </view>
            <!-- 物流公司 -->
            <view class="item">
                <view class="item-title">
                    <span class="xh">*</span>物流单号</view
                >
                <view class="item-r">
                    <input
                        :value="logisticsText"
                        style="text-align: right; width: 460rpx"
                        placeholder-class="item-r-title"
                        placeholder="请填写物流单号"
                        @blur="bindblur"
                    />
                </view>
            </view>
            <!-- 底部悬浮框 -->
            <view class="btnView">
                <view
                    class="btnView-Title"
                    :style="theme.btn"
                    @tap.stop="commitwl"
                    >提交</view
                >
            </view>
        </view>
        <!-- 弹出层 -->
        <!-- toolBar -->
        <!-- <van-popup :show="show" position="bottom" @close="onPop">
				<view class="pop-toolBar">
					<view class="pop-toolBar-title" style="color:#9C9C9C;" data-type="0" @tap.stop="onPop">取消</view>
					<view class="pop-toolBar-title" style="color:#BD8F46;" data-type="1" @tap.stop="onPop">确定</view>
				</view>
				<van-picker :default-index="0" :columns="companyList" @change="pickerOnChange"></van-picker>
			</van-popup> -->
        <!-- 选择框 -->
        <!-- <u-picker
            mode="multiSelector"
            v-model="show"
            :range="companyList"
            range-key="title"
        ></u-picker> -->
        <u-select
            v-model="show"
            :list="companyList"
            :default-value="defaultValue"
            @confirm="determineCompany"
        ></u-select>
    </view>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            theme: uni.$theme,
            logisticscompany: {}, // 物流公司
            logisticsText: "", // 物流单号
            companyList: [], // 物流list
            show: false,
            chargebackId: "", // 退单id
            options: {}, // 传参
            multiSelector: "",
            defaultValue: [0],
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.setData({
                chargebackId: options.id,
                options: options,
            });
        }
        this.getCompanyList();
    },
    methods: {
        /**
         * @description 确认快递公司
         */
        determineCompany(val) {
            this.setData({
                logisticscompany: val[0],
            });
        },
        /**
         * @description 获取快递公司列表
         */
        async getCompanyList() {
            const res = await uni.$api.apiRequest("getwlCompanyList");
            if (res && res.code == 10000) {
                const arr = res.data.map((item) => {
                    return {
                        value: item.code,
                        label: item.title,
                    };
                });
                this.setData({
                    companyList: arr,
                });
                if (+this.options.type === 1) {
                    this.logisticsText = this.options.expressNo;
                    this.companyList.map((item, index) => {
                        if (item.value === this.options.expressCode) {
                            this.logisticscompany = item;
                            this.defaultValue = [index];
                        }
                    });
                }
            }
        },
        /**
         * 提交物流单信息
         * 这里还要区分是修改还是初次提交
         */
        commitwl: function () {
            // if (this.data.options.type == '0') {
            const params = {
                expressCode: this.logisticscompany.value,
                expressNo: this.logisticsText,
                refundOrderId: Number(this.chargebackId),
                motifyType: Number(this.options.type),
            };
            console.log(params);
            uni.$api.apiRequest("commitOrderWLinfo", params).then((res) => {
                if (res.code == 10000) {
                    let pages = getCurrentPages(); // 获取当前页面js里面的pages里的所有信息。
                    let prevPage = pages[pages.length - 2];
                    uni.navigateBack({
                        success: () => {
                            uni.$alert.showSuccess(
                                this.options.type == "0"
                                    ? "保存成功"
                                    : "修改成功"
                            );
                            prevPage.getOrderDetailData();
                        },
                    });
                }
                console.log("res:", res);
            });
            // } else {
            //   wx.$api.updateOrderWLinfo({
            //     expressCode: this.data.logisticscompany.code,
            //     expressNo: this.data.logisticsText,
            //     refundOrderId: Number(this.data.chargebackId),
            //     motifyType: this.data.options.type
            //   }).then(res => {
            //     if (res.code == 10000) {
            //       let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
            //       let prevPage = pages[pages.length - 2];
            //       wx.navigateBack({
            //         success: () => {
            //           prevPage.getOrderDetailData()
            //         }
            //       })
            //     }
            //   })
            // }
        },

        /**
         * 输入框
         */
        bindblur: function (e) {
            console.log(e);
            var reg = /^[A-Za-z0-9]+$/;

            if (!reg.test(e.detail.value)) {
                return uni.$alert.showToast("请输入正确的物流单号");
            }

            this.setData({
                logisticsText: e.detail.value,
            });
        },

        /**
         * 显示 选择框
         */
        selectWlcompony() {
            this.setData({
                show: true,
                // logisticscompany: this.logisticscompany.text
                //     ? this.logisticscompany
                //     : this.companyList[0],
            });
        },

        onPop(e) {
            console.log(e);
            this.setData({
                show: false,
            });
        },

        /**
         * picker 先择器
         */
        pickerOnChange(event) {
            const { picker, value, index } = event.detail;
            this.setData({
                logisticscompany: value,
            });
        },
    },
};
</script>
<style>
/* miniprogram/pages/my/Logistics/updateLogistics/updateLogistics.wxss */

.updateLogistics {
    height: 100vh;
}

.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0rpx 28rpx;
    height: 88rpx;
    margin: 32rpx;
    border: 1rpx solid #bfbfbf;
}

.item-title {
    font-size: 28rpx;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(69, 69, 69, 1);
}

.xh {
    font-size: 28rpx;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: rgba(255, 87, 91, 1);
    margin-right: 6rpx;
}

.item-r {
    display: flex;
    align-items: center;
}

.item-r-title {
    font-size: 28rpx;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(191, 191, 191, 1);
    text-align: right;
}
/* 弹框 */

.pop-toolBar {
    padding: 32rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.pop-toolBar-title {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}

.pop-field {
    height: 60rpx;
    margin: 32rpx 60rpx 0px 60rpx;
    border-bottom: 1rpx solid #c8c8c8;
}
.van-picker__toolbar {
    display: none !important;
}

/* 提交 */

.btnView {
    position: fixed;
    width: 100vw;
    bottom: 0rpx;
    height: 168rpx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rpx 20rpx 60rpx 0rpx rgba(0, 0, 0, 0.15);
}

.btnView-Title {
    margin: 0px 32rpx;
    height: 80rpx;
    background: rgba(219, 182, 120, 1);
    border-radius: 8rpx;
    font-size: 28rpx;
    font-family: SFUIDisplay-Medium, SFUIDisplay;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 80rpx;
    text-align: center;
    margin-top: 20rpx;
}
.btnView-Title-no {
    margin: 0px 32rpx;
    height: 80rpx;
    background: #bfbfbf;
    border-radius: 8rpx;
    font-size: 28rpx;
    font-family: SFUIDisplay-Medium, SFUIDisplay;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 80rpx;
    text-align: center;
    margin-top: 20rpx;
}
</style>