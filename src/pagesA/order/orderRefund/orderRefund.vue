<template>
    <view>
        <navBar title="退款详情" background="#fff" back="true"></navBar>
        <view class="view">
            <!-- 退款信息 -->
            <view class="refundInfo">
                <!-- 提示 -->
                <view class="alertView">{{ orderInfo.orderStatusStr }}</view>
                <!-- 信息 -->
                <view class="info-view">
                    <view class="infoRow">
                        <view class="title">退款类型：</view>
                        <view class="infoValue">{{
                            orderInfo.refundTypeStr
                        }}</view>
                    </view>
                    <view class="infoRow">
                        <view class="title">货物状态：</view>
                        <view class="infoValue">{{
                            orderInfo.productStatusStr
                        }}</view>
                    </view>
                    <view class="infoRow">
                        <view class="title">退款原因：</view>
                        <view class="infoValue">{{
                            orderInfo.refundReason
                        }}</view>
                    </view>
                    <view class="infoRow" v-if="orderInfo.goodsTotalAmt">
                        <view class="title">商品退款：</view>
                        <view class="infoValue"
                            >￥{{ orderInfo.goodsTotalAmt }}</view
                        >
                    </view>
                    <view
                        class="infoRow"
                        v-if="orderInfo.refundProductPayScore"
                    >
                        <view class="title">退还：</view>
                        <view class="infoValue"
                            >{{ orderInfo.refundProductPayScore
                            }}{{ ponitName }}</view
                        >
                    </view>
                    <view class="infoRow">
                        <view class="title">运费退款：</view>
                        <view class="infoValue"
                            >￥{{ orderInfo.expressFee }}</view
                        >
                    </view>
                    <view class="infoRow" v-if="orderInfo.refundDescription">
                        <view class="title">退款描述：</view>
                        <view class="infoValue">{{
                            orderInfo.refundDescription
                        }}</view>
                    </view>
                    <view class="infoRow mb30" v-if="orderInfo.imgList && orderInfo.imgList.length">
                        <view class="title">凭证图片：</view>
                        <view class="imgsbg">
                            <image
                                v-for="(item, index) in orderInfo.imgList"
                                :key="index"
                                class="logisticsItem-img"
                                :src="item"
                                @tap.stop="previewimg"
                                :style="index == 5 ? 'margin-right: 0rpx;' : ''"
                            ></image>
                        </view>
                    </view>
                    <!-- 取消退货、修改申请 -->
                    <view class="returnsTool" v-if="orderInfo.refundStatus < 4">
                        <view
                            class="returnsTool-btn"
                            v-if="
                                (orderInfo.refundStatus == 2 ||
                                    orderInfo.refundStatus == 1) &&
                                orderInfo.refundTypeStr == '仅退款'
                            "
                            style="
                                color: #838383;
                                border: 1rpx solid #bfbfbf;
                                margin-right: 20rpx;
                            "
                            @tap.stop="operatingRefundInfo"
                            data-type="0"
                            >取消退款</view
                        >
                        <view
                            class="returnsTool-btn"
                            v-if="
                                orderInfo.refundStatus <= 3 &&
                                orderInfo.refundTypeStr == '退货退款'
                            "
                            style="color: #838383; border: 1rpx solid #bfbfbf"
                            @tap.stop="operatingRefundInfo"
                            data-type="0"
                            >取消退货</view
                        >
                        <view
                            class="returnsTool-btn"
                            style="margin-left: 20rpx"
                            v-if="
                                orderInfo.refundTypeStr == '仅退款'
                                    ? orderInfo.refundStatus == 1 ||
                                      orderInfo.refundStatus == 2
                                    : orderInfo.refundStatus < 2
                            "
                            @tap.stop="operatingRefundInfo"
                            data-type="1"
                            >修改申请</view
                        >
                    </view>
                </view>
            </view>
            <!-- 协商历史 -->
            <view class="negotiation-history" @tap.stop="negotiationHistory">
                <view class="negotiation-history-title">协商历史</view>
                <image src="/static/images/jtr.png"></image>
            </view>
            <!-- 退款商品 -->
            <view class="refundGoods" style="padding-top: 0rpx">
                <view class="refundGoods-header">
                    <view class="refundGoods-header-title">退款信息</view>
                    <view class="refundGoods-header-status">{{
                        orderInfo.goodsRefundStatusStr
                    }}</view>
                </view>
                <!-- 商品 -->
                <view class="refundGoodsDesc">
                    <image mode="aspectFit" :src="orderInfo.goodsImg"></image>
                    <view class="refundGoodsDesc-right">
                        <view>
                            <view class="refundGoodsDesc-right-title">
                                {{ orderInfo.goodsName }}
                            </view>
                            <view class="refundGoodsDesc-right-spec">
                                规格：{{ orderInfo.goodsSpec }}
                            </view>
                        </view>
                        <view class="refundGoodsDesc-right-total-num">
                            <view>
                                <text class="refundGoodsDesc-right-money">{{
                                    func.handlePrice(
                                        orderInfo.productCharge,
                                        orderInfo.refundProductPayScore,
                                        ponitName
                                    )
                                }}</text>
                            </view>
                            <view class="refundGoodsDesc-right-num"
                                >x {{ orderInfo.num }}</view
                            >
                        </view>
                    </view>
                </view>
                <!-- 信息 -->
                <view>
                    <view class="infoRow">
                        <view class="title">退款原因：</view>
                        <view class="info-value-left">{{
                            orderInfo.refundReason
                        }}</view>
                    </view>
                    <view class="infoRow" v-if="orderInfo.refundTotalAmt">
                        <view
                            class="title"
                            style="display: flex; align-items: center"
                            >退款金额：
                        </view>
                        <view class="info-value-left"
                            >￥{{ orderInfo.refundTotalAmt }}</view
                        >
                    </view>
                    <view
                        class="infoRow"
                        v-if="orderInfo.refundProductPayScore"
                    >
                        <view
                            class="title"
                            style="display: flex; align-items: center"
                            >退还：
                        </view>
                        <view class="info-value-left"
                            >{{ orderInfo.refundProductPayScore
                            }}{{ ponitName }}</view
                        >
                    </view>

                    <view class="infoRow">
                        <view class="title">退单编号：</view>
                        <view class="info-value-left">{{
                            orderInfo.backOrderId
                        }}</view>
                    </view>
                    <view class="infoRow">
                        <view class="title">申请时间：</view>
                        <view class="info-value-left">{{
                            orderInfo.refundTime
                        }}</view>
                    </view>
                    <view class="infoRow">
                        <view class="title">订单编号：</view>
                        <view class="info-value-left">{{
                            orderInfo.orderId
                        }}</view>
                    </view>
                </view>
            </view>
        </view>

        <view class="refundInfo-bottom" v-if="orderInfo.refundStatus === 3">
            <!-- <view
                v-if="orderInfo.expressNo"
                :class="[
                    orderInfo.expressCode
                        ? 'refundInfo-bottom-btn-gray'
                        : 'refundInfo-bottom-btn',
                ]"
                @tap.stop="returnLogistics"
                >退货物流</view
            > -->
            <view
                class="refundInfo-bottom-btn"
                v-if="orderInfo.expressNo"
                :style="theme.btn"
                @tap.stop="returnLogisticsUpdate"
                >修改物流</view
            >
            <view
                class="refundInfo-bottom-btn"
                v-else
                :style="theme.btn"
                @tap.stop="returnLogistics"
                >退货物流</view
            >
        </view>
        <!-- 底部悬浮框 暂时不显示 -->

        <!-- 弹框 -->
        <u-popup
            v-model="show"
            closeable
            mode="center"
            border-radius="14"
            @close="operating"
        >
            <view style="padding: 40rpx">
                <view class="header headerPadding">
                    <view class="header-title">取消申请</view>
                    <image
                        style="width: 24rpx; height: 24rpx"
                        src="/static/images/clear-icon.png"
                    ></image>
                </view>
                <view class="content">确定取消申请退款/退货？</view>
                <view class="bottomView">
                    <view
                        class="canle bottomView-title"
                        style="color: #2e2e2e"
                        @tap.stop="operating"
                        data-type="0"
                        >取消</view
                    >
                    <view
                        class="ok bottomView-title"
                        :style="theme.btn"
                        @tap.stop="operating"
                        data-type="1"
                        >确认</view
                    >
                </view>
            </view>
        </u-popup>

        <!-- 提示信息弹框 -->
        <alertView v-if="alertShow" title="提示" content="">
            <view class="contentView" slot="contentView">
                <view v-if="alertShowInfo">
                    <view class="contentView-text0"
                        >实际退款金额已扣除了不足扣减积分的货币价值</view
                    >
                    <view class="contentView-text1"
                        >应扣积分：{{
                            alertShowInfo.shouldReduceScore
                        }}，当前账户积分：{{
                            alertShowInfo.scoreBalance
                        }}，不足扣减积分：{{
                            alertShowInfo.lackScore
                        }}。积分价值：{{
                            alertShowInfo.scoreRatio
                        }}元/积分，退款扣除金额：{{
                            alertShowInfo.buyScoreCash
                        }}元。</view
                    >
                </view>
                <view v-else>
                    <view class="contentView-text0"
                        >退款金额以实际到账金额为准</view
                    >
                    <view class="contentView-text1"
                        >退款成功时，若用户当前账户积分值小于退款商品在原订单中发放的积分值，则将按照当前积分的货币价值从退款金额中扣减。</view
                    >
                </view>
            </view>
        </alertView>
    </view>
