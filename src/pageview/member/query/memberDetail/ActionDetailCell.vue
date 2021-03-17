<template>
  <div class="detail-cell">
    <Tooltip
      v-model="bubbleVisible"
      placement="top"
      :transfer="true"
    >
      <div class="icon-container">
        <div class="action-name">
          {{ createActionText() }}
        </div>
        <div class="action-detail">
          {{ operationDetail }}
        </div>
      </div>

      <div
        slot="content"
        class="text-container"
      >
        <div class="all-text">
          {{ operationDetail }}
        </div>
      </div>
    </Tooltip>
  </div>
</template>

<script>
    // import {log} from "@/utils/tools";

    export default {
        name: "ActionDetailCell",
        props: {
            operationType: Number,
            operationDetail: String,
            list: Array,
        },
        data() {
            return {
                actionList: this.list,
                bubbleVisible: false,

            };
        },
        methods: {
            createActionText() {
                let currentType = this.$_.find(this.actionList, { value: this.operationType })
                let name = (currentType === undefined) ? '-' : currentType.label
                return name
            }
        }
    }
</script>

<style scoped lang="scss">
    .detail-cell {
        cursor: pointer;
        font-family:SFUIDisplay-Light,SFUIDisplay,sans-serif;
        display: flex;
        justify-content: flex-start;
    }

    .action-name {
        font-size:14px;
        font-weight:300;
        color:rgba(23,23,37,1);
        line-height:24px;

        text-align: left;
    }

    .action-detail {
        margin-top: 4px;
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);

        line-height:22px;
        text-align: left;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        /*width: 320px;*/
    }

    .text-container {
        white-space: normal;
    }
</style>
