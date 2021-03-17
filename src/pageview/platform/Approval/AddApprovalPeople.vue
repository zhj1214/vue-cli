<template>
  <div class="addApproval-page">
    <h2 class="page-title">
      <span
        @click="backListPage"
      ><i
        class="icon iconfont iconBack"
        title="返回"
      /></span>
      <span @click="backListPage">添加审批人</span>
    </h2>
    <div class="add-content">
      <div class="approval-jd">
        审批人
      </div>
      <Row
        :gutter="64"
        style="padding-top: 24px"
      >
    <i-col
          v-for="(item, index) in approvalIds"
          :key="index"
          span="4"
        />
        <div
          class="approve-people"
          style="position: relative; min-height: 90px"
        >
          <div
            style="max-width: 130px"
            @click="openDetail(item)"
          >
            <div style="overflow: hidden">
              <span class="approval-roleName">{{ item.name }}</span>
              <span class="approval-store">{{ item.departmentName }}</span>
            </div>
            <div class="spproval-orgName">
              {{ item.belongOrg }}
            </div>
          </div>
          <i
            class="iconfont iconClose"
            style="position: absolute; top: 10px; right: 10px"
            @click="deleteApproval(index)"
          />
        </div>
        <Modal
          v-model="detailModal"
          :title="item.name"
          ok-text="关闭"
          :mask-closable="false"
          @on-ok="closeDetail"
        >
        <Table :columns="approvalColumns" 
		:data="approvalList" 
		height="200">
            <template v-slot:name="row">
              <span>{{ row.name }}</span>
            </template>
            <template v-slot:phone="row">
              <span>{{ row.phone }}</span>
            </template>
          </Table>
        </Modal>
		</i-col>
      </Row>
    </div>
    <div
      class="add-content"
      style="margin-top: 24px"
    >
      <div class="top-notice">
        <img
          src="../../../assets/images/icon-info.png"
          alt=""
          style="
				width: 24px;
				height: 24px;
				position: absolute;
				left: 12px;
				top: 12px;
				"
        >
        <span>注：当所有审批角色对应的审批人为空时，审批自动通过。</span>
      </div>
      <LeftTreeLayout style="position: relative">
		<template v-slot:left>
		<orgTree
          @select-change="treeChange"
        />
		</template>
		<template v-slot:right>
		<div
          class="content"
        >
          <div class="show-table">
            <div
              class="clear"
              style="margin-bottom: 24px"
            >
              <i-input
                v-model="pageData.name"
                placeholder="角色名称检索"
                search
                class="w250 fix-iview-icon"
                @on-enter="onSearch"
                @on-click="onSearch"
              />
            </div>
            <Table
              :columns="columns"
              :data="tableList"
            >
              <template
                v-slot:name="row"
              >
                <span>{{ row.name }}</span>
              </template>
              <template
                v-slot:employeeCount="row"
                
              >
                <span>{{ row.employeeCount }}</span>
              </template>
              <template
                v-slot:action="row"
                
              >
                <Button
                  class="action-text"
                  @click="addApproval(row)"
                >
                  添加
                </Button>
              </template>
            </Table>
          </div>
        </div>
		<div >
		<div
          class="footer"
          style="position: absolute; right: 0; margin-top: 24px"
        >
          <Button
            style="margin-right: 10px"
            @click="cancelApproval()"
          >
            取消
          </Button>
          <Button
            type="primary"
            @click="save()"
          >
            保存
          </Button>
        </div>
	</div>
		</template>
	
      </LeftTreeLayout>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import orgTree from "../../../components/orgTree/orgTree";
