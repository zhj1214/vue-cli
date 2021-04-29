<template>
  <div class="tagsListBtnBox">
    <Poptip
      v-if="isShowDeleteBtn"
      trigger="click"
      confirm
      transfer
      title="是否确认删除该标签?"
      @on-ok="deleteFunc"
      @on-cancel="() => {}"
    >
      <span v-if="isShowDeleteBtn" class="button-gap action-text" :class="settingStyle()"
        >删除</span
      >
    </Poptip>
    <!--        <Divider-->
    <!--            type="vertical"-->
    <!--            v-if="isShowImportDataBtn || isShowEditBtn || isShowDeleteBtn"-->
    <!--        />-->
    <Dropdown
      v-if="isShowImportDataBtn"
      ref="dropDown"
      class="more__wrapper"
      trigger="click"
      transfer
      @on-click="clickDropDown"
    >
      <a class="" href="javascript:void(0)">
        更多
        <Icon type="md-arrow-dropdown" />
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-if="isShowImportDataBtn" name="1"> 导入会员 </DropdownItem>
        <DropdownItem v-if="isShowImportDataBtn" name="2"> 进程查看 </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  // import {log} from "@/utils/tools";
  import mixinsGlobal from '@/mixins/mixinsGlobal'

  export default {
    name: 'TagsListBtnBox',
    components: {},
    mixins: [mixinsGlobal],
    props: {
      detailFunc: {
        type: Function,
        default: () => {},
      },
      deleteFunc: {
        type: Function,
        default: () => {},
      },
      importDataFunc: {
        type: Function,
        default: () => {},
      },
      watchImportFunc: {
        type: Function,
        default: () => {},
      },
      rowData: Object,
    },
    data() {
      return {}
    },
    computed: {
      isShowDeleteBtn() {
        let { canBeOperator } = this.rowData
        let right = this.__hasPower('batchDelete')
        // 有操作权限的
        return canBeOperator && right
      },
      isShowImportDataBtn() {
        let { canBeOperator, isHand } = this.rowData
        let right = this.__hasPower('importCheck')
        return canBeOperator && right && isHand
      },
    },
    watch: {},
    created() {},
    methods: {
      clickDropDown(name) {
        if (name === '1') {
          this.importDataFunc()
        } else if (name === '2') {
          this.watchImportFunc()
        }
      },
      settingStyle() {
        return this.isShowImportDataBtn ? 'border-btn' : ''
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tagsListBtnBox {
    display: flex;
    width: 100%;
    height: auto;
    justify-content: flex-start;
    align-items: center;
  }

  .tagsListBtnBox__btn {
    width: auto;
    height: auto;
    font-size: 14px;
    font-weight: 500;
    color: #2d8cf0;
    cursor: pointer;
  }

  .border-btn {
    position: relative;
    padding-right: 8px;
    line-height: 24px;
    cursor: pointer;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      background-color: #e2e2ea;
      content: '';
    }
  }

  .single-btn {
    position: relative;
    padding-right: 8px;
    line-height: 24px;
    cursor: pointer;
  }
</style>

<style lang="scss">
  .tagsListBtnBox {
    .ivu-dropdown-rel {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }

    .ivu-select-dropdown {
      border-radius: 8px;
    }

    .ivu-poptip-content {
      width: 220px;
    }

    .ivu-poptip-body-message {
      text-align: left;
    }
  }
</style>
