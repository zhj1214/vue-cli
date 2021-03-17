<template>
  <div class="fan-message">
    <!-- <div class="FanMessageH1"><h1>粉丝信息</h1></div> -->
    <div>
      <div class="fwwMemberMessageContent">
        <Row
          style="margin-bottom:20px;"
          type="flex"
          justify="space-between"
          class="code-row-bg"
        >
          <i-col span="4">
            <DatePicker
              v-model="searchData.timeRange"
              clearable
              type="daterange"
              placement="bottom-end"
              placeholder="开始时间-结束时间"
              style="width: 400px"
              @on-change="onTimeChange"
              @on-clear="onTimeCancel"
            />

            <!-- format="yyyy-MM-dd HH:mm"   -->
          </i-col>
          <i-col span="4">
            <!-- <Input @on-keyup="onSearch" v-model="search" search placeholder="请输入昵称/城市" /> -->
            <i-input
              v-model="searchFind"
              placeholder="请输入昵称/城市"
              style="width: auto"
              @on-change="onIcon"
              @on-enter="onIcon"
            >
              <Icon
                slot="suffix"
                type="ios-search"
                @click="onIcon"
              />
            </i-input>
          </i-col>
        </Row>
      </div>
      <div class="fwwFanMessageForm">
        <Table
          :loading="loading"
          :columns="tableColumns1"
          :data="tableData1"
        />
        <div style="margin: 10px;overflow: hidden">
          <Page
            class="pagebox"
            :current="searchData.page"
            :page-size="searchData.size"
            :total="total"
            show-elevator
            show-sizer
            show-total
            @on-change="onChange"
            @on-page-size-change="changeSize"
          />
        </div>
      </div>
    </div>
    <Modal
      v-model="modal8"
      title="编辑备注"
      :mask-closable="false"
      @on-ok="ok"
      @on-cancel="cancal"
    >
      <div
        class="modal-content"
        style="padding:30px 0"
      >
        <span class="fwwfansSpan">备注：</span>
        <Input
          v-model="fansRemark"
          type="textarea"
          :rows="5"
          maxlength="200"
          style="width: 70%;height: 200px;"
          placeholder="请输入粉丝备注"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
import {log} from "@/utils/tools";
import {fanCol} from "@/pageview/member/fanManage/fanCol";
import mixinsGlobal from "@/mixins/mixinsGlobal";

