<template>
    <view class="my-plan-style">
        <!-- 3D轮播 -->
        <view class="">
            <swiper
                class="imageContainer"
                :current="currentIdx"
                @change="handleChange"
                previous-margin="50rpx"
                next-margin="50rpx"
                circular
                :autoplay="autoplay"
            >
                <block v-for="(item, index) in imgList" :key="index">
                    <swiper-item class="swiperitem">
                        <image
                            class="itemImg"
                            v-if="isShowBg"
                            :class="currentIdx == index ? 'swiperactive' : ''"
                            :src="list[index]"
                            lazy-load
                            mode="scaleToFill"
                        ></image>
                        <view
                            class="jswiperContent"
                            style="
                                position: relative;
                                width: 100%;
                                height: auto;
                            "
                        >
                            <!-- <cover-image
                                @click="settingCardHandle"
                                v-show="currentIdx === index"
                                style="
                                    width: 72rpx;
                                    height: 68rpx;
                                    position: absolute;
                                    right: 0;
                                    top: 0;
                                    z-index: 10;
                                "
                                src="../../static/images/my/peeling.png"
                                mode=""
                            ></cover-image> -->
                            <image
                                @click="settingCardHandle"
                                v-show="currentIdx === index && getGradeText(item) == '当前等级'"
                                style="
                                    width: 72rpx;
                                    height: 68rpx;
                                    position: absolute;
                                    right: 0;
                                    top: 0;
                                    z-index: 10;
                                "
                                src="../../static/images/my/peeling.png"
                                mode=""
                            />

                            <view class="list" v-if="slotType == '0'">
                                <view
                                    class="card_type"
                                    :style="{ color: item.textColor }"
                                >
                                    {{ item.levelName }}
                                    <view
                                        class="status"
                                        :style="{
                                            color: item.reachedSignTextColor,
                                            'background-color':
                                                item.reachedSignBackgroundColor,
                                        }"
                                        v-if="getGradeText(item) == '已达成'"
                                        >{{ getGradeText(item) }}</view
                                    >
                                    <view
                                        class="status"
                                        :style="{
                                            color: item.soonSignTextColor,
                                            'background-color':
                                                item.soonSignBackgroundColor,
                                        }"
                                        v-else
                                        >{{ getGradeText(item) }}</view
                                    >
                                </view>
                                <view
                                    class="date"
                                    :style="{ color: item.textColor }"
                                    v-if="item && item.searchedTime"
                                    >有效期至：{{
                                        getTime(item.searchedTime)
                                    }}</view
                                >
                                <view
                                    class="level_box"
                                    v-if="currentIdx + 1 < imgList.length"
                                >
                                    <view class="level_info">
                                        <text :style="{ color: item.textColor }"
                                            >保级{{
                                                item.protectionGradeValue
                                            }}</text
                                        >
                                        <text :style="{ color: item.textColor }"
                                            >升级{{
                                                imgList[currentIdx + 1]
                                                    .upGradeValue
                                            }}</text
                                        >
                                    </view>
                                    <view class="process_out">
                                        <view
                                            class="process_in"
                                            :style="{
                                                width: `${
                                                    (growthScore /
                                                        imgList[currentIdx + 1]
                                                            .upGradeValue) *
                                                    100
                                                }%`,
                                            }"
                                        ></view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </block>
            </swiper>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        imgList: {
            type: Array,
            default: [],
        },
        current: {
            type: Number,
            default: 0,
        },
        imgkey: {
            type: String,
            default: "",
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
        isShowBg: {
            type: Boolean,
            default: true,
        },
        slotType: {
            type: String,
            default: "0",
        },
        nowGradeId: String,
        growthScore: String,
    },
    data() {
        return {
            userInfo: undefined,
            currentIdx: 0,
            list: [],
        };
    },
    created() {
        this.currentIdx = this.current;
        this.getCardInfo();
        this.userInfo = uni.$localStorage.getCurrentUser();
    },
    methods: {
        getCardInfo() {
            uni.$api
                .apiRequest("getCardFaceInfo", {
                    memberId: uni.$localStorage.getItem("memberId"),
                })
                .then((res) => {
                    if (res.code == 10000 && res.data) {
                        this.imgList.forEach((item) => {
                            if (item.levelId == this.userInfo.levelName) {
                                item.cardBackground =
                                    res.data.memberCardFaceLogo;
                            }
                        });
                        this.list = this.imgList.map((item) => {
                            return item[this.imgkey];
                        });
                    }
                });
        },
        handleChange(val) {
            this.currentIdx = val.detail.current;
            this.$emit("handleChange", val, this.current);
        },
        settingCardHandle() {
            this.$emit("settingCardHandle");
        },
        getGradeText(item) {
            if (item) {
                if (this.nowGradeId.slice(2) > +item.levelId.slice(2)) {
                    return "已达成";
                } else if (this.nowGradeId === item.levelId) {
                    return '当前等级';
                } else {
                    if (this.growthScore < item.upGradeValue) {
                        return "待解锁";
                    } else {
                        return "已达成";
                    }
                }
            }
        },
        getTime(date) {
            if (!date) {
                return "";
            }
            return new Date(Number(date)).Format("YYYY-MM-DD");
        },
    },
};
</script>
<style lang="scss">
@import "./thirdCard.less";

// 3D轮播样式
.imageContainer {
    width: 100%;
    /* height: 500rpx; */
    /* background: #000; */
    height: 325upx;
    background-color: #fff;
}

.swiperitem {
    /* height: 500rpx; */

    padding: 0upx 20upx;
    box-sizing: border-box;
    position: relative;

    .swiperText {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 56upx;
        left: 51upx;
        z-index: 998;
        width: 162upx;
        height: 163upx;
        background: rgba(255, 255, 255, 1);
        border-radius: 8upx;
        padding: 10upx;

        .name {
            font-size: 26upx;
            font-weight: 500;
            color: rgba(253, 57, 91, 1);
            line-height: 37upx;
            margin-bottom: 10upx;
        }

        .zq,
        .cz {
            font-size: 20upx;
            color: rgba(253, 57, 91, 1);
            line-height: 35upx;
        }

        .addNl {
            width: 120upx;
            height: 26upx;
            background: rgba(253, 57, 91, 1);
            border-radius: 13upx;
            font-size: 20upx;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 26upx;
            margin-top: 10upx;
        }
    }
}

.itemImg {
    position: absolute;
    width: 95%;
    /* height: 380rpx; */
    height: 328rpx;
    border-radius: 15rpx;
    z-index: -10;
    opacity: 0.7;
    top: 5%;
    box-shadow: 0px 4upx 15upx 0px rgba(153, 153, 153, 0.24);
}

.swiperactive {
    width: 95%;
    opacity: 1;
    z-index: -10;
    height: 328rpx;
    top: 0%;
    transition: all 0.2s ease-in 0s;
}

.zhankai {
    text-align: center;

    .iconfont {
        margin-left: 10upx;
    }
}
</style>
