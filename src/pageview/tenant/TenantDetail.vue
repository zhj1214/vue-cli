<template>
  <div class="tenant-detail">
    <h2 class="h2">
      <span @click="$router.replace('/tenant/list')"><img
        :src="$backIcon"
        alt=""
      >商户详情</span>
    </h2>
    <!--基本信息-->
    <div class="detail-card clear">
      <div class="left-card">
        <img
          :src="detailObj.logo||default_icon"
          class="logo"
          alt="logo"
        >
        <p><strong style="font-size: 24px;">{{ detailObj.name }}</strong></p>
        <p>
          <span
            :class="detailObj.status==='running'?'is-running':'is-stop'"
          >{{ runStatusMap[detailObj.status] }}</span>
        </p>
        <p>
          <img
            :src="versionTypeMap[detailObj.versionType]?versionTypeMap[detailObj.versionType].icon:''"
            alt=""
            :title="versionTypeMap[detailObj.versionType]?versionTypeMap[detailObj.versionType].title:''"
          >
          <img
            :src="authStatusMap[detailObj.authStatus]?authStatusMap[detailObj.authStatus].icon:''"
            alt=""
            :title="authStatusMap[detailObj.authStatus]?authStatusMap[detailObj.authStatus].title:''"
          >
        </p>
								
        <p>
          <span
            class="is-active pointer"
            style="font-size: 14px;margin-right: 5px;"
            @click="onUpgrade"
          >立即升级</span>
          <span
            class="is-active pointer"
            style="border-left:1px solid #E2E2EA;font-size: 14px;padding-left: 5px;"
            @click="onChangeValid"
          >更改认证</span>
        </p>
      </div>
      <div class="right-card">
        <div class="fix-actions">
          <Button
            class="button"
            type="primary"
            @click="onUpdateTenant"
          >
            编辑
          </Button>
										
          <Dropdown @on-click="onDropActions">
            <a href="javascript:void(0)">
              <Icon
                class="icon"
                color="#756CEA"
                size="28"
                type="ios-more"
              />
            </a>
            <DropdownMenu slot="list">
              <!--2020年3月17日11:39:32暂时关闭商户入口-->
              <!--<DropdownItem class="text-left" v-if="detailObj.status==='running'" name="close">关闭商户
														</DropdownItem>-->
              <DropdownItem
                v-if="detailObj.status==='closed'"
                class="text-left"
                name="open"
              >
                启用商户
              </DropdownItem>
              <DropdownItem
                class="text-left"
                name="delete"
              >
                删除
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="row-info">
          <div class="item">
            <p>公司编码</p>
            <p>{{ detailObj.orgId }}</p>
          </div>
          <div class="item">
            <p>商户类型</p>
            <p>{{ storeTypeMap[detailObj.storeType] }}</p>
          </div>
          <div class="item">
            <p>所属行业</p>
            <p>{{ detailObj.industryName }}</p>
          </div>
        </div>
        <div class="row-info">
          <div class="item item-2">
            <p>公司地址</p>
            <p>
              {{ detailObj.address.province }}
              {{ detailObj.address.city }}
              {{ detailObj.address.area }}
              {{ detailObj.address.addressDetail }}
            </p>
          </div>
          <div class="item item-1">
            <p>门店数</p>
            <p>{{ detailObj.storeNum }}</p>
          </div>
        </div>
								
        <div class="row-info">
          <div class="item">
            <p>创建人</p>
            <p>{{ detailObj.creatorName }}</p>
          </div>
          <div class="item">
            <p>创建时间</p>
            <p>{{ $format(detailObj.createTime) }}</p>
          </div>
          <div class="item">
            <p>到期时间</p>
            <p>{{ $format(detailObj.expireTime) }}</p>
          </div>
        </div>
      </div>
    </div>
    <!--组织信息-->
    <div class="detail-org">
      <h3>组织信息</h3>
      <div class="org-list clear">
        <div class="left-org">
          <Tabs
            type="card"
            @on-click="onSelectNextOrg"
          >
            <TabPane
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
            />
          </Tabs>
        </div>
      </div>
      <div class="org-detail">
        <div class="sub-title clear">
          <strong>{{ storeDetail.orgName }} 实时数据更新：</strong>
          <span>该组织由 <b>{{ storeDetail.creatorName }}</b> 于 {{ $format(storeDetail.createTime) }} 创建</span>
        </div>
								
        <div class="org-card">
          <div class="card-item">
            <div class="icon">
              <img
                src="../../assets/images/tenant/employee.png"
                alt=""
              >
            </div>
            <p class="strong">
              <strong>{{ $formatNumber(storeDetail.employeeNum,0) }}</strong>人
            </p>
            <p class="p">
              门店员工数
            </p>
          </div>
          <div class="card-item">
            <div class="icon">
              <img
                src="../../assets/images/tenant/icon-member.png"
                alt=""
              >
            </div>
            <p class="strong">
              <strong>{{ $formatNumber(storeDetail.memberNum,0) }}</strong>人
            </p>
            <p class="p">
              注册会员数
            </p>
          </div>
          <div class="card-item">
            <div class="icon">
              <img
                src="../../assets/images/tenant/icon-product.png"
                alt=""
              >
            </div>
            <p class="strong">
              <strong>{{ $formatNumber(storeDetail.shopsNum,0) }}</strong>件
            </p>
            <p class="p">
              商品数
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--操作记录-->
    <div class="detail-logs">
      <div class="clear">
        <h3 style="float: left;font-size: 18px;">
          操作记录
        </h3>
        <i-input
          v-model="pageData.searchKey"
          style="float: right;"
          class="w250"
          placeholder="操作人 / 操作内容 检索"
          search
          @on-enter="onSearch"
          @on-click="onSearch"
        />
      </div>
      <div class="table-content">
        <BaseTable
          :list="tableList"
          :col="tableCol"
          :page-data="pageData"
          @on-pageSize="onPageSize"
          @on-pageChange="onPageChange"
        />
      </div>
    </div>
    <Modal
      v-model="updateModalStatus"
      title="编辑商户"
      :mask-closable="false"
      @on-cancel="onCloseUpdateModal"
      @on-ok="onConfirmUpdateModal"
    >
      <div class="body">
        <TenantEdit
          v-if="updateModalStatus"
          ref="tenantEdit"
          style="width: 100%;"
          @onCloseModal="onCloseUpdateModal"
        />
      </div>
						
      <div
        slot="footer"
        class="footer"
      >
        <Button
          type="primary"
          ghost
          @click="onCloseUpdateModal"
        >
          取消
        </Button>
        <Button
          type="primary"
          @click="onConfirmUpdateModal"
        >
          确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
	import TenantEdit from "./TenantEdit";
	import trial_icon from "../../assets/images/tenant/icon-trial.png";
	import official_icon from "../../assets/images/tenant/icon-release.png";
	import auth_icon from "../../assets/images/tenant/icon-authorized.png";
	import not_auth_icon from "../../assets/images/tenant/icon-unauthorized.png";
	import default_icon from "../../assets/images/tenant/icon-tenant-logo.png";
	import BaseTable from "../base/BaseTable";
	import {renderTime} from "../../utils/tools";
	
	export default {
		name: "TenantDetail",
		components: {
			TenantEdit, BaseTable
		},
		data() {
			return {
				tenantId: this.$route.query.tenantId || '',
				orgId: this.$route.query.orgId || '',
				tab: 1,
				updateModalStatus: false,
				default_icon,
				detailObj: {
					versionType: "",
					authStatus: "",
					address: {}
				},
				storeTypeMap: {
					Personal: '个人商户',
					Chain: '连锁店',
				},
				versionTypeMap: {
					// 试用版
					Trial: {
						title: "试用版",
						icon: trial_icon
					},
					// 正式版
					Official: {
						title: "正式版",
						icon: official_icon
					},
				},
				runStatusMap: {
					expired: "过期",
					running: "运行中",
					closed: "已关闭"
				},
				authStatusMap: {
					NOT_AUTH: {
						title: "未认证",
						icon: not_auth_icon
					},
					// 认证中
					// AUTHING: {},
					AUTHED: {
						title: "已认证",
						icon: auth_icon
					}
				},
				storeList: [],
				storeItem: {
					index: 0,
				},
				storeDetail: {
					memberNum: 0,
					employeeNum: 0,
					creatorName: "",
					creatorPhone: "",
					createTime: "",
				},
				pageData: {
					page: 1,
					size: 10,
					count: 0,
					searchKey: ""
				},
				tableList: [],
				tableCol: [
					{
						title: "操作人", key: "operatorName",
						render: (h, params) => {
							return h('div', [
								h('p', params.row.operatorName),
								h('p', {class: 'p-text'}, params.row.operatorPhone),
							]);
						}
					},
					{
						title: "操作类型/内容",
						render: (h, params) => {
							return h('div', [
								h('p', params.row.operateType),
								h('p', {class: 'p-text'}, params.row.operateContent),
							]);
						},
					},
					{title: "操作时间", key: "createTime", render: renderTime},
				]
			};
		},
		created() {
			this.getTenantDetail();
			this.getStoreList();
			this.getTenantLog();
			this.getStoreMemberCount();
		},
		methods: {
			getTenantDetail() {
				this.$ajaxGet('/user-server/platform/store/detail', {id: this.tenantId})
					.then(res => {
						if (res && res.code === 10000) this.detailObj = res.data;
					});
			},
			getStoreMemberCount() {
				this.$ajaxGet('/member-server/api/remote/member/count', {
					orgId: this.storeItem.orgId || this.orgId
				})
					.then(res => {
						if (res && res.code === 10000) {
							this.storeDetail.memberNum = res.data;
						}
					});
			},
			// 获取旗下门店
			getStoreList() {
				this.$ajaxGet('/user-server/platform/store/sub/list', {id: this.tenantId})
					.then(res => {
						if (res && res.code === 10000) {
							const {storeList, ...other} = res.data || {};
							this.storeList = (storeList || []).map((item, index) => {
								item.index = index;
								return item;
							});
							this.storeDetail.creatorName = other.creatorName;
							this.storeDetail.creatorPhone = other.creatorPhone;
							this.storeDetail.createTime = other.createTime;
							this.storeDetail.employeeNum = other.employeeNum;
						}
					});
			},
			onPageSize(size) {
				this.pageData.size = size;
				this.pageData.page = 1;
				this.$nextTick(() => {
					this.getTenantLog();
				});
			},
			onPageChange(page) {
				this.pageData.page = page;
				this.$nextTick(() => {
					this.getTenantLog();
				});
			},
			onSearch() {
				this.pageData.page = 1;
				this.$nextTick(() => {
					this.getTenantLog();
				});
			},
			getTenantLog() {
				this.$ajaxGet('/user-server/platform/operateLog/store/log', {
					...this.pageData,
					departmentId: this.tenantId
				})
					.then(res => {
						if (res && res.code === 10000) {
							this.tableList = res.data.list || [];
							this.pageData.count = res.data.count;
						}
					});
			},
			getStoreDetail() {
				const {id} = this.storeItem;
				this.$ajaxGet('/user-server/platform/store/sub/detail', {id})
					.then(res => {
						if (res && res.code === 10000) {
							const json = res.data || {};
							this.storeDetail.creatorName = json.creatorName;
							this.storeDetail.creatorPhone = json.creatorPhone;
							this.storeDetail.createTime = json.createTime;
							this.storeDetail.employeeNum = json.employeeNum;
						}
					});
			},
			onSelectNextOrg(index) {
				this.storeItem = this.storeList[index];
				this.tab++;
				this.getStoreMemberCount();
				this.getStoreDetail();
			},
			onUpgrade() {
				alert('稍后呈现');
			},
			onChangeValid() {
				alert('稍后呈现');
			},
			onDropActions(name) {
				switch (name) {
					case 'close':
						this.$Modal.confirm({
							title: '关闭商户提醒',
							content: '<p></p>关闭商户后，停止该商户运营，商户将无法正常营业，确认要关闭吗？</p>',
							onOk: () => {
								this.closeTenant();
							}
						});
						break;
					case 'open':
						this.openTenant();
						break;
					case 'delete':
						this.$Modal.confirm({
							title: '删除商户提醒',
							content: '<p>删除商户后，该商户的所有信息无法恢复，确认要删除吗？</p>',
							onOk: () => {
								this.deleteTenant();
							},
						});
						break;
				}
			},
			closeTenant() {
				this.$ajaxPost('/user-server/platform/store/closeOrOpen', {id: this.tenantId, status: 0})
					.then(res => {
						if (res && res.code === 10000) {
							this.$Message.success(res.message || '操作成功');
							this.getTenantDetail();
						}
					});
			},
			openTenant() {
				this.$ajaxPost('/user-server/platform/store/closeOrOpen', {id: this.tenantId, status: 1})
					.then(res => {
						if (res && res.code === 10000) {
							this.$Message.success(res.message || '操作成功');
							this.getTenantDetail();
						}
					});
			},
			deleteTenant() {
				this.$ajaxPost('/user-server/platform/store/delete', {id: this.tenantId})
					.then(res => {
						if (res && res.code === 10000) {
							this.$Message.success(res.message || '操作成功');
							this.$router.push('/tenant/list');
						}
					});
			},
			
			onUpdateTenant() {
				this.updateModalStatus = true;
			},
			onCloseUpdateModal() {
				this.updateModalStatus = false;
				this.getTenantDetail();
			},
			onConfirmUpdateModal() {
				this.$refs['tenantEdit'].onCreateUpdateTenant();
			}
		}
		
	};
