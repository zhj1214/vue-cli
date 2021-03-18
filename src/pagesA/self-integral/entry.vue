<template>
  <view class="page-self-intergral-entry">
    <navBar title="自助积分" background="#fff" ext-class="fixed-bar"
            :home-btn="true"></navBar>
    <view class="page-header">
      <view class="location-bar">
        <view class="left" @tap="jumpToSwitch">
          <image
            class="left__icon"
            src="/static/images/self-integral/location.png"
          ></image>
          <view class="left__text">
            {{currentMall.marketName || "请选择"}}
          </view>
        </view>
        <view class="right" @click="jumpIntegral">
          <view class="right__text">
            积分明细
          </view>
        </view>
      </view>

      <view class="photo" @click="getIntegralPhoto">
        <image
          mode="widthFix"
          class="photo__img"
          src="https://eos-wuxi-1.cmecloud.cn/crmoss/ce960b93-f90d-4a93-8891-98ddabec56f4.png"
        ></image>
      </view>
    </view>
      <!-- 摄像头 -->
		<view class="cameraView" v-if="showCamera">
			<camera binderror="handleCameraError" device-position="back" flash="off" style="width: 100%; height: 88vh;">
        <cover-view class="coverText">
          <cover-view class="shadowText">
            <cover-view style="font-weight:500;height:100rpx;color: #FFFFFF;line-height: 100rpx;text-align: center;">拍照规则</cover-view>
            <cover-view>
              <cover-view class="tips">1.上传当日小票有效，每次仅限上传一张小票；</cover-view>
              <cover-view class="tips">2.需保证小票拍摄清晰，并包含店铺信息、交易时间、交易号、消费金额等重要信息；</cover-view>
              <cover-view class="tips">3.小票拍摄完成后工作人员会在3天内完成审核，审核完成后，积分和成长值会发放至您的账户，审核未通过前建议您保留好小票；</cover-view>
              <cover-view class="tips">4.请确保上传小票为本人消费。</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
			</camera>
      <view class="cameraBottom">
			    <view class="cancelCamera"><view @tap="cancalCamera">取消</view></view>
          <view class="shootPhoto">
            <image
             @tap="takeIntegralPhoto"
            src="/static/images/self-integral/cameraBtn.png"
            style="height:112rpx;width:112rpx;"
            ></image>
          </view>
			</view>
		</view>
    <!-- 预览相片 -->
    <view class="prePhoto" v-if="showPrePhoto">
      <view>
        <image
          :src="integralPhotoUrl"
          style="width: 100%; height: 88vh; vertical-align: bottom;"
        ></image>
      </view>
      <view class="prePhotoBottom">
			    <view class="backCamera"><view @tap="backCamera">重拍</view></view>
          <view class="usePhoto"><view @tap="uploadCameraPhoto">使用照片</view></view>
			</view>
    </view>

    <view class="wrap" v-if="switchAds.length">
		  <u-swiper :list="switchAds" :height="160" :border-radius="80" :interval="3000" @click="jumpAds">
      </u-swiper>
	  </view>

    <view class="page-body">
      <view class="page-body__hd">
        <view class="page-body__hd--bar">
          <view class="left">
            <view class="left__text">
              近7条记录
            </view>
          </view>
          <view class="right">
            <view class="right__text" @click="jumpAllRecord">
              全部记录
            </view>
          </view>
        </view>
      </view>
      <view v-if="entryRecords.length" class="page-body__bd">
        <view  v-for="item in entryRecords" :key="item.id" @click="jumpDetail(item)">
          <app-intergral-log-card  :card="item" ></app-intergral-log-card>
        </view>
      </view>
      <app-empty-card v-else></app-empty-card>
    </view>
  </view>
</template>

<script>
import AppIntergralLogCard from '@/pageComponents/ht-app/cards/intergral-log-card.vue';
import AppEmptyCard from '@/pageComponents/ht-app/cards/empty.vue';
import { request } from '../../utils/http';
const app = getApp(); //获取应用实例


