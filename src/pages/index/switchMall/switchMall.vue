<template>
    <view class="view">
        <navBar title="切换商场" background="#fff"></navBar>
        <view class="header">
            <view class="top flex-row"> 
                <view class="headerDesc">推荐商场</view>
                <view class="headerDesc"></view>
                <view class="headerLoction flex-row" @click="reloadLocation">
                    <image
                        style="width: 11px; height: 11px"
                        src="../../../static/images/reloadred.png"
                        mode=""
                    ></image>
                    重新定位
                </view>
            </view>
            <view class="recommend flex-between" v-if="recommends.length > 0">
                <view
                    :class="[
                        currentMall && currentMall.orgid === item.orgid
                            ? 'active-address'
                            : 'item',
                        'flex-between',
                    ]"
                    @click="jump"
                    v-for="(item, index) in recommends"
                    :key="index"
                    :data-item="item"
                >
                    <view class="itemText flex-row "
                        >
                        <div class="oneLine">{{ item.marketName }}</div>
                        <view class="itemTag">{{
                            item.type == "near" ? "最近" : "常去"
                        }}</view>
                    </view>
                    <view class="itemDistance">{{ item.distance }}</view>
                </view>
            </view>
        </view>
        <view class="content">
            <view class="headerDesc">全部商场</view>
            <view class="listItem" v-for="(arr, idx) in malls" :key="idx">
                <view class="itemHeader">{{ arr[0].province }}</view>
                <view class="list">
                    <view
                        :class="[
                            currentMall && currentMall.orgid === item.orgid
                                ? 'active-address'
                                : 'item',
                            'flex-between',
                        ]"
                        style="margin-bottom: 10px;heigth:36px;"
                        v-for="(item, index) in arr"
                        :key="index"
                        :data-item="item"
                        @click="jump"
                    >
                        <view class="itemText flex-row oneLine">{{
                            item.marketName
                        }}</view>
                        <view class="itemDistance">{{ item.distance }}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 提示信息弹框 -->
        <alertView
            v-if="alertShow && alertContent"
            :showHeader="false"
            :content="alertContent"
            :showCancel="true"
            @ok="okAlert(1)"
            @cancel="okAlert(0)"
        >
        </alertView>
        <!-- 冻结弹框 -->
        <alertView
            v-if="alertdj"
            :showHeader="false"
            content="您在该商城的账号已被冻结，请切换商场在使用"
            @ok="()=>{alertdj = false;}"
        >
        </alertView>
    </view>
</template>

<script>
/**
 * 场景
 * 1.第一次进入小程序，授权定位，选择商场（无常去商场）
 * 2.切换商场（有常去的商场）
 * 3.普通场景模式（不用切换商场）走1
 * */
import alertView from "../../../pageComponents/alertView/alertView";

import { adaptChangeMall } from '@/utils/adaptors/shop.js'