</template>

<script module="func" lang="wxs" src="../../../utils/utilFunc.wxs"></script>
<script>
import alertView from "../../../pageComponents/alertView/alertView.vue";
import pandp from "../../../pageComponents/priceAndPoint/priceAndPoint";
const app = getApp();
export default {
    data() {
        return {
            ponitName: app.globalData.pointName,
            theme: uni.$theme,
            orderInfo: {},
            // 是否展示弹框
            show: false,
            // 提示信息
            alertShow: false,
            options: "",
            alertShowInfo: "",
            ponitName: app.globalData.pointName,
        };
    },

    components: {
        alertView,
        pandp,
    },
    props: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            options: options,
        });
        // this.getOrderDetailData(options);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getOrderDetailData(this.options);
    },
    methods: {
        /**
         * 跳转协商历史
         */
        negotiationHistory() {
            var goods = {
                goodsImg: this.orderInfo.goodsImg,
                goodsName: this.orderInfo.goodsName,
                goodsSpec: this.orderInfo.goodsSpec,
                num: this.orderInfo.num,
                productCharge: this.orderInfo.productCharge,
                goodsTotalAm: this.orderInfo.goodsTotalAm,
                refundProductPayScore: this.orderInfo.refundProductPayScore,
            };
            uni.navigateTo({
                url:
                    "/pagesA/order/negotiationHistory/negotiationHistory?id=" +
                    this.orderInfo.orderRefundInfoId +
                    "&json=" +
                    JSON.stringify(goods),
            });
        },

        /**
         * 获取订单数据
         */
        getOrderDetailData() {
            uni.$api
                .apiRequest("orderChargeback", {
                    orgId: this.options.orgId,
                    backOrderId: this.options.orderId,
                    memberId: uni.$localStorage.getItem("memberId"),
                })
                .then((res) => {
                    if (res.code == 10000) {
                        // 时间处理
                        var create = new Date(res.data.createTime);
                        res.data.createTime = create.Format(
                            "YYYY-MM-DD HH:mm:ss"
                        );
                        var refundTime = new Date(res.data.refundTime);
                        res.data.refundTime = refundTime.Format(
                            "YYYY-MM-DD HH:mm:ss"
                        ); // 订单列表

                        this.setData({
                            orderInfo: res.data,
                        });
                        // if (res.data.refundStatus == 5) {
                        //   this.getShowInfo()
                        // }
                        console.log("orderInfo:", this.orderInfo);
                    }
                });
        },

        /**
         * 取消退货 、 修改申请
         * */
        operatingRefundInfo(e) {
            if (e.currentTarget.dataset.type == "0") {
                this.setData({
                    show: true,
                });
            } else {
                var chargebackType =
                    this.orderInfo.productStatusStr == "已收货" ? "1" : "0";
                var json = {
                    id: this.orderInfo.orderId,
                    status: this.orderInfo.productStatusStr ? "2" : "",
                    goodsSkuId: this.orderInfo.goodsSkuId,
                    orderOrgId: this.options.orgId,
                };
                uni.navigateTo({
                    url:
                        "/pagesA/order/Chargeback/chargebackApplication?chargebackType=" +
                        chargebackType +
                        "&order=" +
                        JSON.stringify(json) +
                        "&refundOrderId" +
                        this.orderInfo.refundOrderId,
                });
            }
        },

        operating(e) {
            this.setData({
                show: false,
            });

            if (e.currentTarget.dataset.type == 1) {
                if (this.orderInfo.refundTypeStr == "仅退款") {
                    uni.$api
                        .apiRequest("cancelReturnsRequest", {
                            refundOrderId: this.orderInfo.orderRefundInfoId,
                        })
                        .then((res) => {
                            if (res.code == 10000) {
                                uni.navigateBack({
                                    success: () => {
                                        uni.$alert.showSuccess("取消成功");
                                    },
                                });
                            }
                        });
                } else {
                    uni.$api
                        .apiRequest("cancelReturnsGoodsRequest", {
                            refundOrderId: this.orderInfo.orderRefundInfoId,
                        })
                        .then((res) => {
                            if (res.code == 10000) {
                                uni.navigateBack({
                                    success: () => {
                                        uni.$alert.showSuccess("取消成功");
                                    },
                                });
                            }
                        });
                }
            }
        },

        /**
         * 预览图片
         * */
        previewimg() {
            uni.previewImage({
                current: this.orderInfo.imgList[0],
                // 当前显示图片的http链接
                urls: this.orderInfo.imgList, // 需要预览的图片http链接列表
            });
        },

        /**
         * @description 退货物流
         */
        returnLogistics() {
            if (this.orderInfo.expressCode) {
                return false;
            } else {
                uni.navigateTo({
                    url: `/pages/my/Logistics/updateLogistics/updateLogistics?id=${this.orderInfo.orderRefundInfoId}&type=0`,
                });
            }
        },
        /**
         * @description 修改物流
         */
        returnLogisticsUpdate() {
            uni.navigateTo({
                url: `/pages/my/Logistics/updateLogistics/updateLogistics?id=${this.orderInfo.orderRefundInfoId}&type=1&expressCode=${this.orderInfo.expressCode}&expressNo=${this.orderInfo.expressNo}`,
            });
        },

        /* *
         * 是否显示提示
         * */
        alertShowFun(show) {
            this.setData({
                alertShow: show ? show.detail : true,
            });
        },

        getShowInfo() {
            uni.$api
                .apiRequest("getRefundIntegralInfo", {
                    orgId: this.options.orgId,
                    backOrderId: this.options.orderId,
                })
                .then((res) => {
                    console.log(res);

                    if (res.code == 10000 && res.data) {
                        this.setData({
                            alertShowInfo: res.data,
                        });
                    }
                });
        },
    },
};
</script>
<style>
@import "./orderRefund.css";
</style>
