<template>
  <div class="editApproval-page">
    <h2 class="page-title">
      <span @click="backListPage"><i class="icon iconfont iconBack" title="返回" /></span>
      <span @click="backListPage">编辑审批</span>
    </h2>
    <div class="edit-content">
      <div class="edit-title">
        审批名称：<span>{{ approvalroleList.approveTradeName }}</span>
      </div>
      <Row type="flex" justify="start" class="code-row-bg">
        <i-col span="4">
          <div class="font-size12"> 审核状态 </div>
          <div v-if="approvalroleList.status == 1">
            <Badge status="success" />
            <span class="font-size14">已启用</span>
          </div>
          <div v-if="approvalroleList.status == -1">
            <Badge status="default" />
            <span class="font-size14">已停用</span>
          </div>
        </i-col>
        <i-col span="4">
          <div class="font-size12"> 所属组织 </div>
          <div>
            <span class="font-size14">{{ approvalroleList.departmentName }}</span>
            <span class="font-size12" style="padding: 5px;">{{
              approvalroleList.completeDepartmentName
            }}</span>
          </div>
        </i-col>
      </Row>
    </div>
    <div class="edit-content" style="overflow: hidden;">
      <div class="approval-jd" style="margin-bottom: 24px;"> 审批节点 </div>
      <Row v-if="approvalNode.length == 0" :gutter="80" class="card-content" style="width: 75%;">
        <i-col span="6">
          <div class="edit-card">
            <div class="font-size16"> 一级审批 </div>
            <div class="edit-people" @click="addApprovalPeople(0)"> 填写审批人 </div>
          </div>
        </i-col>
      </Row>
      <Row v-else :gutter="80" class="card-content jbsp" style="width: 75%;">
        <div>
          <i-col
            v-for="(item, index) in approvalNode"
            :key="index"
            span="6"
            style="position: relative;"
          >
            <div style="margin-bottom: 24px; overflow: hidden;" class="people-card">
              <div style="float: left; margin-left: 14px;">
                <div class="font-size16" style="margin-top: 15px;"> {{ item.text }}级审批 </div>
                <div class="role-edit">
                  <span>审批角色：</span>
                  <span>{{ item.list.length }}</span>
                </div>
                <div class="role-edit">
                  <span>关联审批人：</span>
                  <span>{{ item.approverNum }}</span>
                </div>
              </div>
              <div style="float: right; margin-right: 14px;">
                <div style="margin-top: 24px; margin-bottom: 6px;">
                  <!-- <Icon
                    type="ios-trash-outline"
                    class="icon-people"
                    @click="deleteRole(index)"
                    style="cursor: pointer"
                  /> -->
                  <i
                    class="iconfont iconRemove"
                    style="color: #b5b5bd; cursor: pointer;"
                    @click="deleteRole(index)"
                  />
                </div>
                <div>
                  <!-- <Icon
                    type="md-color-filter"
                    class="icon-people"
                    @click="editRole(index)"
                    style="cursor: pointer"
                  /> -->
                  <i
                    class="iconfont iconEdit"
                    style="color: #b5b5bd; cursor: pointer;"
                    @click="editRole(index)"
                  />
                </div>
              </div>
            </div>
            <i
              v-if="index != approvalNode.length - 1 && index != 3"
              class="iconfont iconTo"
              style="position: absolute; top: 30%; right: -4%; color: #b5b5bd;"
            />
          </i-col>
          <i-col v-if="nodeFlag" span="6" class="height106">
            <div class="edit-card">
              <div class="font-size16"> {{ matchList[approvalNode.length + 1] }}级审批 </div>
              <div class="edit-people" @click="addApprovalPeople(approvalNode.length)">
                填写审批人
              </div>
            </div>
          </i-col>
        </div>
      </Row>
      <Button v-if="approvalNode.length < 8" type="primary" @click="addApprovalNode()">
        添加审批节点
      </Button>
      <Poptip v-else trigger="hover" content="审批节点最多设置8级" placement="top" class="poptip">
        <Button style="background: #f1f1f5;"> 添加审批节点 </Button>
      </Poptip>
      <div class="footer" style="float: right; margin-top: 50px;">
        <Button style="margin-right: 10px;" @click="cancel()"> 取消 </Button>
        <Button type="primary" @click="submit"> 提交 </Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // approveTradeName:'',//审批名称
        approveTradeId: '',
        approvalroleList: {
          approveTradeName: '',
          list: [],
        },
        approvalNode: [],
        editFlag: false, //是否是首次进入编辑审批
        approvalIds: {},
        matchList: {},
        nodeFlag: false,
        // submitTransform:'',
        appList: [],
      }
    },
    computed: {},
    created() {
      this.approveTradeId = this.$route.query.id
      this.editFlag = this.$route.query.edit
      this.orgId = this.$route.query.orgId
      //从审批设置页面过来
      if (this.editFlag == false) {
        this.getApprovalData()
        //从添加审批人页面过来
      } else {
        this.approvalIds = this.$route.query.approvalIds
        this.approvalroleList = this.approvalIds ? this.approvalIds : {}
        this.approvalNode = this.renderLevel(this.approvalIds.list)
      }
    },
    mounted() {},
    methods: {
      // 返回上一页id
      backListPage() {
        this.$router.push('/platform/Approval/setting')
      },

      //添加审批节点
      addApprovalNode() {
        this.nodeFlag = true
      },
      //获取审批数据
      getApprovalData() {
        this.$ajaxGet('/approve-server/api/approve/setting/detail', {
          approveTradeId: this.approveTradeId,
        })
          .then((res) => {
            if (res && res.code === 10000) {
              if (res.data) {
                this.matchList = {
                  1: '一',
                  2: '二',
                  3: '三',
                  4: '四',
                  5: '五',
                  6: '六',
                  7: '七',
                  8: '八',
                }
                let list = res.data.list.map((item) => {
                  let arr = item.roles.map((e, index) => {
                    return {
                      grade: item.grade,
                      approverNum: index == 0 ? item.approverNum : 0,
                      roles: [
                        {
                          roleId: e,
                          orgId: res.data.orgId,
                        },
                      ],
                    }
                  })

                  return arr
                })

                this.approvalroleList = res.data
                this.approvalroleList.list = list
                this.approvalNode = this.renderLevel(list)
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      //提交
      //
      submit() {
        //如果用户只添加了审批节点而未填写审批人
        if (this.nodeFlag) {
          this.$Message.error('审批节点内容未完善，请完善后提交。')
          return
        }
        this.approvalNode.map((item) => {
          let transNum = {
            一: 1,
            二: 2,
            三: 3,
            四: 4,
            五: 5,
            六: 6,
            七: 7,
            八: 8,
          }
          item.grade = transNum[item.text]
          item.list.map((element) => {
            delete element.approverNum
            element.grade = item.grade
            // item.orgId = element.orgId

            //   if(element.list instanceof Object){
            //     element.list.map(e=>{
            //       delete e.approverNum;
            //       return e;
            //     })
            //   }
            return element
          })
          this.appList.push(item.list)
          this.appList = this.$_.flatten(this.appList)
          return item
        })
        //如果是删除过后又加上来的节点
        this.appList = this.appList.map((item) => {
          if (item.hasOwnProperty('text')) {
            // delete item.list[0].text
            item.grade = item.list[0].grade
            item.roles = item.list[0].roles
            // delete item.list
          }
          delete item.approverNum
          return item
        })

        this.$ajaxPost('/approve-server/api/approve/setting/edit', {
          approveSettingEditList: this.appList,
          approveTradeId: this.approveTradeId,
          //    roles: this.approvalNode[0].roles
        })
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Message.success(res.message || '提交成功')
              this.$router.push('/platform/Approval/setting')
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      //提交时候的判断数据来自于接口返回还是新添加的
      isResponseOrAdd(item) {
        if (Array.isArray(item)) {
          let flag = item[0].hasOwnProperty('list')
          return flag
        } else {
          return false
        }
      },
      //修改角色id
      editRole(index) {
        this.$router.push({
          path: '/platform/approval/addApprovalPeople',
          query: {
            approvalPeople: this.approvalroleList,
            id: this.$route.query.id,
            addNode: 2,
            currentIdx: index,
            // grade:grade
          },
        })
      },
      //填写审批人
      addApprovalPeople(val) {
        this.approvalroleList.list = this.approvalroleList.list.map((item) => {
          if (item != '') {
            if (Array.isArray(item)) {
              return item
            } else {
              return [item]
            }
          }
        })
        this.$router.push({
          path: '/platform/approval/addApprovalPeople',
          query: {
            // approvalPeople: JSON.stringify(this.approvalroleList),
            approvalPeople: this.approvalroleList,
            id: this.$route.query.id,
            currentIdx: val,
            addNode: 1,
          },
        })
      },
      // 删除当前审批节点
      deleteRole(index) {
        this.approvalNode.splice(index, 1)
        this.approvalroleList.list = this.approvalNode
      },
      //取消
      cancel() {
        this.$router.push('/platform/Approval/setting')
        // this.$router.back();
      },
      renderLevel(list) {
        this.matchList = {
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六',
          7: '七',
          8: '八',
        }
        var idx
        list.forEach((item, index) => {
          if (item.length == 0) idx = index
        })
        if (idx != undefined) {
          list.splice(idx, 1)
        }
        let allNodes = list.map((arr, index) => {
          var num = 0 //关联审批人
          arr.forEach((element) => {
            if (element instanceof Array) {
              element.forEach((e) => {
                num = num + e.approverNum
              })
            } else {
              num = num + element.approverNum
            }
          })
          return {
            text: this.matchList[index + 1],
            approverNum: num,
            list: arr,
          }
        })
        return allNodes
      },
      transform(list) {
        return list.map((item) => {
          this.transNum = {
            一: 1,
            二: 2,
            三: 3,
            四: 4,
            五: 5,
            六: 6,
            七: 7,
            八: 8,
          }

          item.grade = this.transNum[item.text]
          return item
        })
      },
    },
  }
</script>

<style lang="scss">
  // .editApproval-page {
  // 		background: #fff;
  // 		padding: 24px;
  // 		border-radius: 16px;
  // }
  .page-title {
    margin-bottom: 28px;
    vertical-align: middle;

    & > span {
      font-family: SFUIDisplay-Semibold;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
      color: rgba(62, 69, 82, 1);
      text-align: left;
      vertical-align: middle;
      cursor: pointer;

      /* vertical-align: middle; */
    }

    .iconBack {
      position: relative;
      display: inline-block;
      padding-right: 12px;
      font-size: 24px;
      vertical-align: middle;
      transform: translateY(-2.5px);
    }
  }

  .edit-content {
    padding: 24px;
    margin-bottom: 24px;
    background-color: #fff;
    border-radius: 8px;

    .edit-title {
      margin-bottom: 24px;
      font-family: SFUIDisplay-Medium, SFUIDisplay;
      font-size: 16px;
      font-weight: 700;
      color: #171725;
    }

    .font-size12 {
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-size: 12px;
      font-weight: 300;
      color: #92929d;
    }

    .font-size14 {
      height: 24px;
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-size: 14px;
      font-weight: 300;
      line-height: 24px;
      color: #171725;
    }
  }

  .approval-jd {
    height: 38px;
    padding-left: 16px;
    line-height: 38px;
    color: #44444e;
    background: #fafafb;
    border-radius: 8px;
  }

  .card-content {
    margin-bottom: 24px;
  }

  .edit-card {
    padding: 24px 0;
    text-align: center;
    border: 1px solid #e2e2ea;
    border-radius: 8px;
  }

  .edit-people {
    height: 24px;
    font-family: PingFangSC-Light, PingFang SC;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: #756cea;
    cursor: pointer;
  }

  .font-size16 {
    height: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    color: #44444f;
  }

  .people-card {
    // text-align: center;
    // padding:24px 0;
    min-height: 106px;
    border: 1px solid #e2e2ea;
    border-radius: 8px;
  }

  .icon-people {
    width: 24px;
    height: 24px;
    line-height: 24px;
    // text-align: center;
    // border: 1px dashed #ccc;
  }

  .role-edit {
    font-family: PingFangSC-Light, PingFang SC;
    font-size: 12px;
    font-weight: 300;
    color: #92929d;
  }

  .height106 {
    min-height: 106px !important;
  }

  .poptip .ivu-poptip-body-content-inner {
    color: #fff;
    text-shadow: 0 0 8px rgba(181, 181, 189, 0.24);
  }

  .poptip .ivu-poptip-inner {
    height: 32px;
    text-align: center;
    background: rgba(23, 23, 36, 0.8);
    border-radius: 4px;
    box-shadow: 0 0 8px 0 rgba(181, 181, 189, 0.24);
  }

  .poptip .ivu-poptip-popper[x-placement^='top'] .ivu-poptip-arrow::after {
    border-top-color: rgba(23, 23, 36, 0.8);
  }
</style>