import mixinsPlatform from "../../../mixins/mixinsPlatform"
import LeftTreeLayout from "../../../layout/LeftTreeLayout";
import mixinsGlobal from "../../../mixins/mixinsGlobal";
// import func from 'vue-temp/vue-editor-bridge';
export default {
	mixins: [mixinsPlatform, mixinsGlobal],
	components: {
		orgTree,
		LeftTreeLayout,
	},
	data() {
		return {
		approveTradeName: "", //审批名称
		approvalIds: [], //审批人数组
		treeItem: {},
		tableList: [],
		columns: [
			{
			title: "角色名称",
			slot: "name",
			},
			{
			title: "关联员工数量",
			slot: "employeeCount",
			},
			{
			title: "操作",
			slot: "action",
			},
		],
		tableLoading: false,
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
			slot: "name",
			},
			{
			title: "账号",
			slot: "phone",
			},
		], //审批人详情表格表头
		approvalPeople: {
			list: [],
		},
		roles: [],
		addNode: "", //判断是从编辑还是添加过来,1是添加，2是编辑
		nodeList: [],
		clickAdd:'',//判断是点击完添加之后点击的取消还是直接取消
		};
	},
	created() {
		this.approvalPeople = this.$route.query.approvalPeople;
		let ids = [];
		this.addNode = this.$route.query.addNode;
		let currentIdx = this.$route.query.currentIdx;
		this.nodeList = this.approvalPeople.list;
		// //如果最后一级节点为空，则删掉
		if (this.nodeList.length > 0) {
			// console.log('addNode',this.addNode)
			if (this.addNode == 1) this.nodeList[currentIdx] = [];
				let targetNode = this.nodeList[currentIdx];
				// 不是新添加的节点
				let notAddNode = targetNode !== undefined;
				if (notAddNode) {
					targetNode.map((item) => {
					// console.log("item.roles", item.roles);
					item.roles.map((element) => {
						ids.push(element.roleId);
					});
					});
				}
				this.editApproval(ids);
			}
	},
	mounted() {
		// 更新左边树 和 右边的表
		// this.$eventEmitter.trigger("orgTreelist", {
		// ...this.treeItem,
		// ...{
		// 	departmentId: localStorage.getItem("departmentId"),
		// 	page: 1,
		// 	size: 100,
		// },
		// });
		// this.getRoleTable(); // 拉取表格
	},
	computed: {},
	methods: {
		// 返回上一页
		backListPage() {
			this.$router.push({
				path: "/platform/approval/edit",
				query: {
				id: this.approvalPeople.approveTradeId,
				orgId: this.approvalPeople.orgId,
				edit: true,
				approvalIds: this.approvalPeople,
				},
			});
		},
		//编辑审批人
		editApproval(ids) {
			this.$ajaxPost("/user-server/platform/role/batchDetail", ids).then(
				(res) => {
				if (res && res.code === 10000) {
					this.approvalIds = res.data;
					// 不是新添加的节点
					let notAddNode = this.targetNode !== undefined;
					if (notAddNode) {
					this.targetNode.forEach((item) => {
						res.data.forEach((element) => {
						if (item.roles[0].roleId == element.id)
						// console.log('不是新添加的节点',item.approverNum)
							item.approverNum = element.employeeCount;
						});
					});
					}
				}
				}
			);
		},
		// 是否有相同的角色
		hasDuplicateRole(id) {
			return this.approvalIds.some((item) => item.id === id);
		},
		//添加审批人
		addApproval(row) {
			if (this.hasDuplicateRole(row.id)) {
				this.$Message.error("已存在相同角色");
				return;
			}
			this.clickAdd = true;//此时证明点击过添加按钮
			var self = this;
			self.$ajaxGet("/user-server/platform/role/detail", {
				roleId: row.id,
				})
			.then((res) => {
				if (res && res.code === 10000) {
					if (res.data) {
						// console.log('直接进来的',self.approvalIds.length)
						//此时审批人数组为空,说明是直接添加或者是在上一个页面删掉后过来添加
					if (self.approvalIds.length == 0) {
						self.approvalIds.push(res.data);
						let testList = self.approvalPeople.list; //几级节点
						let currentIndex = self.$route.query.currentIdx;
						let testObj = [
						{
							approverNum: row.employeeCount,
							grade: currentIndex,
							roles: [
							{
								roleId: row.id,
								orgId: this.approvalPeople.orgId,
							},
							],
						},
						];
						//添加进来的如果最后一个是空数组
						if(testList[currentIndex]){
							testList[currentIndex].push(testObj[0]);
						} else{
							testList.push(testObj);
						}
						self.approvalPeople.list = testList;
					} else {
						//此时审批人数组不为空,说明是编辑的时候添加
						self.approvalIds.push(res.data);
						// self.getShopTable(row.id);
						let testList = self.approvalPeople.list;
						//添加审批人
						let testObj = [
						{
							approverNum: row.employeeCount,
							grade: currentIndex,
							roles: [
							{
								roleId: row.id,
								orgId: this.approvalPeople.orgId,
							},
							],
						},
						];

						let currentIndex = self.$route.query.currentIdx;
						let firstAdd =testList.length == 0 ;
						// testList.length == 0 || testList.length < currentIndex + 1;
						if (firstAdd) {
							testList.push(testObj);
						} else {
							testList[currentIndex].push(testObj[0]);
						}
						self.approvalPeople.list = testList;
					}
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
				this.getRoleTable();
			});
		},
		onPageSize(size) {
			this.pageData.size = size;
			this.onSearch();
		},
		onSearch() {
			this.pageData.page = 1;
			this.$nextTick(() => {
				this.getRoleTable(this.pageData.name);
			});
		},
		treeChange(item) {
			const data = JSON.parse(JSON.stringify(item));
			delete data.children;
			this.treeItem = data;
			this.$nextTick(() => {
				this.getRoleTable();
			});
		},
		//获取角色表格
		getRoleTable(searchContent, id) {
			this.$ajaxPost("/user-server/platform/role/list/employee", {
				searchType: "name",
				searchContent: searchContent,
				departmentId:
				id || this.treeItem.id || localStorage.getItem("departmentId"),
				page: this.pageData.page,
				size: this.pageData.size,
			})
			.then((res) => {
			if (res && res.code === 10000) {
				this.tableList = res.data.list;
			}
			})
			.catch((err) => {
			console.log(err);
			});
		},
		//点击审批人详情弹窗出现
		openDetail(item) {
			this.getShopTable(item.id);
			this.detailModal = true;
		},
		//获取角色详情表格数据
		getShopTable(id) {
			this.$ajaxPost("/user-server/platform/role/detail/employee", {
				roleId: id,
				page: this.pageData.page,
				size: this.pageData.size,
			})
			.then((res) => {
			// console.log(res);
			if (res && res.code === 10000) {
				this.approvalList = res.data.list;
			}
			})
			.catch((err) => {
			console.log(err);
			});
		},
		//关闭审批人详情弹窗
		closeDetail() {
			this.detailModal = false;
		},
		//删除当前添加的这个审批人
		deleteApproval(index) {
			this.approvalIds.splice(index, 1);
			this.approvalPeople.list[this.$route.query.currentIdx].splice(index, 1);
		},
		//点击取消返回到编辑页面
		cancelApproval() {
		if(this.clickAdd){
			this.approvalPeople.list=this.approvalPeople.list.splice(this.approvalPeople.list.length - 1, 1);
		}
		this.$router.push({
			path: "/platform/approval/edit",
			query: {
			id: this.approvalPeople.approveTradeId,
			orgId: this.approvalPeople.orgId,
			edit: true,
			approvalIds: this.approvalPeople,
			},
		});
		},
		//保存添加的审批人信息并回到编辑页面
		save() {
		this.$router.push({
			path: "/platform/approval/edit",
			query: {
			id: this.approvalPeople.approveTradeId,
			orgId: this.approvalPeople.orgId,
			edit: true,
			approvalIds: this.approvalPeople,
			},
		});
		},
	},
};
</script>

<style scoped lang="scss">
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

.add-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;

  .add-title {
    font-family: SFUIDisplay-Medium, SFUIDisplay;
    font-weight: 700;
    color: #171725;
    font-size: 16px;
    margin-bottom: 24px;
  }

  .font-size12 {
    font-size: 12px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: #92929d;
  }

  .font-size14 {
    height: 24px;
    font-size: 14px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: #171725;
    line-height: 24px;
  }
}

