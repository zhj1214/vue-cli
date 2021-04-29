<!---
选择添加积分商品
-->
<template>
  <div>
    <Row style="text-align: right;">
      <i-input
        v-model="search"
        placeholder="礼品名称/礼品ID检索"
        style="width: auto;"
        search
        clearable
        @on-change="onSearch"
        @on-clear="onSearch"
      />
    </Row>
    <div style="margin-top: 20px;">
      <Table
        ref="currentRowTable"
        highlight-row
        :loading="loading"
        :columns="actColumns"
        :data="presentList"
        no-data-text="暂无数据"
        @on-current-change="handleSelect"
      />
      <Page
        :total="total"
        :current="page"
        :page-size="pageSize"
        show-elevator
        show-sizer
        size="small"
        show-total
        style="margin: 10px; text-align: right;"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      />
    </div>
    <div class="btn-box">
      <Button @click="cancelPresent"> 取消 </Button>
      <Button type="primary" @click="confirmPresent"> 确定 </Button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ChoosePrsent',
    props: {
      present: Object,
      url: String, // 拉取礼品接口，从 ChooseGoods 组件传入
      iCols: Array, // 表格展示title信息，如果传入新的则使用该字段
    },
    data() {
      return {
        columns: [
          {
            title: '状态',
            align: 'center',
            width: '80px',
            render: (h, params) => {
              let curId = this.curPresent
                ? this.curPresent['id'] || this.curPresent['presentIdentify']
                : ''
              let parId = params.row['id'] || params.row['presentIdentify']
              return h(
                'Radio',
                {
                  props: {
                    value: curId === parId,
                    disabled: params.row.availableNum ? !(params.row.availableNum > 0) : false,
                  },
                },
                ''
              )
            },
          },
          {
            title: '礼品名称/ID',
            key: 'presentName',
            width: 200,
            render: (h, params) => {
              return h(
                'div',
                {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-around',
                  },
                },
                [
                  h(
                    'div',
                    {
                      style: {
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        float: 'left',
                      },
                    },
                    [
                      h(
                        'img',
                        {
                          style: {
                            width: '100%',
                            height: '100%',
                          },
                          domProps: {
                            src: params.row.presentPictureUrl,
                          },
                        },
                        params.row.presentPictureUrl
                      ),
                    ]
                  ),
                  h(
                    'div',
                    {
                      style: {
                        height: '48px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                      },
                    },
                    [
                      h(
                        'span',
                        {
                          style: {
                            color: '#3E4552',
                          },
                        },
                        params.row.presentName
                      ),
                      h(
                        'span',
                        {
                          style: {
                            color: '#3E4552',
                          },
                        },
                        'ID:' + params.row.presentIdentify
                      ),
                    ]
                  ),
                ]
              )
            },
          },
          {
            title: '价格',
            key: 'worth',
            className: 'table-info',
            sortable: true,
            render: (h, params) => {
              return <span style='color:red'>{params.row.worth}</span>
            },
          },
          {
            title: '库存',
            key: 'availableNum',
            sortable: true,
          },
          {
            title: '创建时间/更新时间',
            key: 'createTime',
            render: (h, params) => {
              return h(
                'div',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flexItems: 'center',
                  },
                },
                [
                  h('span', {}, this.$format(params.row.createTime * 1, 'YY-MM-DD HH:mm:ss')),
                  h(
                    'span',
                    {},
                    params.row.modifyTime
                      ? this.$format(params.row.modifyTime * 1, 'YY-MM-DD HH:mm:ss')
                      : ''
                  ),
                ]
              )
            },
          },
        ],
        presentList: [],
        total: 0,
        loading: false,
        page: 1,
        pageSize: 5,
        search: '',
        curPresent: this.present,
      }
    },
    computed: {
      actColumns() {
        let nowCols = this.columns.slice(),
          arr = []
        if (this.iCols.length) {
          arr = [nowCols[0]].concat([...this.iCols])
        } else {
          arr = nowCols
        }
        return arr
      },
    },
    mounted() {
      this.getPresentList()
    },
    methods: {
      // 页码
      onPageChange(page) {
        this.page = page
        this.getPresentList()
      },
      onPageSizeChange(size) {
        this.pageSize = size
        this.getPresentList()
      },
      // 查询
      onSearch() {
        this.page = 1
        this.pageSize = 5
        this.getPresentList()
      },
      // 选择礼品添加项
      handleSelect(currentRow) {
        if (currentRow.availableNum > 0 || this.iCols.length) {
          this.curPresent = currentRow
        } else {
          this.curPresent = null
          this.$Message.error('不能选择库存为0的商品！')
        }
      },
      // 礼品列表数据
      async getPresentList() {
        let obj = {
          search: this.search,
          page: this.page,
          pageSize: this.pageSize,
          orgId: localStorage.orgId,
        }
        this.loading = true
        const { data } = await this.$ajaxGet(this.url, obj)
        this.loading = false

        if (data) {
          this.presentList = data.list || []
          this.total = data.count || 0
        }
      },
      //点击礼品取消
      cancelPresent() {
        this.curPresent = null
        this.$emit('cancelPresent')
      },
      // 确认添加商品
      confirmPresent() {
        if (!this.curPresent) {
          this.$Message.error('请选择要添加的礼品!')
          return false
        } else {
          this.$emit('confirmPresent', this.curPresent)
          this.curPresent = null
        }
      },
    },
  }
</script>
