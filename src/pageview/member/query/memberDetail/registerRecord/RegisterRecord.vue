<template>
  <div>
    <div class="mini-block-narrow">
      <div class="search-block">
        <div>
          <span class="search-title">实际注册组织：</span>
          <Select
            v-model="searchData.actualRegistrationOrgId"
            :remote-method="getActualOrg"
            filterable
            clearable
            class="w240"
            @on-clear="getList"
            @on-change="getList"
          >
            <Option v-for="item in registerOrgList" :key="item.value" :value="item.value">
              {{ item.label }}
            </Option>
          </Select>
        </div>

        <div class="change-type">
          <span class="search-title">已注册组织：</span>
          <Select
            v-model="searchData.orgId"
            :remote-method="getRegisteredOrg"
            clearable
            class="w240"
            filterable
            @on-clear="getList"
            @on-change="getList"
          >
            <Option v-for="item in existOrgList" :key="item.value" :value="item.value">
              {{ item.label }}
            </Option>
          </Select>
        </div>
      </div>

      <div class="search-block middle-block-narrow">
        <div>
          <span class="search-title">时间：</span>
          <DatePicker
            type="daterange"
            placement="bottom-end"
            class="component-narrow w280"
            placeholder="开始时间 → 结束时间"
            format="yyyy-MM-dd"
            :value="[searchData.startTime, searchData.endTime]"
            @on-change="handleTimePiker"
          />
        </div>
      </div>

      <Table
        :columns="columns"
        class="level-table middle-block-narrow"
        :loading="tableLoading"
        :data="list"
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
  import { log, createRangeTime } from '@/utils/tools'
  import { registerRecordCol } from './registerRecordCol'

  export default {
    name: 'PointRecord',
    props: {
      memberId: String,
    },
    data() {
      return {
        timeOption: {
          disabledDate(date) {
            // 禁用过去的时间
            return date && date.valueOf() > Date.now() - 86400000
          },
        },

        orgId: '',
        orgName: '',
        searchData: {
          startTime: '',
          endTime: '',
          orgId: [],
          actualRegistrationOrgId: '',
        },

        pageData: {
          page: 1,
          size: 10,
          count: 0,
        },
        list: [],

        storeList: [
          {
            value: '',
            label: '',
          },
        ],
        columns: registerRecordCol.call(this),
        tableLoading: false,

        registerOrgList: [],
        existOrgList: [],
        changeTypeList: [],
      }
    },
    computed: {},
    created() {
      this.initData()
      this.getActualOrg()
      this.getRegisteredOrg()
    },
    mounted() {
      this.getList()
    },
    methods: {
      initData() {
        let orgId = localStorage.orgId || '777777'
        let orgName = localStorage.orgName

        this.orgName = orgName
        this.orgId = orgId
      },
      formatData() {
        let { page, size } = this.pageData

        let data = {
          page,
          size,
          ...this.searchData,
          memberId: this.memberId,
        }

        return data
      },
      getList() {
        let server = '/member-server'
        let url = server + '/member/info/registration/list'
        let data = this.formatData()
        this.list = []

        this.tableLoading = true
        this.$ajaxGet(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              let resData = res.data
              this.list = resData.list || []
              this.pageData.count = resData.total || 0
            }
            this.tableLoading = false
          })
          .catch((err) => {
            log(err)
          })
      },
      getActualOrg(query) {
        let server = '/member-server'
        let url = server + '/member/info/getActualOrg'
        let data = {
          memberId: this.memberId,
          content: query,
        }

        this.$ajaxGet(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              let resData = res.data
              log('getActualOrg, resData', resData)
              let format = resData.map((item) => {
                return {
                  label: item.orgName,
                  value: item.orgId,
                }
              })
              this.registerOrgList = this.registerOrgList.concat(format)
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      getRegisteredOrg(query) {
        let server = '/member-server'
        let url = server + '/member/info/getAlreadyOrg'
        let data = {
          memberId: this.memberId,
          content: query,
        }

        this.$ajaxGet(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              let resData = res.data
              let format = resData.map((item) => {
                return {
                  label: item.orgName,
                  value: item.orgId,
                }
              })
              this.existOrgList = this.existOrgList.concat(format)
              log('getRegisteredOrg, resData', resData)
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getList()
        })
      },
      onPageSize(size) {
        this.pageData.size = size
        this.getList()
      },
      handleTimePiker(val) {
        let startDate = val[0]
        let endDate = val[1]
        if (startDate) {
          startDate = startDate + ' 00:00:00'
          endDate = endDate + ' 23:59:59'
        }

        Object.assign(this.searchData, {
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
    },
  }
</script>

<style lang="scss" scoped>
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
    line-height: 32px;
    text-align: right;
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
    height: 32px;
    padding: 0 4px 0 16px;
    line-height: 32px;
    vertical-align: middle;
    cursor: pointer;
    background: white;
    border: 1px solid #dcdee2;
    border-radius: 4px;

    &:hover {
      color: #756cea;
      border: 1px solid #756cea;
    }

    &:hover > .iconTreeFold {
      color: #756cea;
      cursor: pointer;
    }
  }

  .search-separate-line {
    display: inline-block;
    height: 20px;
    margin: -6px 8px;
    border-right: 1px solid rgba(226, 226, 234, 1);
  }

  .button-gap {
    margin-right: 8px;
  }

  .action-text {
    color: #756cea;
    cursor: pointer;
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
      font-size: 24px;
      color: #bbb8bb;
    }
  }

  .fold-block-normal {
    display: inline-block;
    width: 56px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    background: rgba(250, 250, 251, 1);
    border: 1px solid rgba(226, 226, 234, 1);
    border-radius: 8px;

    .iconfont {
      color: #929496;
      vertical-align: middle;
    }
  }

  .fold-block-active {
    position: relative;
    z-index: 2;
    display: inline-block;
    width: 56px;
    height: 41px;
    padding-bottom: 10px;
    margin-bottom: -22px;
    cursor: pointer;
    background: #fafafb;
    border: 1px solid #e2e2ea;
    border-bottom: none;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;

    .iconfont {
      color: #756cea;
      vertical-align: middle;
    }

    &::before {
      position: absolute;
      bottom: 0;
      left: -20px;
      z-index: 2;
      display: inline-block;
      width: 20px;
      height: 22px;
      background: white;
      border-right: 1px solid #e2e2ea;
      border-bottom: 1px solid #e2e2ea;
      border-bottom-right-radius: 12px 12px;
      content: '';
    }

    &::after {
      position: absolute;
      bottom: 0;
      left: -10px;

      /* border-radius:         10px; */
      z-index: 1;
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #fafafb;
      content: '';
    }
  }

  .filter-container {
    position: absolute;
    top: -8px;
    display: inline-block;
    padding: 7px 4px;
    line-height: 32px;
    vertical-align: middle;
  }

  .advanced-block {
    padding: 0 24px;
    margin-top: 8px;
    background: #fafafb;
    border: 1px solid rgba(226, 226, 234, 1);
    border-radius: 8px;
    border-top-right-radius: unset;
  }

  .filter-row {
    padding: 20px 0;
    border-bottom: dashed 1px #e2e2ea;
  }

  .last-row {
    display: flex;
    width: 100%;
    margin: 20px 0;
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
    padding: 20px 24px;
    margin-top: 8px;
    background: #fafafb;
    border: 1px solid rgba(226, 226, 234, 1);
    border-radius: 8px;
    justify-content: space-between;
  }

  .displayListEach {
    display: inline-block;
    padding-left: 12px;
    line-height: 24px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(226, 226, 234, 1);
    border-radius: 11px;

    /* height: 26px; */

    & > span {
      font-size: 12px;
      font-weight: 300;
      line-height: 24px;
      color: #979497;
      vertical-align: middle;
    }

    .iconfont {
      color: #979497;
      vertical-align: middle;
      cursor: pointer;
    }
  }

  .reset-btn {
    display: inline-block;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    line-height: 26px;
    color: rgba(117, 108, 234, 1);
  }

  .action-list {
    position: absolute;
    top: 50px;
    left: 176px;
    z-index: 2;
    display: flex;
    width: 296px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    box-shadow: 0 0 8px 0 rgba(181, 181, 190, 0.24);
  }

  .parent-action-container {
    width: 148px;
    border-right: 1px solid rgba(226, 226, 234, 1);
  }

  .parent-action {
    display: flex;
    padding: 6px 6px 6px 16px;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(68, 68, 79, 1);
    cursor: pointer;
    justify-content: space-between;

    &:hover {
      background: rgba(250, 250, 251, 1);
    }
  }

  .select-parent-action {
    color: #756cea;
    background: #e9e8ff;
  }

  .sub-action {
    width: 148px;
    padding: 6px 16px;
    cursor: pointer;

    &:hover {
      background: rgba(250, 250, 251, 1);
    }
  }

  .not-select-member {
    color: rgba(213, 213, 220, 1);
  }

  .more-action {
    display: inline-block;
    height: 32px;
    padding: 0 4px 0 16px;
    line-height: 32px;
    vertical-align: middle;
    cursor: pointer;
    background: white;
    border: 1px solid #dcdee2;
    border-radius: 4px;

    &:hover {
      color: #756cea;
      border: 1px solid #756cea;
    }

    &:hover > .iconTreeFold {
      color: #756cea;
      cursor: pointer;
    }
  }

  .action-background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    overflow: auto;
    background: rgba(79, 48, 14, 0.01);
  }

  .card-container {
    display: flex;
    width: 100%;
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
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
    word-break: break-all;
  }

  .select-info-block {
    display: flex;
    padding: 12px 16px;
    margin-top: 20px;
    line-height: 24px;
    color: rgba(23, 23, 37, 1);
    vertical-align: middle;
    background: #e9e8ff;
    border: 1px solid rgba(117, 108, 234, 1);
    border-radius: 4px;
    justify-content: space-between;

    .iconInfo {
      margin-right: 4px;
      vertical-align: middle;
    }
  }

  .color-text {
    color: rgba(117, 108, 234, 1);
  }

  .select-count {
    padding: 4px;
    color: rgba(117, 108, 234, 1);
  }
</style>