export default {
    name: 'FanMessage',
    mixins: [mixinsGlobal],
    data() {

        return {
            ButtonPermissions: [], //按钮权限
            searchData: {
                id: '',
                page: 1,
                size: 10,
                nickName: '',

                address: '',
                beginTime: '',
                endTime: '',
                status: '',

                province: '',
                remark: '',
                content: '',
                timeRange: [],

            },
            count: 0,
            modal8: false,
            fansRemark: '',
            fansTabIndex: -1,
            loading: true,
            isRead: true,
            isWrite: true,
            total: 0,
            searchFind: '',
            index: -1,
            value3: '',
            changeValue: '',
            tableData1: [],
            condition: true,
            //筛选性别
            fwwSexList: [
                {
                    label: '全部',
                    value: '',
                    isSelect: true
                },
                {
                    label: '男',
                    value: 'M',
                    isSelect: false
                },
                {
                    label: '女',
                    value: 'F',
                    isSelect: false
                },],
            //筛选来源
            fwwSourceList: [{label: '全部', value: '', isSelect: true}],
            tableColumns1: fanCol.call(this)
        }
    },
    mounted() {
        this.ButtonPermissions = this.pageAction[this.$route.name];
        this.getFanList();
        this.getSource();

        // 子公司列表不显示来源
        // let curOrg = localStorage.orgId;
        // curOrg!=15&&this.tableColumns1.splice(5,1)
    },
    methods: {
        getSource() {
            let url = "/user-server/platform/department/pageDepartment"
            let data = {
                // 类型搜索：3：部门，4：区域，5：商场，10：店铺
                type: 5,
            }
            this.$ajaxPost(url, data)
                .then(res => {
                    if (res.code != 10000) return false;

                    let resData =res.data.list || []

                    for (let item of resData) {
                        this.fwwSourceList.push({
                            label: item.name,
                            value: item.orgId,
                            isSelect: false
                        })
                    }

                }).catch(err => {
                log(err)
            })
        },
        filterFollowStatus(d) {
            this.searchData.status = d[0]
            this.$nextTick(() => {
                this.getFanList()
            })
        },
        filterFollowMethod(d) {
            this.searchData.subscribeScene = d[0]
            this.getFanList()
        },
        ok() {
            if (this.fansTabIndex >= 0) {
                this.tableData1[this.fansTabIndex].remark = this.fansRemark;
                // console.log(this.tableData1[this.fansTabIndex].id, this.fansRemark || " ")
                this.getFan(this.tableData1[this.fansTabIndex].id, this.fansRemark || " ");
            }
            this.cancal();
        },
        cancal() {
            this.fansRemark = '';
            this.modal8 = false;
        },
        //寻找
        remove(index) {
            this.tableData1.splice(index, 1);
            this.disappear = false;
            this.appear = true;
        },
        //寻找昵称城市
        onIcon() {
            this.searchData.page = 1;
            this.getFanList(this.searchFind);
        },
        // //寻找昵称
        // onSearch(){
        //     this.getFanList(this.searchFind);
        // },

        dateFormat(time) {
            //转化成日期
            var date = new Date(time);
            var year = date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
            * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
            * */
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            // var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            // var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            // var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            // 拼接
            return year + "-" + month + "-" + day;
        },

        //日期选择器
        onTimeChange() {

            this.searchData.beginTime = this.searchData.timeRange[0] || '1900-01-01';
            this.searchData.endTime = this.searchData.timeRange[1] || '9999-12-31';
            console.log(this.searchData.beginTime + " " + this.searchData.endTime)
            this.searchData.beginTime = this.dateFormat(this.searchData.beginTime) + ' 00:00:00';
            this.searchData.endTime = this.dateFormat(this.searchData.endTime) + ' 23:59:59';
            let obj = {
                beginTime: this.searchData.beginTime,
                endTime: this.searchData.endTime
            }
            this.searchData.page = 1;
            this.getFanList(obj)
        },
        //取消日期
        onTimeCancel() {
            this.searchData.page = 1;
            this.searchData.timeRange = [];
            this.searchData.beginTime = '';
            this.searchData.endTime = '';
            this.getFanList({})
        },
        //页数
        onChange(page) {
            this.searchData.page = page;
            console.log(page);
            this.getFanList(page);
        },
        //每页条数
        changeSize(size) {
            this.searchData.size = size;
            this.getFanList(size);
        },
        //获取粉丝列表
        getFanList() {
            this.loading = true;
            // /crm-server/api/fans/list
            let {status, subscribeScene} = this.searchData
            this.$ajaxPost('/member-server/api/fans/list', {
                page: this.searchData.page,
                size: this.searchData.size,
                content: this.searchFind,
                beginTime: this.searchData.beginTime,

                endTime: this.searchData.endTime,
                orgId: this.searchData.source,
                sex: this.searchData.sex,
                status,
                subscribeScene,
            })
                .then(res => {
                    this.loading = false;
                    if (res.code === 10000) {
                        this.total = res.data.count || 0;//页数
                        this.tableData1 = res.data.list || [];
                    }
                })
                .catch(err => {
                    this.loading = false;
                    log(err)
                })
        },
        //修改备注
        getFan(id, remark) {
            this.$ajaxPost('/member-server/api/fans/edit', {
                id,
                remark
            })
                .then(res => {
                    if (res.code === 10000) {
                        this.getFanList();
                    }
                })
                .catch(err => {
                    console.info(err)
                })
        }

    },
}
</script>
<style lang="scss" scoped>
.fan-message {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
}

.fwwFanMessageH1 h1 {
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 700;
    color: rgba(62, 69, 82, 1);
    line-height: 30px;
    margin-bottom: 30px;
}

.modal-content {
    padding: 30px 0;
    display: flex;
    justify-content: flex-start;
}
.fwwFanMessageNavigation Button {
    margin-left: 20px;
}

.fwwfansSpan {
    font-size: 14px;

    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(62, 69, 82, 1);
    margin-left: 40px;
}
</style>