</script>

<style scoped lang="scss">
		.tenant-detail {
				width: 1128px;
				margin: 0 auto;
		}
		
		.detail-card {
				height: 322px;
				background: #fff;
				
				.left-card {
						position: relative;
						width: 350px;
						float: left;
						height: 100%;
						text-align: center;
						padding-top: 40px;
						border-top-left-radius: 20px;
						border-bottom-left-radius: 20px;
						overflow: hidden;
						
						p {
								margin-top: 15px;
								padding: 0 8px;
						}
						
						.logo {
								width: 72px;
								height: 72px;
								background-size: 100%;
								border: 1px solid #E2E2EA;
								border-radius: 50%;
						}
						
						&:before {
								display: block;
								position: absolute;
								left: 0;
								top: 0;
								width: 8px;
								height: 100%;
								content: "";
								background: #756CEA;
						}
				}
				
		}
		
		.right-card {
				position: relative;
				padding-top: 40px;
				margin-left: 350px;
				height: 100%;
				
				&:before {
						display: block;
						position: absolute;
						content: "";
						left: 0;
						top: 36px;
						width: 1px;
						height: 250px;
						border-left: 1px solid #e2e2ea;
				}
				
				.row-info {
						display: flex;
						margin-bottom: 24px;
						padding-left: 36px;
						
						.item {
								flex: 1;
								
								p {
										&:nth-child(1) {
												color: #92929D;
										}
										
										&:nth-child(2) {
												color: #44444F;
										}
								}
								
						}
						
						.item-2 {
								flex: 2;
						}
						
						.item-1 {
								flex: 1;
						}
				}
				
				
				.fix-actions {
						position: relative;
						text-align: right;
						margin-bottom: 24px;
						
						.ivu-icon-ios-more {
								border: 1px solid #756CEA;
								border-radius: 50%;
								vertical-align: middle;
								margin-left: 12px;
						}
				}
		}
		
		.detail-org {
				padding: 36px;
				background: #fff;
				
				h3 {
						font-size: 18px;
						margin-bottom: 24px;
				}
				
		}
		
		.org-list {
				position: relative;
				margin-bottom: 24px;
				line-height: 30px;
				background: #FAFAFB;
				padding: 20px 8px;
				
				.left-org {
						span {
								cursor: pointer;
								display: inline-block;
								padding: 0 10px;
								margin-left: 30px;
						}
				}
				
				.right-org-next {
						cursor: pointer;
						position: absolute;
						top: 0;
						right: 0;
						width: 30px;
						text-align: center;
						float: right;
						
				}
		}
		
		.org-card {
				display: flex;
				height: 128px;
				margin-top: 48px;
				
				.card-item {
						position: relative;
						flex: 1;
						margin: 0 12px;
						border: 1px solid #E2E2EA;
						border-radius: 8px;
						
						p {
								text-align: center;
								
								strong {
										font-size: 28px;
										margin-right: 5px;
								}
						}
						
						.strong {
								margin-top: 40px;
						}
						
						.p {
								color: #696974;
						}
						
						.icon {
								position: absolute;
								left: 50%;
								top: -28px;
								transform: translateX(-50%);
								width: 56px;
								height: 56px;
								line-height: 56px;
								text-align: center;
								border-radius: 16px;
								
								img {
										vertical-align: middle;
										
								}
						}
						
						&:nth-child(1) {
								.icon {
										background: #FFD8D8;
								}
						}
						
						&:nth-child(2) {
								.icon {
										background: #FFF1D2;
								}
						}
						
						&:nth-child(3) {
								.icon {
										background: #E1F1D0;
								}
						}
						
				}
		}
		
		.sub-title {
				span {
						float: right;
				}
		}
		
		.detail-logs {
				padding: 36px;
				background: #fff;
				
				.table-content {
						margin-top: 24px;
				}
		}
		
		
		.is-running, .is-stop {
				position: relative;
				
				&:before {
						display: inline-block;
						content: '';
						width: 6px;
						height: 6px;
						
						border-radius: 50%;
						margin-right: 10px;
						vertical-align: middle;
						
				}
		}
		
		.is-running {
				&:before {
						background: #756CEA;
				}
		}
		
		.is-stop {
				&:before {
						background: #B5B5BE;
				}
		}
</style>
