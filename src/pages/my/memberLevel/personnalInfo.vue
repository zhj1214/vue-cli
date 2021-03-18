<template>
    <view class="memberInfo">
        <navBar title="会员权益" :backBtn="true" :homeBtn="true"></navBar>
        <view class="header_box">
            <cover-view class="header">
                <cover-view class="info">
                    <cover-image
                        class="infoImg"
                        style="
                            border-radius: 50%;
                            width: 50px;
                            height: 50px;
                            border: 4px solid white;
                            margin-top: 10px;
                        "
                        :src="avatar"
                    ></cover-image>
                    <cover-view
                        style="margin: 34rpx 0 0 20rpx; font-size: 28rpx"
                        >{{ nickname }}</cover-view
                    >
                </cover-view>
                <cover-view class="growth" @click="jumpgrowth"
                    >成长值：{{ growthScore || 0 }}
                    <u-icon
                        name="arrow-right"
                        size="20"
                        style="margin-left: 8rpx"
                    ></u-icon>
                    <cover-view
                        class="clickView"
                        @click.stop="settingCardHandle"
                    ></cover-view>
                </cover-view>
            </cover-view>
            <jswiper
                v-if="list.length > 0"
                style="top: 50px; position: relative"
                :imgList="list"
                :growthScore="growthScore"
                :nowGradeId="nowGradeId"
                imgkey="cardBackground"
                slotType="0"
                :current="currentIdx"
                :currentLevelLog="currentLevelLog"
                @handleChange="handleChange"
                @settingCardHandle="settingCardHandle"
            ></jswiper>
        </view>
        <view
            style="
                box-shadow: 0px 8px 20px -2px rgba(0, 0, 0, 0.05);
                border-radius: 4px;
                margin: 40rpx;
            "
        >
            <view class="privilege">
                <image
                    style="
                        width: 22rpx;
                        height: 20rpx;
                        margin-right: 16rpx;
                        margin-top: 11rpx;
                    "
                    src="../../../static/images/my/privilegeLeft.png"
                    mode=""
                ></image>
                {{ list[currentIdx].levelName }}专属特权
                <image
                    style="
                        width: 22rpx;
                        height: 20rpx;
                        margin-left: 16rpx;
                        margin-top: 11rpx;
                    "
                    src="../../../static/images/my/privilegeRight.png"
                    mode=""
                ></image>
            </view>
            <view class="privilege_detail">
                <view
                    class="detail"
                    v-for="item in list[currentIdx].memberEquityRespList"
                    :key="item.equityId"
                    @tap.stop="goDetails(item.equityId)"
                >
                    <image
                        style="
                            width: 60rpx;
                            height: 60rpx;
                            margin-bottom: 16rpx;
                        "
                        :src="item.imgUrl"
                        mode=""
                    ></image>
                    <view class="des">{{ item.equityName }}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
// import navBar from '@/components/navBar/navBar'
import Utils from "@/utils/h5utils/util.js";
import jswiper from "@/components/jing-swiper/jing-swiper";

