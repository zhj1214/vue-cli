<template>
  <div>
    <div class="mini-block-narrow">
      <div class="search-block">
        <RoundRadio
          :data-list="typeList"
          :default-select="listType"
          @select="selectRadio"
        />
        <div v-if="listType === 'total'">
          <span class="color-text">账户总积分：{{ this.totalPoint }}</span>
        </div>
      </div>
      <div
        v-if="listType === 'detail'"
        class="search-block middle-block-narrow"
      >
        <div class="change-type">
          <span class="search-title">时间：</span>
          <DatePicker
            type="daterange"
            placement="bottom-end"
            class="component-narrow w240"
            placeholder="开始时间 → 结束时间"
            format="yyyy-MM-dd"
            :value="[searchData.startTime, searchData.endTime]"
            @on-change="handleTimePiker"
          />
        </div>

        <div class="change-type">
          <span class="search-title">变更类型：</span>
          <Cascader
            class="w240"
            :data="growthAction"
            placeholder="请选择变更类型"
            trigger="hover"
            @on-change="selectActions"
          />
        </div>
      </div>

      <div
        v-if="listType === 'detail'"
        class="search-block middle-block-narrow"
      >
        <div class="change-type">
          <span class="search-title">所属组织：</span>
          <Cascader
            class="w240"
            :data="orgTree"
            change-on-select
            @on-change="chooseOrg"
          />
        </div>

        <div>
          <span>流水号：</span>
          <i-input
            v-model="searchData.serialNumber"
            search
            class="w240 identity-search"
            placeholder="流水号检索"
            @on-search="getList"
            @on-change="getList"
          >
            <i
              slot="suffix"
              class="icon iconfont iconSearch"
              title="更多"
            />
          </i-input>
        </div>
      </div>

      <Table
        v-if="listType === 'detail'"
        :columns="columns"
        class="level-table middle-block-narrow"
        :loading="tableLoading"
        :data="list"
      />

      <Table
        v-if="listType === 'total'"
        :columns="totalCol"
        class="level-table middle-block-narrow"
        :loading="tableLoading"
        :data="totalList"
      />

      <Page
        class="pagebox"
        :total="pageData.count"
        :current="pageData.page"
        show-sizer
        :page-size="pageData.size"
        show-elevator
        show-total
        @on-change="onPageChange"
        @on-page-size-change="onPageSize"
      />
    </div>
  </div>
</template>