.approve-people {
  background: #f6f6f7;
  border-radius: 8px;
  border: 1px solid #d5d5dc;
  padding: 16px;
  min-height: 56px;
  cursor: pointer;
}

.approval-roleName {
  font-size: 14px;
  font-family: SFUIDisplay-Light, SFUIDisplay;
  font-weight: 300;
  color: #44444f;
  padding-right: 5px;
  border-right: 1px solid #e2e2e9;
}

.approval-store {
  padding-left: 5px;
  font-size: 14px;
  font-family: SFUIDisplay-Light, SFUIDisplay;
  font-weight: 300;
  color: #696974;
}

.spproval-orgName {
  font-size: 12px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: #92929d;
}

.approval-jd {
  height: 38px;
  background: #fafafb;
  border-radius: 8px;
  line-height: 38px;
  padding-left: 16px;
  color: #44444e;
}

.icon-people {
  width: 24px;
  height: 24px;
  line-height: 24px;
  float: right;
  // border: 1px dashed #ccc;
}

.top-notice {
  height: 48px;
  line-height: 48px;
  background: #e9e8ff;
  border-radius: 4px;
  border: 1px solid #756cea;
  position: relative;
  padding-left: 50px;
  // background: url(../../../assets/images/icon-info.png) no-repeat;
}

.ivu-btn {
  border-color: transparent !important;
}
</style>
