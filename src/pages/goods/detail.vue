<template>
  <view class="app-goods-detail">
    <navBar
      background="transparent"
      ext-class="fixed-bar"
      :home-btn="true"
    ></navBar>
    <u-swiper
      v-if="pics.length"
      height="750"
      border-radius="0"
      :list="pics"
      @click="onSwiperTap"
      :interval="10000"
      mode="number"
      indicator-pos="bottomRight"
    ></u-swiper>
    <view class="main-card">
      <view class="main-card__hd">
        <!-- <view class="main-card__hd--left">
            {{
              curSku.skuId
                ? curSku.price
                : '￥' +
                  detail.goodsBaseInfo.priceMoney +
                  ' + ' +
                  detail.goodsBaseInfo.pricePoint
            }}
            积分
            <text class="origin"
              >{{ detail.goodsBaseInfo.originalPrice }} 
            </text>
          </view> -->
        <view class="main-card__hd--left">
          <!-- {{
              curSku.skuId
                ? '￥' + 
                  curSku.price + 
                  '+' + 
                  curSku.point
                : '￥' +
                  detail.goodsBaseInfo.priceMoney +
                  ' + ' +
                  detail.goodsBaseInfo.pricePoint
            }}
            积分 -->
          <view style="display:inline-block" v-if="curSku.skuId">
            <text v-if="curSku.price">¥ {{ curSku.price }} </text>
            <text v-if="curSku.price && curSku.point"> + </text>
            <text v-if="curSku.point"> {{ curSku.point }} 积分</text>
          </view>
          <view style="display:inline-block" v-if="!curSku.skuId">
            <text v-if="isShowPrice">
             {{priceMoney}}
            </text>
            <text
              v-if="
                isShowPrice &&
                  isShowPoint && (priceMoney!==pricePoint)
              "
              style="margin:0 3px;"
              >{{detail.goodsBaseInfo.goodsType == 1?'-':'+'}}</text
            >
            <text v-if="isShowPoint && (priceMoney!==pricePoint)">
              {{pricePoint}}
              </text>
          </view>
          <text
            class="origin"
            v-if="
              detail.goodsBaseInfo.showWorthToMember &&
                detail.goodsBaseInfo.goodsType == 1 &&
                (curSku.prePrice || detail.goodsBaseInfo.prePrice)
            "
          >
            ¥{{
              curSku.skuId ? curSku.prePrice : detail.goodsBaseInfo.prePrice
            }}
          </text>
        </view>
        <view class="main-card__hd--right"
          >总销量 {{ detail.goodsBaseInfo.exchangeNum }} 件</view
        >
      </view>
      <view class="main-card__bd" style="width:100%;position:relative;">
        <view
          class="main-card__bd--left"
          style="width: calc(100% - 52px);float:left;"
          >{{ detail.goodsBaseInfo.goodsName || '--' }}</view
        >
        <view
          style="width:54px;position:absolute;right:0;top:10px;"
          class="main-card__bd--right"
          @tap="showShareList"
        >
          <image
            mode="widthFix"
            class="icon"
            src="/static/images/store/goods/share.png"
            >分享</image
          >
        </view>
      </view>
      <view v-if="detail.goodsBaseInfo.secondName" class="main-card__ft">
        {{ detail.goodsBaseInfo.secondName || '--' }}
      </view>
    </view>
    <u-cell-group style="margin-bottom: 20rpx;">
      <u-cell-item
        :title="formatSku(curSku)"
        v-if="detail.goodsBaseInfo.showStockToMember"
        :value="
          '库存: ' + (curSku.skuId ? curSku.count : detail.totalStockCount || 0)
        "
        arrow
        @tap="showModal"
      >
        <view slot="icon" style="color: #7F7F7F;margin-right: 28rpx;"
          >规格</view
        >
        <!-- <view slot="right-icon"></view> -->
      </u-cell-item>
      <u-cell-item
        :title="formatSku(curSku)"
        v-if="!detail.goodsBaseInfo.showStockToMember"
        arrow
        @tap="showModal"
      >
        <view slot="icon" style="color: #7F7F7F;margin-right: 28rpx;"
          >规格</view
        >
      </u-cell-item>
      <!-- <u-cell-item
          :title="curSku.spec"
          v-if="!detail.goodsBaseInfo.showStockToMember"
          arrow
          @tap="showModal"
        >
          <view slot="icon" style="color: #7F7F7F;margin-right: 28rpx;"
            >规格</view
          >
        </u-cell-item> -->
      <view style="margin-bottom: 10px;">
        <u-cell-item v-if="detail.goodsBaseInfo.goodsType !== 2" :title="carriage" :arrow="false" :border-bottom="false">
          <view slot="icon" style="color: #7F7F7F;margin-right: 28rpx;"
            >运费</view
          >
          <view slot="right-icon" v-show="getShow()">支持线下自提</view>
        </u-cell-item>
      </view>
    </u-cell-group>
    <app-shop-bar-full
      :isMallFlag="isMallFlag"
      v-if="detail.storeBaseInfo"
      :info="detail.storeBaseInfo"
      @barTap="onShopBarTap"
    ></app-shop-bar-full>
    <u-tabs
      :bold="false"
      :list="tabs"
      :is-scroll="false"
      active-color="#FE5D4D"
      :current="curTabIndex"
      @change="onTabChange"
    ></u-tabs>

    <!-- 商品介绍 -->
    <view v-if="curTabIndex === 0" class="card-intro">
      <u-parse :html="detail.goodsBaseInfo.goodsDesc"></u-parse>
    </view>
    <!-- 购买说明 -->
    <view v-if="curTabIndex === 1" class="card-intro">
      <u-parse :html="detail.goodsBaseInfo.exchangeDescription"></u-parse>
    </view>

    <app-buy-bar
      :num="cartGoodsNumber"
      @shop="onTapShop"
      @buy="onBuy"
      @cart="onCartTap"
      @cart-add="onCartAdd"
    ></app-buy-bar>

    <u-popup v-model="visible" mode="bottom" border-radius="14" closeable>
      <!-- <scroll-view scroll-y="true" style="height: 920rpx;"> </scroll-view> -->
      <view class="popup__content">
        <view class="popup__content__bd">
          <app-sku-goods-card
            :card="detail"
            :current="curSku"
            :buy-num="buyGoodsNumber"
            ref="appSkuGoodsCard"
          >
          </app-sku-goods-card>
          <scroll-view scroll-y="true" style="height: 400rpx;">
          <view class="sku__wrap">
            <view class="sku" v-for="spec in skuData.specMainList" :key="spec.mainId">
              <view class="sku__title">{{ spec.mainValue}}：</view>
              <view class="sku__bd">
                <view
                  v-for="sku in spec.children"
                  :key="sku.detailId"
                  :class="
                    curSkuMap[spec.mainId] && sku.detailId === curSkuMap[spec.mainId].detailId
                      ? 'sku__bd--tag checked'
                      : 'sku__bd--tag'
                  "
                  @tap="onSkuTap(sku, spec)"
                  >{{ sku.detailValue || '张' }}</view
                >
              </view>
            </view>
            <view class="sku">
              <view class="sku__title">数量：</view>
              <view class="sku__bd">
                <u-number-box
                  v-model="buyGoodsNumber"
                  :min="1"
                  :max="
                    curSku.count === undefined
                      ? detail.totalStockCount
                      : curSku.count
                  "
                ></u-number-box>
                <view style="margin-left: 20rpx;color: #999;font-size: 24rpx;"
                  >库存剩余：{{ stockNum }} 件</view
                >
              </view>
            </view>
          </view>
          </scroll-view>
        </view>
        <view>
          <button
            class="btn__confirm"
            hover-class="btn__confirm--hover"
            @tap="onSkuConfirm"
          >
            确定
          </button>
        </view>
      </view>
    </u-popup>

    <app-share
      :visible="showShare"
      @change="onActionTap"
      @cancel="showShare = false"
    ></app-share>

    <!-- <u-action-sheet
        border-radius="16"
        :list="shareList"
        v-model="showShare"
        @tap="onActionListTap"
      ></u-action-sheet> -->
    <canvas
      style="width: 420px; height:336px;position: absolute;top: -20000px"
      canvas-id="shareFriendsCanvas"
      id="shareFriendsCanvas"
    ></canvas>
    <!-- <image :src="shareFriendImg" style="width: 100%"></image> -->
    <canvas
      style="width: 460px; height:820px;position: absolute;top: -20000px"
      canvas-id="shareCanvas"
      id="shareCanvas"
    ></canvas>
    <!-- <canvas
        style="width: 460px; height:740px;"
        canvas-id="shareCanvas"
        id="shareCanvas"
      ></canvas> -->
    <u-popup v-model="sharePopup" mode="center" border-radius="8">
      <view class="share-popup-content">
        <image
          mode="widthFix"
          class="share-img"
          style="width: 460rpx;"
          :src="shareImg"
        ></image>
        <button
          class="btn__save"
          hover-class="btn__save--hover"
          @tap="saveToAblum"
        >
          保存至相册 再分享
        </button>
      </view>
    </u-popup>
  </view>
