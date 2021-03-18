<template>
  <view class="ht-category">
    <!-- 左侧tab -->
    <scroll-view class="left tab">
      <view
        v-for="(item, index) in categories"
        :key="index"
        :class="item.id === curTabId ? 'tab-item selected' : 'tab-item'"
        @tap="switchTab(item, index)"
      >
        {{ item.name }}
      </view>
    </scroll-view>
    <!-- 右侧滚动区域 -->
    <scroll-view class="right" :style="'height:'+ height + 'px'" scroll-y="true" @scroll="onScroll" :scroll-top="scrollTop" scroll-with-animation>
      <view
        v-for="(item, index) in categories"
        :key="index"
        :id="'id_' + item.id"
      >
        <image class="category-cover" mode="widthFix" :src="item.img"></image>
        <view class="sub-category" v-for="(sItem, i) in item.children" :key="i">
          <view class="sub-category__title">{{ sItem.name }}</view>
          <view class="sub-category__grid-wrap">
            <view
              v-for="(gItem, gIndex) in sItem.children"
              :key="gIndex"
              class="sub-category__grid"
            >
              <image
                class="sub-category__icon"
                mode="widthFix"
                :src="gItem.img"
              ></image>
              <view class="sub-category__text">{{ gItem.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'ht-category',
  props: {
    height: {
      type: Number,
    },
    threshold: {
      type: Number,
      default: 0
    },
    categories: {
      type: Array,
      default() {
        return [
          {
            id: '1',
            name: '为你推荐',
            img:
              'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
            children: [
              {
                name: '当季主推',
                children: [
                  {
                    name: '口红fdsa发的发射点',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                ],
              },
              {
                name: '放松放松',
                children: [
                  {
                    name: '口红fdsa发的发射点',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                  },
                ],
              },
            ],
          },
          {
            id: '2',
            name: '为你推荐',
            img:
              'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
            children: [
              {
                name: '当季主推',
                children: [
                  {
                    name: '口红',
                    img:
                      'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
                  },
                ],
              },
            ],
          },
          {
            id: '3',
            name: '为你推荐',
            img:
              'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
            children: [
              {
                name: '当季主推',
                children: [
                  {
                    name: '口红',
                    img:
                      'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
                  },
                  {
                    name: '口红',
                    img:
                      'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
                  },
                ],
              },
            ],
          },
        ];
      },
    },
  },
  data() {
    return {
      curTabId: '1', // 首个分类的id
      hTokens: [], // 高度的token流
      scrollTop: 0,
    };
  },

  mounted() {
    // TODO 样式还需要修改，确保不需要等图片渲染完才来计算高度
    // 确保图片渲染完成后再去获取高度
    setTimeout(() => {
      this.getHeightTokens();
    }, 1000);
  },
  methods: {
    switchTab(item, index) {
      this.curTabId = item.id;
      // console.log(this.hTokens[index])
      this.scrollTop = this.hTokens[index].sTop -  this.hTokens[index].height 

    },
    getHeightTokens() {
      let that = this;
      that.hTokens = [];
      for (let i = 0; i < this.categories.length; i++) {
        // 获取元素属性最好是在渲染之后执行，避免获取空值
        uni
          .createSelectorQuery()
          .in(this)
          .select('#id_' + this.categories[i].id)
          .boundingClientRect(function(rect) {
            let obj = {
              id: that.categories[i].id,
              height: rect.height,
              sTop: that.hTokens[that.hTokens.length - 1]
                ? that.hTokens[that.hTokens.length - 1].sTop + rect.height
                : rect.height,
            };

            that.hTokens.push(obj);
          })
          .exec();
      }
      // console.log(this.hTokens);
    },

    fetchToken(scrollTop, callback) {
      let i = 0;
      // console.log(scrollTop);
      while (true) {
        if (
          scrollTop <= this.hTokens[i].sTop &&
          scrollTop >= (this.hTokens[i - 1] ? this.hTokens[i - 1].sTop : 0)
        ) {
          // console.log(i);
          callback && callback(this.hTokens[i]);
          return;
        }
        if (!this.hTokens[i]) {
          // console.log(i - 1);
          callback && callback(this.hTokens[i - 1]);
          return;
        }
        i++;
      }
    },
    onScroll(e) {
      const scrollTop = e.detail.scrollTop;
      // this.scrollTop = scrollTop
      this.fetchToken(scrollTop + this.threshold, (token)=>{
        // console.log(token.id)
        this.curTabId = token.id
      });
    },
  },

  watch: {
    // 保证分类变化，重新计算
    categories(){
      this.$$nextTick(()=>{
        this.getHeightTokens()
      })
    }
  }
};
</script>

<style lang="less">
.ht-category {
  // margin-top: 28rpx;
  display: flex;
  .left {
    flex-shrink: 0;
    width: 200rpx;
    color: #2e2e2e;
    background-color: #f9f9f9;
    .tab-item {
      padding: 32rpx 0 32rpx 40rpx;
      &.selected {
        position: relative;
        color: #fe5d4d;
        font-size: 28rpx;
        font-weight: bold;
        background-color: #fff;
        &::after {
          position: absolute;
          content: ' ';
          left: 0;
          top: 30rpx;
          bottom: 30rpx;
          width: 10rpx;
          background-color: #fe5d4d;
        }
      }
    }
  }

  .right {
    padding: 0 40rpx;
    height: 1000rpx;
    flex: 1;
    .category-cover {
      width: 100%;
    }
    .sub-category {
      margin-top: 32rpx;
      &__title {
        color: #2e2e2e;
        font-size: 28rpx;
        margin-bottom: 16rpx;
      }
      &__grid-wrap {
        display: flex;
        flex-wrap: wrap;
      }
      &__grid {
        width: 33.33%;
        padding: 10rpx;
        text-align: center;
      }
      &__icon {
        width: 100%;
      }
      &__text {
        text-align: center;
        color: #929497;
      }
    }
  }
}
</style>
