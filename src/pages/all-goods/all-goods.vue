<template>
  <view class="all-goods-page">
    <navBar title="发现更多好物" background="#fff"></navBar>
    <view class="view">
      <view class="backgroundview" v-if="sidebar.length > 0">
        <!-- 侧边栏 -->
        <view class="u-menu-wrap">
          <scroll-view
            scroll-y
            scroll-with-animation
            class="u-tab-view menu-scroll-view"
            :scroll-top="scrollTop"
            :scroll-into-view="itemId"
          >
            <view
              v-for="(item, index) in sidebar"
              :key="index"
              v-ishow="item.isDisplay == 1"
              class="u-tab-item left-swiper-item"
              :class="[current == index ? 'u-tab-item-active' : '']"
              @tap.stop="swichMenu(index)"
            >
              <view class="u-line-1">{{ item.sortName }}</view>
            </view>
          </scroll-view>
          <!-- 本来这两个scrollView 是联动的，需求并不需要联动，就做了改动 -->
          <!-- 联动方法 @scroll="rightScroll"   @scrolltoupper="scrolltoupper"-->
          <scroll-view
            :scroll-top="scrollRightTop"
            scroll-y
            scroll-with-animation
            class="right-box"
          >
            <view>
              <!-- 海報 -->
              <view
                style="padding:18rpx 16rpx; background-color: #fff;"
                v-if="sidebar[current].image"
                @click="jumpDetail(sidebar[current])"
              >
                <u-image
                  mode="aspectFill"
                  height="220rpx"
                  :src="sidebar[current].image"
                ></u-image>
              </view>
              <view
                class="class-item"
                :id="'item' + index"
                v-for="(item, index) in erListData"
                :key="index"
              >
                <view class="item-title">
                  <text>{{ item.sortName }}</text>
                </view>
                <view class="item-container">
                  <view
                    class="thumb-box"
                    v-for="(item1, index1) in item.recommendInfoList"
                    :key="index1"
                    @click="jumpDetail(item1)"
                  >
                    <u-image
                      mode="aspectFill"
                      width="67px"
                      height="67px"
                      style="margin:0 auto;"
                      :src="item1.image"
                    ></u-image>
                    <view
                      class="classificationItem-desc"
                      v-html="getGoodsName(item1.name)"
                    >
                      <!-- {{getGoodsName(item1.name)}} -->
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="notData flex-center-row" v-else>
        <image
          style="width:280rpx;height:280rpx;"
          src="../../static/images/picNotData.png"
        ></image>
        <view class="notDataText">暂无相关内容</view>
        <view class="notDataButton" @click="jumpHome">去首页看看吧</view>
      </view>
    </view>
    <!-- 下一页begin -->
    <view
      class="nextPage"
      @click="fetchNextCateGoods"
      :class="showNextBtn ? 'pageActive' : ''"
    >
      <!-- <view class="goodsName">点击跳到“{{sidebar[current+1].sortName}}”</view> -->
      <view class="goodsName" v-if="showNextBtn && current < sidebar.length - 1"
        >点击跳到“{{ sidebar[current + 1].sortName }}”</view
      >
      <u-icon
        name="arrow-right-double"
        :custom-style="customStyle"
        color="#545454"
        size="28"
      ></u-icon>
    </view>
    <!-- 下一页end -->
  </view>
</template>

<script>
import { adaptCategories, adaptSubCategories } from '@/utils/adaptors/shop.js';
// pages/all-goods/all-goods.js
const app = getApp();

