<template>
  <div style="background:#fff;padding:24px;">
    <Timeline>
      <Row
        v-for="(item,index) in currentList"
        :key="index"
        :gutter="16"
      > 
        <Col span="2" />
        <div class="name-icon">
          <span>{{ item.approvalName }}</span>
          <img
            src="../../../assets/images/Icon-whiteInfo.png"
            alt=""
            class="icon-lc"
          >
        </div>
        </Col>
        <Col span="8" />
        <TimelineItem>
          <img
            slot="dot"
            src="../../../assets/images/Icon-whiteInfo.png"
            alt=""
            class="icon-lc"
            style="margin-top:17px;margin-right:8px;"
          >
          <p class="time">
            {{ item.updateTime }}
          </p>
          <p class="content">
            {{ item.approveTradeType }}
          </p>
        </TimelineItem>
        </Col>
        <Col
          span="8"
          class="message"
        />{{ item.tradeName }}</Col>
      </Row>
    </Timeline>
    <div
      slot="right"
      class="footer"
      style="text-align:right;margin-top:24px;"
    >
      <Button
        style="margin-right:10px;"
        @click="cancelApproval()"
      >
        取消
      </Button>
      <Button
        type="primary"
        @click="save()"
      >
        提交
      </Button>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            currentList:[
                {
                    approvalName:'李云磊',
                    updateTime:'2020-08-24 11:20:32',
                    approveTradeType:'发起审批',
                    tradeName:'国庆节问候短信审批'
                },
                {
                    approvalName:'李云磊',
                    updateTime:'2020-08-24 11:20:32',
                    approveTradeType:'发起审批',
                    tradeName:'国庆节问候短信审批'
                }
            ],
        }
    },
    computed:{
    },
    created(){
    },
    methods:{
    },
}
</script>
<style lang="scss" scoped>
.icon-lc{
    width: 22px;
    height: 22px;
    border:1px dashed #ccc;
}
.name-icon{   
    border-radius: 4px;
    border: 1px solid #E3EBF0;
    padding:0 10px;
    height: 28px;
    line-height:28px;
    position: relative;
    span{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #92929D;
    }
    img{
        position: absolute;
        top:2px;
        right:10px;

    }
}
// .ivu-timeline-item-head-custom{
//     margin-top:15px !important;
//     left:5px !important;
// }

// .ivu-timeline-item-content{
//     padding: 1px 1px 10px 36px !important;
// }
.time{
    
font-size: 12px;
font-family: DINAlternate-Bold, DINAlternate;
font-weight: bold;
color: #D5D5D5;
}
.content{
    
font-size: 12px;
font-family: PingFangSC-Semibold, PingFang SC;
font-weight: 600;
color: #6ED29D;
}
.message{
    height: 38px;
    line-height: 38px;
    border-left:2px solid #E2E2EA;
    padding-left:35px;
}
// .ivu-timeline-item-head-custom{
//     left:5px;
// }
// /depp/.ivu-timeline-item-head .ivu-timeline-item-head-custom{
//     margin-top:15px !important;
// }
</style>
