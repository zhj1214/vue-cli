<template>
	<view class="pageBackground">
		<view class="pageContainer" >
			<navBar title="签到打卡" color="white" background="#FE6252"  :back="true"></navBar>
			<view class="pageTopPart" v-if="isCheckRuleEnable && checkInStatusReady">
				<view class="containerFlexCenter topRowOne"><text>{{textBeforeBtn}}</text></view>
				<view class="containerFlexCenter topRowTwo" v-if="isCheckedIn">
					<button class="btnAfterCheckIn" @click="onCheckIn">
						<text style="font-weight: bold">已签到</text>
					</button>
				</view>
				<view class="containerFlexCenter topRowTwo" v-else>
					<button class="btnBeforeCheckIn" @click="onCheckIn">
						<text style="font-weight: bold">立即签到</text>
					</button>
				</view>
				<view class="containerFlexCenter font12px"><text>{{textAfterBtn}}</text></view>
				<view class="ruleButton" @click="onCheckRule">签到规则</view>
			</view>
			<view class="pageTopPart" v-else-if="!isCheckRuleEnable && checkInStatusReady">
				<view class="containerFlexCenter topRowOne"><text>暂无签到活动</text></view>
			</view>
			<view class="pageTopPart" v-else>
				<view class="containerFlexCenter topRowOne"><text>暂无数据</text></view>
			</view>
			<view class="pageBottomPart">
			<view class="bottomRowOne" v-if="isCheckRuleEnable">
					<view class="bottomItem">
						<view class="boldText">{{rewardInfo.integral}}</view>
						<view class="lightText">我的积分</view>
					</view>
					<view class="centerline"></view>
					<view class="bottomItem">
						<view class="boldText">{{rewardInfo.growthValue}}</view>
						<view class="lightText">我的成长值</view>
					</view>
				</view>
				<view class="containerFlexCenter calendarContainer">
					<uniCalendar
						:selected="signDateListData"
						:showMonth="false"
						:allowDateChange="false"
						:periodInfo="isCheckRuleEnable && periodInfo ? periodInfo : null"
					/>
				</view>
			</view>
			<view class="maskLayer" v-if="showCheckInMask">
				<view @click="onCloseMask">
					<image  class="maskContentContainer" src="https://eos-wuxi-1.cmecloud.cn/crmoss/a4927f33-6b42-4326-bac4-a9dc0586002b.png">
					</image>
				</view>
				<view class="contentInImg">
					<view class="containerFlexCenter imgContentText">获得<text class="redText">{{rewardInfo.todayIntegral}}</text>积分奖励</view>
					<view class="containerFlexCenter imgContentText">获得<text class="redText">{{rewardInfo.todayGrowthValue}}</text>成长值奖励</view>
					<view class="lightText imgBottomText">
						{{`明日继续签到可获得
						${rewardInfo.tomorrowIntegral ? rewardInfo.tomorrowIntegral + " 积分" : ""}
						${rewardInfo.tomorrowIntegral && rewardInfo.tomorrowGrowthValue ? "，": ""}
						${rewardInfo.tomorrowGrowthValue ? rewardInfo.tomorrowGrowthValue + " 成长值" : ""}
						`}}
					</view>
					<view class="closeMaskBtn" @click="onCloseMask"></view>
				</view>
				<view class="closeMaskPng" @click="onCloseMask"></view>
			</view>
			<view class="maskLayer" v-if="showRemindMask">
				<view @click="onCloseMask">
					<image  class="maskContentContainer" src="https://eos-wuxi-1.cmecloud.cn/crmoss/3fe8c037-4eb3-4bc1-a911-65cd5f48039a.png">
					</image>
				</view>
				<view class="contentInImg">
					<view class="containerFlexCenter imgContentText lightText">本期连续签到额外奖励周期为</view>
						<text class="containerFlexCenter imgContentText " style="margin: 6px 0">
							{{periodInfo}}
						</text>
					<view class="imgContentText lightText">请及时签到哦~</view>
					<view class="closeMaskBtn" @click="onCloseRemindMask"></view>
				</view>
				<view class="closeMaskPng" @click="onCloseRemindMask"></view>
			</view>
			<view class="maskLayer" v-if="showCheckRule">
				<view class="ruleText lightText">
					<view class="containerFlexCenter ruleTitleText">签到规则</view>
					{{ruleInfo.detail || ""}}
				</view>
				<view class="closeMaskPng" @click="onCheckRule"></view>
			</view>
		</view>
	</view>