export default {
  data() {
    return {
      // scroll 改造
      scrollTop: 0, //tab标题的滚动条位置
      oldScrollTop: 0,
      current: undefined, // 预设当前项的值
      itemId: '', // 栏目右边scroll-view用于滚动的id
      scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
      arr: [], // top高度缓存
      // 侧边栏
      sidebar: [],
      // 二级分类数据
      erListData: [],
      // 海报
      currentP: 0,
      customStyle: {
        transform: 'rotate(90deg)',
        width: '32px',
        height: '32px',
        lineHeight: '32px',
        textAlign: 'center',
        position: 'relative',
        top: '8px',
      },
      showNextBtn: false,
      directOrgId:null // 直营店铺组织id
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // console.log('监听页面初次渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  // 上拉加载上一分类
  async onPullDownRefresh() {
    if (!this.current || this.current == 0) return;
    this.current--;
    this.scrollRightTop = this.oldScrollTop;
    // this.$nextTick(function() {
    // this.getGoodsErData(this.sidebar[this.current].id);
    // this.leftMenuStatus(this.current);
    // });
    try {
      await this.getGoodsErData(this.sidebar[this.current].id);
      await this.leftMenuStatus(this.current);
    } catch (error) {
      console.error(error);
    } finally {
      uni.stopPullDownRefresh();
    }
  },
  onReachBottom: function() {
    this.showNextBtn = true;
    setTimeout(() => {
      this.showNextBtn = false;
    }, 2000);
  },
  methods: {
    async init () {
      await this.getOrgIdInfo()
      this.getAllGoodsData();
    },
    // 获取直营店铺组织id
    async getOrgIdInfo () {
      const {data=[]} = await uni.$api.apiRequest('fetchDepartmentList',
      {
        orgIds: [uni.$localStorage.getItem('orgId')],
        types: [10],
        shopTypes: [3],
        isSearch: true
      });
      if (data&&data.list.length) {
        this.directOrgId = data.list[0].orgId
      }
    },
    /**
     * 获取所有商品数据
     */
    getAllGoodsData(val) {
      // var self = this;
      // uni.$api.apiRequest('goodsClassification', {}).then((res) => {
      //   if (res.code == 10000 && res.data) {
      //     var sidebar = res.data.topCategoryList;

      //     self.sidebar = sidebar;
      //     if (!self.current || self.current >= sidebar.length) {
      //       self.current = 0;
      //     }
      //     if (sidebar.length > 0) {
      //       self.getGoodsErData(sidebar[self.current].id);
      //     }
      //   } else {
      //     self.setData({
      //       sidebar: [],
      //     });
      //   }
      // });
      // V2 mark
      this.v2_getAllGoodsData(val);
    },

    v2_getAllGoodsData(val) {
			const self = this;
      uni.$api
        .apiRequest('__v2__goodsClassification', {
          type: 2, // 2代表商城分类， 1 代表商品分类，c端都是2
          parentId: 0,
          source: this.directOrgId || uni.$localStorage.getItem("orgId")
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            var sidebar = adaptCategories(res.data.categoryInfoList);

            self.sidebar = sidebar;
            if (!self.current || self.current >= sidebar.length) {
              self.current = 0;
            }
            if (sidebar.length > 0) {
              self.getGoodsErData(sidebar[self.current].id);
              console.log('getGoodsErData',sidebar[self.current].id)
            }
          } else {
            self.setData({
              sidebar: [],
            });
          }
        });
    },

    // 拉取下一分页数据
    fetchNextCateGoods() {
      this.showNextBtn = false;
      if (this.current >= this.sidebar.length - 1) return;
      this.setData({
        current: this.current + 1,
      });
      this.scrollRightTop = this.oldScrollTop;
      this.$nextTick(function() {
        this.getGoodsErData(this.sidebar[this.current].id);
        this.leftMenuStatus(this.current);
      });
    },
    getGoodsErData(val) {
      // uni.$api
      //   .apiRequest('goodsClassification', {
      //     topId: val,
      //   })
      //   .then((res) => {
      //     if (res.code == 10000 && res.data) {
      //       this.setData({
      //         erListData: res.data.secondCategoryList,
      //       });
      //     }
      //   });

      // V2 mark
      this.v2_getGoodsErData(val);
    },

    v2_getGoodsErData(val) {
      uni.$api
        .apiRequest('__v2__goodsClassification', {
          parentId: val,
          pageNum: 1, // 是否需要推荐列表数据
          pageSize: -1,
          type: 2,
          source: uni.$localStorage.getItem("orgId"),
          needCategoryRecommend: true // 查分类下所有推荐商品
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.setData({
              erListData: adaptSubCategories(res.data.categoryInfoList),
            });
          }
        });
    },

    getGoodsName(name) {
      if (!name) {
        return '';
      }
      if (name.length <= 4) {
        return name;
      }
      let backName =
        name.substring(0, 4) + '<br>' + name.substring(4, name.length);
      return backName;
    },

    /**
     * 跳转详情
     * 链接类型1.url链接,2.商城商品,3.商品品牌,4.商品分类
     */
    jumpDetail(goods) {
      console.log(goods);
      if (goods.link == '' || goods.link == undefined) return;
      if (goods.linkType == 2) {
        uni.navigateTo({
          url: '/pages/goods/detail?id=' + goods.link,
        });
      } else if (goods.linkType == 1) {
        // protocol://appleht/pages/commLottery/circlenew?gameId=143&isTourist=1
        let arr = goods.link.split('appleht');
        if (goods.link.indexOf('http') != -1) {
          uni.navigateTo({
            url: '/pagesA/out/out?src=' + goods.link,
          });
        } else if (arr.length == 2) {
          console.log(arr);
          uni.navigateTo({
            url: arr[1],
          });
        }
      } else if (goods.linkType == 3) {
        uni.navigateTo({
          url: `/pagesA/shop/brand-detail?brandId=${goods.link}`,
        });
      } else if (goods.linkType == 4) {
        // uni.navigateTo({
        // 	url: `/pages/index/goods-search/goods-search-result?keyword=${goods.name}`,
        // });
        let linkArr = goods.link ? goods.link.split(',') : '';
        let nameArr = goods.content ? goods.content.split('/') : [];
        let name =
          nameArr && nameArr.length ? nameArr[nameArr.length - 1] : '类目详情';
        uni.navigateTo({
          url: `/pagesA/shop/category-detail?name=${name}&categoryId=${
            linkArr[linkArr.length - 1]
          }`,
        });
      }
    },

    /**
     * 切换tab页面
     */
    async swichMenu(index) {
      this.showNextBtn = false;
      // if (this.arr.length == 0) {
      // 	await this.getMenuItemTop();
      // }
      if (index == this.current) return;
      this.scrollRightTop = this.oldScrollTop;
      this.$nextTick(function() {
        // this.scrollRightTop = this.arr[index];
        this.current = index;
        this.getGoodsErData(this.sidebar[index].id);
        this.leftMenuStatus(index);
      });
    },
    // 设置左边菜单的滚动状态
    async leftMenuStatus(index) {
      this.current = index;
      // 如果为0，意味着尚未初始化
      if (this.menuHeight == 0 || this.menuItemHeight == 0) {
        await this.getElRect('menu-scroll-view', 'menuHeight');
        await this.getElRect('u-tab-item', 'menuItemHeight');
      }
      // 将菜单活动item垂直居中
      this.scrollTop =
        index * this.menuItemHeight +
        this.menuItemHeight / 2 -
        this.menuHeight / 2;
    },
    /**
     * 右边菜单滚动
     * */
    async rightScroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
      if (this.arr.length == 0) {
        await this.getMenuItemTop();
      }
      if (this.timer) return;
      if (!this.menuHeight) {
        await this.getElRect('menu-scroll-view', 'menuHeight');
      }
      setTimeout(() => {
        // 节流
        this.timer = null;
        // scrollHeight为右边菜单垂直中点位置
        let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
        for (let i = 0; i < this.arr.length; i++) {
          let height1 = this.arr[i];
          let height2 = this.arr[i + 1];
          // 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
          if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
            this.leftMenuStatus(i);
            return;
          }
        }
      }, 10);
    },
    // 获取右边菜单每个item到顶部的距离
    getMenuItemTop() {
      new Promise((resolve) => {
        let selectorQuery = uni.createSelectorQuery();
        selectorQuery
          .selectAll('.class-item')
          .boundingClientRect((rects) => {
            // 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
            if (!rects.length) {
              setTimeout(() => {
                this.getMenuItemTop();
              }, 10);
              return;
            }
            rects.forEach((rect) => {
              // 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
              this.arr.push(rect.top - rects[0].top);
              resolve();
            });
          })
          .exec();
      });
    },
    // 获取一个目标元素的高度
    getElRect(elClass, dataVal) {
      new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('.' + elClass)
          .fields(
            {
              size: true,
            },
            (res) => {
              // 如果节点尚未生成，res值为null，循环调用执行
              if (!res) {
                setTimeout(() => {
                  this.getElRect(elClass);
                }, 10);
                return;
              }
              this[dataVal] = res.height;
              resolve();
            }
          )
          .exec();
      });
    },
    /**
     * 去逛逛吧
     * */
    jumpHome() {
      uni.switchTab({
        url: '/pages/index/index',
      });
    },
  },
};
</script>
<style lang="less">
@import './all-goods.css';
.all-goods-page {
  padding-bottom: 60px;
  .nextPage {
    // width: 32px;
    max-width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 16px;
    border: 1px solid #9a9a9a;
    position: fixed;
    right: 10px;
    bottom: 20px;
    display: flex;
    flex-direction: row;
    transition: max-width 1s;
    .goodsName {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin: 0 12px;
      overflow: hidden;
    }
  }
  .pageActive {
    width: auto;
    max-width: 320px;
  }
  .u-menu-wrap {
    flex: 1;
    display: flex;
    overflow: hidden;

    .u-tab-view {
      width: 100px;
      height: 100%;
    }

    .u-tab-item {
      // height: 110rpx;
      // padding: 18px 46rpx 18px 24rpx;
      padding: 18px 0;
      line-height: 20px;
      background: #f6f6f6;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
      color: #444;
      font-weight: 400;
      line-height: 1;
    }
    .left-swiper-item {
      justify-content: left;
    }
    .u-tab-item {
      .u-line-1 {
        white-space: unset !important;
        line-height: 20px;
        text-align: left;
        width: 60px;
        font-size: 14px !important;
        margin-left: 20px;
        flex-wrap: wrap;
      }
    }

    .u-tab-item-active {
      position: relative;
      color: #2e2e2e;
      font-size: 28rpx;
      background: #fff;

      .u-line-1 {
        color: #fe5d4d !important;
      }
    }

    .u-tab-item-active::before {
      content: '';
      position: absolute;
      border-left: 4px solid #fe5d4d;
      height: 66rpx;
      left: 0;
      // top: 39rpx;
    }

    .right-box {
      background-color: rgb(250, 250, 250);

      .class-item {
        margin-bottom: 30rpx;
        background-color: #fff;
        padding: 16rpx;
        border-radius: 8rpx;
      }

      .item-container {
        display: flex;
        flex-wrap: wrap;
      }

      .thumb-box {
        width: 33.333333%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 20rpx;
      }

      .item-title {
        padding-bottom: 18rpx;
        font-size: 24rpx;
        color: #545454;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.notData {
  height: 80vh;
  flex-direction: column;

  .notDataText {
    margin-top: 30rpx;
    font-size: 18px;
    font-family: PingFang-SC-Light, PingFang-SC;
    font-weight: 300;
    color: #7f7f7f;
  }

  .notDataButton {
    margin-top: 60rpx;
    width: 126px;
    height: 40px;
    background: #fe5d4d;
    border-radius: 4px;
    text-align: center;
    font-size: 16px;
    font-family: PingFang-SC-Light, PingFang-SC;
    font-weight: 300;
    color: #ffffff;
    line-height: 40px;
  }
}
</style>
