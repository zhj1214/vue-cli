<template>
  <div class="logs-page">
    <div slot="right" class="content">
      <div class="query clear">
        <Button v-if="pageAction.includes('create')" type="primary" @click="showCreateModal">
          新建
        </Button>

        <i-input
          v-model="pageData.content"
          placeholder="机构名称/机构编号检索"
          search
          class="w250 fix-iview-icon"
          style="float: right;"
          icon="ios-search"
          @on-enter="onSearch"
          @on-click="onSearch"
        />
      </div>
      <BaseTable
        :list="tableList"
        :loading="tableLoading"
        :page-data="pageData"
        :col="tableCol"
        @on-pageChange="onPageChange"
        @on-pageSize="onPageSize"
      />
      <Modal
        v-model="visible.c"
        :mask-closable="false"
        :loading="loading.c"
        title="新增"
        ok-text="生成参数二维码"
        @on-ok="submit"
      >
        <TableForm v-if="visible.c" ref="TABLE_FORM" />
      </Modal>
      <Modal
        v-model="visible.r"
        :mask-closable="false"
        :loading="loading.r"
        title="详情"
        footer-hide
      >
        <TableDetail v-if="visible.r" :row="curRow" />
      </Modal>
      <Modal
        v-model="visible.u"
        :mask-closable="false"
        :loading="loading.u"
        title="编辑"
        @on-ok="submitUpdate"
      >
        <TableUpdate v-if="visible.u" ref="UPDATE" :row="curRow" />
      </Modal>
    </div>
  </div>
</template>

<script>
  import { baseTableCol as tableCols } from './tableCols.js'
  import BaseTable from '@/pageview/base/BaseTable'
  import mixinsGlobal from '@/mixins/mixinsGlobal'
  import TableForm from './components/Form'
  import TableDetail from './components/Detail'
  import TableUpdate from './components/Update'

  export default {
    name: 'ChannelRegisterMngBase',
    components: {
      BaseTable,
      TableForm,
      TableDetail,
      TableUpdate,
    },
    mixins: [mixinsGlobal],
    data() {
      return {
        tableList: [],
        tableLoading: false,
        pageData: {
          sort: 1, // 倒序
          page: 1,
          size: 10,
          count: 0,
          content: '',
        },
        operateModuleList: [],
        operateTypeList: [],
        visible: {
          c: false, // create
          r: false, // detail
          u: false, // update
        },
        loading: {
          c: true, // create
          r: false, // detail
          u: true, // update
        },
        curRow: {},
      }
    },
    computed: {
      tableCol() {
        return tableCols.call(this) || []
      },
    },
    created() {
      // 获取相关枚举值
      this.getModuleList()
      // 获取列表数据
      this.fetchList()
    },
    methods: {
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.fetchList()
        })
      },
      onPageSize(size) {
        this.pageData.size = size
        this.onSearch()
      },
      onSearch() {
        console.log(111)
        this.pageData.page = 1
        this.$nextTick(() => {
          this.fetchList()
        })
      },

      fetchList() {
        this.tableLoading = true
        this.$ajaxPost('/member-server/api/channel/list', this.pageData).then((res) => {
          if (res && res.code === 10000) {
            this.tableList = res.data.list || []
            this.pageData.count = res.data.count || 0
          }
          this.tableLoading = false
        })
      },
      getModuleList() {
        // this.$ajaxGet('/member-server/api/channel/list', this.pageData).then(
        //   (res) => {
        //     if (res && res.code === 10000) {
        //       this.operateModuleList = (res.data || []).map((item) => {
        //         return {
        //           value: item.code,
        //           label: item.value,
        //         };
        //       });
        //     }
        //   }
        // );
      },

      showCreateModal() {
        this.visible.c = true
        this.loading.c = true
      },
      showUpdateModal(row) {
        this.curRow = row
        this.visible.u = true
        this.loading.u = true
      },
      showDeleteModal(row) {
        this.$Modal.confirm({
          title: '删除后将无法恢复，确认要继续吗？',
          loading: true,
          onOk: () => {
            this.$ajaxGet('/member-server/api/channel/delete', {
              channelId: row.id,
            }).then((res) => {
              if (res && res.code === 10000) {
                this.$Modal.remove()
                this.$Message.info('删除成功')
                this.fetchList()
              }
            })
          },
        })
      },
      showDetailModal(row) {
        this.curRow = row
        this.visible.r = true
      },

      submit() {
        this.$refs.TABLE_FORM.handleSubmit('formValidate', {
          success: () => {
            this.visible.c = false
            this.fetchList()
          },
          complete: () => {
            this.loading.c = false
            this.$nextTick(() => {
              this.loading.c = true
            })
          },
        })
      },
      submitUpdate() {
        this.$refs.UPDATE.handleSubmit({
          success: () => {
            this.visible.u = false
            this.fetchList()
          },
          complete: () => {
            this.loading.u = false
            this.$nextTick(() => {
              this.loading.u = true
            })
          },
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
</style>