export default {
    components: {
        jswiper,
    },
    data() {
        return {
            currentIdx: 0,
            nickname: "", // 会员名称
            avatar: "", // 会员头像
            nowGradeId: "", // 会员等级
            growthScore: "", // 成长值
            nextNeededGrowth: "", // 下次升级所需的成长值
            list: [], // 卡片数组
            nowGradeIndex: 0,
            scrollWidth: 0, // 滚动区域宽度
            memberEquityRespList: [], // 权益数组
            levelName: "", // 会员名称
        };
    },
    computed: {
        // currentItem(){
        // 	return this.list[this.currentIdx]
        // }
    },
    onShow: function (options) {
        this.getHomeMemberInfo();
    },
    onLoad: function (options) {
        this.userInfo = uni.$localStorage.getCurrentUser();
        // window.addEventListener('scroll', this.handleScroll, true)
    },
    mounted() {
        this.getMemberInfo();
    },
    methods: {
        /**
         * @description 权益详情
         * @param {String} equityId 权益ID
         */
        goDetails(equityId) {
            console.log("equityId:", equityId);
            const param = JSON.stringify({
                gradeEquityId: equityId,
            });
            uni.navigateTo({
                url: `/pagesA/out/parsePage?title=权益说明&url=benefitDetails&param=${param}`,
            });
        },
        getHomeMemberInfo() {
            const self = this;
            // 更新用户信息
            uni.$api
                .apiRequest("getUserInfo", {
                    orgId: uni.$localStorage.getItem("orgId"),
                })
                .then((res) => {
                    if (res.code == 10000 && res.data) {
                        uni.$localStorage.setCurrentUser(res.data);
                        let u = { ...self.userInfo, ...res.data };
                        self.$nextTick(() => {
                            self.userInfo = u;
                        });
                    }
                });
        },

        // 获取会员等级信息
        getMemberInfo() {
            uni.$api.apiRequest("getMemberGradeLiist", {}).then((res) => {
                if (res.code == 10000 && res.data) {
                    const {
                        nickname,
                        avatar,
                        nowGradeId,
                        nextNeededGrowth,
                        growthScore,
                        list,
                    } = res.data;
                    this.nickname = nickname;
                    this.avatar = avatar;
                    this.nowGradeId = nowGradeId;
                    this.nextNeededGrowth = nextNeededGrowth;
                    this.growthScore = growthScore;
                    this.list = list;
                    this.nowGradeIndex = this.list.findIndex(
                        (item) => item.levelId == nowGradeId
                    );
                    // 默认选中当前等级
                    this.currentIdx = this.nowGradeIndex;
                    this.memberEquityRespList =
                        list[this.nowGradeIndex].memberEquityRespList;
                    this.levelName = list[this.nowGradeIndex].levelName;
                    this.scrollWidth =
                        list.length * 335 + (list.length - 1) * 10 + "px";
                }
            });
        },
        // 跳转自定义卡面设置
        settingCardHandle() {
            // const {
            // 	levelId,
            // 	levelName,
            // 	searchedTime
            // } = this.list[this.nowGradeIndex]
            const { levelId, levelName, searchedTime } = this.list[
                this.currentIdx
            ];
            uni.$api.apiRequest("cardGradeEnable", {}).then((res) => {
                if (res.code == 10000) {
                    let { status } = res.data; // status:1停用：2启用
                    if (status == 2) {
                        uni.navigateTo({
                            url: `/pages/my/memberLevel/customizeCard?levelId=${levelId}&levelName=${levelName}&searchedTime=${searchedTime}`,
                        });
                    }
                }
            });
        },

        jumpgrowth() {
            uni.navigateTo({
                url:
                    "/pages/my/growthList/growthList?value=" + this.growthScore,
            });
        },
        handleChange(val) {
            this.currentIdx = val.detail.current;
        },
    },
};
</script>
<style lang="less" scoped>
.memberInfo {
    .clickView {
        position: absolute;
        width: 30px;
        height: 30px;
        bottom: -8px;
        right: 35px;
    }

    .header_box {
        width: 100%;
        height: auto;
        height: 422rpx;
        position: relative;

        .header {
            width: 100%;
            overflow: hidden;
            position: absolute;
            z-index: 2;

            .info {
                float: left;
                margin-left: 86rpx;
                display: flex;
                flex-direction: row;
                position: relative;

                .infoImg {
                    // position: absolute;
                }
            }

            .growth {
                float: right;
                margin: 40rpx 40rpx 0 0;
            }
        }

        .scroll_box {
            position: relative;
            top: -17px;
            width: 100%;
            height: auto;
            overflow-x: scroll;
            margin-top: -30rpx auto 0;

            .list_box {
                width: 2050rpx;
                display: flex;
                flex-direction: row;
                padding: 0px 40rpx;
            }
        }

        .scroll_box::-webkit-scrollbar {
            display: none;
        }
    }

    .privilege {
        text-align: center;
        font-size: 32rpx;
        color: #444444;
        padding-top: 40rpx;
        line-height: 44rpx;
    }

    .privilege_detail {
        width: 670rpx;
        height: auto;
        margin: 48rpx auto 0;

        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        .detail {
            width: 33.3333%;
            text-align: center;
            margin-bottom: 60rpx;

            .des {
                font-size: 24rpx;
                text-align: center;
            }
        }

        .detail:nth-last-child(1),
        .detail:nth-last-child(2),
        .detail:nth-last-child(3) {
            margin-bottom: 40rpx;
        }
    }
}
</style>
