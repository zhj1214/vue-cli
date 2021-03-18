<template>
<view class="share-back" @tap.stop="handleClose" v-if="isCanDraw">
	<painter style="position: absolute; top: -9999rpx;" :palette="imgDraw" @imgOK="onImgOK"></painter>
	<scroll-view class="share-wrap" scroll-y v-if="visible">
		<view class="share-container">
			<image mode="widthFix" :src="sharePath" class="share-image" @tap.stop="empty"></image>
			<view class="save-btn" :style="theme.btn" @tap="savePhoto">保存</view>
		</view>
	</scroll-view>
</view>
</template>

<script>
import painter from "../painter/painter";

export default {
  data() {
    return {
      theme: uni.$theme,
      imgDraw: {},
      //绘制图片的大对象
      sharePath: '',
      //生成的分享图
      visible: false,
      goodsId: '',
      // 画布大小
      ctx_W: 668,
      ctx_h: 0,
      posetsImgsUrl: ""
    };
  },

  components: {
    painter
  },
  props: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      default: false
    },
    canvasParam: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    isCanDraw: function (newVal, oldVal) {
      newVal && this.initData();
    }
  },
  methods: {
    /**
     * 初始化canvas 所需信息
     * */
    initData() {
      var self = this; // 计算海报比例

      uni.getImageInfo({
        src: this.canvasParam.pictureUrl,

        complete(res) {
          // console.log('海报', res)
          // 计算 主图宽高
          if (res.height && res.width) {
            let dHeight = self.ctx_W * res.height / res.width;
            self.setData({
              ctx_h: dHeight < self.ctx_W ? dHeight : self.ctx_W
            }); // 上传参数，获取id

            self.getQrCodeData();
          }
        }

      });
    },

    /**
     * 关闭海报显示
     * */
    handleClose() {
      this.$emit('closePosters');
      this.setData({
        isCanDraw: false,
        visible: false
      });
    },

    /**
     * 显示海报
     * */
    drawPic() {
      uni.showLoading({
        title: '正在绘制'
      });
      var img_H = this.ctx_h;
      var canTotal_H = img_H + 380 + 70; // 最后一个组件的 top + 组件高度和底部间距

      var views = [{
        type: 'image',
        url: this.canvasParam.pictureUrl,
        css: {
          top: '0rpx',
          left: '0rpx',
          width: '668rpx',
          height: `${img_H}rpx`
        }
      }, {
        type: 'text',
        text: this.canvasParam.goodsName,
        css: {
          top: `${img_H + 20}rpx`,
          left: '38rpx',
          maxLines: '1',
          width: '440rpx',
          fontSize: '28rpx',
          color: '#000000',
          fontWeight: 'bold'
        }
      }, {
        type: 'text',
        text: this.canvasParam.secondName,
        css: {
          top: `${img_H + 72}rpx`,
          left: '38rpx',
          maxLines: '2',
          width: '440rpx',
          fontSize: '24rpx',
          color: '#D1A779'
        }
      }, {
        type: 'rect',
        css: {
          top: `${img_H + 30}rpx`,
          left: '491rpx',
          height: '68rpx',
          width: '1rpx',
          color: '#D8D8D8'
        }
      }, {
        type: 'text',
        text: `￥` + this.canvasParam.priceMoney,
        css: {
          top: `${img_H + 20}rpx`,
          left: '498rpx',
          width: '130rpx',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '38rpx',
          color: '#FF595F'
        }
      }, {
        type: 'image',
        url: this.posetsImgsUrl,
        css: {
          top: `${img_H + 160}rpx`,
          left: '245rpx',
          width: '180rpx',
          height: '180rpx'
        }
      }, {
        type: 'image',
        url: "/static/images/order/Frame.png",
        css: {
          top: `${img_H + 150}rpx`,
          left: '235rpx',
          width: '200rpx',
          height: '200rpx'
        }
      }, {
        type: 'text',
        text: `长按或扫描查看`,
        css: {
          top: `${img_H + 380}rpx`,
          left: '0rpx',
          width: '668rpx',
          textAlign: 'center',
          fontSize: '24rpx',
          color: '#282828'
        }
      }]; // 是否显示指导价格

      if (this.canvasParam.guidancePrice && this.canvasParam.showWorthToMember) {
        views.push({
          type: 'text',
          text: `￥` + this.canvasParam.guidancePrice,
          css: {
            top: `${img_H + 70}rpx`,
            left: '498rpx',
            width: '130rpx',
            textAlign: 'center',
            fontSize: '24rpx',
            color: '#BFBFBF',
            textDecoration: 'line-through'
          }
        });
      }

      this.setData({
        imgDraw: {
          width: '668rpx',
          height: `${canTotal_H}rpx`,
          background: '#fff',
          views: views
        }
      });
    },

    /**
     * 海报回调
     * */
    onImgErr(e) {
      uni.hideLoading();
      uni.showToast({
        title: '生成分享图失败，请刷新页面重试'
      });
    },

    onImgOK(e) {
      uni.hideLoading();
      this.setData({
        sharePath: e.detail.path,
        visible: true
      }); //通知外部绘制完成，重置isCanDraw为false
      // this.triggerEvent('initData')
    },

    /**
     * 保存图片
     * */
    savePhoto() {
      var path = this.sharePath;
      if (!path) return;
      uni.showLoading({
        title: '正在保存...',
        mask: true
      });
      uni.saveImageToPhotosAlbum({
        filePath: path,
        success: res => {
          uni.showToast({
            title: '已保存到相册',
            icon: 'none'
          });
          this.handleClose();
        },
        fail: res => {
          uni.getSetting({
            success: res => {
              let authSetting = res.authSetting;

              if (!authSetting['scope.writePhotosAlbum']) {
                uni.showModal({
                  title: '提示',
                  content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',

                  success(res) {
                    if (res.confirm) {
                      uni.openSetting();
                    }
                  }

                });
              }
            }
          });
          setTimeout(() => {
            uni.hideLoading();
            this.setData({
              visible: false
            });
          }, 300);
        }
      });
    },

    /**
     * 获取二维码 &userOrgId:${wx.$localStorage.getItem('userOrgId')}
     * */
    getQrCodeData() {
      let id = this.canvasParam.id;
      if (!id) return;
      let param = {
        goodsId: id,
        memberId: uni.$localStorage.getItem('memberId'),
        userOrgId: uni.$localStorage.getItem('userOrgId')
      };
      uni.$api.apiRequest('addGoodsSharePram',{
        parameter: JSON.stringify(param)
      }).then(res => {
        if (res.code == 10000) {
          let scene = `${res.data || ''}_${uni.$localStorage.getItem('userOrgId')}_share`;
          let u = uni.$api.getWXQrcodeData() + '?' + encodeURIComponent('scene') + '=' + encodeURIComponent(scene) + '&' + encodeURIComponent('page') + '=' + encodeURIComponent("pages/goodsDetail/goodsDetail") + '&' + encodeURIComponent('orgId') + '=' + encodeURIComponent(uni.$localStorage.getItem('orgId')); // 商品 图片

          var that = this;
          uni.$canvas.getCloudPath(u).then(path => {
            that.setData({
              posetsImgsUrl: path
            });
            this.drawPic();
          });
        }
      });
    },

    empty() {
      console.log('点击了海报');
    }

  }
};
</script>
<style>
@import "./canvasPainter.css";
</style>