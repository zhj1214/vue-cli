<template>
  <div class="detail-cell">
    <Tooltip v-model="bubbleVisible" placement="top" :transfer="true">
      <div class="icon-container">
        <div class="action-name">
          {{ createActionText() }}
        </div>
        <div class="action-detail">
          {{ operationDetail }}
        </div>
      </div>

      <div slot="content" class="text-container">
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
    name: 'ActionDetailCell',
    props: {
      operationType: Number,
      operationDetail: String,
      list: Array,
    },
    data() {
      return {
        actionList: this.list,
        bubbleVisible: false,
      }
    },
    methods: {
      createActionText() {
        let currentType = this.$_.find(this.actionList, { value: this.operationType })
        let name = currentType === undefined ? '-' : currentType.label
        return name
      },
    },
  }
</script>

<style scoped lang="scss">
  .detail-cell {
    display: flex;
    font-family: SFUIDisplay-Light, SFUIDisplay, sans-serif;
    cursor: pointer;
    justify-content: flex-start;
  }

  .action-name {
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(23, 23, 37, 1);
    text-align: left;
  }

  .action-detail {
    margin-top: 4px;
    overflow: hidden;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;

    /* width: 320px; */
  }

  .text-container {
    white-space: normal;
  }
</style>
