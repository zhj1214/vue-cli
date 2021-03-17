<template>
  <div class="install-page">
    <div
      slot="right"
      class="content"
    >
      <div class="query clear">
        <!-- <Cascader
          :data="orgData"
          v-model="orgValue"
          class="w250"
          style="float: left"
          @on-change="onChangeOrg"
          placeholder="所属组织"
          change-on-select
        ></Cascader> -->
        <BelongOrgCascade
          class="w250"
          style="float: left"
          @selectOrg="searchOrgId"
        />
        <i-input
          v-model="pageData.approveTradeName"
          placeholder="请输入审批流程名称"
          search
          class="w250 fix-iview-icon"
          style="float: right"
          @on-enter="onSearch"
          @on-click="onSearch"
        />
      </div>
      <Table
        :columns="columns"
        :data="tableList"
      >
        <template
          slot="approveTradeName"
          slot-scope="{ row }"
        >
          <span>{{ row.approveTradeName }}</span>
        </template>
        <template
          slot="status"
          slot-scope="{ row }"
        >
          <div v-if="row.status == 1">
            <Badge status="success" />
            <span>{{ "启用" }}</span>
          </div>
          <div v-if="row.status == -1">
            <Badge status="default" />
            <span>{{ "停用" }}</span>
          </div>
        </template>
        <template
          slot="departmentName,completeDepartmentName"
          slot-scope="{ row }"
        >
          <div class="heigher">
            {{ row.departmentName }}
          </div>
          <div class="current">
            {{ row.completeDepartmentName }}
          </div>
        </template>
        <template
          slot="updateTime"
          slot-scope="{ row }"
        >
          <span>{{ row.updateTime }}</span>
        </template>
        <template
          slot="action"
          slot-scope="{ row }"
        >
          <!-- <Poptip
						confirm
						title='编辑审批'
						transfer
						@on-ok="editApproval(row.approveTradeId)"
						@on-cancel="cancel">
						<Button class="action-text" v-if="__hasPower('edit')">编辑</Button>
					</Poptip> -->
          <Button
            v-if="__hasPower('edit')"
            class="action-text"
            @click="update(row)"
          >
            编辑
          </Button>
          <div v-if="row.editModal">
            <Modal
              v-model="row.editModal"
              title=""
              :mask-closable="false"
              @on-ok="editApproval(row)"
              @on-cancel="cancel"
            >
              <p>审批编辑后，在启用状态下：</p>
              <p>（1）新提交的内容，需要进入启用后的审批流程；</p>
              <p>
                （2）历史待审批、已超时、已撤回、已驳回的变更为待审批状态，并开始启用后的审批流程。
              </p>
              <p>是否确认编辑？</p>
            </Modal>
          </div>
          <!-- <Poptip
						confirm
						:title='statusTitle'
						transfer
						@on-popper-show = "showDisable(row.status)"
						@on-ok="disable(row.status,row.approveTradeId)"
						@on-cancel="cancel">
						<Button v-if="row.status == 1 && __hasPower('start')" class="action-text">停用</Button>
						<Button v-if="row.status == -1 &&  __hasPower('stop')" class="action-text">启用</Button>
					</Poptip> -->
          <Button
            v-if="row.status == 1 && __hasPower('stop')"
            class="action-text"
            @click="stop(row)"
          >
            停用
          </Button>
          <div v-if="row.stopModal">
            <Modal
              v-model="row.stopModal"
              title=""
              @on-ok="stopApproval"
              @on-cancel="cancel"
            >
              <p>审批停用后：</p>
              <p>（1）新提交的内容不需审批自动生效；</p>
              <p>（2）历史待审批的内容自动通过审批；</p>
              <p>
                （3）历史已超时、已撤回、已驳回的审批维持原状态，重新提交审批将自动通过。
              </p>
              <p>是否确认停用？</p>
            </Modal>
          </div>
          <Button
            v-if="row.status == -1 && __hasPower('start')"
            class="action-text"
            @click="start(row)"
          >
            启用
          </Button>
          <div v-if="row.startModal">
            <Modal
              v-model="row.startModal"
              title=""
              @on-ok="startApproval"
              @on-cancel="cancel"
            >
              <p>审批启用后：</p>
              <p>（1）新提交的内容，需要进入启用后的审批流程；</p>
              <p>
                （2）历史待审批、已超时、已撤回、已驳回的变更为待审批状态，并开始启用后的审批流程。
              </p>
              <p>是否确认启用？</p>
            </Modal>
          </div>
        </template>
      </Table>
      <div style="overflow: hidden; margin-top: 24px">
        <!-- <Page
          :total="pageData.count"
          show-elevator
          show-total
          class="pagebox"
          @on-change="onPageChange"
          @on-page-size-change="onPageSize"
        /> -->
        <Page
          class="pagebox"
          :total="pageData.count"
          :current="pageData.page"
          :page-size="pageData.size"
          show-elevator
          show-sizer
          show-total
          @on-change="onPageChange"
          @on-page-size-change="onPageSize"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { createOrgCascade } from "../../../utils/tools";

