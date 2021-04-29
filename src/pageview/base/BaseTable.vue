<!--
 * @Description:
 * @Author: sam.xutao
 * @Date: 2020-03-16 10:19:40
 * @LastEditTime: 2020-03-28 13:41:47
 * @LastEditors: sam.xutao
 -->
<template>
  <div class="base-table">
    <!--on-selection-change-->
    <Table
      ref="ivu-table"
      :loading="loading"
      :columns="col"
      :data="list"
      :show-header="showHeader"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      @on-select-cancel="(selection, row) => $emit('on-selectCancel', selection, row)"
      @on-select="(selection, row) => $emit('on-select', selection, row)"
      @on-selection-change="(selection) => $emit('on-selectTable', selection)"
      @on-select-all="(selection) => $emit('on-selectAll', selection)"
      @on-select-all-cancel="(selection) => $emit('on-selectAllCancel', selection)"
      @on-row-click="(row, index) => $emit('on-rowClick', row, index)"
      @on-expand="(row, status) => $emit('on-expandTable', row, status)"
      @on-sort-change="(column, key, order) => $emit('on-sortChange', column, key, order)"
    />

    <div class="page-row mt-10">
      <!--
            total数据总数
            page-size:每页条数
            current:当前页码
            -->
      <Page
        v-if="!noPage"
        class="pagebox"
        :total="pageData.count"
        :current="pageData.page"
        :page-size="pageData.pageSize || pageData.size || 10"
        show-elevator
        show-sizer
        show-total
        :page-size-opts="[10, 20, 30, 40]"
        @on-change="(page) => $emit('on-pageChange', page)"
        @on-page-size-change="(size) => $emit('on-pageSize', size)"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseTable',
    props: {
      highlightRow: {
        type: Boolean,
        default: false,
      },
      showHeader: {
        type: Boolean,
        default: true,
      },
      rowClassName: {
        type: [String, Function],
      },
      loading: {
        type: Boolean,
      },
      noPage: {
        type: Boolean,
        default: false,
      },
      col: {
        required: true,
        type: [Array, Function],
      },
      list: {
        required: true,
        type: [Array, Function],
        default: () => {
          return []
        },
      },
      pageData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
  }
</script>

<style scoped lang="scss">
  .page-row {
    text-align: right;
  }
</style>
