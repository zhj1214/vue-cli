<template>
  <view class="ht-group-card">
    <!-- 分组 -->
    <block v-for="(groupItem, gIndex) in groups" :key="gIndex">
      <view
        v-if="groupItem.goodsInfoList && groupItem.goodsInfoList.length"
        class="group-card"
      >
        <u-section
          font-size="32"
          :title="groupItem.groupName"
          sub-title="更多"
          :show-line="false"
          @tap="onTapMore(groupItem)"
        ></u-section>
        <view class="group-card__swiper-wrap">
          <u-swiper
            v-if="groupItem.groupLogo"
            height="300"
            border-radius="0"
            :list="[{ image: groupItem.groupLogo, title: groupItem.secondTitle }]"
            mode="none"
            :autoplay="false"
            :title="!!groupItem.secondTitle"
            :title-style="{ 'text-align': 'center' }"
          ></u-swiper>
        </view>
        <scroll-view scroll-x="true" style="width: 100%;">
          <view class="group-card__scroll">
            <cell
              :group="groupItem"
              @tap-more="onTapMore"
              @tap-goods="onGoodsCardTap"
            ></cell>
          </view>
        </scroll-view>
      </view>
    </block>
  </view>
</template>

<script>
import cell from "./group-card-cell";

export default {
  name: "ht-group-card",
  props: {
    groups: {
      type: Array,
      default() {
        return [];
      },
    },
    isIndex: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    cell,
  },
  methods: {
    onTapMore(group) {
      this.$emit("tap-more", group);
    },
    onGoodsCardTap(item) {
      this.$emit("tap-goods", item);
    },
  },
};
</script>

<style lang="less" scoped>
@gutter: 20rpx;
.ht-group-card {
  .group-card {
    margin-bottom: @gutter;
    padding: 40rpx;
    background-color: #fff;
    &__swiper-wrap {
      padding-top: 20rpx;
      margin-bottom: 32rpx;
    }
    &__scroll {
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .origin {
    margin-left: 10rpx;
    font-size: 24rpx;
    text-decoration: line-through;
    color: #929497;
    font-weight: normal;
  }
  .more {
    text-align: center;
    width: 22px;
    padding: 50px 2px 105px;
    font-size: 12px;
    color: #929497;
    background: #f3f3f3;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
  }
}
</style>