import  BelongOrgCascade  from "../../../components/BelongOrgCascade";
import mixinsGlobal from "../../../mixins/mixinsGlobal";
export default {
  components: {BelongOrgCascade},
  mixins: [mixinsGlobal],
  data() {
    return {
      tableList: [],
      columns: [
        {
          title: "审批流程名称",
          slot: "approveTradeName",
        },
        {
          title: "状态",
          slot: "status",
          filters: [
            {
              label: "已启用",
              value: 1,
            },
            {
              label: "已停用",
              value: -1,
            },
          ],
          filterMultiple: false,
          filterRemote: this.filterStatus,
          // filterRemote:(val)=>{
          // 	let status = val[0];
          // 	// this.selectRadio(status)
          // 	this.filterStatus()
          // }
        },
        {
          title: "所属组织",
          slot: "departmentName,completeDepartmentName",
        },
        {
          title: "最后更新时间",
          slot: "updateTime",
        },
        {
          title: "操作",
          slot: "action",
        },
      ],
      isEditStatus: false,
      modalStatus: false,
      tableLoading: false,
      pageData: {
        page: 1,
        size: 10,
        count: 0,
        approveTradeName: "",
        beginTime: "",
        endTime: "",
      },
      orgValue: [],
      orgData: [],
      statusTitle: "", //状态tutle
      editModal: false, //编辑二次弹窗是否显示
      editId: "", //编辑传参
      stopModal: false, //停用二次弹窗是否显示
      stopId: "",
      stopStatus: "",
      startModal: false, //启用二次弹窗是否显示
      startId: "",
      startStatus: "",
    };
  },
  computed: {},
  created() {
    this.getInstallTable();
    this.getOrgData();
  },
  mounted() {},
  methods: {
    // 获取所属组织数据
    getOrgData() {
      this.$ajaxGet("/user-server/platform/department/entityTree", {
        departmentId: localStorage.getItem("departmentId"),
      })
        .then((res) => {
          if (res && res.code === 10000) {
            if (res.data) {
			  this.orgData = createOrgCascade(res.data, "title", "orgId");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onPageChange(page) {
      this.pageData.page = page;
      this.$nextTick(() => {
        this.getInstallTable();
      });
    },
    onPageSize(size) {
      this.pageData.size = size;
      this.$nextTick(() => {
        this.getInstallTable();
      });
    },
    onSearch() {
      this.pageData.page = 1;
      this.$nextTick(() => {
        this.getInstallTable(this.pageData.approveTradeName);
      });
    },
    // onChangeOrg(val) {
      
	// },
	//组织筛选
	searchOrgId(val){
    let orgId = val;
    console.log('searchOrgId, orgId', orgId)
		this.pageData.page = 1;
		this.$nextTick(() => {
			this.getInstallTable("", "", orgId);
		});
	},
    //筛选状态
    filterStatus(val) {
      let status = val[0];
      this.pageData.page = 1;
      this.$nextTick(() => {
        this.getInstallTable("", status);
      });
    },
    //获取审批设置表格数据
    getInstallTable(approveTradeName, status, orgId) {
      this.$ajaxPost("/approve-server/api/approve/setting/list", {
        orgId: orgId || localStorage.getItem("orgId"),
        approveTradeName: approveTradeName,
        page: this.pageData.page,
        size: this.pageData.size,
        status: status,
      })
        .then((res) => {
          if (res && res.code === 10000) {
            this.tableList = res.data.list.map((item) => {
              return {
                ...item,
                ...{
                  editModal: false,
                  stopModal: false,
                  startModal: false,
                },
              };
            });
            this.pageData.count = res.data.count;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //点击编辑按钮弹窗出现
    update(row) {
      this.editId = row.approveTradeId;
      row.editModal = true;
    },
    //点击确认按钮进入编辑审批页面
    editApproval(row) {
      this.$router.push({
        path: "/platform/approval/edit",
        query: {
          id: this.editId,
          orgId: row.orgId,
          edit: false,
        },
      });
    },
    //点击取消按钮,退回到审批设置页面
    cancel() {
      this.$router.push("/platform/Approval/setting");
    },
    //点击停用按钮弹窗出现
    stop(row) {
      this.stopId = row.approveTradeId;
      this.stopStatus = row.status;
      row.stopModal = true;
      console.log("stopId", this.stopId);
    },
    //点击确认停用审批
    stopApproval() {
      this.disable(this.stopStatus, this.stopId);
    },
    //点击启用按钮弹窗出现
    start(row) {
      this.startId = row.approveTradeId;
      this.startStatus = row.status;
      row.startModal = true;
      console.log("startId", this.startId);
    },
    //点击确认按钮启用审批
    startApproval() {
      this.disable(this.startStatus, this.startId);
    },
    //修改二次确认框标题
    // showDisable(status){
    // 	if(status == -1){
    // 		this.statusTitle = '启用审批'
    // 	}else if(status == 1){
    // 		this.statusTitle = '停用审批'
    // 	}
    // },
    //启用停用调的接口
    disable(status, newId) {
      let newStatus = status === 1 ? -1 : 1;
      this.$ajaxPost("/approve-server//api/approve/setting/status", {
        approveTradeId: newId,
        status: newStatus,
      })
        .then((res) => {
          if (res && res.code === 10000) {
            this.$nextTick(() => {
              this.$Message.success(res.message || "操作成功");
              this.getInstallTable();
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.install-page {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
}

.query {
  margin-bottom: 24px;
}
.ivu-btn {
  border-color: transparent !important;
  padding: 0 5px !important;
}
.ivu-btn:focus {
  box-shadow: none;
  background: none;
}
.ivu-btn:hover {
  box-shadow: none;
  background: none;
}
.heigher{
		font-size: 14px;
		font-family: SFUIDisplay-Light, SFUIDisplay;
		font-weight: 300;
		color: #171725;
	}
	.current{
		font-size: 12px;
		font-family: SFUIDisplay-Light, SFUIDisplay;
		font-weight: 300;
		color: #92929D;
		line-height: 22px;
	}
</style>
