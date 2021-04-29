<!--
 * @Author: your name
 * @Date: 2021-01-08 10:52:48
 * @LastEditTime: 2021-01-08 10:53:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \pi-heng\src\components\commons\ViewInfor.vue
-->

<style lang="scss">
  .cardDescView {
    .cardDescCont {
      max-height: 75%;
      padding: 20px;
      overflow: hidden;
      overflow-y: auto;
      font-family: PingFangSC-Regular;
      font-weight: 600;

      .prodList {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .prodList span {
        margin-right: 8px;
      }

      li {
        position: relative;
        margin-bottom: 16px;
        text-indent: 1em;
        list-style-type: none;

        &::before {
          position: absolute;
          top: 8px;
          left: 0;
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #dbb678;
          border-radius: 50%;
          content: '';
        }
      }

      li h3 {
        font-size: 14px;
        color: rgba(103, 103, 143, 1);

        & + div {
          word-break: break-word;
        }
      }

      li > div {
        color: rgba(145, 145, 145, 1);
      }
    }
  }

  .cardDescView {
    height: 97%;
    overflow: hidden;
    overflow-y: auto;
  }
</style>
<style lang="scss">
  .prodList .ivu-tag {
    text-indent: 0 !important;
  }
</style>
<style lang="less">
  .instructionsWrapper {
    width: 100%;
    height: auto;

    p {
      margin-top: 11px;
      font-size: 14px;

      label {
        color: #b4b4b4;
      }

      span {
        font-size: #333;
      }
    }
  }
</style>
<template>
  <i-col span="24" class="cardDescView">
    <div
      v-if="infor.couponDesc != initDesc"
      class="instructionsWrapper"
      v-html="infor.couponDesc"
    />
    <div v-else class="instructionsWrapper" />
  </i-col>
</template>

<script>
  export default {
    name: 'CouponView',
    props: {
      infor: { type: Object },
    },
    data() {
      return {
        amountTypeObj: { 1: '元', 2: '小时', 3: '分钟' },
        initDesc: '<ul><li>优惠券名称</li><li>优惠内容</li><li>适用商品</li><li>有效日期</li></ul>',
      }
    },
    computed: {},
  }
</script>
