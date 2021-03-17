<template>
  <div>
    <span
      v-if="showDelete"
      :class="settingStyle()"
      class="span-a"
      @click="showPop"
    >删除</span>

    <Dropdown
      trigger="click"
      transfer
    >
      <span class="text-gap action-text">更多<i
        class="icon iconfont iconTreeFold"
        title=""
      /></span>
      <DropdownMenu slot="list">
        <DropdownItem @click="showImport">
          导入会员
        </DropdownItem>
        <DropdownItem>进程查看</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { log } from "@/utils/tools";

import mixinsGlobal from "@/mixins/mixinsGlobal";

export default {
    name: "OperateCell",
    components: {},
    mixins: [mixinsGlobal],
    props: {
        rowData: Object,
    },
    data() {
        return {};
    },
    computed: {
        showDelete() {
            let { canBeOperator } = this.rowData
            let right = true || this.__hasPower('delete')
            log('right', right)
            return canBeOperator && right
        }
    },
    watch: {},
    created() {
    },
    mounted() {

    },
    methods: {
        showPop() {
            this.$Modal.confirm({
                title: '删除标签？',
                content: '<p><span style="color: red">删除标签后无法恢复</span>，调用该标签的功能将均失效，你还要继续吗？</p>',
                onOk: () => {
                    this.onCancelRegister(this.rowData)
                }
            });
        },
        settingStyle() {
            // return this.__hasPower('editCard') ? 'border-btn' : ''
            return 'border-btn'
        },
        showImport() {
            this.$emit('showImport')
        },
    },
}
</script>

<style lang="scss" scoped>
.border-btn {
    position: relative;
    cursor: pointer;
    padding-right: 8px;
    line-height: 24px;

    &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 0px;

        bottom: 0px;
        width: 1px;
        background-color: #e2e2ea;
    }
}


.single-btn {
    position: relative;
    cursor: pointer;
    padding-right: 8px;
    line-height: 24px;
}


.text-gap {
    padding-left: 8px;
}
</style>
