<!------------------------
 *@name common-manage
 *@desc 通用条件 - 表格 - 分页 布局组件
 *@author Sam
 *@date 2019/06/02
 *@props columns Array 表头信息
 *@props tabData Array 表格数据
 *@props loading Boolean 表格 loading 状态
 *@action selectionChange 支持接收多选回调

 *@slot-cond-tool: 条件区域

 ** Example **
  <CommManage :columns="columns" :tabData="assistantList" :loading="loading">
    <template #cond-tool>
      <i-col span="12">
        <Select placeholder="请选择投放位置" style="width:300px; " v-model="search.place" >
          <Option v-for="(item, index) in placeList" :key="index" :value="item.code">{{item.title}}</Option>
        </Select>
      </i-col>
      <i-col span="4" offset="8"><Input v-model="search.name" placeholder="请输入广告名称检索" /></i-col>
    </template>
  </CommManage>
 -------------------------->
<template>
  <div>
    <slot name="cond-tool" />
    <slot name="cond-tabs" />
    <div style="margin-top: 24px;">
      <Table
        :columns="columns"
        :data="tabData"
        :loading="loading"
        @on-selection-change="(selection) => $emit('selectionChange', selection)"
      />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CommManage',
    props: {
      columns: { required: true, type: Array },
      tabData: { required: true, type: Array },
      loading: { required: true, type: Boolean },
    },
  }
</script>
<style lang="scss">
  .comm-tool-box {
    display: flex;
    justify-content: space-between;

    .btn-group {
      margin-left: 24px;

      button {
        margin-right: 12px;
      }
    }
  }
</style>
