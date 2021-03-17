<template>
  <div
    v-if="__hasPower('edit')"
    class="confirm-bubble"
  >
    <span
      v-if="toConfig"
      class="action-text"
      @click="actionBubble('edit')"
    >待配置</span>
    <span
      v-else
      :class="{'border-btn': showDelete }"
      class="action-text"
      @click="actionBubble('edit')"
    > 编辑</span>

    <Poptip
      v-model="showPop"
      trigger="click"
      placement="top"
      :transfer="true"
      confirm
      title="等级删除后不可恢复，是否确认该操作？"
      @on-ok="actionBubble('delete')"
    >
      <span
        v-if="!toConfig && showDelete"
        class="action-btn action-text"
      >
        删除
      </span>
    </Poptip>
  </div>
</template>

<script>
    // import {log} from "@/utils/tools";

    import mixinsGlobal from "@/mixins/mixinsGlobal";

    export default {
        name: "ConfirmCellBubble",
        mixins: [mixinsGlobal],
        props: {
            item: Object,
            isLast: Boolean,
            levelCount: Number,
            isActive: Boolean,
            isTop: Boolean,
        },
        data() {
            return {
                showPop: false,
                toConfig: false,
                showDelete: false,
            };
        },
        watch: {
            isActive() {
                this.showDelete = this.isLast &&
                    (this.item.levelId !== 'Lv1') &&
                    (!this.isActive) &&
                    this.isTop
                this.showConfigBtn()
            }
        },
        created() {
            this.showConfigBtn()
        },
        methods: {
            showConfigBtn() {
                let showDelete = this.isLast &&
                    (this.item.levelId !== 'Lv1') &&
                    (!this.isActive) &&
                    this.isTop

                if (this.item.id === '-') {
                    this.toConfig = true
                    this.showPop = false
                } else if ( showDelete ) {
                    this.showDelete = true
                }
            },
            actionBubble(type) {
                if (this.levelCount === 11 && this.toConfig) {
                    this.$Message.error('最多支持 10 个等级')
                    return
                }
                this.$emit('actionBubble', type, this.item)
            }
        }
    }
</script>

<style scoped lang="scss">
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

    .normal-text {

    }

    .action-text {
        cursor: pointer;
        color: #756CEA;
    }

    .action-btn {
        padding-left: 8px;
    }
</style>