<script>
import {log, createRangeTime, createCascadeFormat} from "@/utils/tools";
    import {pointRecordCol, totalCol, } from "./pointRecordCol";
    import { growthAction } from "./growthAction";
    import RoundRadio from "@/components/RoundRadio";

    export default {
        name: "PointRecord",
        components: {
            RoundRadio,
        },
        props: {
            memberId: String,
        },
        data() {
            return {
                timeOption:{
                    disabledDate (date) {
                        // 禁用过去的时间
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },

                orgId: '',
                orgName: '',

                // total 积分总览 detail 积分明细
                listType: 'detail',
                searchData: {
                    startTime: '',
                    endTime: '',
                    // 积分： 2
                    type: 2,
                    orgIds: [],

                    isAdd: '',
                    changeReason: '',
                    phone: '',
                    serialNumber: '',
                    memberId: [this.memberId],
                },
                pageData: {
                    page: 1,
                    size: 10,
                    count: 0,
                },

                growthAction: growthAction,

                list: [],
                storeList: [
                    {
                        value: '',
                        label: '',
                    },
                ],
                totalList: [],
                totalCol: totalCol.call(this),
                totalPoint: 0,

                columns: pointRecordCol.call(this),
                tableLoading: false,
                growthFilterFlag: false,
                growthFilter: [
                    {
                        id: '',
                        name: '全部',
                    },
                    {
                        id: '1',
                        name: '增加',
                    },
                    {
                        id: '-1',
                        name: '减少',
                    },
                ],
                orgTree: [],
                selectOrg: '',

                typeList: [
                    {
                        label: '积分总览',
                        value: 'total',
                    },
                    {
                        label: '积分明细',
                        value: 'detail',
                    },
                ]
            }
        },
        computed: {
        },
        created() {
            this.initData()
        },
        mounted() {
            log('listType', this.listType)
            this.onSearch()
            this.getOrgList()
        },
        methods: {
            initData() {
                let orgId = localStorage.orgId || '777777'
                let orgName = localStorage.orgName

                this.orgName = orgName
                this.orgId = orgId
            },
            onSearch() {
                if (this.listType === 'total') {
                    this.getTotalList()
                } else if (this.listType === 'detail') {
                    this.getList()
                }
            },
            chooseOrg(value) {
                this.selectOrg = value.slice(-1)
                this.getList()
            },
            getOrgList() {
                let server = '/user-server'
                let url = server + '/platform/department/entityTree'

                let data = {
                    departmentId: localStorage.departmentId,
                }

                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res.code === 10000) {
                            this.orgTree = createCascadeFormat(res.data, 'title', 'orgId' )
                        }

                    })
                    .catch(err => {
                        log(err);
                    });
            },
            formatData() {
                let { page, size} = this.pageData
                let data = {
                    page,
                    size,
                    ...this.searchData
                }

                let { memberId } = this.searchData
                delete data.memberId
                data.memberIds = memberId
                data.orgIds = this.selectOrg

                return data
            },
            getList() {
                let server = '/points-server'
                let url = server + '/api/score/detail/list'
                let data = this.formatData()
                log('getList data', data)
                this.list = []

                this.tableLoading = true
                this.$ajaxPost(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.list = resData.list || [];
                            this.pageData.count = resData.total || 0;
                        }
                        this.tableLoading = false
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            formatTotalData() {
                let { page, size} = this.pageData
                let data = {
                    page,
                    size,
                    memberId: this.memberId,
                }

                return data
            },
            getTotalList() {
                let server = '/member-server'
                let url = server + '/member/info/subScores/list'
                let data = this.formatTotalData()
                this.totalList = []

                this.tableLoading = true
                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let { totalScore, pageInfo } = res.data
                            this.totalList = pageInfo.list || [];
                            this.pageData.count = pageInfo.total || 0
                            this.totalPoint = totalScore
                        }
                        this.tableLoading = false
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            createStoreList(resData) {
                let tempList = []
                let mainStore = {
                    value: this.orgId,
                    label: this.orgName,
                }
                tempList.push(mainStore)

                resData.forEach((item) => {
                    let cell = {
                        value: item.orgId,
                        label: item.name,
                    }
                    tempList.push(cell)
                })
                this.storeList = tempList
            },
            getStoreList() {
                let server = '/user-server'
                let url = server + '/internal/organization/getSubStoreInfoList'
                let data = { orgId: this.orgId }

                this.$ajaxGet(url, data)
                    .then(res => {
                        if (res && res.code === 10000) {
                            let resData = res.data
                            this.createStoreList(resData)
                        }
                    })
                    .catch(err => {
                        log(err);
                    });
            },
            onPageChange(page) {
                this.pageData.page = page
                this.$nextTick(() => {
                    this.onSearch();
                });
            },
            onPageSize(size) {
                this.pageData.size = size;
                this.onSearch();
            },
            handleTimePiker(val){
                let startDate = val[0]
                let endDate = val[1]
                if (startDate) {
                    startDate = startDate + " 00:00:00"
                    endDate = endDate + " 23:59:59"
                }

                Object.assign( this.searchData, {
                    startTime: startDate,
                    endTime: endDate,
                })
                this.getList()
            },
            // 根据选择时间间隔，设置 DatePicker
            chooseTimeRange(val) {
                let pack = createRangeTime(val)
                let [startTime, endTime] = pack
                if (val === 'custom') {
                    startTime = ''
                    endTime = ''
                }

                Object.assign(this.searchData, {
                    startTime,
                    endTime,
                })
            },
            selectActions(value) {
                let emptyValue = value.length === 0
                if (emptyValue) {
                    value = ['', '']
                }
                let [parentType, subType] = value
                Object.assign(this.searchData, {
                    isAdd: parentType,
                    changeReason: subType,
                })
                this.getList()
            },
            selectRadio(label) {
                this.listType = label
                this.onSearch()
            },
        }
    }
</script>

