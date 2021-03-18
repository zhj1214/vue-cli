<template>
    <view>
        <navBar title="协商历史" background="#fff" back="true"></navBar>
        <view class="view">
            <!-- 退款商品 -->
            <view class="refundGoods">
                <view class="refundGoods-header">退款商品</view>
                <view class="refundGoods-item">
                    <view class="refundGoods-item-l">
                        <image
                            mode="aspectFit"
                            class="refundGoods-item-img"
                            :src="goodsList.goodsImg"
                        ></image>
                    </view>
                    <view class="refundGoods-item-info">
                        <view class="refundGoods-item-info-content">
                            <view class="refundGoods-item-title">{{
                                goodsList.goodsName
                            }}</view>
                            <view class="refundGoods-item-desc"
                                >规格：{{ goodsList.goodsSpec }}</view
                            >
                        </view>
                        <view class="refundGoods-item-r">
                            <pandp
                                style="color: #1e273f"
                                :price="goodsList.productCharge"
                                :point="goodsList.refundProductPayScore"
                            ></pandp>
                            <view class="refundGoods-item-desc"
                                >× {{ goodsList.num }}</view
                            >
                        </view>
                    </view>
                </view>
            </view>
            <!-- 协商历史 -->
            <view class="negotiationHistory">
                <view class="refundGoods-header">协商历史</view>
                <!-- 时间轴 -->
                <view class="timeLine">
                    <historyTimeline
                        v-for="(item, index) in historyTimeList"
                        :key="index"
                        :param="item"
                    >
                        <view slot="playlog-item-right" style="width: 100%">
                            <view class="timeLine-time">{{ item.time }}</view>
                            <view class="timeLine-content">
                                <view class="timeLine-content-t">{{
                                    item.title
                                }}</view>
                                <view v-if="item.contentText" class>{{
                                    item.contentText
                                }}</view>
                                <view
                                    v-for="(
                                        item, index2
                                    ) in item.contentTextList"
                                    :key="index2"
                                    class="linsSpace-top"
                                >
                                    <!-- 文字 -->
                                    <view
                                        v-if="!item.contentType && item.title"
                                    >
                                        <span class="linsSpace-right"
                                            >{{ item.title }}:</span
                                        >
                                        <span>{{ item.content }}</span>
                                    </view>
                                    <!-- 图片 -->
                                    <view
                                        v-if="item.contentType"
                                        class="xsimgViewbg"
                                    >
                                        <view class="linsSpace-right"
                                            >{{ item.title }}:</view
                                        >
                                        <view class="xsimgView">
                                            <image
                                                v-for="(
                                                    el, index3
                                                ) in item.contentList"
                                                :key="index3"
                                                class="xsImg"
                                                :src="el"
                                                @tap.stop="previewImage"
                                                :data-imgs="item.contentList"
                                                :data-idx="index"
                                            ></image>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </historyTimeline>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import historyTimeline from "../../../pageComponents/Timeline/historyTimeline.vue";
import pandp from "../../../pageComponents/priceAndPoint/priceAndPoint";

export default {
    data() {
        return {
            backOrderId: "",
            // 商品列表
            goodsList: {},
            // 协商历史
            historyTimeList: [],
        };
    },

    components: {
        historyTimeline,
        pandp,
    },
    props: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id) {
            this.setData({
                backOrderId: options.id,
                goodsList: JSON.parse(options.json),
            });
            console.table(this.goodsList);
            this.getBackOrderData();
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    methods: {
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        getBackOrderData: function () {
            uni.$api
                .apiRequest("getNegotiationInfos", {
                    orderRefundInfoId: this.backOrderId,
                })
                .then((res) => {
                    if (res.code == 10000) {
                        console.log("res:", res.code);
                        var arr = res.data.map((item) => {
                            // 时间
                            var create = new Date(item.operTime); // 纯文本

                            var contentText = ""; // 先排序 在组装内容

                            var con = undefined;

                            if (item.recordList) {
                                function compare(val1, val2) {
                                    return val1.sort - val2.sort;
                                }

                                item.recordList.sort(compare);
                                con = item.recordList.map((el) => {
                                    if (!el.title) {
                                        contentText = el.content;
                                    }

                                    return el;
                                });
                            }

                            return {
                                time: create.Format("YYYY-MM-DD HH:mm:ss"),
                                title: "[" + item.refundConsultStatusStr + "]",
                                contentText: contentText,
                                contentTextList: con,
                                select: false,
                            };
                        });
                        this.setData({
                            historyTimeList: arr,
                        });
                        console.log("historyTimeList:", this.historyTimeList);
                    }
                });
        },

        /**
         * 图片预览
         */
        previewImage(e) {
            let idx = e.currentTarget.dataset.idx;
            let urls = e.currentTarget.dataset.imgs;

            if (urls && urls.length > 0) {
                uni.previewImage({
                    current: urls[idx],
                    // 当前显示图片的http链接
                    urls: urls,
                });
            }
        },
    },
};
</script>
<style>
@import "./negotiationHistory.css";
</style>
