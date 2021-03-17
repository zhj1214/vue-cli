<template>
  <div class="detailApproval-page">
    <h2 class="page-title">
      <span
        @click="backListPage"
      ><i
        class="icon iconfont iconBack"
        title="返回"
      /></span>
      <span @click="backListPage">审批详情</span>
    </h2>
    <div class="detail-content">
      <!-- <h3 v-if="mesObj.approveTradeType == 3"
				style="
				font-size: 16px;
				font-weight: 500;
				color: #92929D;
				"
			>
				{{ mesObj.tradeName }}
			</h3> -->
      <h3
        style="
				font-size: 16px;
				font-weight: 500;
				color: #756cea;
				cursor: pointer;
				"
        @click="enterContent(mesObj)"
      >
        {{ mesObj.tradeName }}
      </h3>
      <h4>ID：{{ mesObj.tradeId }}</h4>
      <Row :gutter="16">
        <Col
          span="8"
          style="max-height: 60px"
        />
        <div style="padding: 24px 0">
          <div class="approval-mes">
            状态
          </div>
          <div
            v-if="mesObj.status == 1"
            class="approval-cont"
          >
            <Badge color="gold" />
            <span>{{ "待审批" }}</span>
          </div>
          <div
            v-if="mesObj.status == 2"
            class="approval-cont"
          >
            <Badge status="success" />
            <span>{{ "已通过" }}</span>
          </div>
          <div
            v-if="mesObj.status == 3"
            class="approval-cont"
          >
            <Badge color="red" />
            <span>{{ "已驳回" }}</span>
          </div>
          <div
            v-if="mesObj.status == 4"
            class="approval-cont"
          >
            <Badge status="default" />
            <span>{{ "已撤回" }}</span>
          </div>
          <div
            v-if="mesObj.status == 5"
            class="approval-cont"
          >
            <Badge color="#B46EF4" />
            <span>{{ "已超时" }}</span>
          </div>
        </div>
        </Col>
        <Col
          span="8"
          style="max-height: 60px"
        />
        <div style="padding: 24px 0">
          <div class="approval-mes">
            发起人
          </div>
          <div class="approval-cont">
            {{ mesObj.initiatorName }}
          </div>
        </div>
        </Col>
        <Col
          span="8"
          style="max-height: 60px"
        />
        <div style="padding: 24px 0">
          <div class="approval-mes">
            发起人手机号
          </div>
          <div class="approval-cont">
            {{ mesObj.initiatorPhone }}
          </div>
        </div>
        </Col>
        <Col
          span="8"
          style="max-height: 60px"
        />
        <div style="padding: 24px 0">
          <div class="approval-mes">
            所属审批流程
          </div>
          <div
            v-if="mesObj.approveTradeType == 1"
            class="approval-cont"
          >
            {{ "活动市场上架" }}
          </div>
          <div
            v-if="mesObj.approveTradeType == 2"
            class="approval-cont"
          >
            {{ "活动管理上架" }}
          </div>
          <div
            v-if="mesObj.approveTradeType == 3"
            class="approval-cont"
          >
            {{ "领券中心上架" }}
          </div>
          <div
            v-if="mesObj.approveTradeType == 4"
            class="approval-cont"
          >
            {{ "商城上架" }}
          </div>
          <div
            v-if="mesObj.approveTradeType == 5"
            class="approval-cont"
          >
            {{ "消息发送" }}
          </div>
        </div>
        </Col>
        <Col
          span="8"
          style="max-height: 60px"
        />
        <div style="padding: 24px 0">
          <div class="approval-mes">
            发起时间
          </div>
          <div class="approval-cont">
            {{ mesObj.initiatorTime }}
          </div>
        </div>
        </Col>
        <Col
          span="8"
          style="max-height: 60px"
        />
        <div style="padding: 24px 0">
          <div class="approval-mes">
            更新时间
          </div>
          <div class="approval-cont">
            {{ mesObj.updateTime }}
          </div>
        </div>
        </Col>
      </Row>
      <h5 style="margin-top: 24px">
        所属组织{{ mesObj.departmentName }}({{ mesObj.completeDepartmentName }})
      </h5>
    </div>
    <div
      class="detail-content"
      style="margin-top: 24px"
    >
      <div class="sp-mes">
        审批流程
      </div>
      <div style="background: #fff; padding: 24px">
        <Timeline>
          <div
            v-for="(item, index) in currentList"
            :key="index"
            :gutter="16"
            class="pub-parent"
          >
            <div
              class="name-icon public"
              style="width: 110px"
            >
              <Tooltip
                v-if="item.approverName"
                placement="top"
                trigger="hover"
                :content="item.approverName"
                max-width="300"
              >
                <span style="cursor:pointer">{{ item.approverName }}</span>
              </Tooltip>
              <Poptip
                v-if="mesObj.departmentName"
                :content="mesObj.departmentName + mesObj.completeDepartmentName"
                placement="top"
                trigger="hover"
                style="float: right"
                class="poptip"
              >
                <img
                  src="../../../assets/images/Icon-whiteInfo.png"
                  alt=""
                  class="icon-lc"
                >
              </Poptip>
              <img
                v-else
                src="../../../assets/images/Icon-whiteInfo.png"
                alt=""
                class="icon-lc"
              >
            </div>
            <TimelineItem
              class="timeline"
              style="width: 500px; padding: 0 0 34px 0"
            >
              <img
                v-if="
                  item.status == 1 ||
                    item.status == 4 ||
                    item.status == 6 ||
                    item.status == 7 ||
                    item.status == 8
                "
                slot="dot"
                src="../../../assets/images/Incon-greenInfo.png"
                alt=""
                class="icon-lc"
                style="margin-top: 17px; margin-right: 8px"
              >
              <img
                v-if="item.status == 2"
                slot="dot"
                src="../../../assets/images/Icon-redInfo.png"
                alt=""
                class="icon-lc"
                style="margin-top: 17px; margin-right: 8px"
              >
              <img
                v-if="item.status == 3"
                slot="dot"
                src="../../../assets/images/Icon-purpleInfo.png"
                alt=""
                class="icon-lc"
                style="margin-top: 17px; margin-right: 8px"
              >
              <img
                v-if="item.status == 5 || item.status == 9"
                slot="dot"
                src="../../../assets/images/Icon-whiteInfo.png"
                alt=""
                class="icon-lc"
                style="margin-top: 17px; margin-right: 8px"
              >
              <p class="time">
                {{ item.approveTime }}
              </p>
              <p
                v-if="
                  item.status == 1 ||
                    item.status == 4 ||
                    item.status == 6 ||
                    item.status == 7 ||
                    item.status == 8
                "
                class="content"
                style="color: #6ed29d"
              >
                {{ item.approveStatusText }}
              </p>
              <p
                v-if="item.status == 2"
                class="content"
                style="color: #fc5a5a"
              >
                {{ item.approveStatusText }}
              </p>
              <p
                v-if="item.status == 3"
                class="content"
                style="color: #b46ef4"
              >
                {{ item.approveStatusText }}
              </p>
              <p
                v-if="item.status == 5 || item.status == 9"
                class="content"
                style="color: #d5d5d5"
              >
                {{ item.approveStatusText }}
              </p>
            </TimelineItem>
            <Tooltip
              v-if="item.remark"
              trigger="hover"
              :content="item.remark"
              max-width="500"
            >
              <div
                v-if="item.status == 1"
                class="message public"
                style="flex: 1"
              >
                {{ item.remark }}
              </div>
            </Tooltip>
            <Tooltip
              v-if="item.remark"
              trigger="hover"
              :content="item.remark"
              max-width="500"
            >
              <div
                v-if="item.status == 4"
                class="message public"
                style="flex: 1"
              >
                描述：{{ item.remark }}
              </div>
            </Tooltip>
            <Tooltip
              v-if="item.remark"
              trigger="hover"
              :content="item.remark"
              max-width="500"
            >
              <div
                v-if="item.status == 2"
                class="message public"
                style="flex: 1"
              >
                驳回理由：{{ item.remark }}
              </div>
            </Tooltip>
            <Tooltip
              v-if="item.remark"
              trigger="hover"
              :content="item.remark"
              max-width="500"
            >
              <div
                v-if="item.status == 7"
                class="message public"
                style="flex: 1"
              >
                {{ item.remark }}
              </div>
            </Tooltip>
            <Tooltip
              v-if="item.remark"
              trigger="hover"
              :content="item.remark"
              max-width="500"
            >
              <div
                v-if="item.status == 8"
                class="message public"
                style="flex: 1"
              >
                {{ item.remark }}
              </div>
            </Tooltip>
            <!-- <div class="message public" style="flex: 1" v-if="item.status == 7">
						{{ "审批流程已停用，审批自动通过" }}
						</div>
						<div class="message public" style="flex: 1" v-if="item.status == 8">
						{{ "审批流程变更，重新发起审批" }}
						</div> -->
          </div>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      approveTradeName: "", //审批名
      pageData: {
        page: 1,
        size: 10,
        count: 0,
        operatorName: "",
        operateModule: "",
        operateType: "",
        beginTime: "",
        endTime: "",
      },
      detailModal: false, //控制审批人详情弹窗显示隐藏
      approvalList: [], //审批人详情表格数据
      approvalColumns: [
        {
          title: "员工姓名",
          slot: "roleName",
        },
        {
          title: "账号",
          slot: "phoneNum",
        },
      ], //审批人详情表格表头
      memberTabs: [
        {
          label: "用户旅程",
          value: "userTravel",
        },
        {
          label: "积分记录",
          value: "points",
        },
        {
          label: "订单记录",
          value: "order",
        },
        {
          label: "身份记录",
          value: "identity",
        },
      ],
      selectedTab: "points",
      mesObj: {},
      currentList: [],
      approveId: "", //详情传参
    };
  },
  computed: {},
  created() {
    this.approveId = this.$route.query.approveId;
    this.getApprovalDetail();
  },
  methods: {
    // 返回上一页
    backListPage() {
      this.$router.push("/platform/Approval/Manage");
    },
    //关闭审批人详情弹窗
    closeDetail() {
      this.detailModal = false;
    },
    //进入内容详情页
    enterContent(mesObj) {
      //活动市场详情页
			if(mesObj.approveTradeType == 1){
                let url = '/activity/list?marketingId' + mesObj.tradeId;
				window.open(url, "_blank");
			//活动管理详情页
			}else if(mesObj.approveTradeType == 2){
                let url = "/activity/offline?activityId="+mesObj.tradeId;
                window.open(url, "_blank");
            //领券详情页
            }else if(mesObj.approveTradeType == 3){
                let url = "/activity/coupon/detail?type="+'couponCenter' + '&couponContactId=' + mesObj.tradeId;
                window.open(url, "_blank"); 
            //商品详情页
            }else if(mesObj.approveTradeType == 4){
            //    let url = "/onlinemall/mall/malldetail/"+mesObj.tradeId;
			//     window.open(url, "_blank");
			let routeData = this.$router.resolve({
				path: "/onlinemall/mall/malldetail/"+mesObj.tradeId,
				query: {routerType:'approvalDetail'}
			});
			window.open(routeData.href, '_blank');
			//消息详情页
			}else if(mesObj.approveTradeType == 5){
                let url = '/message/templateMessage?isView=' + 1 + '&id=' + mesObj.tradeId;
				window.open(url, "_blank");
			}
    },
    //获取审批详情数据
    getApprovalDetail() {
      let tradeId = this.$route.query.tradeId;
      let approveTradeType = this.$route.query.approveTradeType;
      if (approveTradeType === undefined) {
        approveTradeType = "";
      }
      this.$ajaxGet("/approve-server/api/approve/detail", {
        approveId: this.approveId,
        tradeId: tradeId,
        approveTradeType: approveTradeType,
      })
        .then((res) => {
          if (res && res.code === 10000) {
            if (res.data) {
              this.mesObj = res.data;
              this.currentList = res.data.approveProcessList;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
// .addApproval-page {
// 		background: #fff;
// 		padding: 24px;
// 		border-radius: 16px;
// }
.page-title {
  margin-bottom: 28px;
  vertical-align: middle;
  & > span {
    cursor: pointer;
    vertical-align: middle;
    font-family: SFUIDisplay-Semibold;
    font-weight: 600;
    text-align: left;
    color: rgba(62, 69, 82, 1);
    font-size: 24px;
    line-height: 32px;
    /*vertical-align: middle;*/
  }

  .iconBack {
    display: inline-block;
    position: relative;
    padding-right: 12px;
    font-size: 24px;
    vertical-align: middle;
    transform: translateY(-2.5px);
  }
}
.detail-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  h3 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #756cea;
  }
  h4 {
    padding-top: 10px;
    font-size: 12px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: #92929d;
  }
  h5 {
    font-size: 10px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: #92929d;
  }
}
.approval-mes {
  font-size: 12px;
  font-family: SFUIDisplay-Light, SFUIDisplay;
  font-weight: 300;
  color: #92929d;
}
.icon-people {
  width: 24px;
  height: 24px;
  line-height: 24px;
  float: right;
  border: 1px dashed #ccc;
}
.approval-cont {
  font-size: 14px;
  font-family: SFUIDisplay-Light, SFUIDisplay;
  font-weight: 300;
  color: #171725;
}
.sp-mes {
  height: 38px;
  line-height: 38px;
  background: #fafafb;
  border-radius: 8px;
  font-size: 12px;
  font-family: SFUIDisplay-Medium, SFUIDisplay;
  font-weight: 500;
  color: #44444e;
  margin-bottom: 24px;
}
.icon-lc {
  width: 22px;
  height: 22px;
  // border: 1px dashed #ccc;
}
.name-icon {
  border-radius: 4px;
  border: 1px solid #e3ebf0;
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
  // position: relative;
  overflow: hidden;
  span {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #92929d;
    display: block;
    width: 60px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  img {
    float: right;
    margin-top: 2px;
    // position: absolute;
    // top:2px;
    // right:10px;
  }
}
.time {
  font-size: 12px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: #d5d5d5;
}
.content {
  font-size: 12px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  // color: #6ED29D;
}
.message {
  height: 38px;
  line-height: 38px;
  border-left: 2px solid #e2e2ea;
  padding-left: 35px;
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.pub-parent {
  display: flex;
}
</style>
<style lang="scss">
.timeline .ivu-timeline-item-head-custom {
  left: 5px !important;
}
.timeline .ivu-timeline-item-content {
  left: 18px !important;
  z-index: 0 !important;
}
.timeline .ivu-timeline-item {
  padding: 0 0 50px 0 !important;
}
.ivu-timeline-item:last-child .ivu-timeline-item-tail{
  display: block !important;
}
.timeline .ivu-timeline-item-tail {
  // width: 1px !important;
  // height: 87px !important;
  left: 20px !important;
  top: 6px !important;
  z-index: 1 !important;
}
.pub-parent:last-child .ivu-timeline-item .ivu-timeline-item-tail{
	display: none !important;
}
.poptip .ivu-poptip-body-content-inner {
  color: #ffffff;
  text-shadow: 0px 0px 8px rgba(181, 181, 189, 0.24);
}
.poptip .ivu-poptip-inner {
  height: 32px;
  background: rgba(23, 23, 36, 0.8);
  box-shadow: 0px 0px 8px 0px rgba(181, 181, 189, 0.24);
  border-radius: 4px;
  text-align: center;
}
.poptip .ivu-poptip-popper[x-placement^="top"] .ivu-poptip-arrow:after {
  border-top-color: rgba(23, 23, 36, 0.8);
}
</style>