export default {
  name: 'page-self-intergral-entry',
  components: {AppIntergralLogCard, AppEmptyCard},
  data(){
    return {
      currentMall: uni.$localStorage.getItem("currentMall"),
      currentData: [],
      userInfo: {},
      switchAds: [],
      entryRecords: [],
      page: 1,
      authCamera: true,
      showCamera: false,
      ctxCamera: null,
      integralPhotoUrl: '',
      showPrePhoto: false,
      isUsePhoto: false
    }
  },

  onShow() {
    this.logIn();
    this.setData({
      currentMall: uni.$localStorage.getItem("currentMall"),
    });
    this.getHomeMemberInfo();
    this.initGrids();
    this.getIntegralList();
    // console.log(this.currentMall);
    // console.log(this.userInfo);
  },

  onLoad() {
    // this.getCameraAuth();
  },

/**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function(e) {
    // 如果还有数据
    if (this.total > this.entryRecords.length) {
      this.page = this.page + 1;
      this.getIntegralList();
      return;
    }
    // 已经是最后一页
    uni.showToast({
      title: '没有更多了',
      icon: 'none',
    });
  },

  methods: {
    jumpToSwitch() {
      uni.navigateTo({
        url: `/pages/index/switchMall/switchMall?type=${true}`,
      });
    },
    jumpAds(index) {
      let address = this.switchAds[index].linkAddress;
      uni.$util.adJumpUrl(address);
    },

    // 判断用户是否登录
    logIn() {
      if (!uni.$localStorage.getItem("Token")) {
        uni.showToast({
            title: '请先登录',
            icon: 'none',
        });
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
    },
    /**
     * @description 获取用户信息
     */
    getHomeMemberInfo() {
      var self = this;
      uni.$util.getMemberInfo().then((res) => {
        if (res) {
          let u = { ...self.userInfo, ...res };
          app.globalData.integral = res.integral;
          uni.$localStorage.setCurrentUser(res);
          uni.$localStorage.setItem('memberId', res.memberId);
          let isLogin = uni.$localStorage.getItem('Token') ? true : false; // 改变登录状态
          self.$nextTick(() => {
            this.isLogin = isLogin;
            self.setData({
              userInfo: u,
            });
          });
        }
      });
    },
    /**
     * 获取积分记录
     */
    getIntegralList() {
      if (uni.$localStorage.getItem("Token")) {
        uni.$api
        .apiRequest("integralList", {
          memberId: uni.$localStorage.getItem("memberId"),
          orgId: uni.$localStorage.getItem("orgId"),
          page: this.page,
          size: 7,
          status: 0
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.total = res.data.count; // 保存总条数
            // 保存列表数据
            if (this.page === 1) {
              this.entryRecords = res.data.list || [];
            } else {
              this.entryRecords = this.entryRecords.concat(res.data.list || []);
            }
          }
        })
      }
    },
      /**
     * 积分明细
     * */
    jumpIntegral() {
      let url =
          "/pages/my/integral/integral?value=" +
          this.userInfo.orgTotalScore +
          `&allValue=${this.userInfo.integral || 0}`;
      uni.navigateTo({
        url: url,
      });
    },
    /**
         * @description 获取头部广告位
         */
        async initGrids() {
            const res = await uni.$api.apiRequest('getAdvs', {
                orgId: uni.$localStorage.getItem('currentMall').orgid,
                placement: 27,
                size: 10
            });
            if (res.code == 10000 && res.data) {
                this.switchAds = res.data;
            }
        },
      /**
     * 全部记录
     * */
    jumpAllRecord() {
      uni.navigateTo({
        url: '/pagesA/self-integral/list'
      })
    },
    /**
     * 记录详情
     * */
    jumpDetail(item) {
      uni.navigateTo({
        url: `/pagesA/self-integral/detail?uniqueCode=${item.id}`
      })
    },
    /**
     * 拍照
     * */
    // getCameraAuth() {
    //   var that = this;
		// 	//获取相机权限
		// 	uni.getSetting({
		// 		success(res) {
		// 		 if (res.authSetting["scope.camera"]) {
		// 					that.authCamera = true
		// 		  } else {
		// 			  that.authCamera = false
		// 		  }
		// 		}
		// 	})
    // },
    getIntegralPhoto () {
        let that = this;
        uni.showActionSheet({
          itemList: ['拍照','从手机相册选择'],
          success(res) {
            console.log(res.tapIndex);
            if (res.tapIndex === 0) {
            //调用camera组件
              that.showCamera = true//开启拍照
            } else if (res.tapIndex === 1) {
                uni.chooseImage({
				    count: 1,           // 最多可以选择的图片张数，默认9
				    sizeType: ['original', 'compressed'],              //original 原图，compressed 压缩图，默认二者都有
				    sourceType: ['album'],             //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
				    success: function (res) {
                // console.log(JSON.stringify(res.tempFilePaths));
                const tempFilePaths = res.tempFilePaths;
                uni.uploadFile({
                  url: uni.$api.getApiHost() + '/file-server/api/resources/files/upload',
                  filePath:tempFilePaths[0],
                  name: 'file',
                  success: (uploadFileRes) => {
                    if(uploadFileRes.statusCode == 200) {
                      //uploadFileRes.data是String类型，要转对象的话需要JSON.parse
                      // console.log(uploadFileRes);
                      uni.$api.apiRequest("integralPhoto", {
                        'memberId': that.userInfo.memberId,
                        'nickName': that.userInfo.nickName,
                        'phone': that.userInfo.phone,
                        'imgUrl': JSON.parse(uploadFileRes.data).data,
                        'marketOrgId': that.currentMall.orgid,
                      })
                      .then((res) => {
                        if (res.code == 10000) {
							            uni.navigateTo({
                            url: '/pagesA/self-integral/success'
                          })
                        }
                        else {
							            uni.$alert.showToast('图片上传失败');
						            }
                      })
                    }
                    else {
                      uni.$alert.showToast('图片上传失败');
                    }
                  }
                })
				    }
				});
            }
          }
        })	
      },
      cancalCamera() {
        this.showCamera = false//关闭拍照
      },
      takeIntegralPhoto () {
        let that = this;
				uni.createCameraContext().takePhoto({
				      	quality: 'high',
					      success: (res) => {
                  console.log(res.tempImagePath);
                  this.integralPhotoUrl = res.tempImagePath;
                  this.showCamera = false;//关闭拍照
                  this.showPrePhoto = true;//开启预览
                  this.isUsePhoto = true;//使用照片只能用一次
                  // uni.previewImage({
                  //   urls: res.tempFilePaths,
                  //       success: function(data) {
                            
                  //       },
                  //       fail: function(err) {
                  //           console.log(err.errMsg);
                  //       }
                  // });
					      }
				});
      },
      //重拍
      backCamera() {
        this.showPrePhoto= false;//关闭预览
        this.showCamera = true;//开启拍照
      },
      //拍照使用照片
      uploadCameraPhoto() {
        if(this.isUsePhoto) {
          this.isUsePhoto = false;
          let that = this;
          uni.uploadFile({
                  url: uni.$api.getApiHost() + '/file-server/api/resources/files/upload',
                  filePath: that.integralPhotoUrl,
                  name: 'file',
                  success: (uploadFileRes) => {
                    if(uploadFileRes.statusCode == 200) {
                      //uploadFileRes.data是String类型，要转对象的话需要JSON.parse
                      // console.log(uploadFileRes);
                      uni.$api.apiRequest("integralPhoto", {
                        'memberId': that.userInfo.memberId,
                        'nickName': that.userInfo.nickName,
                        'phone': that.userInfo.phone,
                        'imgUrl': JSON.parse(uploadFileRes.data).data,
                        'marketOrgId': that.currentMall.orgid,
                      })
                      .then((res) => {
                        that.showPrePhoto = false;//关闭预览
                        if (res.code == 10000) {
							            uni.navigateTo({
                            url: '/pagesA/self-integral/success'
                          })
                        }
                        else {
							            uni.$alert.showToast('图片上传失败');
						            }
                      })
                    }
                    else {
                      uni.$alert.showToast('图片上传失败');
                    }
                  }
                })
        }
      },
      handleCameraError(){
			    uni.showToast({
			      title:'请开启摄像头权限',
			      icon: 'none'
			    })
			},
  }
};
</script>

