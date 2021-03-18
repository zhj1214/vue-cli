<!-- 转盘抽奖 -->
<template>
  <view class="circle-lottery">
    <navBar title="转盘抽奖" background="#fff" :back="false"></navBar>
    <view class="circle-lotteryBg" :style="contentBgColor">
      <!-- 抽奖界面上本部分效果展示 -->
      <view class="circle-lottery-header">
        <!-- 海报 -->
        <view class="circle-lottery-banner" :style="bgStyle"></view>
        <!-- 我的奖品 -->
        <view
          class="lottery-header-myPrize"
          style="bottom: 88rpx;"
          v-if="!isTourist"
          @click="toAward"
          >我的奖品</view
        >
        <!-- 任务列表 -->
        <view
          class="lottery-header-myPrize"
          style="bottom: 12rpx;"
          v-if="!isTourist"
          @click="showTask"
          >任务列表</view
        >
        <!-- 头部 -->
        <view class="lottery-header" v-if="!isTourist" :style="contentBgColor">
          <view
            class="lottery-header-integral"
            :style="integralColorStyle"
            v-if="gameInfo.awardQualificationType != 'FREE'"
          >
            <span style="margin-right: 40rpx;">{{ consumePoint }} 积分/次</span
            ><span>可用积分：{{ availablePoint }}</span>
          </view>
        </view>
      </view>
      <!-- 抽奖大转盘 -->
      <view class="lottery-bigTurntable" :style="contentStyle">
        <view class="wheel">
          <view
            class="draw-btn"
            ref="drawBtn"
            :style="btnStyle"
            @click="draw"
          ></view>
          <view
            class="wheel-bg"
            :style="{
              transform: rotate_angle,
              transition: rotate_transition,
              backgroundImage: turntableBg,
            }"
          >
            <view class="prize-list" v-if="awards.length > 0">
              <view
                class="prize-item"
                v-for="(item, index) in awards"
                :key="index"
              >
                <view class="prize-content">
                  <view class="prize-pic">
                    <image
                      class="prize-pic-img"
                      :src="item.awardPicUrl || ''"
                    ></image>
                  </view>
                  <view class="prize-type">{{
                    filterName(item.awardInfo || '')
                  }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!--  抽奖次数 设置了最大值才展示还剩次数，只有设置了免费次数才展示对应文案，并移除“前xx次” -->
        <view class="lottery-bottom" v-if="!isTourist">
          <view
            class="lottery-bottom-title"
            :style="{ color: colors.prizeListColor }"
            v-if="gameInfo.awardQualificationType == 'CONSUME_POINT'"
          >
          <view v-if="availableTimes">您还有 {{ availableTimes }} 次抽奖机会</view>
            
          </view>
          <!-- v-if="gameInfo.awardQualificationType != 'FREE' && availableFreeTimes && availableFreeTimes!=0" -->
          <view
            class="lottery-bottom-btn lottery-bottom-title"
            :style="{
              color: colors.prizeListColor,
              borderColor: colors.prizeListColor,
            }"
            v-if="gameInfo.awardQualificationType == 'CONSUME_POINT'"
          >
            前 {{ availableFreeTimes }}次免费
          </view>
          <view
            v-else
            class="lottery-bottom-btn lottery-bottom-title"
            :style="{
              color: colors.prizeListColor,
              borderColor: colors.prizeListColor,
            }"
          >
            可用免费次数 {{ availableFreeTimes }} 次
          </view>
        </view>
      </view>
      <!-- 活动规则 -->
      <view class="rule-and-awards">
        <view class="rule">
          <view class="rule-title">
            <text
              class="line"
              :style="{ background: colors.buttonTextColor }"
            ></text>
            <label :style="{ color: colors.buttonTextColor }">活动规则</label>
            <text
              class="line"
              :style="{ background: colors.buttonTextColor }"
            ></text>
          </view>
          <view
            class="words"
            :style="prizeColorStyle"
            v-html="appearanceContext.info"
          >
          </view>
        </view>
        <view class="award">
          <view class="rule-title">
            <text
              class="line"
              :style="{ background: colors.buttonTextColor }"
            ></text>
            <label :style="{ color: colors.buttonTextColor }">奖品清单</label>
            <text
              class="line"
              :style="{ background: colors.buttonTextColor }"
            ></text>
          </view>
          <view class="words">
            <view
              v-for="item in awards"
              :key="item.awardId"
              v-if="item.showInAwardList"
              :style="prizeColorStyle"
            >
              <h3 v-if="item.awardInfo">{{ item.awardInfo }}</h3>
              <view
                class="words"
                v-if="item.awardDescription"
                v-html="item.awardDescription"
              ></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 弹框 -->
    <lottery-dialog
      :awardPicUrl="awardPicUrl"
      :awardInfo="awardInfo"
      :gameId="gameId"
      ref="lotteryDialog"
      :text="text"
      :btnText="btnText"
      :title="title"
      :isTourist="isTourist"
    ></lottery-dialog>
  </view>
