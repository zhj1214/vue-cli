<template>
  <div style="padding: 24px; background: #fff;">
    <Timeline>
      <Row v-for="(item, index) in currentList" :key="index" :gutter="16">
        <i-col span="2">
          <div class="name-icon">
            <span>{{ item.approvalName }}</span>
            <img src="../../../assets/images/Icon-whiteInfo.png" alt="" class="icon-lc" />
          </div>
        </i-col>
        <i-col span="8">
          <TimelineItem>
            <img
              slot="dot"
              src="../../../assets/images/Icon-whiteInfo.png"
              alt=""
              class="icon-lc"
              style="margin-top: 17px; margin-right: 8px;"
            />
            <p class="time">
              {{ item.updateTime }}
            </p>
            <p class="content">
              {{ item.approveTradeType }}
            </p>
          </TimelineItem>
        </i-col>
        <i-col span="8" class="message">{{ item.tradeName }}</i-col>
      </Row>
    </Timeline>
    <div slot="right" class="footer" style="margin-top: 24px; text-align: right;">
      <Button style="margin-right: 10px;" @click="cancelApproval()"> 取消 </Button>
      <Button type="primary" @click="save()"> 提交 </Button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentList: [
          {
            approvalName: '李云磊',
            updateTime: '2020-08-24 11:20:32',
            approveTradeType: '发起审批',
            tradeName: '国庆节问候短信审批',
          },
          {
            approvalName: '李云磊',
            updateTime: '2020-08-24 11:20:32',
            approveTradeType: '发起审批',
            tradeName: '国庆节问候短信审批',
          },
        ],
      }
    },
    computed: {},
    created() {},
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .icon-lc {
    width: 22px;
    height: 22px;
    border: 1px dashed #ccc;
  }

  .name-icon {
    position: relative;
    height: 28px;
    padding: 0 10px;
    line-height: 28px;
    border: 1px solid #e3ebf0;
    border-radius: 4px;

    span {
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 12px;
      font-weight: 400;
      color: #92929d;
    }

    img {
      position: absolute;
      top: 2px;
      right: 10px;
    }
  }
  // .ivu-timeline-item-head-custom{
  //     margin-top:15px !important;
  //     left:5px !important;
  // }

  // .ivu-timeline-item-content{
  //     padding: 1px 1px 10px 36px !important;
  // }
  .time {
    font-family: DINAlternate-Bold, DINAlternate;
    font-size: 12px;
    font-weight: bold;
    color: #d5d5d5;
  }

  .content {
    font-family: PingFangSC-Semibold, PingFang SC;
    font-size: 12px;
    font-weight: 600;
    color: #6ed29d;
  }

  .message {
    height: 38px;
    padding-left: 35px;
    line-height: 38px;
    border-left: 2px solid #e2e2ea;
  }
  // .ivu-timeline-item-head-custom{
  //     left:5px;
  // }
  // /depp/.ivu-timeline-item-head .ivu-timeline-item-head-custom{
  //     margin-top:15px !important;
  // }
</style>