</template>

<script>
	import uniCalendar from "@/components/uni-calendar/uni-calendar.vue"
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				ruleInfo: null,
				rewardInfo: null,
				periodInfo: null,
				monthCheckRecord: [],
				orgId: uni.$localStorage.getItem("orgId"),
				memberId: uni.$localStorage.getItem("memberId"),
				showCheckInMask: false, // 展示签到结果
				showRemindMask: false, // 展示签到提醒
				showCheckRule: false, // 展示签到规则
				checkInStatusReady: false, // 是否已获取签到信息
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function() {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			if (!uni.$localStorage.getItem("Token")) {
				uni.navigateTo({
					url: "/pages/login/login",
				});
				return;
			}
			this.getCheckRewardInfoRequest();
			this.getCheckRuleRequest();
			this.getCheckRecordRequest();
			
		},
		computed: {
			isCheckedIn() {
				return Boolean(this.rewardInfo && this.rewardInfo.state)
			},
			isCheckRuleEnable() {
				return this.ruleInfo && (this.ruleInfo.ruleStatus === 1)
			},
			textBeforeBtn() {
				return  this.isCheckedIn ? `已连续签到${(this.ruleInfo && this.ruleInfo.signContinuityNum) || ""}天` : "今日未签到"
			},
			

			textAfterBtn() {
				const rewardInfo = this.rewardInfo || {}
				if (this.isCheckedIn) {
					if (rewardInfo.tomorrowIntegral && rewardInfo.tomorrowGrowthValue) {
						return `今日已签到，明日继续签到可获得${rewardInfo.tomorrowIntegral}积分，${rewardInfo.tomorrowGrowthValue}成长值`
					} else if(rewardInfo.tomorrowIntegral) {
						return `今日已签到，明日继续签到可获得${rewardInfo.tomorrowIntegral}积分`
					} else if(rewardInfo.tomorrowGrowthValue) {
						return `今日已签到，明日继续签到可获得${rewardInfo.tomorrowGrowthValue}成长值`
					} else {
						return "今日已签到"
					}
				} else {
					if (rewardInfo.todayIntegral && rewardInfo.todayGrowthValue) {
						return `今日签到可获得${rewardInfo.todayIntegral}积分，${rewardInfo.todayGrowthValue}成长值`
					} else if(rewardInfo.tomorrowIntegral) {
						return `今日签到可获得${rewardInfo.todayIntegral}积分`
					} else if(rewardInfo.tomorrowGrowthValue) {
						return `今日签到可获得${rewardInfo.todayGrowthValue}成长值`
					} else {
						return ""
					}
				}
			},
			signDateListData() {
				const signDateList = (this.ruleInfo && this.ruleInfo.signDate) || [];
				const monthCheckRecordList = this.monthCheckRecord.map((item) => {
					return item && item.signInTime;
				});
				return monthCheckRecordList.map((item) => {
					return {date: item, outOfPeriod: signDateList.indexOf(item) < 0}
				})
			},
		},
		methods: {
			/*** 关闭签到蒙层*/
			onCloseMask() {
				this.showCheckInMask = false;
			},
			/*** 打开签到蒙层*/
			onOpenMask() {
				this.showCheckInMask = true;
			},
			/*** 关闭提醒蒙层*/
			onCloseRemindMask() {
				this.showRemindMask = false;
			},
			/*** 签到*/
			onCheckIn() {
				this.getCheckInfoRequest();
			},
			/*** 显示签到规则*/
			onCheckRule() {
				this.showCheckRule = !this.showCheckRule;
			},
			
			periodDateRangeStr(startTime, endTime) {
				if (startTime && endTime) {
					return `${startTime.split(" ")[0]}~${endTime.split(" ")[0]}`
				}
				return "";
			},
			
			/** 获取周期内签到记录、签到规则 */
			getCheckRuleRequest() {
				uni.$api.apiRequest('getCheckRuleInfo', {
					memberId: this.memberId,
					orgId: this.orgId,
				}).then(res => {
					const result = res && res.data || {};
					this.ruleInfo = result;
					this.periodInfo = this.periodDateRangeStr(result && result.startTime, result && result.endTime)
					// 规则启用、且周期内未签到时显示签到提醒
					this.showRemindMask = result.ruleStatus === 1 && !Boolean(result && result.signDate && result.signDate.length);
				});
			},
			/** 获取签到奖励信息 */
			getCheckRewardInfoRequest() {
				uni.$api.apiRequest('getCheckRewardInfo', {
					memberId: this.memberId,
					orgId: this.orgId,
				}).then(res => {
					this.checkInStatusReady = true;
					this.rewardInfo = (res && res.data) || null;
				});
			},
			/** 获取月内签到记录 */
			getCheckRecordRequest() {
				uni.$api.apiRequest('getCheckRecord', {
					memberId: this.memberId,
					orgId: this.orgId,
					month: new Date().Format("YYYY-MM")
				}).then(res => {
					this.monthCheckRecord = (res && res.data && res.data.signInfo) || [];
				});
			},
			/** 签到并获取信息 */
			getCheckInfoRequest() {
				uni.$api.apiRequest('getCheckInfo', {
					memberId: this.memberId,
					orgId: this.orgId,
					signTime: new Date().Format("YYYY-MM-DD HH:mm:ss"),
					ruleId: this.ruleInfo && this.ruleInfo.id,
				}).then(res => {
					
					if (res && res.code === 10000) {
						this.onOpenMask(); // 签到成功才打开mask
					}
					// 无论是否签到成功都刷新如下数据，存在签到超时但实际签到成功的情况
					this.getCheckRewardInfoRequest();
					this.getCheckRecordRequest();
					this.getCheckRuleRequest();
				});
			},
		}
	};