</template>

<script>
import LotteryDialog from './lottery-dialog';

export default {
  components: {
    LotteryDialog,
  },
  data() {
    return {
      gameId: '', // 游戏id
      awardQualificationType: '', // 游戏资格模式类型 CONSUME_POINT:消耗积分 FREE:免积分消耗
      availablePoint: null,
      start_rotating_degree: 0, //初始旋转角度
      rotate_angle: 0, //将要旋转的角度
      start_rotating_degree_pointer: 0, //指针初始旋转角度
      rotate_angle_pointer: 0, //指针将要旋转的度数
      rotate_transition: 'transform 6s ease-in-out', //初始化选中的过度属性控制
      rotate_transition_pointer: 'transform 12s ease-in-out', //初始化指针过度属性控制
      click_flag: true, //是否可以旋转抽奖
      index: 0,
      text: '',
      btnText: '',
      title: '',
      availableTimes: null,
      availableFreeTimes: null,
      status: '', // 活动共状态
      gameStatus: '', // 游戏状态 WAIT_START:未开始 RUNNING:进行中 ENDED:已结束
      maxLimit: '', // 限制次数 周期内最大限制次数，无值为无限制
      consumePoint: null, // 单次游戏消耗积分
      appearanceContext: '', // json字符串，游戏的一些可配置项
      awards: [], // 奖品列表
      taskDesc: '', // 游戏任务说明
      gameTemplate: '', // 游戏模板
      gameInfo: {},
      awardType: '',
      awardInfo: '', // 奖品信息
      awardPicUrl: '',
      bgStyle: '',
      clickStatusImageUrl: '',
      unClickImageUrl: '',
      btnStyle: '',
      turntableBg: '',
      prizeColorStyle: '',
      integralColorStyle: '', // 积分的文字颜色
      contentStyle: '',
      contentBgColor: '',
      colors: {},
      isTourist: false,
    };
  },
  async onLoad(options) {
    console.log(options);
    uni.$scene.setScene(options);

    console.log(getApp());

    if (options.isTourist) this.isTourist = options.isTourist != '0';
    this.gameId = options.gameId || '';

    await uni.$scene.next(async ({ sceneObj }) => {
			
			// 正常，模式
      if (sceneObj.type == 3) {
				// 正常模式下，先走登录
				if(!uni.$localStorage.getItem('Token')){
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return false
				}
        this.gameId = sceneObj.paramsId;
        this.isTourist = false;
      }
			// 预览，模式
      if (sceneObj.type == 4) {
        this.gameId = sceneObj.paramsId;
        this.isTourist = true;
      }
      return true;
		});

    
    // 
    if (this.gameId != undefined && !this.isTourist) {
      var self = this;
			this.init();
    } else {
      this.init();
      // 游客模式清除一切缓存，防止意外
      // uni.clearStorage();
    }
  },
  methods: {
    init() {
      this.getGameInfo();
      if (!this.isTourist){
        // 未登录去登陆
        if (!uni.$localStorage.getItem("Token")) {
          uni.reLaunch({
            url: "/pages/login/login",
          });
        } 
        // 
        this.getMemberQualification();
      } 
      
    },
    /**
     * @description 获取用户信息
     */
    getHomeMemberInfo() {
      var self = this;
      //获取应用实例
      const app = getApp();
      uni.$util.getMemberInfo().then((res) => {
        if (res) {
          app.globalData.userInfo = res;
          app.globalData.integral = res.integral;
          uni.$localStorage.setCurrentUser(res);
          self.init();
        }
      });
    },
    /**
     * 获取游戏	信息
     * */
    getGameInfo() {
      var self = this;
      uni.$api
        .apiRequest('game_info', {
          gameId: this.gameId,
        })
        .then((res) => {
          if (res.code == 10000) {
            self.gameInfo = res.data || {};
            self.awards = res.data.awards || []; // 奖品列表
            self.taskDesc = res.data.taskDesc || ''; // 任务数据
            self.appearanceContext =
              JSON.parse(res.data.appearanceContext) || {}; // 配置信息
            console.log(self.appearanceContext);
            self.colors = self.appearanceContext.colors || {};
            self.clickStatusImageUrl =
              self.appearanceContext.clickStatusImageUrl;
            self.unClickImageUrl = self.appearanceContext.unClickImageUrl;
            self.gameStatus = res.data.gameStatus || ''; // 游戏状态
            self.consumePoint = res.data.consumePoint; // 可用积分
            self.maxLimit = res.data.maxLimit; // 最大次数
            self.awardQualificationType = res.data.awardQualificationType; // 游戏资格模式类型 CONSUME_POINT:消耗积分 FREE:免积分消耗
            if (res.data.taskDesc) {
              setTimeout(() => {
                self.showTask();
              }, 500);
            }
          }
        });
    },
    /**
     * 获取游戏 次数
     * */
    getMemberQualification() {
      uni.$api
        .apiRequest('game_member_qualification', {
          memberId: uni.$localStorage.getItem('memberId'),
          gameId: this.gameId,
        })
        .then((res) => {
          this.availableTimes = res.data.availableTimes;
          this.availableFreeTimes = res.data.availableFreeTimes;
          this.availablePoint = res.data.availablePoint;
        })
        .catch((err) => {
          console.log(err, 'dfds');
        });
    },
    /**
     * 启动转盘
     * */
    touristDraw() {
      this.index = Math.ceil(Math.random() * 7);
      let goods = this.awards[this.index];
      // this.awardType == 'NOTHING'
      this.awardType = goods.awardType; // 是不是 中奖了
      this.awardInfo = goods.awardInfo; // 中奖产品名称
      this.awardPicUrl = goods.awardPicUrl; // 产品图片
      // :text="text"
      // :btnText="btnText" :title="title",
      console.log(this.index, '___this.index');
      console.log(goods, '___goods');
      this.rotating();
    },
    draw() {
      if (!this.click_flag) return;
      // 游客模式
      if (this.isTourist) return this.touristDraw();
      if (
        this.availableFreeTimes == 0 &&
        this.gameInfo.awardQualificationType == 'FREE'
      ) {
        return this.handleDialogShow(
          '次数不足',
          '次数用光了，下次再来吧！',
          '我知道了'
        );
      }
      this.click_flag = false;
      // 旋转结束前，不允许再次触发
      if (this.gameStatus == 'WAIT_START') {
        this.click_flag = true;
        // gameStatus 游戏状态 WAIT_START:未开始 RUNNING:进行中 ENDED:已结束
        let sTime = this.filterTime(this.gameInfo.startTime);
        this.handleDialogShow(
          '活动还未开始',
          `活动开始时间为：${sTime}`,
          '我知道了'
        );
        return;
      } else if (this.gameStatus == 'ENDED') {
        this.click_flag = true;
        let sTime = this.filterTime(this.gameInfo.startTime);
        let eTime = this.filterTime(this.gameInfo.endTime);
        this.handleDialogShow(
          '活动已结束',
          `活动时间为：${sTime}~${eTime}`,
          '我知道了'
        );
        return;
      } else if (this.gameStatus == 'UNUSUAL_ENDED') {
        this.click_flag = true;
        let sTime = this.filterTime(this.gameInfo.startTime);
        let eTime = this.filterTime(this.gameInfo.endTime);
        this.handleDialogShow(
          '活动已结束',
          `活动时间为：${sTime}~${eTime}`,
          '我知道了'
        );
        return;
      }
      if (Number(this.availableTimes) < 1 && this.availableTimes != null) {
        this.click_flag = true;
        this.handleDialogShow(
          '次数不足',
          '次数用光了，下次再来吧！',
          '我知道了'
        );
        return;
      }
      if (
        Number(this.availableFreeTimes) < 1 &&
        this.availablePoint < this.consumePoint &&
        this.availableFreeTimes != null &&
        this.availablePoint != null
      ) {
        this.click_flag = true;
        this.handleDialogShow('积分不足', '积分不足，攒攒积分吧', '我知道了');
        return;
      }
      uni.$util.currentClockin() // 点亮
      uni.$api
        .apiRequest('game_draw_result', {
          memberId: uni.$localStorage.getItem('memberId'),
          gameId: this.gameId,
        })
        .then((r) => {
          if (r.code == 10000) {
            this.awardType = r.data.awardType; // 是不是 中奖了
            this.awardInfo = r.data.awardInfo; // 中奖产品名称
            this.awardPicUrl = r.data.awardPicUrl; // 产品图片
            this.getMemberQualification();
            let awardId = r.data.awardId;
            this.index = this.awards.findIndex((val) => {
              return val.awardId == awardId;
            });
            if (this.index < 0) {
              return uni.$alert.showToast('奖品id未配置！');
            }
            console.log(this.index, '===');
            this.rotating();
          } else {
            this.click_flag = true;
          }
        })
        .catch((err) => {
          console.log(err);
          this.click_flag = true;
        });
    },
    rotating() {
      let type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
      let during_time = 5; // 默认为1s
      let result_index = this.index; // 最终要旋转到哪一块，对应prize_list的下标
      let result_angle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5]; //最终会旋转到下标的位置所需要的度数
      let rand_circle = 6; // 附加多转几圈，2-3
      // this.click_flag = false; // 旋转结束前，不允许再次触发
      if (type == 0) {
        // 转动盘子
        let result_angle_item =
          this.index == 0 ? 22.5 : result_angle[result_index - 1];
        let rotate_angle =
          this.start_rotating_degree +
          rand_circle * 360 +
          result_angle_item -
          (this.start_rotating_degree % 360);
        this.start_rotating_degree = rotate_angle;
        console.log(rotate_angle);
        this.rotate_angle = 'rotate(' + rotate_angle + 'deg)';
        let that = this;
        // 旋转结束后，允许再次触发
        setTimeout(function() {
          that.click_flag = true;
          that.game_over();
        }, during_time * 1000 + 1500); // 延时，保证转盘转完
      }
    },
    game_over() {
      if (this.awardType == 'NOTHING') {
        this.handleDialogShow('谢谢参与', '别灰心，再来一次吧～', '继续抽奖');
      } else {
        this.handleDialogShow('恭喜您', '', '');
      }
    },
    toAward() {
      if (!this.click_flag) {
        return uni.$alert.showToast('正在抽奖中！');
      }
      uni.navigateTo({
        url: `/pages/commLottery/my-prize?gameId=${this.gameId}`,
      });
    },
    showTask() {
      if (!this.click_flag) {
        return uni.$alert.showToast('正在抽奖中！');
      }

      if (!this.taskDesc) {
        return uni.$alert.showToast('暂无任务！');
      }
      this.handleDialogShow('游戏任务', this.taskDesc, '我知道了');
    },
    handleDialogShow(title, text, btnText) {
      this.$nextTick(() => {
        this.title = title;
        this.text = text;
        this.btnText = btnText;
        this.$refs.lotteryDialog.show();
      });
    },
    filterTime(val) {
      if (!val) return '';
      return new Date(val).Format('YYYY-MM-DD HH:mm:ss');
    },
    filterName(name) {
      if (!name) return '';
      return uni.$util.cutString(name, 8);
    },
  },
  watch: {
    appearanceContext(val) {
      console.log(val);
      let bg = this.appearanceContext.themeImageUrl;
      let bgColor = this.appearanceContext.colors.bgColor;
      this.bgStyle = `background-color:${bgColor};background-image: url(${bg});`; // 整个背景的背景色、背景图片
      this.contentBgColor = `background-color:${bgColor};`; // 整个背景的背景色、背景图片
      this.btnStyle = `background-image:url(${this.appearanceContext.clickStatusImageUrl});`; // 转盘按钮背景图片
      this.turntableBg = `url(${this.appearanceContext.turntableImageUrl})`; // 转盘背景图
      this.contentStyle = `background:${this.appearanceContext.colors.turntableColor}`; // 大转盘背景色
      this.prizeColorStyle = `color:${this.appearanceContext.colors.contentTextColor}`; // 活动规则 字体颜色
      this.integralColorStyle = `color:${this.appearanceContext.colors.integralValueColor}`; // 积分的文字颜色
    },
    click_flag(val) {
      if (!val) {
        this.btnStyle = `background-image:url(${this.appearanceContext.unClickImageUrl})`;
      } else {
        this.btnStyle = `background-image:url(${this.appearanceContext.clickStatusImageUrl});`;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.circle-lottery {
  .circle-lotteryBg {
    width: 100%;
    background-position: center top;
    background-repeat: no-repeat;
    min-height: 100%;
    background-size: 100%;
    position: relative;
    text-align: center;
    padding-bottom: 30px;
    overflow-x: hidden;

    .circle-lottery-header {
      position: relative;
      overflow: hidden;

      .circle-lottery-banner {
        background-size: 100% 100%;
        width: 100vw;
        height: 430rpx;
      }

      .lottery-header-myPrize {
        z-index: 999;
        position: absolute;
        right: 0;
        width: 124rpx;
        height: 54rpx;
        line-height: 54rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        background: rgba(0, 0, 0, 0.57);
        border-radius: 36rpx 0rpx 0rpx 36rpx;
      }

      .lottery-header {
        height: 68px;
        border-radius: 50% 50% 50% 0;
        position: absolute;
        bottom: 0;
        width: 100vw;
        display: flex;
        justify-content: center;
        margin-bottom: -36px;

        .lottery-header-integral {
          line-height: 36px;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    .lottery-bigTurntable {
      margin: 25rpx;
      padding: 60rpx 0rpx;
      background: rgba(255, 247, 230, 1);
      border-radius: 16rpx;

      .lottery-bottom {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .lottery-bottom-title {
          font-size: 24rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(218, 117, 133, 1);
        }

        .lottery-bottom-btn {
          margin-top: 18rpx;
          padding: 0px 12rpx;
          height: 38rpx;
          border-radius: 4rpx;
          border: 1px solid rgba(206, 65, 87, 1);
        }
      }
    }
  }
}

.rule-and-awards {
}

.rule-title {
  width: 96vw;
  padding: 0 6px;
  height: 43px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-top: 6px;

  .line {
    width: 120px;
    height: 1px;
  }

  label {
    font-size: 16px;
    margin: 0 6px;
  }
}

/* 转盘 */
.wheel {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wheel-bg {
  width: 274px;
  height: 274px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}

.prize-item {
  position: absolute;
  width: 135px;
  height: 135px;
  transform-origin: right bottom 0;
  -webkit-transform-origin: right bottom 0;
}

.prize-list {
  position: absolute;
  width: 135px;
  height: 135px;
  transform-origin: right bottom 0;
  -webkit-transform-origin: right bottom 0;
}

.prize-list .prize-item:first-child {
  transform: rotate(0deg) skewY(45deg);
}

.prize-list .prize-item:nth-child(2) {
  transform: rotate(45deg) skewY(45deg);
}

.prize-list .prize-item:nth-child(3) {
  transform: rotate(90deg) skewY(45deg);
}

.prize-list .prize-item:nth-child(4) {
  transform: rotate(135deg) skewY(45deg);
}

.prize-list .prize-item:nth-child(5) {
  transform: rotate(180deg) skewY(45deg);
}

.prize-list .prize-item:nth-child(6) {
  transform: rotate(225deg) skewY(45deg);
}

.prize-list .prize-item:nth-child(7) {
  transform: rotate(270deg) skewY(45deg);
}

.prize-list .prize-item:nth-child(8) {
  transform: rotate(315deg) skewY(45deg);
}

.prize-content {
  width: 100px;
  height: 100px;
  transform-origin: center center 0;
  transform: skewY(-45deg) rotate(-22.5deg) translate(9px, 35px);
  -webkit-transform: skewY(-45deg) rotate(-22.5deg) translate(9px, 35px);
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: center;
}

.prize-pic {
  // width: 65px;
  // height: 40px;
  margin-top: 14px;
}

.prize-pic-img {
  width: 40px;
  height: 30px;
  display: block;
  margin: 0 auto;
  // margin-top: 4px;
}

.prize-type {
  font-size: 12px;
  color: rgb(28, 25, 25);
  opacity: 0.8;
  margin-top: 2px;
}

/* 规则 */
.words {
  width: 94vw;
  margin-left: 3vw;
  font-size: 12px;
  font-family: PingFangSC;
  font-weight: 400;
  line-height: 17px;
  opacity: 0.7;
  text-align: left;
  overflow: hidden;
}

.award-title {
  // background: url("/static/images/lottery/award-title.png") no-repeat center;
  // background-size: 100%;
  // margin: 0 auto;
}

.award h3 {
  // color: #fff;
  // opacity: 0.9;
  font-size: 14px;
  width: 298px;
  margin: 5px auto;
  text-align: left;
}

.draw-btn {
  width: 101px;
  height: 101px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  background-image: url('https://eos-wuxi-1.cmecloud.cn/crmoss/3222a2df-1622-449e-a477-e395fab7c8c5.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  z-index: 10;
}
</style>
