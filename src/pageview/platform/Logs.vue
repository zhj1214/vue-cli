<template>
  <div class="logs-page">
    <div slot="right" class="content">
      <div class="query clear">
        <a
          v-if="pageAction.includes('export')"
          type="download"
          class="mr-10"
          target="_blank"
          rel="noopener noreferrer"
          :href="`/user-server/platform/operateLog/export?operatorName=${
            pageData.operatorName || ''
          }&operateModule=${pageData.operateModule || ''}&operateType=${
            pageData.operateType || ''
          }&beginTime=${pageData.beginTime || ''}&endTime=${pageData.endTime || ''}&token=${token}`"
        >
          <Button type="primary">导出</Button>
        </a>

        <DatePicker
          v-model="dateQuery"
          type="daterange"
          placeholder="开始时间 → 结束时间"
          split-panels
          style="width: 220px;"
          @on-change="onChangeDate"
        />
        <div style="float: right;">
          <div v-if="advancedFilterStatus" class="fold-block-active" @click="toggleAdvancedFilter">
            <span class="filter-container">
              <i class="icon iconfont iconFilter" title="筛选" />
              <i class="icon iconfont iconDropdownUnfold" title="更多" />
            </span>
          </div>

          <div v-else class="fold-block-normal" @click="toggleAdvancedFilter">
            <i class="icon iconfont iconFilter" title="筛选" />
            <i class="icon iconfont iconTreeFold" title="更多" />
          </div>
        </div>
        <div v-if="advancedFilterStatus" class="advanced-block">
          <div class="filter-row keep-one-line">
            <span>操作模块：</span>
            <Select
              v-model="pageData.operateModule"
              filterable
              style="width: 240px; margin-right: 40px;"
            >
              <Option v-for="item in operateModuleList" :key="item.value" :value="item.value">
                {{ item.label }}
              </Option>
            </Select>

            <span>操作内容：</span>
            <i-input
              v-model="pageData.operateContent"
              placeholder="操作内容"
              class="w250 fix-iview-icon"
              style="margin-right: 40px;"
            />
            <span>操作人：</span>
            <i-input
              v-model="pageData.searchContent"
              placeholder="操作人昵称/账号"
              class="w250 fix-iview-icon"
            />
          </div>

          <div class="last-row">
            <Button class="button-gap w60" type="primary" @click="getLogTable"> 查询 </Button>
            <Button class="button-gap w60" type="default" @click="reset"> 重置 </Button>
          </div>
        </div>
      </div>
      <BaseTable
        :key="`keyTable${keyTable}`"
        :list="tableList"
        :loading="tableLoading"
        :page-data="pageData"
        :col="tableCol"
        @on-pageChange="onPageChange"
        @on-pageSize="onPageSize"
      />
    </div>
  </div>
</template>

<script>
  import { logsTableCol } from './platformTableCol'
  import BaseTable from '../base/BaseTable'
  import mixinsGlobal from '../../mixins/mixinsGlobal'

  export default {
    name: 'Log',
    components: {
      BaseTable,
    },
    mixins: [mixinsGlobal],
    data() {
      return {
        tableList: [],
        dateQuery: [],
        tableLoading: false,
        advancedFilterStatus: false,
        pageData: {
          page: 1,
          size: 10,
          count: 0,
          operatorName: '',
          operateModule: '',
          operateType: '',
          operateContent: '',
          searchContent: '',
          beginTime: '',
          endTime: '',
        },
        operateModuleList: [],
        operateTypeList: [],
        token: localStorage.getItem('token'),
        keyTable: 1,
      }
    },
    computed: {
      tableCol() {
        return logsTableCol.call(this) || []
      },
    },
    created() {
      this.getOperateTypeList()
      this.getModuleList()
      this.getLogTable()
    },
    methods: {
      reset() {
        let currentStatus = this.advancedFilterStatus
        this.advancedFilterStatus = !currentStatus
        this.pageData = {
          page: 1,
          size: 10,
          count: 0,
          operatorName: '',
          operateModule: '',
          operateType: '',
          beginTime: '',
          endTime: '',
          searchContent: '',
        }
        this.keyTable++ // 重置时 重新渲染表格
        this.$nextTick(() => {
          this.getLogTable()
        })
      },
      toggleAdvancedFilter() {
        let currentStatus = this.advancedFilterStatus
        this.advancedFilterStatus = !currentStatus
      },
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getLogTable()
        })
      },
      onPageSize(size) {
        this.pageData.size = size
        this.onSearch()
      },
      onSearch() {
        this.pageData.page = 1
        this.$nextTick(() => {
          this.getLogTable()
        })
      },
      onChangeDate(date) {
        this.pageData.beginTime = date[0]
        this.pageData.endTime = date[1]
        this.onSearch()
      },
      filterLogModule(list) {
        const [module] = list
        this.pageData.operateModule = module
        this.onSearch()
      },
      filterLogType(list) {
        const [type] = list
        this.pageData.operateType = type
        this.onSearch()
      },
      getLogTable() {
        this.tableLoading = true
        this.$ajaxPost('/user-server/platform/operateLog/list', this.pageData).then((res) => {
          if (res && res.code === 10000) {
            this.tableList = res.data.list || []
            this.pageData.count = res.data.count || 0
          }
          this.tableLoading = false
        })
      },
      getModuleList() {
        this.$ajaxGet('/user-server/platform/operateLog/operateModule/list').then((res) => {
          if (res && res.code === 10000) {
            this.operateModuleList = (res.data || []).map((item) => {
              return {
                value: item.code,
                label: item.value,
              }
            })
          }
        })
      },
      getOperateTypeList() {
        this.$ajaxGet('/user-server/platform/operateLog/operateType/list').then((res) => {
          if (res && res.code === 10000) {
            this.operateTypeList = (res.data || []).map((item) => {
              return {
                value: item.code,
                label: item.value,
              }
            })
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .logs-page {
    padding: 24px;
    background: #fff;
    border-radius: 16px;
  }

  .query {
    margin-bottom: 24px;
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
</style>