<style lang="scss"  scoped>

    .row-narrow {
        margin-top: 20px;
    }

    .search-block {
        display: flex;
        justify-content: space-between;
    }

    .search-title {
        display: inline-block;
        width: 100px;
        text-align: right;
        line-height: 32px;
    }

    .change-type {
        display: flex;
        justify-content: flex-start;
    }
    .action-block {
        position: relative;
        display: inline-block;


        .iconfont {
            font-size: 24px;
            vertical-align: middle;
        }
    }

    .mark-btn {
        display: inline-block;
        vertical-align: middle;
        background: white;
        border-radius: 4px;

        border: 1px solid #dcdee2;
        height: 32px;
        line-height: 32px;
        padding: 0 4px 0 16px;
        cursor: pointer;

        &:hover {
            border:1px solid #756CEA;
            color: #756CEA;
        }
        &:hover > .iconTreeFold {
            cursor: pointer;
            color: #756CEA;
        }
    }

    .search-separate-line {
        display: inline-block;
        height: 20px;
        border-right: 1px solid rgba(226,226,234,1);
        margin: -6px 8px;
    }

    .button-gap {
        margin-right: 8px;
    }

    .action-text {
        cursor: pointer;
        color: #756CEA;
    }

    .search-label {
        display: inline-block;
        width: 70px;
        text-align: right;
    }

    .filter-btn {
        display: flex;
        justify-content: flex-end;
    }

    .identity-search {
        position: relative;
        z-index: 4;
        .iconSearch {
            color: #BBB8BB;
            font-size: 24px;
        }
    }

    .fold-block-normal {
        display: inline-block;
        cursor: pointer;
        line-height: 32px;
        width: 56px;
        height: 32px;

        text-align: center;
        vertical-align: middle;

        background:rgba(250,250,251,1);
        border-radius:8px;
        border:1px solid rgba(226,226,234,1);

        .iconfont {
            vertical-align: middle;

            color: #929496;
        }
    }

    .fold-block-active {
        display: inline-block;
        z-index: 2;
        position: relative;
        cursor: pointer;
        background: #FAFAFB;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border: 1px solid #e2e2ea;
        border-bottom: none;
        width: 56px;
        height: 41px;
        margin-bottom: -22px;
        padding-bottom: 10px;

        .iconfont {
            vertical-align: middle;
            color: #756CEA;
        }

        &:before {
            position: absolute;
            bottom: 0px;
            content: '';
            display: inline-block;
            width: 20px;
            left: -20px;
            background: white;
            height: 22px;
            border-right: 1px solid #e2e2ea;
            border-bottom: 1px solid #e2e2ea;
            border-bottom-right-radius: 12px 12px;
            z-index: 2;
        }
        &:after {
            position: absolute;
            bottom: 0;
            content: '';
            display: inline-block;
            width: 20px;
            left: -10px;
            background: #FAFAFB;
            height: 20px;
            /*border-radius:         10px;*/
            z-index: 1;
        }
    }


    .filter-container {
        display: inline-block;
        position: absolute;
        line-height: 32px;
        vertical-align: middle;
        padding: 7px 4px;
        top: -8px;
    }


    .advanced-block {
        margin-top: 8px;
        border-radius:8px;
        border-top-right-radius: unset;
        border:1px solid rgba(226,226,234,1);
        background: #FAFAFB;
        padding: 0 24px;
    }

    .filter-row {
        padding: 20px 0;
        border-bottom: dashed 1px #E2E2EA;
    }

    .last-row {
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .keep-one-line {
        display: flex;
        line-height: 32px;
    }

    .big-row-narrow {
        margin-right: 40px;
    }

    .displayFilterList {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        background: #FAFAFB;

        border-radius:8px;

        border:1px solid rgba(226,226,234,1);
        padding: 20px 24px;
    }

    .displayListEach {
        display: inline-block;
        background:rgba(255,255,255,1);
        border-radius:11px;
        border:1px solid rgba(226,226,234,1);

        padding-left: 12px;
        line-height: 24px;
        /*height: 26px;*/

        & > span {
            vertical-align: middle;
            font-size:12px;
            font-weight:300;
            color: #979497;
            line-height:24px;
        }

        .iconfont {
            cursor: pointer;
            color: #979497;
            vertical-align: middle;
        }
    }

    .reset-btn {
        display: inline-block;
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        color:rgba(117, 108, 234, 1);
        line-height:26px;
    }

    .action-list {
        display: flex;
        position: absolute;
        z-index: 2;
        width:296px;
        left: 176px;

        top: 50px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 8px 0px rgba(181,181,190,0.24);
        border-radius:8px;
    }

    .parent-action-container {
        width:148px;
        border-right: 1px solid rgba(226,226,234,1);
    }

    .parent-action {
        cursor: pointer;
        font-size:14px;
        font-weight:300;
        color:rgba(68,68,79,1);

        line-height:24px;
        padding: 6px 6px 6px 16px;
        display: flex;
        justify-content: space-between;

        &:hover {
            background:rgba(250,250,251,1);
        }
    }

    .select-parent-action {
        color: #756CEA;
        background:#E9E8FF;
    }

    .sub-action {
        width: 148px;
        padding: 6px 16px;
        cursor: pointer;

        &:hover {
            background:rgba(250,250,251,1);
        }
    }

    .not-select-member {
        color:rgba(213,213,220,1);
    }

    .more-action {
        display: inline-block;
        vertical-align: middle;
        background: white;
        border-radius: 4px;

        border: 1px solid #dcdee2;
        height: 32px;
        line-height: 32px;
        padding: 0 4px 0 16px;
        cursor: pointer;

        &:hover {
            border:1px solid #756CEA;
            color: #756CEA;
        }
        &:hover > .iconTreeFold {
            cursor: pointer;
            color: #756CEA;
        }
    }

    .action-background {
        position: fixed;
        overflow: auto;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background: rgba(79, 48, 14, 0.01);
    }

    .card-container {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

        & > div {
            margin-right: 2.5%;
        }
    }

    .big-block-narrow {
        margin-top: 24px;
    }

    .middle-block-narrow {
        margin-top: 20px;
    }

    .input-separator {
        padding: 0 12px;
    }

    .frozen-desc {
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
        word-break: break-all
    }

    .select-info-block {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        background:#E9E8FF;

        border-radius:4px;
        border:1px solid rgba(117, 108, 234, 1);

        padding: 12px 16px;
        color:rgba(23,23,37,1);
        line-height:24px;
        vertical-align: middle;

        .iconInfo {
            vertical-align: middle;
            margin-right: 4px;
        }
    }

    .color-text {
        color:rgba(117, 108, 234, 1);
    }
    .select-count {
        color:rgba(117, 108, 234, 1);
        padding: 4px;
    }


</style>