const app = getApp();
export default {
    components: {
        alertView,
    },
    data() {
        return {
            type: "", // type 为返回
            isSelect: true,
            currentMall: uni.$localStorage.getItem("currentMall"),
            recommends: [],
            malls: [],
            //   弹框
            alertShow: false,
            alertContent: "",
            near: undefined,
            alertdj: false
        };
    },
    onLoad(option) {
        // type 为返回
        const { type , showalert } = option;
        if (type) {
            this.setData({
                type,
            });
        } 
        if(showalert){
          this.alertdj = true
        }

        this.getLocation();
    },
    methods: {
        /**
         * 获取商场数据
         * */
        initData(param) {
            var self = this;
            uni.$api.apiRequest("__v2__changeCityMall",{
                ...param,
                orgId: uni.$localStorage.getItem("orgId"),
                pageNum: 1,
                pageSize: 1000,
                // uid: 1,
            }).then((res) => {
                // console.log(res);
                if (res.code == 10000) {
                    const data = adaptChangeMall(res.data);

                    self.recommends = (() => {
                        let temp = [];
                        if (data.constantlyInfo) {
                            temp.push(data.constantlyInfo);
                        }
                        if (data.nearInfo) {
                            temp.push(data.nearInfo);
                        }
                        return temp;
                    })().map((item) => {
                        if (item.distance >= 0) {
                            let z = (item.distance / 1000).toFixed(1);
                            if (z < 1) {
                                z = item.distance.toFixed(1);
                                z += "m";
                            } else {
                                z += "km";
                            }
                            item.distance = z;
                        } else {
                            item.distance = "";
                        }

                        return item;
                    });

                    // self.recommends = data.list1.map((item) => {
                    // 	if (item.distance >= 0) {
                    // 		let z = (item.distance / 1000).toFixed(1);
                    // 		if (z < 1) {
                    // 			z = item.distance.toFixed(1);
                    // 			z += "m";
                    // 		} else {
                    // 			z += "km";
                    // 		}
                    // 		item.distance = z;
                    // 	} else {
                    // 		item.distance = '';
                    // 	}

                    // 	return item;
                    // });

                    self.malls = data.keyList
                        .map((key) => data.totalDataMap[key])
                        .map((arr) => {
                            arr.map((item) => {
                                if (item.distance >= 0) {
                                    let z = (item.distance / 1000).toFixed(1);
                                    if (z < 1) {
                                        z = item.distance.toFixed(1);
                                        z += "m";
                                    } else {
                                        z += "km";
                                    }
                                    item.distance = z + "";
                                } else {
                                    item.distance = "";
                                }

                                return item;
                            });
                            return arr;
                        });

                    // self.malls = data.totalList3.filter(item=>item).map((arr) => {
                    // 	arr.map((item) => {
                    // 		if (item.distance >= 0) {
                    // 			let z = (item.distance / 1000).toFixed(1);
                    // 			if (z < 1) {
                    // 				z = item.distance.toFixed(1);
                    // 				z += "m";
                    // 			} else {
                    // 				z += "km";
                    // 			}
                    // 			item.distance = z + "";
                    // 		} else {
                    // 			item.distance = '';
                    // 		}

                    // 		return item;
                    // 	});
                    // 	return arr;
                    // });

                    // data.list1.forEach((element) => {
                    // 	if (element.type == "near") {
                    // 		self.near = element;
                    // 	}
                    // });
                    self.near = data.nearInfo;
                    if (self.near)
                        self.alertContent = `您当前还未选择商场，系统定位到您离 ${self.near.marketName}更近，是否切换？`;
                }
            });
        },
        /**
         * 获取经纬度
         * */
        reloadLocation() {
            var self = this;
            uni.getLocation({
                type: "gcj02",
                success(res) {
                    const latitude = res.latitude;
                    const longitude = res.longitude;
                    const speed = res.speed;
                    const accuracy = res.accuracy;
                    console.log(res);
                    self.initData({
                        longitude: res.longitude,
                        latitude: res.latitude,
                        uid: uni.$localStorage.getItem("memberId"),
                    });
                },
                fail() {
                    uni.openSetting({
                        success() {
                            self.getLocation();
                            console.log("openSetting-success");
                        },
                        fail() {
                            uni.showModal({
                                content:
                                    "检测到您未打开获取定位权限，是否去设置打开？",
                                confirmText: "确认",
                                cancelText: "取消",
                                success() {
                                    uni.openSetting({
                                        success(res) {
                                            if (
                                                res.authSetting[
                                                    "scope.userLocation"
                                                ]
                                            ) {
                                                self.getLocation();
                                            }
                                        },
                                    });
                                },
                                fail() {
                                    console.log("showModal-fail");
                                },
                            });
                        },
                    });
                },
            });
        },
        getLocation() {
            var self = this;
            uni.getLocation({
                type: "gcj02",
                success(res) {
                    const latitude = res.latitude;
                    const longitude = res.longitude;
                    const speed = res.speed;
                    const accuracy = res.accuracy;
                    // console.log(res);
                    self.initData({
                        longitude: res.longitude,
                        latitude: res.latitude,
                        uid: uni.$localStorage.getItem("memberId"),
                    });
                },
                fail() {
                    self.initData({
                        uid: uni.$localStorage.getItem("memberId"),
                    });
                },
            });
        },
        /**
         * 弹框事件
         * */

        okAlert(val) {
            if (val) {
                this.jump({
                    currentTarget: {
                        dataset: {
                            item: this.near,
                        },
                    },
                });
            }
        },
        /**
         * 跳转到首页
         * */
        jump(val) {
            console.log(val.currentTarget.dataset.item, "____res");
            if (!uni.$localStorage.getItem("userOpenId")) {
                app.globalData.orgId = val.currentTarget.dataset.item.orgid;
                uni.$localStorage.setItem(
                    "orgId",
                    val.currentTarget.dataset.item.orgid
                );
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
                                    this.jumpNext(val);
                                } else {
                                    response.data &&
                                        uni.$alert.showToast(
                                            response.data.message
                                        );
                                }
                            });
                    },
                    fail: (err)=>{
                        console.log(err)
                    }
                });

                return
            } 
            

            uni.$localStorage.setItem(
                "orgId",
                val.currentTarget.dataset.item.orgid
            );
            this.jumpNext(val);
            
            
        },
        jumpNext(res) {
            uni.$localStorage.setItem(
                "currentMall",
                res.currentTarget.dataset.item
            );
           
            // 返回首页之前 要清除1.用户缓存信息2.获取积分名称3.
            uni.$localStorage.remove("wxUserInfo");
            if (this.type) {
                uni.navigateBack({
                    delta: 1,
                });
            } else {
                uni.switchTab({
                    url: "/pages/index/index",
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
/* 公共地址属性 begin */
.addressPublic() {
    height: 33px;
    border-radius: 1px;
    width: 44vw;
    align-items: center;
    padding: 8px 6px;
    font-family: PingFangSC-Regular, PingFang SC;
    .itemText {
        height: 17px;
        font-size: 12px;
    }
    .itemTag {
        width: 32px;
        padding: 1px 4px;
        margin-left: 4px;
        border-radius: 2px;
        font-size: 8px;
        font-family: PingFang-SC-Light, PingFang-SC;
        font-weight: 300;
    }
    .itemDistance {
        font-size: 10px;
    }
}
/* 公共地址属性 end */
.view {
    .selectItem {
        background: #fe5d4d !important;

        border-radius: 1px;
        border: 1px solid #fe5d4d !important;

        .itemText {
            color: white !important;
        }

        .itemTag {
            font-weight: 300;
            text-align: center;
            color: white !important;
            background: #fe5d4d !important;
            border-radius: 2px !important;
            border: 1px solid #ffffff !important;
        }

        .itemDistance {
            font-weight: 300;
            color: white !important;
        }
    }

    .item {
        background: #ffffff;
        border: 1px solid #dbdbdb;
        .addressPublic();
        .itemText {
            color: #404040;
        }

        .itemTag {
            border: 1px solid #fe5d4d;
            color: #fe5d4d;
        }

        .itemDistance {
            color: #9a9a9a;
        }
    }

    .active-address {
        background: #fe5d4d;
        border: 1px solid #fe5d4d;
        color: #ffffff;
        .addressPublic();
        .itemTag {
            border: 1px solid #ffffff;
        }
    }

    .header {
        padding: 14px 20px;
        border-bottom: 8px solid #f9f9f9;

        .top {
            justify-content: space-between;

            .headerDesc {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #9a9a9a;
            }

            .headerLoction {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #fe5d4d;
            }
        }

        .recommend {
            margin-top: 10px;
        }
    }

    .content {
        padding: 14px 20px;

        .headerDesc {
            padding: 10px 0px;
        }

        .listItem {
            .itemHeader {
                margin-bottom: 10px;
                padding: 1px 10px;
                background: #f5f5f5;
                border-radius: 2px;
            }

            .list {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                margin-bottom: 5px;
            }
        }
    }
}
</style>
