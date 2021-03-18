<template>
    <view class="view">
        <navBar
            color="black"
            :title="type === 6 ? '优惠券核销' : '门票核销'"
        ></navBar>
        <view class="formcss">
            <u-form :model="form" ref="uForm" label-width="auto">
                <u-form-item label="核销内容" prop="title">
                    <u-input
                        v-model="form.title"
                        input-align="right"
                        disabled
                        placeholder="暂无"
                    />
                </u-form-item>
                <u-form-item label="核销状态" prop="status">
                    <u-input
                        v-model="form.status"
                        input-align="right"
                        disabled
                        placeholder="暂无"
                    />
                </u-form-item>
                <u-form-item label="核销人" prop="writerName">
                    <u-input
                        v-model="form.writerName"
                        input-align="right"
                        disabled
                        placeholder="暂无"
                    />
                </u-form-item>
            </u-form>
            <u-button @click="submit" type="error">确认核销</u-button>
        </view>
    </view>
</template>

<script>
const app = getApp(); //获取应用实例
export default {
    data() {
        return {
            form: {
                title: "",
                status: "",
                writerName: "",
            },
            openId: uni.$localStorage.getItem("userOpenId"),
            type: 6,
            uniqueCode: "",
            orgId: uni.$localStorage.getItem("orgId"),
        };
    },
    onShow() {},
    onLoad(option) {
        this.isRequirements();
        const { scene } = option;
        const arr = scene && scene.split("_");
        if (arr && arr.length == 3) {
            this.setData({
                type: Number(arr[2]),
                uniqueCode: arr[0],
                orgId: arr[1],
            });
            uni.$localStorage.setItem("orgId", arr[1]);

            // if (uni.$localStorage.getItem("currentMall")) {
            //   const currentMall = uni.$localStorage.getItem("currentMall");
            //   if (currentMall.orgId !== arr[1]) {
            //     uni.$localStorage.remove("currentMall");
            //   }
            // }
        }
        if (!uni.$localStorage.getItem("userOpenId")) {
            this.init();
        } else {
            this.openId = uni.$localStorage.getItem("userOpenId");
            this.getInfo(this.openId);
        }
        this.getCodeSign();
    },
    // onReady() {
    //   this.$refs.uForm.setRules(this.rules);
    // },
    methods: {
        // 判断是否有商场 然后是否登录
        isRequirements() {
            // if (!uni.$localStorage.getItem("currentMall")) {
            //   uni.navigateTo({
            //     url: "/pages/index/switchMall/switchMall",
            //   });
            //   return;
            // }
            if (!uni.$localStorage.getItem("Token")) {
                uni.switchTab({
                    url: "/pages/index/index",
                });
                return;
            }
        },
        init() {
            uni.login({
                success: (res) => {
                    console.log(res, "微信login成功");
                    uni.$api
                        .apiRequest("getOpenId", {
                            code: res.code,
                        })
                        .then((response) => {
                            if (
                                response.code == 10000 &&
                                response.data &&
                                response.data.openid
                            ) {
                                app.globalData.userOpenId =
                                    response.data.openid;
                                uni.$localStorage.setItem(
                                    "userOpenId",
                                    response.data.openid
                                );
                                this.openId = response.data.openid;
                                this.getInfo(response.data.openid);
                            } else {
                                response.data &&
                                    uni.$alert.showToast(response.data.message);
                            }
                        });
                },
            });
        },
        // 获取优惠券核销信息
        getInfo(openId) {
            if (this.type === 6) {
                uni.$api
                    .apiRequest("getWriteOffInfo", {
                        openId,
                        orgId: this.orgId,
                        uniqueCode: this.uniqueCode,
                    })
                    .then((res) => {
                        if (res.code == 10000 && res.data) {
                            this.setData({
                                form: {
                                    title: res.data.title,
                                    status: res.data.status
                                        ? "已核销"
                                        : "未核销",
                                    writerName: res.data.writerName,
                                },
                            });
                        }
                    });
            } else {
                uni.$api
                    .apiRequest("ticketInfo", {
                        openId,
                        orgId: this.orgId,
                        ticketNo: this.uniqueCode,
                    })
                    .then((res) => {
                        if (res.code == 10000 && res.data) {
                            this.setData({
                                form: {
                                    title: res.data.title,
                                    status:
                                        res.data.status === 2
                                            ? "已核销"
                                            : res.data.status === -1
                                            ? "作废"
                                            : "未核销",
                                    writerName: res.data.writerName,
                                },
                            });
                        }
                    });
            }
        },
        // 获取优惠券核销codesign
        getCodeSign() {
            if (this.type === 6) {
                uni.$api
                    .apiRequest("codeSign", {
                        uniqueCode: this.uniqueCode,
                    })
                    .then((res) => {
                        if (res.code == 10000 && res.data) {
                            this.setData({
                                codeSign: res.data,
                            });
                        }
                    });
            } else {
                uni.$api
                    .apiRequest("getSignData", {
                        ticketNo: this.uniqueCode,
                    })
                    .then((res) => {
                        if (res.code == 10000 && res.data) {
                            this.setData({
                                codeSign: res.data,
                            });
                        }
                    });
            }
        },
        // 确认核销
        submit() {
            if (this.type === 6) {
                this.couponVer();
            } else {
                this.ticketVer();
            }
        },

        // 优惠券核销
        couponVer() {
            uni.$api
                .apiRequest("writeOffCouponC", {
                    openId: this.openId,
                    uniqueCode: this.uniqueCode,
                    codeSign: this.codeSign,
                })
                .then((res) => {
                    if (res.code == 10000) {
                        uni.navigateTo({
                            url: `/pages/verifier/bindSuccess?type=${6}`,
                        });
                    } else {
                        if (
                            res.message ===
                            "权限不足,不是适用范围机构下的核销员"
                        ) {
                            uni.navigateTo({
                                url: `/pages/verifier/bindFail?type=${6}`,
                            });
                        }
                    }
                });
        },
        // 门票核销
        ticketVer() {
            uni.$api
                .apiRequest("writeoff", {
                    openId: this.openId,
                    ticketNo: this.uniqueCode,
                    codeSign: this.codeSign,
                })
                .then((res) => {
                    if (res.code == 10000) {
                        uni.navigateTo({
                            url: `/pages/verifier/bindSuccess?type=7`,
                        });
                    } else {
                        if (res.message === "权限不足,不是该机构下的管理员") {
                            uni.navigateTo({
                                url: `/pages/verifier/bindFail?type=7`,
                            });
                        }
                    }
                });
        },
    },
};
</script>

<style scoped lang="less">
.formcss {
    padding: 15px;
}
</style>
