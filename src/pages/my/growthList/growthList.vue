<template>
	<view class="view">
		<navBar style="position: absolute;top: 0px;" background="inherit" color="white" backgroundColorTop="inherit" title="我的成长值"></navBar>
		<image style="width: 100vw;height: 248px;" src="https://eos-wuxi-1.cmecloud.cn/crmoss/36d9d85f-688f-463e-8694-8a934d53ec7a.png" mode=""></image>

		<view class="contentBg">
			<!-- 积分信息  -->
			<view class="header">
				<view class="flex-row " style="width: 100%;justify-content: flex-end;" @click="jumpRelus">
					<image style="width: 14px;height: 14px;" src="../../../static/images/wh.png" mode=""></image>
					<view class="integralText" style="margin-left: 4px;">成长值规则</view>
				</view>
				<view class="integralText">当前成长值</view>
				<view class="integralValue">{{options.value || 0}}</view>
			</view>
			<!-- 积分列表 -->
			<view class="content">
				<view class="item" v-for="(item, index) in currentData" :key="index">
					<view class="">
						<view class="item-text">{{item.title}}</view>
						<view class="item-time">{{item.timeStr}}</view>
					</view>
					 <view
              class="item-value"
              :style="item.isAdd != -1 ? 'color:#444444;' : 'color:#FE5D4D;'"
              >{{item.isAdd == -1 ?'-':'+'}}{{ item.score }}</view
            >
				</view>
			</view>
		</view>
		
	</view>

	</view>
</template>

<script>
export default {
    data() {
        return {
            options: {},
            // 数据源
            currentData: [],
            page: 1,
        };
    },
    onLoad(options) {
        this.options = options;
        this.getListData();
    },
    methods: {
        /**
         * 获取 成长值明细
         */
        getListData() {
            var param = {
                page: this.page,
                size: 10,
            };

            if (this.page == 1) this.currentData = [];
            uni.$api.apiRequest("gorwthDetail", param).then((res) => {
                if (res.code == 10000 && res.data) {
                    // 如果后面的页码数据为空 则页码-1
                    if (res.data.list.length == 0 && this.page > 1) {
                        this.page = this.page - 1;
                        return;
                    }
                    // 数据源合并

                    var arr = res.data.list.map((item) => {
                        return {
                            ...item,
                            ...{
                                timeStr: new Date(item.createTime).Format(
                                    "YYYY-MM-DD HH:mm:ss"
                                ),
                            },
                        };
                    });
                    if (this.page > 1) {
                        arr = this.currentData.concat(res.data.list);
                    }
                    this.currentData = arr;
                    console.table(this.currentData);
                }
            });
        },
        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function (e) {
            console.log(e);
            this.page += 1;
            this.getListData();
        },
        jumpRelus() {
            uni.navigateTo({
                url:
                    "/pagesA/out/parsePage?title=" +
                    `成长值规则&url=gorwthRelus`,
            });
        },
    },
};
</script>

<style lang="less" scoped>
.view {
    position: relative;
    display: flex;
    justify-content: center;

    .contentBg {
        position: absolute;
        width: 100%;
        margin-top: 110rpx;
        padding: 20px;
    }

    .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .integralText {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
        }

        .integralValue {
            margin: 8px 0px;
            font-size: 34px;
            font-family: DINPro-Bold, DINPro;
            font-weight: bold;
            color: #ffffff;
        }

        .integralTotalValue {
            font-size: 12px;
            font-family: PingFang-SC-Light, PingFang-SC;
            font-weight: 300;
            color: #ffffff;
        }
    }

    .content {
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
        background-color: white;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 20px;

        .item {
            padding: 16px 20px;
            width: 100%;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid #d8d8d8;

            .item-text {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #444444;
            }

            .item-time {
                margin-top: 3px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #404040;
            }

            .item-value {
                font-size: 20px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #444444;
            }
        }
    }
}
</style>