</script>
<style scoped lang="scss">
	.pageContainer {
		width: 100vw;
		height: 100vh;
		background: url(../../static/checkIn/checkInBg.png) no-repeat;
		background-size: 100vw 45vh;
		
	}
	.pageTopPart {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 160px;
		color: #fff;
		padding: 20px;
	}
	.containerFlexCenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.topRowOne {
		font-size: 20px;
	}
	.topRowTwo {
		font-size: 20px;
		margin: 14px 0 12px 0;
	}
	.font12px {
		font-size: 12px;
	}
	.bottomRowOne {
		display: flex;
		align-items: center;
		margin-bottom: 24px;
	}
	.bottomItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 50%;
	}
	.pageBottomPart {
		background: #F9F9F9;
		padding: 24px;
		border-radius: 30px;
	}
	.btnAfterCheckIn {
		padding: 0 50px;
		background: #E9E9E9;
		border-radius: 23px;
		color: #BFBFBF;
	}
	.btnBeforeCheckIn {
		padding: 0 50px;
		background: linear-gradient(180deg, #FFFA9D 0%, #FFE300 100%);
		border-radius: 23px;
		color: #FE5D4D;
	}
	.boldText {
		font-size: 28px;
		font-weight: 400;
	}
	.lightText {
		font-size: 14px;
		color: #8E8E8E;
	}
	.calendarContainer {
		background: #fff;
		border-radius: 16px;
	}
	.maskLayer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		background: rgba(11, 11, 11, 0.65);
		z-index: 5999;
	}
	.maskContentContainer {
		width: 310px;
		height: 355px;
	}
	.closeMaskPng {
		margin-top: 20px;
		width: 40px;
		height: 40px;
		background: url(../../static/checkIn/checkInClose.png) no-repeat;
		background-size: 100% 100%;
	}
	.closeMaskBtn {
		width: 150px;
		height: 50px;
		margin-top: 50px;
	}
	.contentInImg {
		position: fixed;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 60px;
	}
	.imgContentText {
		font-size: 12px;
		font-weight: 500;
	}
	.imgBottomText {
		font-size: 10px;
		padding: 8px 0;
	}
	.redText {
		font-size: 20px;
		margin:  0 5px;
		color: #FE5D4D;
	}
	.ruleButton {
		position: absolute;
		padding: 5px 9px;
		font-size: 12px;
		border-radius: 100px 0 0 100px;
		background: rgba(0, 0, 0, 0.3);
		color: #FFFFFF;
		top: 210rpx;
		right: 0;
	}
	.ruleText {
		line-height: 24px;
		width: 320px;
		min-height: 300px;
		max-height: 500px;
		overflow: scroll;
		border-radius: 8px;
		padding: 10px 20px;
		background: #F9F9F9;
	}
	.ruleTitleText {
		color: #000000;
		font-weight: 500;
		font-size: 17px;
		padding: 10px 0;
	}
	.centerline {
		height: 40px;
		border-left: 1px solid #F5F5F5;
	}
	.pageBackground {
		width: 100vw;
		height: 100vh;
		background: #F9F9F9;
	}
</style>
