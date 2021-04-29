<template>
  <div class="approvalManage-page">
    <Tabs v-model="selectedTab" style="padding-top: 20px;" @on-click="tabApproval">
      <TabPane
        v-for="(item, index) in tabList"
        :key="index"
        :name="item.value"
        :label="item.label"
      />
    </Tabs>
    <div v-if="selectedTab == 'initiate'" class="initiate">
      <div class="query clear">
        <!-- <Cascader :data="orgData" v-model="orgValue" class="w250" style="float: left" @on-change="onChangeOrg" placeholder="所属组织" change-on-select></Cascader> -->
        <BelongOrgCascade class="w250" style="float: left;" @selectOrg="searchOrgId" />
        <DatePicker
          v-model="initiatedateQuery"
          type="daterange"
          placeholder="开始时间 → 结束时间"
          split-panels
          style="float: right; width: 220px;"
          @on-change="onChangeInitiateDate"
        />
      </div>
      <RoundRadio
        :data-list="radioList"
        :default-select="initiateDefault"
        style="margin-top: 24px;"
        @select="selectRadio"
      />
      <div style="margin-bottom: 24px;" />
      <Table :columns="columns" :data="tableList">
        <template slot="tradeName,tradeId" slot-scope="{ row }">
          <!-- <div v-if="row.approveTradeType == 3">
						<div>{{row.tradeName}}</div>
						<span>{{ row.tradeId }}</span>
					</div> -->
          <div>
            <div class="color-text" style="cursor: pointer;" @click="clickContent(row)">
              {{ row.tradeName }}
            </div>
            <span>{{ row.tradeId }}</span>
          </div>
        </template>
        <template slot="approveTradeType" slot-scope="{ row }">
          <span v-if="row.approveTradeType == 1">{{ '活动市场上架' }}</span>
          <span v-if="row.approveTradeType == 2">{{ '活动管理上架' }}</span>
          <span v-if="row.approveTradeType == 3">{{ '领券中心上架' }}</span>
          <span v-if="row.approveTradeType == 4">{{ '商城上架' }}</span>
          <span v-if="row.approveTradeType == 5">{{ '消息发送' }}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == 1">
            <Badge color="gold" />
            <span>{{ '待审批' }}</span>
          </div>
          <div v-if="row.status == 2">
            <Badge status="success" />
            <span>{{ '已通过' }}</span>
          </div>
          <div v-if="row.status == 3">
            <Badge color="red" />
            <span>{{ '已驳回' }}</span>
          </div>
          <div v-if="row.status == 4">
            <Badge status="default" />
            <span>{{ '已撤回' }}</span>
          </div>
          <div v-if="row.status == 5">
            <Badge color="#B46EF4" />
            <span>{{ '已超时' }}</span>
          </div>
        </template>
        <template slot="departmentName,completeDepartmentName" slot-scope="{ row }">
          <div class="heigher">
            {{ row.departmentName }}
          </div>
          <div class="current">
            {{ row.completeDepartmentName }}
          </div>
        </template>
        <template slot="initiateTime,updateTime" slot-scope="{ row }">
          <div>{{ row.initiateTime }}</div>
          <div>{{ row.updateTime }}</div>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div v-if="row.status == 1">
            <div v-if="row.isTradeDel">
              <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                <Button style="border: none;" class="gray-dis"> 撤回 </Button>
              </Poptip>
              <Button style="border: none;" class="action-text" @click="approvalDetail(row)">
                详情
              </Button>
            </div>
            <div v-if="!row.isTradeDel">
              <Poptip
                confirm
                title="撤回后，审批人将不再进行审批，确认撤回吗？"
                transfer
                @on-ok="recall(row)"
                @on-cancel="cancel"
              >
                <Button
                  v-if="__hasPower('operation')"
                  style="border: transparent;"
                  class="action-text"
                >
                  撤回
                </Button>
              </Poptip>
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
            </div>
          </div>
          <div v-if="row.status == 2">
            <Button
              v-if="__hasPower('detail')"
              style="border: none;"
              class="action-text"
              @click="approvalDetail(row)"
            >
              详情
            </Button>
          </div>
          <div v-if="row.status == 3">
            <div v-if="row.isTradeDel">
              <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                <Button style="border: none;" class="gray-dis"> 编辑 </Button>
              </Poptip>
              <Button style="border: none;" class="action-text" @click="approvalDetail(row)">
                详情
              </Button>
              <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                <Button style="border: none;" class="gray-dis"> 提交审批 </Button>
              </Poptip>
              <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                <Button style="border: none;" class="gray-dis"> 驳回理由 </Button>
              </Poptip>
            </div>
            <div v-if="!row.isTradeDel">
              <Button
                v-if="
                  row.approveTradeType == 1 ||
                  row.approveTradeType == 2 ||
                  row.approveTradeType == 3
                "
                style="border: none;"
                class="gray-dis"
              >
                编辑
              </Button>
              <Button
                v-else-if="__hasPower('operation')"
                style="border: none;"
                class="action-text"
                @click="editApproval(row)"
              >
                编辑
              </Button>
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
              <Button
                v-if="__hasPower('operation')"
                style="border: none;"
                class="action-text"
                @click="submitApproval(row)"
              >
                提交审批
              </Button>
              <Tooltip v-if="row.remark" :content="row.remark" placement="top" max-width="300">
                <Button style="border: none;" class="action-text"> 驳回理由 </Button>
              </Tooltip>
            </div>
          </div>
          <div v-if="row.status == 4">
            <div v-if="row.isTradeDel">
              <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                <Button style="border: none;" class="gray-dis"> 编辑 </Button>
              </Poptip>
              <Button style="border: none;" class="action-text" @click="approvalDetail(row)">
                详情
              </Button>
              <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                <Button style="border: none;" class="gray-dis"> 提交审批 </Button>
              </Poptip>
            </div>
            <div v-if="!row.isTradeDel">
              <Button
                v-if="
                  row.approveTradeType == 1 ||
                  row.approveTradeType == 2 ||
                  row.approveTradeType == 3
                "
                style="border: none;"
                class="gray-dis"
              >
                编辑
              </Button>
              <Button
                v-else-if="__hasPower('operation')"
                style="border: none;"
                class="action-text"
                @click="editApproval(row)"
              >
                编辑
              </Button>
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
              <Button
                v-if="__hasPower('operation')"
                style="border: none;"
                class="action-text"
                @click="submitApproval(row)"
              >
                提交审批
              </Button>
            </div>
          </div>
          <div v-if="row.status == 5">
            <div v-if="row.isTradeDel">
              <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                <Button style="border: none;" class="gray-dis"> 编辑 </Button>
              </Poptip>
              <Button style="border: none;" class="action-text" @click="approvalDetail(row)">
                详情
              </Button>
            </div>
            <div v-if="!row.isTradeDel">
              <Button
                v-if="
                  row.approveTradeType == 1 ||
                  row.approveTradeType == 2 ||
                  row.approveTradeType == 3
                "
                style="border: none;"
                class="gray-dis"
              >
                编辑
              </Button>
              <Button
                v-else-if="__hasPower('operation')"
                style="border: none;"
                class="action-text"
                @click="editApproval(row)"
              >
                编辑
              </Button>
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
              <Button
                v-if="__hasPower('operation')"
                style="border: none;"
                class="action-text"
                @click="submitApproval(row)"
              >
                提交审批
              </Button>
            </div>
          </div>
        </template>
      </Table>
      <div style="margin-top: 24px; overflow: hidden;">
        <!-- <Page :total="pageData.count" show-elevator show-total class="pagebox" @on-change="onintiatePageChange" @on-page-size-change="onintiatePageSize"/> -->
        <Page
          class="pagebox"
          :total="pageData.count"
          :current="pageData.page"
          :page-size="pageData.size"
          show-elevator
          show-sizer
          show-total
          @on-change="onintiatePageChange"
          @on-page-size-change="onintiatePageSize"
        />
      </div>
    </div>
    <div v-if="selectedTab == 'approval'" class="approval">
      <div class="query clear">
        <!-- <Cascader :data="orgData" v-model="orgValue" class="w250" style="float: left" @on-change="onChangeOrg" placeholder="所属组织" change-on-select></Cascader> -->
        <BelongOrgCascade class="w250" style="float: left;" @selectOrg="searchOrgId" />
        <DatePicker
          v-model="approvaldateQuery"
          type="daterange"
          placeholder="开始时间 → 结束时间"
          split-panels
          style="float: right; width: 220px;"
          @on-change="onChangeapprovalDate"
        />
      </div>
      <RoundRadio
        :data-list="radioapprovalList"
        :default-select="approvalDefault"
        style="margin-top: 24px;"
        @select="selectApproval"
      />
      <div style="margin-bottom: 24px;" />
      <Table :columns="approvalColumns" :data="tableList">
        <template slot="tradeName,tradeId" slot-scope="{ row }">
          <!-- <div v-if="row.approveTradeType == 3 || row.approveTradeType == 4">
						<div>{{row.tradeName}}</div>
						<span>{{ row.tradeId }}</span>
					</div> -->
          <div>
            <div class="color-text" style="cursor: pointer;" @click="clickContent(row)">
              {{ row.tradeName }}
            </div>
            <span>{{ row.tradeId }}</span>
          </div>
        </template>
        <template slot="approveTradeType" slot-scope="{ row }">
          <span v-if="row.approveTradeType == 1">{{ '活动市场上架' }}</span>
          <span v-if="row.approveTradeType == 2">{{ '活动管理上架' }}</span>
          <span v-if="row.approveTradeType == 3">{{ '领券中心上架' }}</span>
          <span v-if="row.approveTradeType == 4">{{ '商城上架' }}</span>
          <span v-if="row.approveTradeType == 5">{{ '消息发送' }}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == 1">
            <Badge color="gold" />
            <span>{{ '待审批' }}</span>
          </div>
          <div v-if="row.status == 2">
            <Badge status="success" />
            <span>{{ '已通过' }}</span>
          </div>
          <div v-if="row.status == 3">
            <Badge color="red" />
            <span>{{ '已驳回' }}</span>
          </div>
          <div v-if="row.status == 4">
            <Badge status="default" />
            <span>{{ '已撤回' }}</span>
          </div>
          <div v-if="row.status == 5">
            <Badge color="#B46EF4" />
            <span>{{ '已超时' }}</span>
          </div>
        </template>
        <template slot="departmentName,completeDepartmentName" slot-scope="{ row }">
          <div class="heigher">
            {{ row.departmentName }}
          </div>
          <div class="current">
            {{ row.completeDepartmentName }}
          </div>
        </template>
        <template slot="initiatorName" slot-scope="{ row }">
          <span>{{ row.initiatorName }}</span>
        </template>
        <template slot="initiateTime,updateTime" slot-scope="{ row }">
          <div>{{ row.initiateTime }}</div>
          <div>{{ row.updateTime }}</div>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div v-if="isLog">
            <Button
              v-if="__hasPower('detail')"
              style="border: none;"
              class="action-text"
              @click="approvalDetail(row)"
            >
              详情
            </Button>
          </div>
          <div v-if="!isLog">
            <div v-if="row.status == 1">
              <div v-if="row.isTradeDel">
                <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                  <Button style="border: none;" class="gray-dis action-text"> 通过 </Button>
                </Poptip>
                <Poptip content="业务对象已被删除，审批已关闭" placement="top">
                  <Button style="border: none;" class="gray-dis action-text"> 驳回 </Button>
                </Poptip>
                <Button style="border: none;" class="action-text" @click="approvalDetail(row)">
                  详情
                </Button>
              </div>
              <div v-if="!row.isTradeDel">
                <Button
                  v-if="__hasPower('operation')"
                  style="border: none;"
                  class="action-text"
                  @click="goThrough(row)"
                >
                  通过
                </Button>
                <Button
                  v-if="__hasPower('operation')"
                  style="border: none;"
                  class="action-text"
                  @click="reject(row)"
                >
                  驳回
                </Button>
                <Button
                  v-if="__hasPower('detail')"
                  style="border: none;"
                  class="action-text"
                  @click="approvalDetail(row)"
                >
                  详情
                </Button>
              </div>
            </div>
            <Modal
              v-model="row.throughModal"
              title="确认通过该项审核"
              @on-ok="throughOk"
              @on-cancel="cancel"
            >
              <div>
                <span>通过描述：</span>
                <Input
                  v-model="thoughData"
                  maxlength="500"
                  show-word-limit
                  type="textarea"
                  placeholder="请添加描述（选填）"
                  style="width: 280px;"
                />
              </div>
            </Modal>
            <Modal v-model="row.rejectModal" title="驳回" @on-ok="rejectOk" @on-cancel="cancel">
              <div>
                <span style="color: red;">*</span>
                <span>驳回原因：</span>
                <Input
                  v-model="rejectData"
                  maxlength="500"
                  show-word-limit
                  type="textarea"
                  placeholder="请输入驳回原因"
                  style="width: 280px;"
                />
              </div>
            </Modal>
            <div v-if="row.status == 2">
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
            </div>
            <div v-if="row.status == 3">
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
            </div>
            <div v-if="row.status == 4">
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
            </div>
            <div v-if="row.status == 5">
              <Button
                v-if="__hasPower('detail')"
                style="border: none;"
                class="action-text"
                @click="approvalDetail(row)"
              >
                详情
              </Button>
            </div>
          </div>
        </template>
        <!-- <template slot="action" slot-scope="{row}">
					
				</template> -->
      </Table>
      <div style="margin-top: 24px; overflow: hidden;">
        <!-- <Page :total="pageData.count" show-elevator show-total class="pagebox" @on-change="onapprovalPageChange" @on-page-size-change="onapprovalPageSize"/> -->
        <Page
          class="pagebox"
          :total="pageData.count"
          :current="pageData.page"
          :page-size="pageData.size"
          show-elevator
          show-sizer
          show-total
          @on-change="onapprovalPageChange"
          @on-page-size-change="onapprovalPageSize"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import RoundRadio from '../../../components/RoundRadio'
  import { createOrgCascade } from '../../../utils/tools'
  import BelongOrgCascade from '../../../components/BelongOrgCascade'
  import mixinsGlobal from '../../../mixins/mixinsGlobal'
  // import { mapGetters } from "vuex";
  export default {
    components: {
      RoundRadio,
      BelongOrgCascade,
    },
    mixins: [mixinsGlobal],
    data() {
      return {
        tabList: [
          {
            label: '我发起的',
            value: 'initiate',
          },
          {
            label: '我审批的',
            value: 'approval',
          },
        ],
        selectedTab: 'initiate', //默认选中的
        initiatedateQuery: [],
        approvaldateQuery: [],
        pageData: {
          page: 1,
          size: 10,
          count: 0,
          tradeId: '',
          initiatebeginTime: '',
          initiateendTime: '',
          approvalbeginTime: '',
          approvalendTime: '',
          isSearch: '1', //1 当前false ,2 所有true
          isLog: false, //判断是否是历史审批
          approveTradeType: '', //所属审批流程
        },
        orgValue: [],
        orgData: [],
        tableList: [],
        initiatorId: '', //发起人Id
        approvalId: '', //审批人Id
        columns: [
          {
            title: '审批内容名称/ID',
            slot: 'tradeName,tradeId',
          },
          // {
          // 	title: '所属审批流程',
          // 	slot: 'approveTradeName'
          // },
          {
            title: '所属审批流程',
            slot: 'approveTradeType',
            filters: [
              {
                label: '活动市场上架',
                value: 1,
              },
              {
                label: '活动管理上架',
                value: 2,
              },
              {
                label: '领券中心上架',
                value: 3,
              },
              {
                label: '商城上架',
                value: 4,
              },
              {
                label: '消息发送',
                value: 5,
              },
            ],
            filterMultiple: false,
            filterRemote: (val) => {
              this.pageData.approveTradeType = val[0]
              console.log('审批流程')
              this.onSearch()
            },
          },
          {
            title: '状态',
            slot: 'status',
            filters: [
              {
                label: '待审批',
                value: 1,
              },
              {
                label: '已通过',
                value: 2,
              },
              {
                label: '已驳回',
                value: 3,
              },
              {
                label: '已撤回',
                value: 4,
              },
              {
                label: '已超时',
                value: 5,
              },
            ],
            filterMultiple: false,
            filterRemote: (val) => {
              let status = val[0]
              this.selectRadio(status)
            },
          },
          {
            title: '所属组织',
            slot: 'departmentName,completeDepartmentName',
          },
          {
            title: '发起时间/更新时间',
            slot: 'initiateTime,updateTime',
          },
          {
            title: '操作',
            slot: 'action',
          },
        ],
        approvalState: '全部',
        radioList: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '待审批',
            value: 1,
          },
          {
            label: '已通过',
            value: 2,
          },
          {
            label: '已驳回',
            value: 3,
          },
          {
            label: '已撤回',
            value: 4,
          },
          {
            label: '已超时',
            value: 5,
          },
        ],
        radioapprovalList: [
          {
            label: '待审批',
            value: '',
          },
          {
            label: '历史审批',
            value: 3,
          },
        ],
        approvalStatus: [],
        // approvalColumns:,
        throughModal: false, //通过弹窗是否显示
        rejectModal: false, //驳回弹窗是否显示
        thoughData: '', //通过审批数据
        rejectData: '', //驳回审批数据
        remark: '', //弹窗内容
        startTime: '',
        endTime: '',
        isLog: false, //是否是历史审批
        approverId: '', //操作人id
        grade: '', //第几级
        status: '',
        orgId: '',
        rowObj: '',
        rejectRow: '',
        initiateDefault: '', //我发起的默认显示全部
        approvalDefault: '', //我审批的默认选中全部
        approveTradeList: [], //所属审批流程
      }
    },
    computed: {
      approvalColumns() {
        let that = this
        return [
          {
            title: '审批内容名称/ID',
            slot: 'tradeName,tradeId',
          },
          {
            title: '所属审批流程',
            slot: 'approveTradeType',
            filters: [
              {
                label: '活动市场上架',
                value: 1,
              },
              {
                label: '活动管理上架',
                value: 2,
              },
              {
                label: '领券中心上架',
                value: 3,
              },
              {
                label: '商城上架',
                value: 4,
              },
              {
                label: '消息发送',
                value: 5,
              },
            ],
            filterMultiple: false,
            filterRemote: (val) => {
              that.pageData.approveTradeType = val[0]
              console.log('审批流程', that.pageData.approveTradeType)
              that.onSearch()
            },
          },
          {
            title: '状态',
            slot: 'status',
            filters: this.approvalStatus,
            filterMultiple: false,
            filterRemote: (val) => {
              that.status = val[0]
              // console.log('status',status)
              this.getmannageTable()
            },
          },
          {
            title: '所属组织',
            slot: 'departmentName,completeDepartmentName',
          },
          {
            title: '发起人',
            slot: 'initiatorName',
          },
          {
            title: '发起时间/更新时间',
            slot: 'initiateTime,updateTime',
          },
          {
            title: '操作',
            slot: 'action',
          },
        ]
      },
    },
    created() {
      this.getApprovetrade()
      this.getOrgData()
      if (this.selectedTab == 'initiate') {
        this.initiatorId = localStorage.getItem('userId')
      } else {
        this.approvalId = localStorage.getItem('userId')
        this.status = ''
        this.isLog = false
      }
      this.$nextTick(() => {
        this.getmannageTable()
      })
    },
    mounted() {
      // this.$forceUpdate();
    },
    methods: {
      filterStatus(val) {
        console.log(val, 'vaql')
        // this.$nextTick(() => {
        // 		this.getmannageTable();
        // 	});
      },
      //获取所有类型的所属审批流程
      getApprovetrade() {
        this.$ajaxGet('/approve-server/api/approve/setting/getApproveTradeTypeList')
          .then((res) => {
            if (res && res.code === 10000) {
              if (res.data) {
                this.approveTradeList = res.data
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      // 获取所属组织数据
      getOrgData() {
        this.$ajaxGet('/user-server/platform/department/entityTree', {
          departmentId: localStorage.getItem('departmentId'),
        })
          .then((res) => {
            if (res && res.code === 10000) {
              if (res.data) {
                this.orgData = createOrgCascade(res.data, 'title', 'orgId')
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      //切换组织
      // onChangeOrg(val){
      // 	// console.log(1111111111)
      // 	this.orgId = val[val.length-1]
      // 	this.pageData.page = 1;
      // 	this.$nextTick(() => {
      // 		this.getmannageTable();
      // 	});
      // },
      searchOrgId(val) {
        this.orgId = val
        console.log('组织id', this.orgId)
        this.pageData.page = 1
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      // 发起人切换时间
      onChangeInitiateDate(val) {
        let startDate = val[0]
        let endDate = val[1]
        if (startDate) {
          startDate = startDate + ' 00:00:00'
          endDate = endDate + ' 23:59:59'
        }

        Object.assign(this.pageData, {
          initiatebeginTime: startDate,
          initiateendTime: endDate,
        })
        // this.pageData.page = 1
        this.startTime = this.pageData.initiatebeginTime
        this.endTime = this.pageData.initiateendTime
        this.onSearch()
      },
      // 审批人切换时间
      onChangeapprovalDate(val) {
        let startDate = val[0]
        let endDate = val[1]
        if (startDate) {
          startDate = startDate + ' 00:00:00'
          endDate = endDate + ' 23:59:59'
        }

        Object.assign(this.pageData, {
          approvalbeginTime: startDate,
          approvalendTime: endDate,
        })
        // this.pageData.page = 1,
        this.startTime = this.pageData.approvalbeginTime
        this.endTime = this.pageData.approvalendTime
        this.onSearch()
      },
      onSearch() {
        this.pageData.page = 1
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      //切换我审批的和我发起的
      tabApproval(val) {
        // 我发起的
        if (val == 'initiate') {
          ;(this.approvalId = ''),
            // 如果当前登录者是发起人
            (this.initiateDefault = '')
          // this.$set(this.initiateDefault,'')
          this.approvalDefault = ''
          this.status = '' //将状态置为全部
          this.initiatorId = localStorage.getItem('userId')
          this.$nextTick(() => {
            this.getmannageTable()
          })
          //我审批的
        } else {
          this.initiatorId = ''
          this.initiateDefault = ''
          this.approvalDefault = ''
          this.status = '' //将状态置为全部
          //否则当前登陆者是审批人
          this.approvalId = localStorage.getItem('userId')
          this.isLog = false
          //给状态重新赋值
          this.approvalStatus = [
            {
              label: '待审批',
              value: 1,
            },
          ]
          this.getmannageTable()
          // console.log(this.isLog,'isLog00000000000')
        }
      },
      //发起人切换状态
      selectRadio(status) {
        this.initiateDefault = status
        this.pageData.page = 1
        this.status = status
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      //审批人切换状态
      selectApproval(status) {
        this.approvalDefault = status
        // console.log('status',status)
        this.isLog = status !== ''
        this.status = ''
        this.pageData.approveTradeType = ''
        // 根据isLog判断状态，islog== true是历史审批，islog为false时是待审批
        if (this.isLog) {
          //历史审批
          this.pageData.page = 1
          this.approvalStatus = [
            {
              label: '待审批',
              value: 1,
            },
            {
              label: '已通过',
              value: 2,
            },
            {
              label: '已驳回',
              value: 3,
            },
            {
              label: '已撤回',
              value: 4,
            },
            {
              label: '已超时',
              value: 5,
            },
          ]
        } else {
          //待审批
          this.pageData.page = 1
          //给状态重新赋值
          this.approvalStatus = [
            {
              label: '待审批',
              value: 1,
            },
          ]
        }
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      //获取审批管理表格数据
      getmannageTable() {
        this.tableList = []
        this.$ajaxPost('/approve-server/api/approve/list', {
          initiatorId: this.initiatorId,
          approverId: this.approvalId,
          startTime: this.startTime,
          endTime: this.endTime,
          approveTradeType: this.pageData.approveTradeType,
          status: this.status,
          page: this.pageData.page,
          size: this.pageData.size,
          isLog: this.isLog, //是否是历史审批
          orgId: this.orgId,
        })
          .then((res) => {
            if (res && res.code === 10000) {
              this.tableList = res.data.list.map((item) => {
                return {
                  ...item,
                  ...{
                    throughModal: false,
                    rejectModal: false,
                  },
                }
              })
              this.pageData.count = res.data.count
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      // 我发起的切换页面
      onintiatePageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      //发起人表格切换页码
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      onintiatePageSize(size) {
        this.pageData.size = size
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      // 审批人表格切换页码
      onapprovalPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      onapprovalPageSize(size) {
        this.pageData.size = size
        this.$nextTick(() => {
          this.getmannageTable()
        })
      },
      //点击表格项进入内容详情页
      // 有详情页的：活动市场、活动管理、消息
      clickContent(row) {
        //活动市场详情页
        if (row.approveTradeType == 1) {
          let url = '/activity/list?marketingId=' + row.tradeId
          window.open(url, '_blank')
          //活动管理详情页
        } else if (row.approveTradeType == 2) {
          let url = '/activity/offline?activityId=' + row.tradeId
          window.open(url, '_blank')
          //领券详情页
        } else if (row.approveTradeType == 3) {
          let url =
            '/activity/coupon/detail?type=' + 'couponCenter' + '&couponContactId=' + row.tradeId
          window.open(url, '_blank')
          //商品详情页
        } else if (row.approveTradeType == 4) {
          // let url = "/onlinemall/mall/malldetail/"+row.tradeId;
          // window.open(url, "_blank");
          let routeData = this.$router.resolve({
            path: '/onlinemall/mall/malldetail/' + row.tradeId,
            query: { routerType: 'manage' },
          })
          window.open(routeData.href, '_blank')
          //消息详情页
        } else if (row.approveTradeType == 5) {
          let url = '/message/templateMessage?isView=' + 1 + '&id=' + row.tradeId
          window.open(url, '_blank')
        }
      },
      //审批操作
      approvalAction(approveId, status, grade) {
        this.$ajaxPost('/approve-server/api/approve/operation', {
          approveId: approveId,
          status: status,
          remark: this.remark,
          approverId: this.approverId,
          grade: grade || '',
        })
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Message.success(res.message || '操作成功')
              this.getmannageTable()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      //撤回
      recall(row) {
        this.pageData.page = 1
        let status = 4
        this.approverId = localStorage.getItem('userId')
        this.approvalAction(row.approveId, status, row.grade)
      },
      //取消
      cancel() {
        this.$router.push('/platform/Approval/Manage')
      },
      //进入审批详情页面
      approvalDetail(row) {
        this.$router.push({
          path: '/platform/Approval/ApprovalDetail',
          query: {
            approveId: row.approveId,
          },
        })
      },
      //编辑
      //消息(5)和商城(4)可以进编辑页
      editApproval(row) {
        //进编辑页
        //活动市场编辑页
        // if(row.approveTradeType == 1){
        // 	this.$router.push({
        // 	path:'/activity/list',
        // 	query:{
        // 		marketingId:row.tradeId,
        // 		itype:'drop'
        // 	}
        // })
        // //活动管理编辑页
        // }else if(row.approveTradeType == 2){
        // 	this.$router.push({
        // 	path:'/activity/offline',
        // 	query:{
        // 		activityId:row.tradeId,
        // 		type:'edit'
        // 	}
        // })
        // }
        //消息编辑
        if (row.approveTradeType == 5) {
          this.$router.push({
            path: '/message/templateMessage',
            query: {
              id: row.tradeId,
              isEdit: '1',
            },
          })
          //商城上架编辑
        } else if (row.approveTradeType == 4) {
          this.$router.push({
            path: '/onlinemall/mall/updatemall/edit',
            query: {
              id: row.tradeId,
            },
          })
        }
      },
      //提交审批
      submitApproval(row) {
        this.pageData.page = 1
        let status = 1
        this.approverId = localStorage.getItem('userId')
        this.approvalAction(row.approveId, status, row.grade)
      },
      //通过弹窗
      goThrough(row) {
        console.log(row.throughModal, 'row.throughModal')
        row.throughModal = true
        this.rowObj = row
        // this.remark = val;
      },
      // 驳回弹窗
      reject(row) {
        row.rejectModal = true
        this.rejectRow = row
      },
      rejectOk() {
        this.remark = this.rejectData
        this.pageData.page = 1
        this.approverId = localStorage.getItem('userId')
        let status = 3
        this.approvalAction(this.rejectRow.approveId, status, this.rejectRow.grade)
      },
      throughOk() {
        this.remark = this.thoughData
        this.pageData.page = 1
        this.approverId = localStorage.getItem('userId')
        let status = 2
        this.approvalAction(this.rowObj.approveId, status, this.rowObj.grade)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .approvalManage-page {
    background-color: #fff;
    // padding:24px;
  }

  .initiate {
    padding: 24px;
  }

  .approval {
    padding: 24px;
  }

  .top,
  .bottom {
    text-align: center;
  }

  .ivu-poptip-body {
    background-color: #171724 !important;
  }

  .gray-dis {
    color: #d5d5dc !important;
  }

  .heigher {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    font-weight: 300;
    color: #171725;
  }

  .current {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: #92929d;
  }
</style>