<style lang="less" scoped>
.page-self-intergral-entry {
  background-color: #f9f9f9;
  .page-header {
    margin-bottom: 20rpx;
    padding: 20rpx 40rpx;
    background-color: #fff;
    .location-bar {
      margin-bottom: 20rpx;
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        &__icon {
          width: 24rpx;
          height: 24rpx;
          margin-right: 12rpx;
        }
      }
      .right {
        &__text {
          padding: 8rpx 16rpx;
          border-radius: 30rpx;
          color: #9d9d9d;
          border: 1rpx solid #9d9d9d;
        }
      }
    }
    .photo {
      border-radius: 12rpx;
      overflow: hidden;
      &__img {
        width: 100%;
      }
    }
  }

  .page-body {
    background-color: #fff;
    &__hd {
      margin-bottom: 20rpx;
      padding: 20rpx 40rpx;
      background-color: #fff;

      &--bar {
          display: flex;
          justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          &__text {
            font-size: 32rpx;
            font-weight: bold;
            color: #000;
          }
        }
        .right {
          margin-top: 4rpx;
          &__text {
            padding: 8rpx 16rpx;
            border-radius: 30rpx;
            color: #9d9d9d;
            border: 1rpx solid #9d9d9d;
          }
        }
      }
    }
    &__bd{
      margin: 20rpx 40rpx;
    }
  }
  .wrap {
    padding: 0 40rpx;
    padding-top: 36rpx;
    padding-bottom: 20rpx;
    margin-top: 20rpx;
    background-color: #fff;
  }
  .cameraView {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100vh;
    background-color: #FFFFFF;
    .coverText {
      position: fixed;
      top: 50vh;
      color: #fff;
      .shadowText {
        margin:0 100rpx;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.4);
        padding: 0 20rpx;
        padding-bottom: 30rpx;
      }
      .tips {
        white-space: pre-wrap;
        line-height: 50rpx;
        font-weight: 400;
        font-size: 12px;
      }
    }
    .cameraBottom {
      // display:flex;
      overflow: hidden;
      background-color:black;
      height:13vh;
      .cancelCamera {
        float: left;
        width:60rpx;
        color: #FFFFFF;
        margin-top:5vh;
        margin-left:5.5vh;
      }
      .shootPhoto {
        width:120rpx;
        line-height:13vh;
        margin:2.5vh auto;
        // margin-left:23vw;
      }
    }
  }
  .prePhoto {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100vh;
    background-color: #FFFFFF;
    .prePhotoBottom {
      overflow: hidden;
      background-color:black;
      height:13vh;
      .backCamera {
        float: left;
        width:60rpx;
        color: #FFFFFF;
        margin-top:5vh;
        margin-left:5.5vh;
      }
      .usePhoto {
        float: right;
        width:120rpx;
        color: #FFFFFF;
        margin-top:5vh;
        margin-right:4vh;
      }
    }
  }
  
}
</style>