</template>

<script>
import AppShopBarFull from '@/pageComponents/ht-app/bars/shop-bar-full.vue';
import AppBuyBar from '@/pageComponents/ht-app/bars/buy-bar.vue';
import AppSkuGoodsCard from '@/pageComponents/ht-app/cards/sku-goods-card.vue';
import AppShare from '@/pageComponents/ht-app/actionsheet/actionsheet-share.vue';
import { drawShareImg, drawShareFriendsImg } from './share';
import { setScene, fetchScene } from '@/utils/sceneManage';


import { adaptSkuList, adaptGoodsDetail, adaptStoreBaseInfo } from '@/utils/adaptors/shop.js';

export default {
  name: 'app-goods-detail',
  components: { AppShopBarFull, AppSkuGoodsCard, AppBuyBar, AppShare },
  props: {
    tabs: {
      type: Array,
      default() {
        return [
          {
            name: '商品介绍',
          },

          {
            name: '购买说明',
          },
        ];
      },
    },
  },
  data() {
    return {
      query: {}, // url的query string
      shareList: [
        {
          text: '发送给朋友',
        },
        {
          text: '分享到朋友圈',
        },
      ],
      showShare: false,
      shareImg: '',
      sharePopup: false,
      visible: false,
      continueMethod: '', // 用来记录需要继续执行的类型，'' 不执行 onCartAdd 添加购物车  onBuy 立即购买
      curTabIndex: 0,
      pics: ['/static/images/picNotData.png'],

      detail: {
        goodsBaseInfo: {},
        storeBaseInfo: {},
        imgUrlList: [],
      },
      isMallFlag: false,
      skuData: {
        skuInfoList: [],
        specMainList: [],
      },

      curSkuMap: {}, // 保存选择规格后的所有规格数据

      curSku: {}, // 保存匹配到的sku

      cartGoodsNumber: 0,
      buyGoodsNumber: 1,
      shareFriendImg: '',
    };
  },
  computed: {
    stockNum() {
      if (this.curSku.skuId) {
        return this.curSku.count;
      }
      return this.detail.totalStockCount;
    },
    carriage() {
      switch (this.detail.goodsBaseInfo.freightSettings) {
        case 1:
          return '快递物流：' + this.detail.goodsBaseInfo.freightSettingsData + ' 元';
        case 3:
          return '快递物流：' + '包邮';

        default:
          return '快递物流：' + '按距离计费';
      }
    },
    isShowPrice () {
      if (this.detail.priceInfo) {
        if (this.detail.priceInfo.priceNow || this.detail.priceInfo.priceNowSkuMin || this.detail.priceInfo.pointNowSkuMin) {
          return true
        }
        return false
      }
      return false
    },
    // 最小售价+积分
    priceMoney () {
      if (this.detail.baseInfo&&this.detail.baseInfo.type==2) {
        // 服务商品
        return '¥' + this.detail.priceInfo&&this.detail.priceInfo.priceNow || 0
      } else {
        if (this.detail.priceInfo&&(this.detail.priceInfo.priceNowSkuMin&&this.detail.priceInfo.pointNowSkuMin)) {
            return '¥' + this.detail.priceInfo.priceNowSkuMin + '+' + this.detail.priceInfo.pointNowSkuMin + '积分'
        } else if (this.detail.priceInfo&&(this.detail.priceInfo.priceNowSkuMin&&!this.detail.priceInfo.pointNowSkuMin)){
          return '¥' + this.detail.priceInfo.priceNowSkuMin
        } else {
          return this.detail.priceInfo&&this.detail.priceInfo.pointNowSkuMin + '积分'
        }
      }
    },
    isShowPoint () {
      if (this.detail.priceInfo) {
        if (this.detail.priceInfo.pointNow || this.detail.priceInfo.priceNowSkuMax || this.detail.priceInfo.pointNowSkuMax) {
          return true
        }
        return false
      }
      return false
    },
    // 最大售价+积分
    pricePoint () {
      if (this.detail.baseInfo&&this.detail.baseInfo.type==2) {
        // 服务商品
        return this.detail.priceInfo&&this.detail.priceInfo.pointNow + '积分'
      } else {
        if (this.detail.priceInfo&&(this.detail.priceInfo.priceNowSkuMax&&this.detail.priceInfo.pointNowSkuMax)) {
            return '¥' + this.detail.priceInfo.priceNowSkuMax + '+' + this.detail.priceInfo.pointNowSkuMax + '积分'
        } else if (this.detail.priceInfo&&(this.detail.priceInfo.priceNowSkuMax&&!this.detail.priceInfo.pointNowSkuMax)){
          return '¥' + this.detail.priceInfo.priceNowSkuMax
        } else {
          return this.detail.priceInfo&&this.detail.priceInfo.pointNowSkuMax + '积分'
        }
      }
    }
  },
  onLoad(options) {
    setScene(options);
    this.query = options;

    this.init();
  },
  onShareAppMessage() {
    const userInfo = uni.$localStorage.getItem('wxUserInfo');
    const nickName = userInfo ? userInfo.nickName : '--';
    const params = {
      title:
        `【${nickName}@我】快来看看 ` + this.detail.goodsBaseInfo.goodsName ||
        '--',
      path: `/pages/goods/detail?id=${this.query.id}`,
      imageUrl:
        this.shareFriendImg ||
        (this.detail.imgUrlList && this.detail.imgUrlList[0]),
    };
    return params;
  },
  methods: {
    formatSku(sku) {
      if (sku.skuId) {
        if (!sku.spec || !sku.spec) return '张';
        return sku.spec.map((it) => it.detailValue).join(',');
      }
      return '请选规格';
    },

    init() {
      this.fetchDetail();
      this.getCartNumbers();
    },
    async fetchDetail() {
      let params = {};
      console.log('---马上进入扫描二维码场景---');
      await fetchScene(async ({ sceneObj }) => {
        try {
          const sceneRes = await uni.$api.apiRequest('getGoodsSharePram', {
            id: sceneObj.paramsId,
          });
          if (sceneRes.code === 10000 && sceneRes.data) {
            const sceneParams = JSON.parse(sceneRes.data);
            this.query.id = sceneParams.goodsId;
          }
          console.log(sceneRes);
          console.log(getApp());
        } catch (error) {
          console.error(error);
        } finally {
          return true; // 标识场景结束
        }
      });
      console.log('---扫描二维码场景处理结束---');
      params = {
        id: this.query.id,
      };
      const res = await uni.$api.apiRequest('__v2__fetchStoreGoodsDetail', params);
      if (res.code === 10000 && res.data) {
        
        this.detail = adaptGoodsDetail(res.data);

        this.pics = res.data.imgUrlList.length
          ? res.data.imgUrlList
          : ['/static/images/picNotData.png'];
          
        // 查询店铺信息
        this.fetchShopDetail({id: this.detail.orgInfo.orgId})
        this.fetchSkus(params, this.detail.goodsBaseInfo.goodsType)

      }


      // 获取skus

      drawShareFriendsImg(
        'shareFriendsCanvas',
        {
          dpr: 2,
          imgUrl: this.pics[0],
          bgUrl:
            'https://eos-wuxi-1.cmecloud.cn/crmoss/f7c462e9-3ce2-4dd7-a512-bf294567d099.png',
          price:
          this.isShowPrice&&this.isShowPoint && (this.priceMoney!==this.pricePoint)?
          this.detail.goodsBaseInfo.goodsType == 1?this.priceMoney + '-' + this.pricePoint : this.priceMoney + '+' + this.pricePoint
          :this.isShowPrice&&!this.isShowPoint?
          this.priceMoney:this.pricePoint,
            // this.detail.goodsBaseInfo.priceMoney &&
            // this.detail.goodsBaseInfo.pricePoint
            //   ? '￥' +
            //     this.detail.goodsBaseInfo.priceMoney +
            //     '-' +
            //     this.detail.goodsBaseInfo.pricePoint +
            //     '积分'
            //   : this.detail.goodsBaseInfo.priceMoney
            //   ? '￥' + this.detail.goodsBaseInfo.priceMoney
            //   : this.detail.goodsBaseInfo.pricePoint + '积分',
          originPrice:
            this.detail.goodsBaseInfo.showWorthToMember &&
            this.detail.goodsBaseInfo.prePrice &&
            this.detail.goodsBaseInfo.goodsType == 1
              ? this.detail.goodsBaseInfo.prePrice + ' 元'
              : false,
        },
        (url) => {
          this.shareFriendImg = url;
        }
      );
    },

    /**
     * 查询店铺信息
     */
    async fetchShopDetail(params = {}){

      const res = await uni.$api.apiRequest('__v2__fetchStoreBaseInfo', {
        id: params.id,
        needParentInfo: true,
        needBrandCount: true,
        needSaleSpuCount: true,
      });

      if (res.code !== 10000 && !res.data) return;
      this.detail.storeBaseInfo = adaptStoreBaseInfo(res.data);

       this.isMallFlag = this.detail.storeBaseInfo.isDirect; // true 为直营店铺 false为普通店铺
    },
    
    /**
     * 获取所有规格数据
     */
    async fetchSkus(params, type){
      // 如果是优惠券，则规格前端写死
      if(type === 2){
        this.skuData = {
          "skuInfoList": adaptSkuList([
            {
              "codeBar":"3453453443535",
              "pointNow": this.detail.goodsBaseInfo.pricePoint,
              "priceNow": this.detail.goodsBaseInfo.priceMoney,
              "pricePre": this.detail.goodsBaseInfo.prePrice,
              "saleId": this.query.id,
              "skuId": this.query.id,
              "specDetailList":[
                {
                  "detailId":"detailId",
                  "detailValue":"张",
                  "mainId":"mainId",
                  "mainValue":"规格"
                }
              ],
              "stockCountSale":this.detail.stockInfo.countSale,
              "stockCountUsable":340,
              "totalSaleCount":0
            },
          ]),
          "specMainList":[
            {
              "children":[
                {
                  "createTime":1610176272203,
                  "detailId":"detailId",
                  "detailValue":"张"
                }
              ],
              "createTime":1610176272203,
              "mainId":"mainId",
              "mainValue":"规格"
            }
          ]
        }
        return;
      }

      const res = await uni.$api.apiRequest('__v2__fetchStoreGoodsSkus', params);
      if (res.code === 10000 && res.data) {
        this.skuData = {
          ...res.data,
          skuInfoList: adaptSkuList(res.data.skuInfoList || []),
        }
      }
    },

    /**
     * 获取 购物车数量
     */
    getCartNumbers(isShoeText) {
      if (uni.$localStorage.getItem('Token')) {
        uni.$api.apiRequest('getCartGoddsCount').then((res) => {
          if (res.code == 10000) {
            this.cartGoodsNumber = res.data;
          }
        });
      }
    },
    getShow() {
      let paymentMethod = this.detail.goodsBaseInfo.paymentMethod;
      if (paymentMethod) {
        return String(paymentMethod).indexOf('2') >= 0;
      }
      return false;
    },
    onTabChange(index) {
      this.curTabIndex = index;
    },
    showModal() {
      this.visible = true;
      this.$nextTick(()=>{
        this.$refs.appSkuGoodsCard.detail = this.detail
      })
    },
    showShareList() {
      this.showShare = true;
    },
    /**
     * 获取二维码 &userOrgId:${wx.$localStorage.getItem('userOrgId')}
     * */
    async getQrCodeData() {
      let id = this.query.id;
      if (!id) return;
      let param = {
        goodsId: id,
        memberId: uni.$localStorage.getItem('memberId'),
        userOrgId: uni.$localStorage.getItem('orgId'),
      };
      const res = await uni.$api.apiRequest('addGoodsSharePram', {
        parameter: JSON.stringify(param),
      });
      if (res.code == 10000) {
        let scene = `${res.data || ''}_${uni.$localStorage.getItem(
          'orgId'
        )}_share`;
        let u =
          uni.$api.getWXQrcodeData() +
          '?' +
          encodeURIComponent('scene') +
          '=' +
          encodeURIComponent(scene) +
          '&' +
          encodeURIComponent('page') +
          '=' +
          encodeURIComponent('pages/goods/detail') +
          '&' +
          encodeURIComponent('orgId') +
          '=' +
          encodeURIComponent(uni.$localStorage.getItem('orgId')); // 商品 图片
        console.log(u);
        return u;
      }
    },
    async onActionTap(item) {
      const userInfo = uni.$localStorage.getItem('wxUserInfo');
      const nickName = userInfo ? userInfo.nickName : '--';
      switch (item.index) {
        case 0:
          break;
        case 1:
          const qrCodeUrl = await this.getQrCodeData();
          if (!qrCodeUrl) {
            uni.showToast({
              title: '二维码生成失败',
              icon: 'none',
            });
            return;
          }

          drawShareImg(
            'shareCanvas',
            {
              dpr: 2,
              imgUrl: this.pics[0],
              qrCodeUrl,
              title: `【${nickName}@我】快来看看`,
              name: this.detail.goodsBaseInfo.goodsName || '--',
              price:
              this.isShowPrice&&this.isShowPoint && (this.priceMoney!==this.pricePoint)?
              this.detail.goodsBaseInfo.goodsType == 1?this.priceMoney + '-' + this.pricePoint : this.priceMoney + '+' + this.pricePoint
              :this.isShowPrice&&!this.isShowPoint?
              this.priceMoney:this.pricePoint,
                // this.detail.goodsBaseInfo.priceMoney &&
                // this.detail.goodsBaseInfo.pricePoint
                //   ? '￥' +
                //     this.detail.goodsBaseInfo.priceMoney +
                //     '-' +
                //     this.detail.goodsBaseInfo.pricePoint +
                //     '积分'
                //   : this.detail.goodsBaseInfo.priceMoney
                //   ? '￥' + this.detail.goodsBaseInfo.priceMoney
                //   : this.detail.goodsBaseInfo.pricePoint + '积分',
              originPrice:
                this.detail.goodsBaseInfo.showWorthToMember &&
                this.detail.goodsBaseInfo.prePrice &&
                this.detail.goodsBaseInfo.goodsType == 1
                  ? this.detail.goodsBaseInfo.prePrice + ' 元'
                  : false,
              tip: '长按屏幕识别小程序码进入小程序',
            },
            (url) => {
              this.shareImg = url;
              this.sharePopup = true;
            }
          );
          break;

        default:
          break;
      }
    },
    saveToAblum() {
      uni.saveImageToPhotosAlbum({
        filePath: this.shareImg,
        success: () => {
          uni.showToast({
            title: '保存成功',
          });
          this.sharePopup = false;
        },
        fail: (err) => {
          console.error(err);
          uni.showToast({
            title: '保存失败',
          });
        },
      });
    },

    onSkuTap(sku, spec) {
      // console.log(sku, spec)

      // 取消选中
      if( this.curSkuMap[spec.mainId] && this.curSkuMap[spec.mainId] === sku){
        delete this.curSkuMap[spec.mainId]
      }else {
        this.curSkuMap[spec.mainId] = sku
      }
      this.curSku = this.matchSku(this.curSkuMap);
      console.log('---', this.curSku)

      // console.log('onSkuTap', this.curSku.count, this.buyGoodsNumber);
      // 保证商品购买数理取值不超过库存
      // if (sku.count < this.buyGoodsNumber) {
      //   this.buyGoodsNumber = sku.count;
      // }
      this.buyGoodsNumber = this.curSku.count ? 1 : 0;
    },

    /**
     * 匹配sku
     */
    matchSku(curSkuMap = {}){
      // 如果规格没全选，数据肯定匹配不上，直接返回空对象
      if(this.skuData.specMainList.length > Object.keys(curSkuMap).length){
        return {}
      }

      const skuList = this.skuData.skuInfoList;
      let isMatch = false
      for(let i = 0 ; i < skuList.length; i++){
        const curSpecList = skuList[i].specDetailList
        isMatch = curSpecList.every(item=>{
          return curSkuMap[item.mainId].detailId == item.detailId
        })
        if(isMatch){
          return skuList[i]
        } else {
          // uni.showToast({
          //   title: '当前规格信息不匹配，请重新选择',
          //   icon: 'none',
          // });
        }
      }
      if (!isMatch) {
        uni.showToast({
            title: '当前规格信息不匹配，请重新选择',
            icon: 'none',
          });
      }

      return {}
    },

    onSkuConfirm() {
      this.visible = false;
      if (this.continueMethod && this[this.continueMethod]) {
        this[this.continueMethod]();
        this.continueMethod = ''; // 重置为空
      }
    },

    onSwiperTap(index) {
      uni.previewImage({
        urls: this.pics,
        current: index,
      });
    },

    onShopBarTap(item) {
      const pages = getCurrentPages();
      const url = 'pagesA/shop/home';
      if (pages[pages.length - 1].route === url) {
        uni.navigateBack();
      } else {
        if(item.isDirect){
          uni.navigateTo({
            url: `/pagesA/shop/all-goods?shopId=${item.shopId}`,
          });
          return
        }
        uni.navigateTo({
          url: `/${url}?shopId=${item.id}`,
        });
      }
    },
    onTapShop() {
      this.onShopBarTap(this.detail.storeBaseInfo);
    },
    onCartTap() {
      uni.switchTab({
        url: '/pages/cart/cart',
      });
    },
    async onCartAdd() {
      if (!uni.$localStorage.getItem('Token')) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      if (!this.curSku.skuId) {
        uni.showToast({
          icon: 'none',
          title: '先选择规格',
        });
        this.continueMethod = 'onCartAdd';
        this.visible = true;
        return;
      }
      if (this.curSku.count < this.buyGoodsNumber || this.curSku.count <= 0) {
        uni.showToast({
          icon: 'none',
          title: '库存不足，请选择其它商品',
        });
        return;
      }
      uni.$util.currentClockin(); // 点亮
      const res = await uni.$api.apiRequest('carGoodsNum', {
        goodsId: this.detail.goodsBaseInfo.id,
        goodsNum: this.buyGoodsNumber,
        goodsSkuId: this.curSku.skuId,
        orgId: this.detail.storeBaseInfo.id,
      });
      if (res.code == 10000) {
        // 更新购物车数量
        this.getCartNumbers();
        // TODO
        // setTimeout(() => {
        //         // 埋点
        //         uni.$sampling.sampling('ADD_SHOPCART', self.cartObj.id, self.route);
        // }, 2000);
      }
    },
    onBuy() {
      if (!uni.$localStorage.getItem('Token')) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        });
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      if (!this.curSku.skuId) {
        uni.showToast({
          icon: 'none',
          title: '先选择规格',
        });
        this.visible = true;
        this.continueMethod = 'onBuy';
        return;
      }
      if (this.curSku.count < this.buyGoodsNumber || this.curSku.count <= 0) {
        uni.showToast({
          icon: 'none',
          title: '库存不足，请选择其它商品',
        });
        return;
      }
      let arr = [
        {
          orgId: this.detail.storeBaseInfo.id,
          goodsList: {
            goodsId: this.detail.goodsBaseInfo.id,
            num: this.buyGoodsNumber,
            goodsSkuId: this.curSku.skuId,
          },
        },
      ];

      uni.$api.apiRequest('cartSettlementApply', arr).then((res) => {
        if (res.code == 10000) {
          let arr = res.data.map((item) => {
            return {
              settlementId: item,
            };
          });
          uni.navigateTo({
            url: `/pages/settlement/settlement?settlementId=${JSON.stringify(
              arr
            )}`,
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.app-goods-detail {
  background-color: #f9f9f9;
  overflow-x: hidden;
  .main-card {
    margin-bottom: 20rpx;
    padding: 36rpx 40rpx;
    background-color: #fff;
    &__hd {
      padding: 10rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &--left {
        font-size: 48rpx;
        color: #ff4c4c;
        font-weight: bold;
        .origin {
          margin-left: 10rpx;
          font-size: 24rpx;
          text-decoration: line-through;
          color: #929497;
          font-weight: normal;
        }
      }
      &--right {
        font-size: 24rpx;
        color: #929497;
      }
    }
    &__bd {
      padding: 20rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &--left {
        font-size: 36rpx;
        color: #2e2e2e;
        font-weight: bold;
      }
      &--right {
        display: flex;
        align-items: center;
        height: 48rpx;
        color: #fe5d4d;
        .icon {
          width: 28rpx;
          margin-right: 10rpx;
        }
      }
    }
    &__ft {
      color: #929497;
    }
  }

  .popup__content {
    display: flex;
    flex-direction: column;
    // max-height: 1300rpx;
    &__bd {
      flex: 1;
      overflow-y: auto;
      .sku__wrap {
        width: 100%;
        height: auto;
        padding: 0 40rpx 40rpx;
        .sku {
          &__title {
            margin-bottom: 10rpx;
            font-size: 28rpx;
            color: #7f7f7f;
          }
          &__bd {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding: 16rpx 0;
            &--tag {
              margin: 0 20rpx 20rpx 0;
              padding: 20rpx 24rpx;
              color: #757575;
              background-color: #f4f4f4;
              border-radius: 12rpx;
              &.checked {
                color: #fe5d4d;
                background-color: #ffebe9;
                border: 1px solid #fe5d4d;
              }
            }
          }
        }
      }
    }

    .btn__confirm {
      margin: 0 40rpx 40rpx;
      color: #fff;
      background-color: #fe5d4d;
      border-radius: 8rpx;
      font-size: 28rpx;
      height: 92rpx;
      line-height: 92rpx;
      &--hover {
        opacity: 0.8;
      }
    }
  }

  .share-popup-content {
    background-color: rgb(102, 102, 102);
  }

  .share-img {
    border-radius: 16rpx;
  }

  .btn__save {
    margin: 30rpx 0 0;
    color: #fff;
    background-color: #fe5d4d;
    font-size: 28rpx;
    line-height: 92rpx;
    border-radius: 8rpx;

    &--hover {
      opacity: 0.8;
    }
  }

  .card-intro {
    background-color: #fff;
    padding: 40rpx;
  }
}
</style>
